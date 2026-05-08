import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Header from '@/components/Header'
import GamesContent from '@/components/GamesContent'

export const revalidate = 30

export default async function GamesPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: sessions }, { data: profile }] = await Promise.all([
    supabase
      .from('sessions')
      .select('*, courts(name, location_name), session_players(id)')
      .gte('date_time', new Date().toISOString())
      .order('date_time', { ascending: true }),
    supabase.from('profiles').select('username, avatar_url').eq('id', user.id).single(),
  ])

  return (
    <div className="page-bg min-h-screen text-white">
      <Header username={profile?.username ?? ''} email={user.email ?? ''} avatarUrl={(profile as any)?.avatar_url} />

      <main className="w-full px-6 md:px-10 py-10 max-w-5xl mx-auto">
        <div className="mb-10">
          <p className="text-white/40 text-sm font-medium uppercase tracking-widest mb-2">
            Pickup košarka · Beograd
          </p>
          <h1 className="text-4xl font-bold text-white leading-tight">
            Zakazane igre<br />
            <span className="gradient-text">i slobodna mesta</span>
          </h1>
        </div>

        <GamesContent sessions={(sessions ?? []) as any} currentUserId={user.id} />
      </main>
    </div>
  )
}
