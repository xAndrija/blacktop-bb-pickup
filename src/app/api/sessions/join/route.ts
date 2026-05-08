import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

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

  // Check session exists and is not full
  const { data: session, error: sessionError } = await supabase
    .from('sessions')
    .select('*, session_players(id)')
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
    // unique constraint violation = already joined
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Already joined' }, { status: 409 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
