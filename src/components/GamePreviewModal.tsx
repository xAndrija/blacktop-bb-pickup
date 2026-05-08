'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { X, MapPin, Calendar, Users, Clock, Loader2, MessageCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { ProfileMap } from '@/types'
import SessionChat from './SessionChat'

interface FullSession {
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
  sessionId: string
  currentUserId: string
  unreadCount?: number
  onMarkRead?: () => void
  onClose: () => void
}

function Avatar({ name, url, highlight }: { name: string; url?: string | null; highlight?: boolean }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      style={{ position: 'relative', flexShrink: 0 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        width: 36, height: 36, borderRadius: '50%', overflow: 'hidden',
        border: highlight ? '2px solid #f97316' : '2px solid rgba(255,255,255,0.10)',
        background: 'rgba(249,115,22,0.12)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 14, fontWeight: 700, color: '#fb923c',
        boxShadow: highlight ? '0 0 0 2px rgba(249,115,22,0.25)' : 'none',
        cursor: 'default',
      }}>
        {url
          ? <img src={url} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : (name?.[0] ?? '?').toUpperCase()
        }
      </div>
      {hovered && (
        <div style={{
          position: 'absolute', bottom: 'calc(100% + 6px)', left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(14,14,22,0.97)', border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 8, padding: '4px 10px', whiteSpace: 'nowrap',
          fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.80)',
          pointerEvents: 'none', zIndex: 10,
          boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
        }}>
          {name}
          <div style={{
            position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
            width: 0, height: 0,
            borderLeft: '5px solid transparent', borderRight: '5px solid transparent',
            borderTop: '5px solid rgba(255,255,255,0.12)',
          }} />
        </div>
      )}
    </div>
  )
}

