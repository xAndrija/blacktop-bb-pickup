import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendJoinNotification } from '@/lib/mail'

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { session_id } = await request.json()
  const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (!session_id || !UUID.test(session_id))
    return NextResponse.json({ error: 'Invalid session_id' }, { status: 400 })

  // Fetch session with court info and current players
  const { data: session, error: sessionError } = await supabase
    .from('sessions')
    .select('*, courts(name, location_name), session_players(id, user_id)')
    .eq('id', session_id)
    .single()

  if (sessionError || !session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 })
  }

  if (session.session_players.length >= session.max_players) {
    return NextResponse.json({ error: 'Session is full' }, { status: 409 })
  }

  const { error } = await supabase
    .from('session_players')
    .insert({ session_id, user_id: user.id })

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Already joined' }, { status: 409 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Send email notifications — awaited but failure doesn't affect the response
  try {
    const otherPlayerIds: string[] = (session.session_players as { user_id: string }[])
      .map(p => p.user_id)
      .filter(id => id !== user.id)

    if (otherPlayerIds.length > 0) {
      const admin = createAdminClient()

      const [profileResult, ...userResults] = await Promise.all([
        supabase.from('profiles').select('username').eq('id', user.id).single(),
        ...otherPlayerIds.map(id => admin.auth.admin.getUserById(id)),
      ])

      const joinerName = (profileResult.data as { username?: string } | null)?.username
        || user.email?.split('@')[0]
        || 'Igrač'

      const recipientEmails = userResults
        .map(r => r.data.user?.email)
        .filter((e): e is string => Boolean(e))

      const court = session.courts as { name: string; location_name: string } | null

      if (recipientEmails.length > 0 && court) {
        await sendJoinNotification({
          recipientEmails,
          joinerName,
          courtName: court.name,
          courtLocation: court.location_name,
          dateTime: session.date_time,
          currentCount: session.session_players.length + 1,
          maxPlayers: session.max_players,
        })
      }
    }
  } catch (err) {
    console.error('[email] join notification failed:', err)
  }

  return NextResponse.json({ success: true })
}
