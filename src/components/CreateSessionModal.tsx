'use client'

import { useState } from 'react'
import { CalendarDays, Clock, Users, FileText, Loader2, X } from 'lucide-react'

interface Props {
  courtId: string
  courtName?: string
  onCreated: () => void
  onClose: () => void
}

export default function CreateSessionModal({ courtId, courtName, onCreated, onClose }: Props) {
  const today = new Date().toISOString().split('T')[0]
  const nowTime = new Date().toTimeString().slice(0, 5)

  const [date, setDate] = useState(today)
  const [time, setTime] = useState(nowTime)
  const [maxPlayers, setMaxPlayers] = useState(10)
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const minTime = date === today ? nowTime : undefined

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!date || !time) { setError('Izaberi datum i vreme'); return }
    setLoading(true)
    setError('')

    const res = await fetch('/api/sessions/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        court_id: courtId,
        date_time: `${date}T${time}:00`,
        max_players: maxPlayers,
        description: description.trim() || null,
      }),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error ?? 'Greška pri kreiranju igre')
      setLoading(false)
      return
    }

    onCreated()
  }

  const spotsLeft = maxPlayers - 1 // creator auto-joins

  return (
    <div
      className="fixed inset-0 flex items-center justify-center px-4"
      style={{ zIndex: 9999, background: 'rgba(0,0,0,0.70)', backdropFilter: 'blur(6px)' }}
    >
      <div
        style={{
          background: 'rgba(12,12,20,0.98)', border: '1px solid rgba(255,255,255,0.10)',
          borderRadius: 24, width: '100%', maxWidth: 460,
          boxShadow: '0 24px 64px rgba(0,0,0,0.7)',
        }}
      >
        {/* Header */}
        <div style={{ padding: '22px 24px 18px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ color: 'white', fontWeight: 800, fontSize: 18, marginBottom: 2 }}>Nova igra</h2>
            {courtName && <p style={{ color: 'rgba(255,255,255,0.30)', fontSize: 13 }}>{courtName}</p>}
          </div>
          <button
            onClick={onClose}
            style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(255,255,255,0.45)' }}
          >
            <X size={15} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '20px 24px 24px', display: 'flex', flexDirection: 'column', gap: 18 }}>
          {error && (
            <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: 'rgba(248,113,113,0.9)', borderRadius: 12, padding: '10px 14px', fontSize: 13 }}>
              {error}
            </div>
          )}

          {/* Date + Time */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.30)', marginBottom: 8 }}>
                <CalendarDays size={11} /> Datum
              </label>
              <input
                type="date"
                required
                value={date}
                min={today}
                onChange={e => setDate(e.target.value)}
                style={{
                  width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)',
                  borderRadius: 12, padding: '11px 14px', color: 'white', fontSize: 14,
                  outline: 'none', boxSizing: 'border-box', colorScheme: 'dark',
                }}
                onFocus={e => (e.target.style.borderColor = 'rgba(249,115,22,0.55)')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.10)')}
              />
            </div>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.30)', marginBottom: 8 }}>
                <Clock size={11} /> Vreme
              </label>
              <input
                type="time"
                required
                value={time}
                min={minTime}
                onChange={e => setTime(e.target.value)}
                style={{
                  width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)',
                  borderRadius: 12, padding: '11px 14px', color: 'white', fontSize: 14,
                  outline: 'none', boxSizing: 'border-box', colorScheme: 'dark',
                }}
                onFocus={e => (e.target.style.borderColor = 'rgba(249,115,22,0.55)')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.10)')}
              />
            </div>
          </div>

          {/* Max players */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.30)', marginBottom: 10 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Users size={11} /> Max igrača</span>
              <span style={{ color: '#fb923c', fontSize: 15, fontWeight: 800 }}>{maxPlayers}</span>
            </label>
            <input
              type="range" min={2} max={20} value={maxPlayers}
              onChange={e => setMaxPlayers(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#f97316', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'rgba(255,255,255,0.20)', marginTop: 4 }}>
              <span>2</span><span>10</span><span>20</span>
            </div>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.28)', marginTop: 6 }}>
              Još <span style={{ color: '#fb923c', fontWeight: 700 }}>{spotsLeft}</span> slobodnih mesta (ti si već u igri)
            </p>
          </div>

          {/* Description */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.30)', marginBottom: 8 }}>
              <FileText size={11} /> Opis <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(opciono)</span>
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              maxLength={280}
              rows={3}
              placeholder="Npr. Fali nam 1 igrač, dolazi na 18h · Mini turnir 3v3 · Trening šuteva…"
              style={{
                width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)',
                borderRadius: 12, padding: '11px 14px', color: 'white', fontSize: 14,
                outline: 'none', boxSizing: 'border-box', resize: 'none', lineHeight: 1.6,
                colorScheme: 'dark', fontFamily: 'inherit',
              }}
              onFocus={e => (e.target.style.borderColor = 'rgba(249,115,22,0.55)')}
              onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.10)')}
            />
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.18)', marginTop: 4, textAlign: 'right' }}>{description.length}/280</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-shimmer"
            style={{
              width: '100%', color: 'white', fontWeight: 700, fontSize: 15,
              padding: '14px', borderRadius: 14, display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: 8, opacity: loading ? 0.6 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? <><Loader2 size={16} style={{ animation: 'spin-cw 0.8s linear infinite' }} /> Kreiranje…</> : 'Kreiraj igru'}
          </button>
        </form>
      </div>
    </div>
  )
}
