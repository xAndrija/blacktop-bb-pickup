import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { court_id, date_time, max_players, description } = await request.json()

  const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (!court_id || !UUID.test(court_id)) return NextResponse.json({ error: 'Invalid court_id' }, { status: 400 })
  if (!date_time || isNaN(Date.parse(date_time))) return NextResponse.json({ error: 'Invalid date_time' }, { status: 400 })
  if (!max_players || typeof max_players !== 'number' || max_players < 2 || max_players > 30)
    return NextResponse.json({ error: 'max_players must be 2-30' }, { status: 400 })
  if (description && description.length > 500)
    return NextResponse.json({ error: 'Description too long' }, { status: 400 })

  const { data: session, error } = await supabase
    .from('sessions')
    .insert({ court_id, date_time, max_players, creator_id: user.id, description: description || null })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Auto-join creator
  await supabase
    .from('session_players')
    .insert({ session_id: session.id, user_id: user.id })

  return NextResponse.json(session)
}
