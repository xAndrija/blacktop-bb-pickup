'use client'

import { useState } from 'react'
import { Calendar, Clock, AlertCircle } from 'lucide-react'
import { SessionWithPlayers, ProfileMap } from '@/types'
import PlayerList from './PlayerList'

interface Props {
  session: SessionWithPlayers
  currentUserId: string
  onUpdate: () => void
  profilesMap?: ProfileMap
}

export default function SessionCard({ session, currentUserId, onUpdate, profilesMap = {} }: Props) {
  const [loading, setLoading] = useState(false)
  const players = session.session_players ?? []
  const hasJoined = players.some(p => p.user_id === currentUserId)
  const isFull = players.length >= session.max_players
  const isCreator = session.creator_id === currentUserId
  const isPast = new Date(session.date_time) < new Date()
  const spotsLeft = session.max_players - players.length

  const dateStr = new Date(session.date_time).toLocaleDateString('sr-Latn-RS', {
    weekday: 'short', month: 'short', day: 'numeric',
  })
  const timeStr = new Date(session.date_time).toLocaleTimeString('sr-Latn-RS', {
    hour: '2-digit', minute: '2-digit',
  })

  async function handleJoin() {
    setLoading(true)
    await fetch('/api/sessions/join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: session.id }),
    })
    onUpdate()
    setLoading(false)
  }

  async function handleLeave() {
    setLoading(true)
    await fetch('/api/sessions/leave', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: session.id }),
    })
    onUpdate()
    setLoading(false)
  }

  return (
    <div className={`glass-card rounded-2xl p-5 ${isPast ? 'opacity-50' : ''}`}>
      {/* Top row: date/time + action button */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-3 mb-1.5">
            <div className="flex items-center gap-1.5 text-white/80">
              <Calendar size={14} className="text-white/40" />
              <span className="font-medium text-sm">{dateStr}</span>
            </div>
            <div className="flex items-center gap-1.5 text-orange-400">
              <Clock size={14} />
              <span className="font-semibold text-sm">{timeStr}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {isPast && (
              <span className="text-xs text-white/25 bg-white/5 px-2 py-0.5 rounded-full border border-white/8">Završeno</span>
            )}
            {isCreator && !isPast && (
              <span className="text-xs text-orange-400/80 bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/20">Tvoja igra</span>
            )}
            {isFull && !isPast && (
              <span className="text-xs text-red-400/80 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20">Popunjeno</span>
            )}
          </div>
        </div>

        {!isPast && (
          hasJoined ? (
            <button
              onClick={handleLeave}
              disabled={loading}
              className="text-sm px-4 py-2 rounded-xl border border-white/10 text-white/50 hover:border-red-500/40 hover:text-red-400 transition-all disabled:opacity-40"
            >
              {loading ? '…' : 'Napusti'}
            </button>
          ) : (
            <button
              onClick={handleJoin}
              disabled={loading || isFull}
              className="text-sm px-5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold transition-all shadow-lg shadow-orange-500/20 disabled:opacity-40 disabled:shadow-none"
            >
              {loading ? '…' : 'Pridruži se'}
            </button>
          )
        )}
      </div>

      {/* Description */}
      {session.description && (
        <p style={{ color: 'rgba(255,255,255,0.50)', fontSize: 13, lineHeight: 1.55, marginBottom: 12, padding: '8px 12px', background: 'rgba(255,255,255,0.04)', borderRadius: 10, borderLeft: '2px solid rgba(249,115,22,0.35)' }}>
          {session.description}
        </p>
      )}

      {/* "Fali X igrač" warning */}
      {!isPast && !isFull && spotsLeft <= 3 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10, color: '#fb923c', fontSize: 12, fontWeight: 600 }}>
          <AlertCircle size={13} />
          {spotsLeft === 1 ? 'Fali samo 1 igrač!' : `Fale još ${spotsLeft} igrača`}
        </div>
      )}

      {/* Players */}
      <PlayerList
        players={players}
        maxPlayers={session.max_players}
        currentUserId={currentUserId}
        profilesMap={profilesMap}
      />
    </div>
  )
}
