'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { CalendarDays, Clock, Users, ChevronRight, Zap, MessageCircle } from 'lucide-react'
import GamePreviewModal from './GamePreviewModal'
import { createClient } from '@/lib/supabase/client'

interface Session {
  id: string
  court_id: string
  date_time: string
  max_players: number
  courts: { name: string; location_name: string }
  session_players: { id: string }[]
}

type Filter = 'danas' | 'nedelja' | 'sve'

interface Props {
  sessions: Session[]
  currentUserId: string
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('sr-Latn-RS', { hour: '2-digit', minute: '2-digit' })
}

function formatDateLabel(iso: string) {
  const d = new Date(iso)
  const today = new Date()
  const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1)

  if (d.toDateString() === today.toDateString()) return 'Danas'
  if (d.toDateString() === tomorrow.toDateString()) return 'Sutra'
  return d.toLocaleDateString('sr-Latn-RS', { weekday: 'long', day: 'numeric', month: 'long' })
}

export default function GamesContent({ sessions, currentUserId }: Props) {
  const [filter, setFilter] = useState<Filter>('sve')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [unread, setUnread] = useState<Record<string, number>>({})

  useEffect(() => {
    if (!sessions.length) return
    const supabase = createClient()
    const ids = sessions.map(s => s.id)

    supabase.rpc('get_unread_counts', { p_user_id: currentUserId, p_session_ids: ids })
      .then(({ data }) => {
        const map: Record<string, number> = {}
        ;(data ?? []).forEach((row: any) => { map[row.session_id] = Number(row.unread_count) })
        setUnread(map)
      })

    const channel = supabase.channel('games-messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
        if (payload.new.user_id !== currentUserId && ids.includes(payload.new.session_id)) {
          setUnread(prev => ({ ...prev, [payload.new.session_id]: (prev[payload.new.session_id] ?? 0) + 1 }))
        }
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [sessions, currentUserId])

  function handleMarkRead(sessionId: string) {
    setUnread(prev => ({ ...prev, [sessionId]: 0 }))
  }

  const now = new Date()
  const todayEnd = new Date(now); todayEnd.setHours(23, 59, 59, 999)
  const weekEnd = new Date(now); weekEnd.setDate(now.getDate() + 7)

  const filtered = sessions.filter(s => {
    const d = new Date(s.date_time)
    if (filter === 'danas') return d <= todayEnd
    if (filter === 'nedelja') return d <= weekEnd
    return true
  })

  // Group by date label
  const groups: { label: string; sessions: Session[] }[] = []
  filtered.forEach(s => {
    const label = formatDateLabel(s.date_time)
    let group = groups.find(g => g.label === label)
    if (!group) {
      group = { label, sessions: [] }
      groups.push(group)
    }
    group.sessions.push(s)
  })

  const todayCount = sessions.filter(s => new Date(s.date_time) <= todayEnd).length
  const totalPlayers = sessions.reduce((acc, s) => acc + s.session_players.length, 0)

  return (
    <>
      {/* Stats row */}
      <div className="flex gap-3 mb-8">
        <div className="glass rounded-2xl px-5 py-4 flex-1">
          <p className="text-white/30 text-xs uppercase tracking-wider mb-1">Igre danas</p>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-white">{todayCount}</span>
            <Zap size={18} className="text-orange-400 mb-1" />
          </div>
        </div>
        <div className="glass rounded-2xl px-5 py-4 flex-1">
          <p className="text-white/30 text-xs uppercase tracking-wider mb-1">Igrači prijavljeni</p>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-white">{totalPlayers}</span>
            <Users size={18} className="text-white/40 mb-1" />
          </div>
        </div>
        <div className="glass rounded-2xl px-5 py-4 flex-1">
          <p className="text-white/30 text-xs uppercase tracking-wider mb-1">Ukupno igara</p>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-white">{sessions.length}</span>
            <CalendarDays size={18} className="text-white/40 mb-1" />
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          {(['sve', 'danas', 'nedelja'] as Filter[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                filter === f
                  ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                  : 'text-white/40 hover:text-white/65 border border-white/8'
              }`}
            >
              {f === 'danas' ? 'Danas' : f === 'nedelja' ? 'Ova nedelja' : 'Sve igre'}
            </button>
          ))}
        </div>
        <Link
          href="/courts"
          className="btn-shimmer text-white text-sm font-semibold px-4 py-2 rounded-xl"
        >
          + Nova igra
        </Link>
      </div>

      {/* Games list */}
      {groups.length === 0 ? (
        <div className="glass rounded-2xl text-center py-20">
          <CalendarDays size={40} className="mx-auto mb-4 text-white/15" />
          <p className="text-white/40 font-semibold text-lg">Nema zakazanih igara</p>
          <p className="text-white/20 text-sm mt-1 mb-6">Budi prvi koji zakazuje na terenu</p>
          <Link href="/courts" className="btn-shimmer inline-flex items-center gap-2 text-white text-sm font-semibold px-5 py-2.5 rounded-xl">
            Idi na terene
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {groups.map(({ label, sessions: daySessions }) => (
            <div key={label}>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-white/30 text-xs uppercase tracking-widest font-semibold">{label}</span>
                <div className="flex-1 h-px bg-white/6" />
                <span className="text-white/20 text-xs">{daySessions.length} {daySessions.length === 1 ? 'igra' : daySessions.length < 5 ? 'igre' : 'igara'}</span>
              </div>

              <div className="space-y-2.5">
                {daySessions.map(s => {
                  const count = s.session_players.length
                  const isFull = count >= s.max_players
                  const pct = Math.round((count / s.max_players) * 100)

                  return (
                    <div
                      key={s.id}
                      onClick={() => setSelectedId(s.id)}
                      className="glass-card rounded-2xl p-4 flex items-center gap-4 cursor-pointer"
                    >
                      {/* Time badge */}
                      <div className="w-14 h-14 rounded-xl bg-orange-500/10 border border-orange-500/18 flex flex-col items-center justify-center shrink-0 gap-0.5">
                        <Clock size={14} className="text-orange-400/70" />
                        <span className="text-orange-300 font-bold text-sm leading-none">{formatTime(s.date_time)}</span>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold truncate">{s.courts.name}</p>
                        <p className="text-white/35 text-sm truncate mb-2">{s.courts.location_name}</p>
                        {/* Progress bar */}
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 rounded-full bg-white/8 overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                width: `${pct}%`,
                                background: isFull
                                  ? 'linear-gradient(90deg,#ef4444,#dc2626)'
                                  : 'linear-gradient(90deg,#f97316,#f59e0b)',
                              }}
                            />
                          </div>
                          <span className={`text-xs font-semibold shrink-0 ${isFull ? 'text-red-400/70' : 'text-white/40'}`}>
                            {count}/{s.max_players}
                          </span>
                        </div>
                      </div>

                      {/* Status + arrow */}
                      <div className="flex items-center gap-2 shrink-0">
                        {(unread[s.id] ?? 0) > 0 && (
                          <div style={{ position: 'relative', display: 'flex' }}>
                            <MessageCircle size={18} className="text-orange-400" />
                            <span style={{
                              position: 'absolute', top: -5, right: -5,
                              background: '#f97316', color: 'white',
                              fontSize: 9, fontWeight: 800, lineHeight: 1,
                              borderRadius: 99, padding: '2px 4px', minWidth: 14, textAlign: 'center',
                            }}>{unread[s.id]}</span>
                          </div>
                        )}
                        {isFull ? (
                          <span className="text-xs font-semibold text-red-400/80 bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-lg">Popunjeno</span>
                        ) : (
                          <span className="text-xs font-semibold text-green-400/80 bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-lg">Slobodno</span>
                        )}
                        <ChevronRight size={16} className="text-white/20" />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedId && (
        <GamePreviewModal
          sessionId={selectedId}
          currentUserId={currentUserId}
          unreadCount={unread[selectedId] ?? 0}
          onMarkRead={() => handleMarkRead(selectedId)}
          onClose={() => setSelectedId(null)}
        />
      )}
    </>
  )
}
