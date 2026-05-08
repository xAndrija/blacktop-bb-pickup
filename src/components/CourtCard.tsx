'use client'

import Link from 'next/link'
import Image from 'next/image'
import { MapPin, ChevronRight } from 'lucide-react'
import { Court } from '@/types'

interface Props {
  court: Court
  sessionCount?: number
}

export default function CourtCard({ court, sessionCount = 0 }: Props) {
  const hasGames = sessionCount > 0

  return (
    <Link href={`/courts/${court.slug ?? court.id}`} style={{ display: 'block' }}>
      <div
        className="group"
        style={{
          borderRadius: 20,
          overflow: 'hidden',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          transition: 'border-color 0.2s, transform 0.15s, box-shadow 0.2s',
          cursor: 'pointer',
        }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLElement
          el.style.borderColor = 'rgba(249,115,22,0.40)'
          el.style.transform = 'translateY(-2px)'
          el.style.boxShadow = '0 12px 40px rgba(0,0,0,0.35)'
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLElement
          el.style.borderColor = 'rgba(255,255,255,0.08)'
          el.style.transform = 'translateY(0)'
          el.style.boxShadow = 'none'
        }}
      >
        {/* ── Image / placeholder area ─────────────────────────────── */}
        <div style={{ height: 190, position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, #0e0e1a 0%, #15102a 50%, #090912 100%)' }}>

          {court.image_url ? (
            <Image
              src={court.image_url}
              alt={court.name}
              fill
              sizes="(max-width: 640px) 100vw, 400px"
              style={{ objectFit: 'cover', objectPosition: 'center' }}
            />
          ) : (
            <>
              {/* warm glow */}
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 45%, rgba(249,115,22,0.13) 0%, transparent 65%)' }} />

              {/* basketball watermark — bottom-right */}
              <div style={{ position: 'absolute', right: -24, bottom: -24, opacity: 0.07, transform: 'rotate(12deg)', pointerEvents: 'none' }}>
                <svg width={148} height={148} viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="48" fill="#f97316" />
                  <g fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round" opacity={0.6}>
                    <line x1="2"  y1="50" x2="98" y2="50" />
                    <line x1="50" y1="2"  x2="50" y2="98" />
                    <path d="M 50 2 A 27 48 0 0 0 50 98" />
                    <path d="M 50 2 A 27 48 0 0 1 50 98" />
                  </g>
                </svg>
              </div>

              {/* grid texture */}
              <div style={{
                position: 'absolute', inset: 0, opacity: 0.025,
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
                backgroundSize: '28px 28px',
              }} />
            </>
          )}

          {/* LIVE badge */}
          {hasGames && (
            <div style={{ position: 'absolute', top: 14, right: 14, zIndex: 2 }}>
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

          {/* bottom gradient for name overlay */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 90, background: 'linear-gradient(to top, rgba(8,8,15,0.92) 0%, transparent 100%)' }} />

          {/* Court name over image */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '14px 18px' }}>
            <h2 style={{ color: 'white', fontWeight: 800, fontSize: 19, lineHeight: 1.15, letterSpacing: '-0.01em' }}>
              {court.name}
            </h2>
          </div>
        </div>

        {/* ── Info strip ───────────────────────────────────────────── */}
        <div style={{ padding: '13px 18px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, flex: 1, minWidth: 0 }}>
              <MapPin size={12} color="rgba(249,115,22,0.5)" style={{ flexShrink: 0 }} />
              <span style={{ color: 'rgba(255,255,255,0.36)', fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {court.location_name}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
              <button
                onClick={e => { e.preventDefault(); e.stopPropagation(); window.open(`https://www.google.com/maps?q=${court.lat},${court.lng}`, '_blank', 'noopener,noreferrer') }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)',
                  borderRadius: 8, padding: '3px 8px',
                  fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.40)',
                  whiteSpace: 'nowrap', cursor: 'pointer',
                  transition: 'background 0.2s, color 0.2s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(249,115,22,0.12)'; (e.currentTarget as HTMLElement).style.color = '#fb923c' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.40)' }}
              >
                <MapPin size={10} />
                Google Maps
              </button>
              <ChevronRight size={15} color="rgba(255,255,255,0.15)" className="group-hover:text-orange-400 transition-colors" />
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: 10, paddingTop: 10 }}>
            {hasGames ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#f97316', flexShrink: 0 }} className="animate-pulse" />
                <span style={{ color: '#fb923c', fontSize: 13, fontWeight: 600 }}>
                  {sessionCount} {sessionCount === 1 ? 'aktivna igra' : sessionCount < 5 ? 'aktivne igre' : 'aktivnih igara'}
                </span>
              </div>
            ) : (
              <span style={{ color: 'rgba(255,255,255,0.20)', fontSize: 13 }}>Nema zakazanih igara</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
