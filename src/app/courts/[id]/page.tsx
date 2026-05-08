export const revalidate = 30

import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ProfileMap } from '@/types'
import CourtDetailClient from './CourtDetailClient'

interface Props {
  params: Promise<{ id: string }>
}

export default async function CourtPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)

  const [{ data: court }, { data: profile }] = await Promise.all([
    isUuid
      ? supabase.from('courts').select('*').eq('id', id).single()
      : supabase.from('courts').select('*').eq('slug', id).single(),
    supabase.from('profiles').select('username, avatar_url').eq('id', user.id).single(),
  ])

  if (!court) notFound()

  const { data: sessions } = await supabase
    .from('sessions').select('*, session_players(*)').eq('court_id', court.id).order('date_time', { ascending: true })

  const userIds = [...new Set((sessions ?? []).flatMap(s => (s.session_players ?? []).map((p: any) => p.user_id)))]
  const { data: profilesData } = userIds.length > 0
    ? await supabase.from('profiles').select('id, username, avatar_url').in('id', userIds)
    : { data: [] }

  const initialProfiles: ProfileMap = {}
  ;(profilesData ?? []).forEach((p: any) => { initialProfiles[p.id] = { username: p.username, avatar_url: p.avatar_url } })

  return (
    <CourtDetailClient
      court={court}
      initialSessions={sessions ?? []}
      initialProfiles={initialProfiles}
      currentUserId={user.id}
      username={profile?.username ?? ''}
      email={user.email ?? ''}
      avatarUrl={(profile as any)?.avatar_url ?? null}
    />
  )
}
