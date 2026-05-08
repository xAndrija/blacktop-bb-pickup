'use client'

import { useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { Court, SessionWithPlayers, ProfileMap } from '@/types'
import { createClient } from '@/lib/supabase/client'
import { MapPin, Calendar } from 'lucide-react'
import SessionCard from '@/components/SessionCard'
import CreateSessionModal from '@/components/CreateSessionModal'
import Header from '@/components/Header'

const CourtMap = dynamic(() => import('@/components/CourtMap'), {
  ssr: false,
  loading: () => <div className="rounded-2xl bg-white/4 animate-pulse" style={{ height: '260px' }} />,
})

interface Props {
  court: Court
  initialSessions: SessionWithPlayers[]
  initialProfiles: ProfileMap
  currentUserId: string
  username: string
  email: string
  avatarUrl?: string | null
}

async function fetchProfilesForSessions(sessions: SessionWithPlayers[]): Promise<ProfileMap> {
  const userIds = [...new Set(sessions.flatMap(s => (s.session_players ?? []).map(p => p.user_id)))]
  if (userIds.length === 0) return {}
  const supabase = createClient()
  const { data } = await supabase.from('profiles').select('id, username, avatar_url').in('id', userIds)
  const map: ProfileMap = {}
  ;(data ?? []).forEach((p: any) => { map[p.id] = { username: p.username, avatar_url: p.avatar_url } })
  return map
}

export default function CourtDetailClient({ court, initialSessions, initialProfiles, currentUserId, username, email, avatarUrl }: Props) {
  const [sessions, setSessions] = useState<SessionWithPlayers[]>(initialSessions)
  const [profilesMap, setProfilesMap] = useState<ProfileMap>(initialProfiles)
  const [showModal, setShowModal] = useState(false)

  const refreshSessions = useCallback(async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('sessions')
      .select('*, session_players(*)')
      .eq('court_id', court.id)
      .order('date_time', { ascending: true })
    if (data) {
      setSessions(data)
      const profiles = await fetchProfilesForSessions(data)
      setProfilesMap(profiles)
    }
  }, [court.id])

  const upcomingSessions = sessions.filter(s => new Date(s.date_time) >= new Date())
  const pastSessions = sessions.filter(s => new Date(s.date_time) < new Date())

  return (
    <div className="page-bg min-h-screen text-white">
      <Header username={username} email={email} avatarUrl={avatarUrl} backHref="/courts" backLabel="Tereni" />

      <main className="max-w-3xl mx-auto px-4 md:px-8 py-8 space-y-5">

        {/* ── Hero: image left + info right ────────────────────────── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 0,
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 20,
          overflow: 'hidden',
          minHeight: 220,
        }}>
          {/* left: image */}
          <div style={{ position: 'relative', minHeight: 220, background: 'linear-gradient(135deg, #0e0e1a 0%, #15102a 50%, #090912 100%)' }}>
            {court.image_url ? (
              <Image
                src={court.image_url}
                alt={court.name}
                fill
                sizes="(max-width: 768px) 50vw, 360px"
                style={{ objectFit: 'cover', objectPosition: 'center' }}
                priority
              />
            ) : (
              <>
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 45%, rgba(249,115,22,0.15) 0%, transparent 65%)' }} />
                <div style={{ position: 'absolute', right: -20, bottom: -20, opacity: 0.08, transform: 'rotate(12deg)', pointerEvents: 'none' }}>
                  <svg width={160} height={160} viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="48" fill="#f97316" />
                    <g fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round" opacity={0.6}>
                      <line x1="2" y1="50" x2="98" y2="50" />
                      <line x1="50" y1="2" x2="50" y2="98" />
                      <path d="M 50 2 A 27 48 0 0 0 50 98" />
                      <path d="M 50 2 A 27 48 0 0 1 50 98" />
                    </g>
                  </svg>
                </div>
              </>
            )}
            {upcomingSessions.length > 0 && (
              <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 2 }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  background: 'rgba(8,8,15,0.65)', backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(249,115,22,0.40)',
                  borderRadius: 999, padding: '5px 11px',
                  fontSize: 10, fontWeight: 800, letterSpacing: '0.08em',
                  color: '#fb923c',
                }}>
                  <span className="animate-pulse" style={{ width: 6, height: 6, borderRadius: '50%', background: '#f97316', display: 'inline-block' }} />
                  LIVE
                </span>
              </div>
            )}
          </div>

          {/* right: info */}
          <div style={{ padding: '22px 22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderLeft: '1px solid rgba(255,255,255,0.06)' }}>
            <div>
              <h1 style={{ color: 'white', fontWeight: 800, fontSize: 20, lineHeight: 1.2, marginBottom: 8 }}>
                {court.name}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: court.description ? 12 : 0 }}>
                <MapPin size={12} color="rgba(249,115,22,0.6)" style={{ flexShrink: 0 }} />
                <span style={{ color: 'rgba(255,255,255,0.40)', fontSize: 13 }}>{court.location_name}</span>
              </div>
              {court.description && (
                <p style={{ color: 'rgba(255,255,255,0.28)', fontSize: 12, lineHeight: 1.6 }}>
                  {court.description}
                </p>
              )}
            </div>
            <button
              onClick={() => setShowModal(true)}
              style={{
                marginTop: 20,
                background: 'linear-gradient(to right, #f97316, #f59e0b)',
                color: 'white',
                fontWeight: 700,
                fontSize: 13,
                padding: '10px 16px',
                borderRadius: 12,
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(249,115,22,0.25)',
              }}
            >
              + Kreiraj igru
            </button>
          </div>
        </div>

        {/* ── Map ──────────────────────────────────────────────────── */}
        <div>
          <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>
            Lokacija
          </p>
          <CourtMap courts={[court]} activeCourt={court} height="240px" />
        </div>

        {/* ── Upcoming games ───────────────────────────────────────── */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Calendar size={15} color="rgba(249,115,22,0.7)" />
              <span style={{ color: 'white', fontWeight: 700, fontSize: 16 }}>Nadolazeće igre</span>
              {upcomingSessions.length > 0 && (
                <span style={{ color: '#fb923c', fontSize: 13, fontWeight: 500 }}>({upcomingSessions.length})</span>
              )}
            </div>
          </div>

          {upcomingSessions.length > 0 ? (
            <div className="space-y-3">
              {upcomingSessions.map(session => (
                <SessionCard
                  key={session.id}
                  session={session}
                  currentUserId={currentUserId}
                  onUpdate={refreshSessions}
                  profilesMap={profilesMap}
                />
              ))}
            </div>
          ) : (
            <div style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px dashed rgba(255,255,255,0.10)',
              borderRadius: 16,
              padding: '40px 24px',
              textAlign: 'center',
            }}>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14, fontWeight: 500 }}>Nema zakazanih igara</p>
              <p style={{ color: 'rgba(255,255,255,0.18)', fontSize: 12, marginTop: 4 }}>Budi prvi i zakaži!</p>
            </div>
          )}
        </div>

        {/* ── Past games ───────────────────────────────────────────── */}
        {pastSessions.length > 0 && (
          <div>
            <p style={{ color: 'rgba(255,255,255,0.22)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>
              Prethodne igre
            </p>
            <div className="space-y-3">
              {pastSessions.map(session => (
                <SessionCard
                  key={session.id}
                  session={session}
                  currentUserId={currentUserId}
                  onUpdate={refreshSessions}
                  profilesMap={profilesMap}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {showModal && (
        <CreateSessionModal
          courtId={court.id}
          courtName={court.name}
          onCreated={() => { setShowModal(false); refreshSessions() }}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  )
}
