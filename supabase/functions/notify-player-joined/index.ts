import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
// @deno-types="https://esm.sh/v135/web-push@3.6.7/src/index.d.ts"
import webpush from 'https://esm.sh/web-push@3.6.7'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const VAPID_PUBLIC_KEY = Deno.env.get('VAPID_PUBLIC_KEY')!
const VAPID_PRIVATE_KEY = Deno.env.get('VAPID_PRIVATE_KEY')!
const VAPID_SUBJECT = Deno.env.get('VAPID_SUBJECT')!
const APP_URL = Deno.env.get('APP_URL') ?? 'http://localhost:3000'

webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY)

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('sr-Latn-RS', { hour: '2-digit', minute: '2-digit' })
}

async function sendPush(subscription: any, payload: { title: string; body: string; url: string }) {
  try {
    await webpush.sendNotification(subscription, JSON.stringify(payload))
    return true
  } catch (e: any) {
    console.log('Push failed:', e?.statusCode, e?.message)
    return false
  }
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 })

  const payload = await req.json()
  console.log('Webhook payload type:', payload.type, 'table:', payload.table)

  const record = payload.record as { session_id: string; user_id: string }
  if (!record?.session_id || !record?.user_id) {
    return new Response('Missing record', { status: 400 })
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

  // Fetch session + court + players
  const { data: session, error: sessionErr } = await supabase
    .from('sessions')
    .select('*, courts(name, slug), session_players(user_id)')
    .eq('id', record.session_id)
    .single()

  console.log('Session:', session?.id, sessionErr?.message)
  if (!session) return new Response('Session not found', { status: 404 })

  const court = session.courts as { name: string; slug?: string }
  const courtSlug = court.slug ?? record.session_id
  const courtUrl = `${APP_URL}/courts/${courtSlug}`
  const playerCount = (session.session_players as { user_id: string }[]).length
  const isFull = playerCount >= session.max_players
  const isCreatorJoining = record.user_id === session.creator_id
  const timeStr = formatTime(session.date_time)

  console.log(`players=${playerCount}/${session.max_players} isFull=${isFull} isCreatorJoining=${isCreatorJoining}`)

  // Fetch new player username
  const { data: newPlayer } = await supabase
    .from('profiles').select('username').eq('id', record.user_id).single()

  const notifications: { userId: string; title: string; body: string }[] = []

  // 1. Notify creator when someone else joins
  if (!isCreatorJoining) {
    notifications.push({
      userId: session.creator_id,
      title: '🏀 Neko se pridružio!',
      body: `${newPlayer?.username ?? 'Igrač'} se pridružio igri na ${court.name} u ${timeStr}h`,
    })
  }

  // 2. Notify all players when game fills up
  if (isFull) {
    const playerIds = (session.session_players as { user_id: string }[]).map(p => p.user_id)
    for (const userId of playerIds) {
      notifications.push({
        userId,
        title: '🔥 Igra je popunjena!',
        body: `${court.name} · ${timeStr}h · ${playerCount}/${session.max_players} igrača`,
      })
    }
  }

  if (notifications.length === 0) {
    console.log('No notifications to send')
    return new Response(JSON.stringify({ sent: 0 }), { headers: { 'Content-Type': 'application/json' } })
  }

  // Fetch push subscriptions for all target users
  const userIds = [...new Set(notifications.map(n => n.userId))]
  const { data: subs } = await supabase
    .from('push_subscriptions')
    .select('user_id, subscription')
    .in('user_id', userIds)

  console.log(`Found ${subs?.length ?? 0} subscriptions for ${userIds.length} users`)

  const subMap = Object.fromEntries((subs ?? []).map(s => [s.user_id, s.subscription]))

  let sent = 0
  for (const notif of notifications) {
    const sub = subMap[notif.userId]
    if (!sub) { console.log('No subscription for', notif.userId); continue }

    const ok = await sendPush(sub, { title: notif.title, body: notif.body, url: courtUrl })
    if (ok) sent++
  }

  console.log(`Sent ${sent}/${notifications.length} push notifications`)
  return new Response(JSON.stringify({ sent }), { headers: { 'Content-Type': 'application/json' } })
})
