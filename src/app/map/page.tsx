import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Header from '@/components/Header'
import MapLoader from '@/components/MapLoader'

export const revalidate = 120

export default async function MapPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: courts }, { data: profile }] = await Promise.all([
    supabase.from('courts').select('*').order('name'),
    supabase.from('profiles').select('username, avatar_url').eq('id', user.id).single(),
  ])

  return (
    <div style={{ background: '#08080f', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header username={profile?.username ?? ''} email={user.email ?? ''} avatarUrl={(profile as any)?.avatar_url} />
      <div style={{ flex: 1, isolation: 'isolate' }}>
        <MapLoader courts={courts ?? []} headerHeight={82} />
      </div>
    </div>
  )
}
