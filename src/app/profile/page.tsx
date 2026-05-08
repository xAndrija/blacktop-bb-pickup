export const revalidate = 60

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Header from '@/components/Header'
import ProfileContent from '@/components/ProfileContent'

export default async function ProfilePage() {
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
      <Header username={profile?.username ?? ''} email={user.email ?? ''} avatarUrl={(profile as any)?.avatar_url} />
      <ProfileContent
        userId={user.id}
        email={user.email ?? ''}
        initialUsername={profile?.username ?? ''}
        initialAvatarUrl={(profile as any)?.avatar_url ?? null}
        memberSince={user.created_at ?? ''}
      />
    </div>
  )
}
