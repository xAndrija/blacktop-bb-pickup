import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Header from '@/components/Header'
import CourtCard from '@/components/CourtCard'
import { pluralIgra } from '@/lib/plural'

export const revalidate = 60

export default async function CourtsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: courts }, { data: sessions }, { data: profile }] = await Promise.all([
    supabase.from('courts').select('*').order('name'),
    supabase.from('sessions').select('id, court_id').gte('date_time', new Date().toISOString()),
    supabase.from('profiles').select('username, avatar_url').eq('id', user.id).single(),
  ])

  const countMap: Record<string, number> = {}
  ;(sessions ?? []).forEach(s => {
    countMap[s.court_id] = (countMap[s.court_id] ?? 0) + 1
  })

  const totalActive = sessions?.length ?? 0

  return (
    <div className="page-bg min-h-screen text-white">
      <Header username={profile?.username ?? ''} email={user.email ?? ''} avatarUrl={(profile as any)?.avatar_url} />

      <main className="w-full px-6 md:px-10 py-10 max-w-7xl mx-auto">

        {/* Page header */}
        <div className="mb-10">
          <p className="text-white/40 text-sm font-medium uppercase tracking-widest mb-2">
            Pickup košarka · Beograd
          </p>
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <h1 className="text-4xl font-bold text-white leading-tight">
              Tereni<br />
              <span className="gradient-text">u Beogradu</span>
            </h1>
            {totalActive > 0 && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: 'rgba(249,115,22,0.10)', border: '1px solid rgba(249,115,22,0.24)',
                color: 'rgba(251,146,60,0.85)', borderRadius: 999,
                padding: '8px 18px', fontSize: 13, fontWeight: 700,
              }}>
                <span className="animate-pulse" style={{ width: 7, height: 7, borderRadius: '50%', background: '#f97316', display: 'inline-block' }} />
                {totalActive} {pluralIgra(totalActive)}
              </span>
            )}
          </div>
        </div>

        {/* Courts grid */}
        {courts && courts.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.25rem',
          }}>
            {courts.map(court => (
              <CourtCard
                key={court.id}
                court={court}
                sessionCount={countMap[court.id] ?? 0}
              />
            ))}
          </div>
        ) : (
          <div className="glass rounded-2xl text-center py-20" style={{ color: 'rgba(255,255,255,0.25)' }}>
            <p className="font-semibold text-lg">Nema terena još uvek</p>
            <p className="text-sm mt-2" style={{ color: 'rgba(255,255,255,0.15)' }}>Tereni će biti dodati uskoro</p>
          </div>
        )}

      </main>
    </div>
  )
}
