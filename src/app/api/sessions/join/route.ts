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

  // Send email notifications in the background — don't block the response
  void (async () => {
    try {
      const otherPlayerIds = session.session_players
        .map((p: { user_id: string }) => p.user_id)
        .filter((id: string) => id !== user.id)

      if (!otherPlayerIds.length) return

      const admin = createAdminClient()

      const [profileResult, ...userResults] = await Promise.all([
        supabase.from('profiles').select('username').eq('id', user.id).single(),
        ...otherPlayerIds.map((id: string) => admin.auth.admin.getUserById(id)),
      ])

      const joinerName = profileResult.data?.username || user.email?.split('@')[0] || 'Igrač'
      const recipientEmails = userResults
        .map(r => r.data.user?.email)
        .filter(Boolean) as string[]

      const court = session.courts as { name: string; location_name: string }
      const newCount = session.session_players.length + 1

      await sendJoinNotification({
        recipientEmails,
        joinerName,
        courtName: court.name,
        courtLocation: court.location_name,
        dateTime: session.date_time,
        currentCount: newCount,
        maxPlayers: session.max_players,
      })
    } catch (err) {
      console.error('Email notification failed:', err)
    }
  })()

  return NextResponse.json({ success: true })
}
