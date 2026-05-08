export const revalidate = 30

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Header from '@/components/Header'
import MyGamesContent from '@/components/MyGamesContent'

export default async function MyGamesPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: profile }, { data: myEntries }] = await Promise.all([
    supabase.from('profiles').select('username, avatar_url').eq('id', user.id).single(),
    supabase.from('session_players').select('session_id').eq('user_id', user.id),
  ])

  const sessionIds = (myEntries ?? []).map(e => e.session_id)

  const { data: sessions } = sessionIds.length > 0
    ? await supabase
        .from('sessions')
        .select('*, creator_id, courts(name, location_name, slug), session_players(id, user_id)')
        .in('id', sessionIds)
        .order('date_time', { ascending: true })
    : { data: [] }

  return (
    <div className="page-bg min-h-screen text-white">
      <Header
        username={profile?.username ?? ''}
        email={user.email ?? ''}
        avatarUrl={(profile as any)?.avatar_url}
      />

      <main className="w-full px-6 md:px-10 py-10 max-w-3xl mx-auto">
        <MyGamesContent
          sessions={(sessions ?? []) as any}
          currentUserId={user.id}
          username={profile?.username ?? ''}
        />
      </main>
    </div>
  )
}