export default function GamePreviewModal({ sessionId, currentUserId, unreadCount = 0, onMarkRead, onClose }: Props) {
  const [session, setSession] = useState<FullSession | null>(null)
  const [profiles, setProfiles] = useState<ProfileMap>({})
  const [loading, setLoading] = useState(true)
  const [joining, setJoining] = useState(false)
  const [tab, setTab] = useState<'igrace' | 'chat'>('igrace')

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data } = await supabase
        .from('sessions')
        .select('*, courts(name, location_name, slug), session_players(id, user_id)')
        .eq('id', sessionId)
        .single()
      if (!data) { setLoading(false); return }
      setSession(data as FullSession)

      const userIds = (data.session_players ?? []).map((p: any) => p.user_id)
      if (userIds.length > 0) {
        const { data: profs } = await supabase
          .from('profiles').select('id, username, avatar_url').in('id', userIds)
        const map: ProfileMap = {}
        ;(profs ?? []).forEach((p: any) => { map[p.id] = { username: p.username, avatar_url: p.avatar_url } })
        setProfiles(map)
      }
      setLoading(false)
    }
    load()
  }, [sessionId])

  async function handleJoinLeave() {
    if (!session) return
    setJoining(true)
    const supabase = createClient()
    const hasJoined = session.session_players.some(p => p.user_id === currentUserId)

    if (isCreator) {
      await supabase.from('sessions').delete().eq('id', session.id)
      setJoining(false)
      onClose()
      return
    }

    if (hasJoined) {
      await supabase.from('session_players').delete()
        .eq('session_id', session.id).eq('user_id', currentUserId)
    } else {
      await supabase.from('session_players').insert({ session_id: session.id, user_id: currentUserId })
    }

    const { data } = await supabase
      .from('sessions')
      .select('*, courts(name, location_name, slug), session_players(id, user_id)')
      .eq('id', sessionId).single()
    if (data) setSession(data as FullSession)
    setJoining(false)
  }

  const hasJoined = session?.session_players.some(p => p.user_id === currentUserId) ?? false
  const isFull = session ? session.session_players.length >= session.max_players : false
  const isCreator = session?.creator_id === currentUserId
  const count = session?.session_players.length ?? 0
  const pct = session ? Math.min(100, Math.round((count / session.max_players) * 100)) : 0
  const courtSlug = (session?.courts as any)?.slug ?? session?.court_id
  const dateStr = session ? new Date(session.date_time).toLocaleDateString('sr-Latn-RS', { weekday: 'long', day: 'numeric', month: 'long' }) : ''
  const timeStr = session ? new Date(session.date_time).toLocaleTimeString('sr-Latn-RS', { hour: '2-digit', minute: '2-digit' }) : ''

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 flex items-end sm:items-center justify-center sm:p-4"
      style={{ zIndex: 9999, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)' }}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="w-full sm:max-w-[400px]"
        style={{
          background: 'rgba(14,14,22,0.98)',
          border: '1px solid rgba(255,255,255,0.10)',
          borderRadius: '22px 22px 0 0',
          overflow: 'hidden',
          boxShadow: '0 24px 80px rgba(0,0,0,0.7)',
          display: 'flex', flexDirection: 'column',
          maxHeight: '92svh',
          height: tab === 'chat' ? 'min(520px, 88svh)' : 'auto',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '18px 20px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12,
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 4 }}>Igra</p>
            <h2 style={{ color: 'white', fontWeight: 800, fontSize: 18, lineHeight: 1.2, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {loading ? '…' : session?.courts?.name}
            </h2>
            {!loading && session && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <MapPin size={11} color="rgba(249,115,22,0.5)" />
                <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {session.courts?.location_name}
                </span>
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            style={{ flexShrink: 0, width: 32, height: 32, borderRadius: 10, background: 'rgba(255,255,255,0.07)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.45)' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Tabs */}
        {!loading && session && (
          <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            {(['igrace', 'chat'] as const).map(t => (
              <button
                key={t}
                onClick={async () => {
                  setTab(t)
                  if (t === 'chat' && unreadCount > 0) {
                    onMarkRead?.()
                    const supabase = createClient()
                    await supabase.from('message_reads').upsert({
                      user_id: currentUserId,
                      session_id: sessionId,
                      last_read_at: new Date().toISOString(),
                    })
                  }
                }}
                style={{
                  flex: 1, padding: '11px', border: 'none', cursor: 'pointer',
                  background: 'transparent', fontWeight: 600, fontSize: 13,
                  color: tab === t ? '#fb923c' : 'rgba(255,255,255,0.30)',
                  borderBottom: tab === t ? '2px solid #f97316' : '2px solid transparent',
                  transition: 'color 0.15s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                }}
              >
                {t === 'igrace'
                  ? <><Users size={13} />Igrači</>
                  : <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <MessageCircle size={13} />
                      Chat
                      {unreadCount > 0 && (
                        <span style={{
                          background: '#f97316', color: 'white',
                          fontSize: 10, fontWeight: 800, lineHeight: 1,
                          borderRadius: 99, padding: '2px 6px',
                        }}>{unreadCount}</span>
                      )}
                    </div>
                }
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div style={{ padding: '48px', display: 'flex', justifyContent: 'center' }}>
            <Loader2 size={24} color="rgba(249,115,22,0.6)" style={{ animation: 'spin-cw 0.8s linear infinite' }} />
          </div>
        ) : session && tab === 'chat' ? (
          <SessionChat sessionId={sessionId} currentUserId={currentUserId} />
        ) : session ? (
          <>
            {/* Date + time */}
            <div style={{ padding: '16px 20px', display: 'flex', gap: 10 }}>
              <div style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '10px 14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                  <Calendar size={11} color="rgba(249,115,22,0.6)" />
                  <span style={{ color: 'rgba(255,255,255,0.30)', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Datum</span>
                </div>
                <span style={{ color: 'white', fontWeight: 600, fontSize: 13 }}>{dateStr}</span>
              </div>
              <div style={{ width: 90, background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.18)', borderRadius: 12, padding: '10px 14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                  <Clock size={11} color="rgba(249,115,22,0.6)" />
                  <span style={{ color: 'rgba(255,255,255,0.30)', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Vreme</span>
                </div>
                <span style={{ color: '#fb923c', fontWeight: 700, fontSize: 15 }}>{timeStr}</span>
              </div>
            </div>

            {/* Description */}
            {session.description && (
              <div style={{ margin: '0 20px 16px', background: 'rgba(249,115,22,0.06)', borderLeft: '2px solid rgba(249,115,22,0.35)', borderRadius: '0 10px 10px 0', padding: '10px 14px' }}>
                <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, lineHeight: 1.55, margin: 0 }}>{session.description}</p>
              </div>
            )}

            {/* Players */}
            <div style={{ padding: '0 20px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Users size={13} color="rgba(255,255,255,0.35)" />
                  <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, fontWeight: 600 }}>Igrači</span>
                </div>
                <span style={{ color: isFull ? 'rgba(239,68,68,0.7)' : 'rgba(255,255,255,0.40)', fontSize: 12, fontWeight: 700 }}>
                  {count}/{session.max_players}
                </span>
              </div>

              {/* Progress bar */}
              <div style={{ height: 4, borderRadius: 99, background: 'rgba(255,255,255,0.07)', overflow: 'hidden', marginBottom: 12 }}>
                <div style={{
                  height: '100%', borderRadius: 99, width: `${pct}%`,
                  background: isFull ? 'linear-gradient(90deg,#ef4444,#dc2626)' : 'linear-gradient(90deg,#f97316,#f59e0b)',
                  transition: 'width 0.3s',
                }} />
              </div>

              {/* Avatar row */}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {session.session_players.map(p => {
                  const prof = profiles[p.user_id]
                  return (
                    <Avatar
                      key={p.id}
                      name={prof?.username ?? '?'}
                      url={prof?.avatar_url}
                      highlight={p.user_id === currentUserId}
                    />
                  )
                })}
                {Array.from({ length: session.max_players - count }).map((_, i) => (
                  <div key={i} style={{
                    width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                    border: '1.5px dashed rgba(255,255,255,0.12)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: 16, lineHeight: 1 }}>+</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div style={{ padding: '12px 20px 20px', display: 'flex', gap: 10 }}>
              <button
                onClick={handleJoinLeave}
                disabled={joining || (!hasJoined && !isCreator && isFull)}
                style={{
                  flex: 1, padding: '11px', borderRadius: 13,
                  border: (hasJoined || isCreator) ? '1px solid rgba(239,68,68,0.25)' : 'none',
                  cursor: joining || (!hasJoined && !isCreator && isFull) ? 'not-allowed' : 'pointer',
                  fontWeight: 700, fontSize: 14, transition: 'opacity 0.2s',
                  opacity: joining || (!hasJoined && !isCreator && isFull) ? 0.5 : 1,
                  background: (hasJoined || isCreator) ? 'rgba(239,68,68,0.12)' : 'linear-gradient(to right,#f97316,#f59e0b)',
                  color: (hasJoined || isCreator) ? 'rgba(239,68,68,0.85)' : 'white',
                } as React.CSSProperties}
              >
                {joining ? <Loader2 size={15} style={{ animation: 'spin-cw 0.8s linear infinite', display: 'inline' }} />
                  : isCreator ? 'Otkaži igru'
                  : hasJoined ? 'Napusti igru'
                  : isFull ? 'Popunjeno'
                  : 'Pridruži se'}
              </button>
              <Link
                href={`/courts/${courtSlug}`}
                style={{
                  flex: isCreator ? 1 : undefined,
                  padding: '11px 16px', borderRadius: 13,
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)',
                  color: 'rgba(255,255,255,0.60)', fontWeight: 600, fontSize: 13,
                  textDecoration: 'none', textAlign: 'center', whiteSpace: 'nowrap',
                }}
              >
                Pogledaj teren →
              </Link>
            </div>
          </>
        ) : (
          <p style={{ padding: 24, color: 'rgba(255,255,255,0.30)', textAlign: 'center' }}>Nije moguće učitati igru.</p>
        )}
      </div>
    </div>
  )
}
