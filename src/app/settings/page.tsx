export const revalidate = 60

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Header from '@/components/Header'
import SettingsContent from '@/components/SettingsContent'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('username, avatar_url')
    .eq('id', user.id)
    .single()

  return (
    <div className="page-bg min-h-screen text-white">
      <Header
        username={profile?.username ?? ''}
        email={user.email ?? ''}
        avatarUrl={(profile as any)?.avatar_url}
      />
      <SettingsContent email={user.email ?? ''} />
    </div>
  )
}
