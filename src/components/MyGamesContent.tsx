'use client'

import Link from 'next/link'
import { MapPin, Users, Crown, User } from 'lucide-react'

interface Session {
  id: string
  court_id: string
  creator_id: string
  date_time: string
  max_players: number
  description?: string | null
  courts: { name: string; location_name: string; slug?: string | null }
  session_players: { id: string; user_id: string }[]
}

interface Props {
  sessions: Session[]
  currentUserId: string
  username: string
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('sr-Latn-RS', { hour: '2-digit', minute: '2-digit' })
}

function formatDayNum(iso: string) {
  return new Date(iso).toLocaleDateString('sr-Latn-RS', { day: 'numeric' })
}

function formatMonth(iso: string) {
  return new Date(iso).toLocaleDateString('sr-Latn-RS', { month: 'short' }).replace('.', '')
}

function formatWeekday(iso: string) {
  return new Date(iso).toLocaleDateString('sr-Latn-RS', { weekday: 'long' })
}

function isToday(iso: string) {
  return new Date(iso).toDateString() === new Date().toDateString()
}

function isTomorrow(iso: string) {
  const t = new Date(); t.setDate(t.getDate() + 1)
  return new Date(iso).toDateString() === t.toDateString()
}

function isPast(iso: string) {
  return new Date(iso) < new Date()
}

export default function MyGamesContent({ sessions, currentUserId, username }: Props) {
  const upcoming = sessions.filter(s => !isPast(s.date_time))
  const past = sessions.filter(s => isPast(s.date_time))

  const createdCount = upcoming.filter(s => s.creator_id === currentUserId).length
  const joinedCount = upcoming.filter(s => s.creator_id !== currentUserId).length

  function courtHref(s: Session) {
    return `/courts/${s.courts?.slug ?? s.court_id}`
  }

  function dayLabel(iso: string) {
    if (isToday(iso)) return 'Danas'
    if (isTomorrow(iso)) return 'Sutra'
    return formatWeekday(iso)
  }

  function renderCard(s: Session, dim = false) {
    const count = s.session_players.length
    const isFull = count >= s.max_players
    const isCreator = s.creator_id === currentUserId
    const pct = Math.min(100, Math.round((count / s.max_players) * 100))

    return (
      <Link key={s.id} href={courtHref(s)} style={{ display: 'block' }}>
        <div
          style={{
            display: 'flex',
            gap: 0,
            background: dim ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)',
            border: `1px solid ${dim ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.10)'}`,
            borderRadius: 16,
            overflow: 'hidden',
            opacity: dim ? 0.55 : 1,
            transition: 'opacity 0.2s',
          }}
        >
          {/* Date column */}
          <div style={{
            width: 72,
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: isCreator
              ? 'rgba(249,115,22,0.10)'
              : 'rgba(255,255,255,0.03)',
            borderRight: `1px solid ${isCreator ? 'rgba(249,115,22,0.15)' : 'rgba(255,255,255,0.06)'}`,
            padding: '16px 8px',
            gap: 2,
          }}>
            <span style={{
              fontSize: 26,
              fontWeight: 800,
              lineHeight: 1,
              color: isCreator ? '#fb923c' : 'rgba(255,255,255,0.75)',
            }}>
              {formatDayNum(s.date_time)}
            </span>
            <span style={{
              fontSize: 11,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: isCreator ? 'rgba(251,146,60,0.6)' : 'rgba(255,255,255,0.30)',
            }}>
              {formatMonth(s.date_time)}
            </span>
            <span style={{
              fontSize: 11,
              fontWeight: 600,
              color: isCreator ? 'rgba(251,146,60,0.5)' : 'rgba(255,255,255,0.22)',
              marginTop: 4,
            }}>
              {formatTime(s.date_time)}
            </span>
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 0, padding: '14px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 4 }}>
              <span style={{ color: 'white', fontWeight: 700, fontSize: 15, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {s.courts?.name}
              </span>
              {isCreator ? (
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.25)',
                  color: '#fb923c', borderRadius: 999, padding: '3px 9px',
                  fontSize: 10, fontWeight: 700, letterSpacing: '0.04em', flexShrink: 0,
                }}>
                  <Crown size={9} />
                  Organizator
                </span>
              ) : (
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)',
                  color: 'rgba(255,255,255,0.45)', borderRadius: 999, padding: '3px 9px',
                  fontSize: 10, fontWeight: 700, letterSpacing: '0.04em', flexShrink: 0,
                }}>
                  <User size={9} />
                  Igrač
                </span>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 10 }}>
              <MapPin size={11} color="rgba(249,115,22,0.45)" />
              <span style={{ color: 'rgba(255,255,255,0.30)', fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {s.courts?.location_name}
              </span>
            </div>

            {/* Player bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ flex: 1, height: 4, borderRadius: 99, background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: 99,
                  width: `${pct}%`,
                  background: isFull
                    ? 'linear-gradient(90deg,#ef4444,#dc2626)'
                    : 'linear-gradient(90deg,#f97316,#f59e0b)',
                  transition: 'width 0.3s',
                }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                <Users size={11} color="rgba(255,255,255,0.30)" />
                <span style={{ fontSize: 12, color: isFull ? 'rgba(239,68,68,0.7)' : 'rgba(255,255,255,0.35)', fontWeight: 600 }}>
                  {count}/{s.max_players}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <>
      {/* Page header */}
      <div style={{ marginBottom: 32 }}>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>
          Moj raspored
        </p>
        <h1 style={{ fontSize: 34, fontWeight: 800, color: 'white', lineHeight: 1.1 }}>
          Zdravo, <span style={{ background: 'linear-gradient(90deg,#f97316,#f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{username || 'igraču'}</span>
        </h1>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 32 }}>
        {[
          { label: 'Nadolazeće', value: upcoming.length },
          { label: 'Organizujem', value: createdCount },
          { label: 'Pridružen', value: joinedCount },
        ].map(({ label, value }) => (
          <div key={label} style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 14,
            padding: '14px 16px',
          }}>
            <p style={{ color: 'rgba(255,255,255,0.30)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>{label}</p>
            <span style={{ fontSize: 28, fontWeight: 800, color: 'white' }}>{value}</span>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {sessions.length === 0 && (
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px dashed rgba(255,255,255,0.10)',
          borderRadius: 18,
          padding: '56px 24px',
          textAlign: 'center',
        }}>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontWeight: 600, fontSize: 16, marginBottom: 6 }}>Nisi prijavljen ni na jednu igru</p>
          <p style={{ color: 'rgba(255,255,255,0.18)', fontSize: 13, marginBottom: 20 }}>Idi na terene i pridruži se ili zakaži svoju igru</p>
          <Link href="/courts" style={{
            display: 'inline-block',
            background: 'linear-gradient(to right,#f97316,#f59e0b)',
            color: 'white', fontWeight: 700, fontSize: 13,
            padding: '10px 22px', borderRadius: 12,
          }}>
            Idi na terene
          </Link>
        </div>
      )}

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <span style={{ color: 'rgba(255,255,255,0.50)', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em' }}>
              Nadolazeće igre
            </span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
            <span style={{ color: 'rgba(255,255,255,0.22)', fontSize: 12 }}>{upcoming.length}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {upcoming.map(s => renderCard(s))}
          </div>
        </div>
      )}

      {/* Past */}
      {past.length > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em' }}>
              Prethodne igre
            </span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
            <span style={{ color: 'rgba(255,255,255,0.16)', fontSize: 12 }}>{past.length}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {past.map(s => renderCard(s, true))}
          </div>
        </div>
      )}
    </>
  )
}
