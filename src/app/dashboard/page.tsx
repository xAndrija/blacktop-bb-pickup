import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Header from '@/components/Header'
import DashboardContent from '@/components/DashboardContent'

export const revalidate = 60

export default async function CourtsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [
    { data: courts },
    { data: sessions },
    { data: profile },
    { count: gamesJoined },
    { count: gamesCreated },
  ] = await Promise.all([
    supabase.from('courts').select('*').order('name'),
    supabase
      .from('sessions')
      .select('id, court_id, date_time, max_players, courts(name, location_name), session_players(id)')
      .gte('date_time', new Date().toISOString())
      .order('date_time', { ascending: true }),
    supabase.from('profiles').select('username, avatar_url').eq('id', user.id).single(),
    supabase.from('session_players').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
    supabase.from('sessions').select('*', { count: 'exact', head: true }).eq('creator_id', user.id),
  ])

  return (
    <div className="page-bg min-h-screen text-white">
      <Header username={profile?.username ?? ''} email={user.email ?? ''} avatarUrl={(profile as any)?.avatar_url} />
      <DashboardContent
        username={profile?.username ?? ''}
        courts={courts ?? []}
        sessions={(sessions ?? []) as any}
        gamesJoined={gamesJoined ?? 0}
        gamesCreated={gamesCreated ?? 0}
      />
    </div>
  )
}
