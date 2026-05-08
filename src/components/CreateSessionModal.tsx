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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
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

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.10)',
    borderRadius: 12,
    padding: '11px 12px',
    color: 'white',
    fontSize: 16, // 16px prevents iOS auto-zoom
    outline: 'none',
    boxSizing: 'border-box',
    colorScheme: 'dark',
  }

  return (
    <div
      className="fixed inset-0 flex items-end sm:items-center justify-center sm:px-4"
      style={{ zIndex: 9999, background: 'rgba(0,0,0,0.70)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-[460px]"
        style={{
          background: 'rgba(12,12,20,0.98)',
          border: '1px solid rgba(255,255,255,0.10)',
          borderRadius: '20px 20px 0 0',
          boxShadow: '0 24px 64px rgba(0,0,0,0.7)',
          maxHeight: '92svh',
          overflowY: 'auto',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Handle bar */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 10, paddingBottom: 4 }}>
          <div style={{ width: 36, height: 4, borderRadius: 999, background: 'rgba(255,255,255,0.12)' }} />
        </div>

        {/* Header */}
        <div style={{ padding: '12px 18px 14px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ color: 'white', fontWeight: 800, fontSize: 17, marginBottom: 1 }}>Nova igra</h2>
            {courtName && <p style={{ color: 'rgba(255,255,255,0.30)', fontSize: 13, margin: 0 }}>{courtName}</p>}
          </div>
          <button
            onClick={onClose}
            style={{ width: 30, height: 30, borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(255,255,255,0.45)', flexShrink: 0 }}
          >
            <X size={14} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '16px 18px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {error && (
            <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: 'rgba(248,113,113,0.9)', borderRadius: 10, padding: '9px 12px', fontSize: 13 }}>
              {error}
            </div>
          )}

          {/* Date + Time */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.30)', marginBottom: 6 }}>
                <CalendarDays size={10} /> Datum
              </label>
              <input
                type="date" required value={date} min={today}
                onChange={e => setDate(e.target.value)}
                style={inputStyle}
                onFocus={e => (e.target.style.borderColor = 'rgba(249,115,22,0.55)')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.10)')}
              />
            </div>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.30)', marginBottom: 6 }}>
                <Clock size={10} /> Vreme
              </label>
              <input
                type="time" required value={time} min={minTime}
                onChange={e => setTime(e.target.value)}
                style={inputStyle}
                onFocus={e => (e.target.style.borderColor = 'rgba(249,115,22,0.55)')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.10)')}
              />
            </div>
          </div>

          {/* Max players */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.30)' }}>
                <Users size={10} /> Max igrača
              </label>
              <span style={{ color: '#fb923c', fontSize: 16, fontWeight: 800 }}>{maxPlayers}</span>
            </div>
            <input
              type="range" min={2} max={20} value={maxPlayers}
              onChange={e => setMaxPlayers(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#f97316', cursor: 'pointer', height: 20 }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'rgba(255,255,255,0.18)', marginTop: 3 }}>
              <span>2</span><span>10</span><span>20</span>
            </div>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', marginTop: 5 }}>
              Još <span style={{ color: '#fb923c', fontWeight: 700 }}>{spotsLeft}</span> slobodnih mesta
            </p>
          </div>

          {/* Description */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.30)', marginBottom: 6 }}>
              <FileText size={10} /> Opis <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, marginLeft: 4 }}>(opciono)</span>
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              maxLength={280}
              rows={2}
              placeholder="Npr. 3v3, fali igrač, trening šuteva…"
              style={{ ...inputStyle, resize: 'none', lineHeight: 1.5, fontFamily: 'inherit' }}
              onFocus={e => (e.target.style.borderColor = 'rgba(249,115,22,0.55)')}
              onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.10)')}
            />
            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.18)', marginTop: 3, textAlign: 'right' }}>{description.length}/280</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-shimmer"
            style={{
              width: '100%', color: 'white', fontWeight: 700, fontSize: 15,
              padding: '13px', borderRadius: 13, display: 'flex', alignItems: 'center',
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
