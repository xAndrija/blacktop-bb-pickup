'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { Map, Zap, ArrowRight, Clock, MapPin, Users, ChevronRight, Trophy, Timer, Shield, Heart, CalendarPlus, Handshake } from 'lucide-react'
import { Court } from '@/types'
import { pluralIgra } from '@/lib/plural'

interface Session {
  id: string
  court_id: string
  date_time: string
  max_players: number
  courts: { name: string; location_name: string }
  session_players: { id: string }[]
}

interface Props {
  username: string
  courts: Court[]
  sessions: Session[]
  gamesJoined: number
  gamesCreated: number
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('sr-Latn-RS', { hour: '2-digit', minute: '2-digit' })
}

function formatDateShort(iso: string) {
  const d = new Date(iso)
  const today = new Date()
  const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1)
  if (d.toDateString() === today.toDateString()) return 'Danas'
  if (d.toDateString() === tomorrow.toDateString()) return 'Sutra'
  return d.toLocaleDateString('sr-Latn-RS', { weekday: 'short', day: 'numeric', month: 'short' })
}

function getLevel(total: number): { label: string; color: string; next: number } {
  if (total === 0) return { label: 'Početnik', color: 'rgba(255,255,255,0.35)', next: 1 }
  if (total < 5)   return { label: 'Mlad igrač', color: '#60a5fa', next: 5 }
  if (total < 15)  return { label: 'Igrač', color: '#34d399', next: 15 }
  if (total < 40)  return { label: 'Veteran', color: '#fb923c', next: 40 }
  return { label: 'Legenda', color: '#f59e0b', next: Infinity }
}

const KODEKS = [
  { Icon: Timer,     title: 'Dođi na vreme',       desc: 'Poštuj tuđe vreme. Kasni se na venčanja, ne na teren.' },
  { Icon: Handshake, title: 'Poštuj protivnike',   desc: 'Pickup je za sva godišta i nivoe. Ekipa je ekipa.' },
  { Icon: Shield,    title: 'Igraj fer',            desc: 'Bez suvišnih faulova i spornih poziva. Igra se sama brani.' },
  { Icon: Heart,     title: 'Uživaj u igri',        desc: 'Poeni prolaze, uspomene ostaju. Igraj sa osmehom.' },
]

export default function DashboardContent({ username, courts, sessions, gamesJoined, gamesCreated }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in-view') }),
      { threshold: 0.08 }
    )
    ref.current?.querySelectorAll('.scroll-reveal').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  const now = new Date()
  const todayEnd = new Date(now); todayEnd.setHours(23, 59, 59, 999)
  const todayGames = sessions.filter(s => new Date(s.date_time) <= todayEnd).length
  const totalPlayers = sessions.reduce((acc, s) => acc + s.session_players.length, 0)
  const dayName = now.toLocaleDateString('sr-Latn-RS', { weekday: 'long' })
  const dateStr = now.toLocaleDateString('sr-Latn-RS', { day: 'numeric', month: 'long' })

  const totalGames = gamesJoined + gamesCreated
  const level = getLevel(totalGames)
  const pct = level.next === Infinity ? 100 : Math.min(100, Math.round((totalGames / level.next) * 100))

  return (
    <div ref={ref} className="w-full px-6 md:px-10 py-10 max-w-7xl mx-auto">

      {/* ══ HERO ══════════════════════════════════════════════════════════ */}
      <section
        className="animate-fade-up relative mb-10 rounded-3xl overflow-hidden p-5 sm:p-8 md:p-11"
        style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -100, right: -60, width: 420, height: 420, borderRadius: '50%', background: 'radial-gradient(circle, rgba(249,115,22,0.13) 0%, transparent 68%)' }} />
          <div style={{ position: 'absolute', bottom: -80, left: -80, width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 68%)' }} />
        </div>

        <div className="flex flex-col-reverse md:flex-row items-center md:justify-between gap-4 md:gap-8" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(249,115,22,0.7)', marginBottom: 14 }}>
              {dayName} · {dateStr}
            </p>
            <h1 style={{ fontSize: 'clamp(30px, 4vw, 54px)', fontWeight: 900, lineHeight: 1.08, letterSpacing: '-0.025em', marginBottom: 12 }}>
              Dobrodošao,{' '}
              <span className="gradient-text">{username || 'igraču'}</span>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 16, marginBottom: 28 }}>
              Pronađi igru, povedi ekipu. Beograd te čeka.
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(249,115,22,0.10)', border: '1px solid rgba(249,115,22,0.24)', color: 'rgba(251,146,60,0.88)', borderRadius: 999, padding: '6px 14px', fontSize: 13, fontWeight: 600 }}>
                <Zap size={13} /> {todayGames} {pluralIgra(todayGames)} danas
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)', color: 'rgba(255,255,255,0.42)', borderRadius: 999, padding: '6px 14px', fontSize: 13, fontWeight: 600 }}>
                <Users size={13} /> {totalPlayers} {totalPlayers === 1 ? 'igrač prijavljen' : 'igrača prijavljeno'}
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)', color: 'rgba(255,255,255,0.42)', borderRadius: 999, padding: '6px 14px', fontSize: 13, fontWeight: 600 }}>
                <MapPin size={13} /> {courts.length} terena
              </span>
            </div>
          </div>

          <div className="hero-animation flex items-center justify-center shrink-0">
            <div style={{ position: 'relative', width: 260, height: 240 }}>

              {/* ── Layer 1: backboard + back-rim + net ── */}
              <svg width="260" height="240" style={{ position: 'absolute', inset: 0 }}>
                {/* Trajectory guide */}
                <path d="M 30 222 Q 65 10 178 88" fill="none" stroke="rgba(249,115,22,0.09)" strokeWidth="1.5" strokeDasharray="5 8" />

                {/* Backboard */}
                <rect x="220" y="22" width="22" height="110" rx="3" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.30)" strokeWidth="2" />
                <rect x="224" y="50" width="14" height="24" rx="2" fill="none" stroke="rgba(249,115,22,0.60)" strokeWidth="1.5" />
                {/* Pole */}
                <line x1="231" y1="132" x2="231" y2="200" stroke="rgba(255,255,255,0.15)" strokeWidth="3" strokeLinecap="round" />
                {/* Support arm — stops at rim edge */}
                <line x1="220" y1="90" x2="218" y2="90" stroke="rgba(255,255,255,0.25)" strokeWidth="3" strokeLinecap="round" />

                {/* Back arc of rim (top half — behind ball) */}
                <path d="M 138 90 A 40 12 0 0 1 218 90" fill="none" stroke="rgba(249,115,22,0.45)" strokeWidth="4" strokeLinecap="round" />

                {/* Rim glow on swish */}
                <ellipse cx="178" cy="90" rx="44" ry="16" fill="none" stroke="rgba(249,115,22,0.9)" strokeWidth="10" style={{ filter: 'blur(7px)', animation: 'rim-flash 2.4s ease-in-out infinite' }} />

                {/* Net */}
                <g style={{ animation: 'net-drop 2.4s ease-in-out infinite', transformOrigin: '178px 90px' }}>
                  {Array.from({ length: 11 }, (_, i) => {
                    const t = i / 10
                    const xTop = 138 + t * 80
                    const cosA = (xTop - 178) / 40
                    const yTop = 90 + 12 * Math.sqrt(Math.max(0, 1 - cosA * cosA))
                    const xBot = 163 + t * 30
                    return <line key={i} x1={xTop} y1={yTop} x2={xBot} y2={152} stroke="rgba(255,255,255,0.25)" strokeWidth="1.1" />
                  })}
                  <path d="M 143 108 Q 178 113 213 108" fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="1.1" />
                  <path d="M 148 122 Q 178 127 208 122" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.1" />
                  <path d="M 153 136 Q 178 140 203 136" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1.1" />
                  <path d="M 158 150 Q 178 153 198 150" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                </g>
              </svg>

              {/* ── Ball (offset-path follower) ── */}
              <div style={{
                position: 'absolute', top: 0, left: 0,
                width: 40, height: 40,
                borderRadius: '50%',
                overflow: 'hidden',
                background: 'radial-gradient(circle at 30% 27%, #fffbeb 0%, #fef3c7 8%, #fde68a 18%, #fb923c 38%, #ea580c 62%, #9a3412 82%, #3b0f06 100%)',
                boxShadow: 'inset -8px -8px 18px rgba(0,0,0,0.65), inset 5px 5px 12px rgba(255,235,180,0.42), 0 0 30px rgba(249,115,22,0.85), 0 0 8px rgba(249,115,22,1)',
                offsetPath: "path('M 30 222 Q 65 10 178 88')",
                animation: 'ball-shot 2.4s cubic-bezier(0.4,0,0.6,1) infinite',
                zIndex: 10,
              } as React.CSSProperties}>
                {/* Seam lines */}
                <svg viewBox="0 0 100 100" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
                  <g fill="none" stroke="rgba(0,0,0,0.55)" strokeWidth="5" strokeLinecap="round">
                    <line x1="2"  y1="50" x2="98" y2="50" />
                    <line x1="50" y1="2"  x2="50" y2="98" />
                    <path d="M 50 2 A 28 50 0 0 0 50 98" />
                    <path d="M 50 2 A 28 50 0 0 1 50 98" />
                  </g>
                </svg>
              </div>

              {/* ── Layer 3: front arc of rim (over ball) ── */}
              <svg width="260" height="240" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 11 }}>
                <path d="M 138 90 A 40 12 0 0 0 218 90" fill="none" stroke="#f97316" strokeWidth="4.5" strokeLinecap="round" />
              </svg>

            </div>
          </div>
        </div>
      </section>

      {/* ══ FEATURE CARDS ═════════════════════════════════════════════════ */}
      <section className="scroll-reveal mb-10" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
        <Link href="/map" className="glass-card rounded-2xl p-6 block">
          <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.24)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
            <Map size={22} color="#818cf8" />
          </div>
          <h3 style={{ fontWeight: 700, fontSize: 17, color: 'white', marginBottom: 6 }}>Mapa terena</h3>
          <p style={{ color: 'rgba(255,255,255,0.32)', fontSize: 14, lineHeight: 1.65, marginBottom: 20 }}>
            Pronađi teren u blizini uz interaktivnu kartu Beograda i okolice.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#818cf8', fontSize: 13, fontWeight: 700 }}>
            Otvori mapu <ArrowRight size={14} />
          </div>
        </Link>

        <Link href="/games" className="glass-card rounded-2xl p-6 block">
          <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.24)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
            <Zap size={22} color="#fb923c" />
          </div>
          <h3 style={{ fontWeight: 700, fontSize: 17, color: 'white', marginBottom: 6 }}>Zakazane igre</h3>
          <p style={{ color: 'rgba(255,255,255,0.32)', fontSize: 14, lineHeight: 1.65, marginBottom: 20 }}>
            {sessions.length > 0
              ? `${sessions.length} ${sessions.length === 1 ? 'nadolazeća igra čeka te' : sessions.length < 5 ? 'nadolazeće igre čekaju te' : 'nadolazećih igara čeka te'}. Pridruži se ili zakaži novu.`
              : 'Budi prvi koji zakazuje igru na terenu u tvojoj blizini.'}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#fb923c', fontSize: 13, fontWeight: 700 }}>
            Vidi igre <ArrowRight size={14} />
          </div>
        </Link>
      </section>

      {/* ══ UPCOMING GAMES ════════════════════════════════════════════════ */}
      {sessions.length > 0 && (
        <section className="scroll-reveal mb-10" style={{ transitionDelay: '0.1s' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: 'white' }}>Naredne igre</h2>
            <Link href="/games" style={{ fontSize: 13, color: 'rgba(249,115,22,0.65)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3 }}>
              Vidi sve <ChevronRight size={14} />
            </Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {sessions.slice(0, 3).map(s => {
              const count = s.session_players.length
              const isFull = count >= s.max_players
              return (
                <Link key={s.id} href={`/courts/${s.court_id}`} className="glass-card rounded-2xl p-4 flex items-center gap-4 block">
                  <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(249,115,22,0.09)', border: '1px solid rgba(249,115,22,0.18)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0, gap: 2 }}>
                    <Clock size={13} color="rgba(251,146,60,0.65)" />
                    <span style={{ color: '#fb923c', fontWeight: 700, fontSize: 13, lineHeight: 1 }}>{formatTime(s.date_time)}</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 600, color: 'white', fontSize: 15, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.courts.name}</p>
                    <p style={{ color: 'rgba(255,255,255,0.30)', fontSize: 13 }}>{formatDateShort(s.date_time)} · {count}/{s.max_players} igrača</p>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, flexShrink: 0, color: isFull ? 'rgba(248,113,113,0.85)' : 'rgba(74,222,128,0.85)', background: isFull ? 'rgba(239,68,68,0.10)' : 'rgba(34,197,94,0.10)', border: `1px solid ${isFull ? 'rgba(239,68,68,0.22)' : 'rgba(34,197,94,0.22)'}`, padding: '4px 10px', borderRadius: 8 }}>
                    {isFull ? 'Popunjeno' : 'Slobodno'}
                  </span>
                  <ChevronRight size={15} color="rgba(255,255,255,0.18)" />
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {/* ══ PERSONAL STATS ════════════════════════════════════════════════ */}
      <section className="scroll-reveal mb-10" style={{ transitionDelay: '0.15s' }}>
        <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 24, padding: '28px 32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.24)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Trophy size={18} color="#f59e0b" />
              </div>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: 'white' }}>Tvoja statistika</h2>
            </div>
            <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.06em', color: level.color, background: `${level.color}18`, border: `1px solid ${level.color}35`, borderRadius: 999, padding: '5px 14px' }}>
              {level.label}
            </span>
          </div>

          {/* Stat numbers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: 'rgba(255,255,255,0.06)', borderRadius: 16, overflow: 'hidden', marginBottom: 20 }}>
            {[
              { label: 'Igara odigrao', value: gamesJoined },
              { label: 'Igara zakazao', value: gamesCreated },
              { label: 'Ukupno igara', value: totalGames },
            ].map(stat => (
              <div key={stat.label} style={{ background: '#08080f', padding: '20px 16px', textAlign: 'center' }}>
                <div className="gradient-text" style={{ fontSize: 34, fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1 }}>{stat.value}</div>
                <div style={{ color: 'rgba(255,255,255,0.30)', fontSize: 12, marginTop: 5 }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Level progress bar */}
          {level.next !== Infinity && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.30)' }}>Napredak ka sledećem nivou</span>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.30)' }}>{totalGames}/{level.next}</span>
              </div>
              <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: `linear-gradient(90deg, #f97316, #f59e0b)`, borderRadius: 999, transition: 'width 1s ease' }} />
              </div>
            </div>
          )}
          {level.next === Infinity && (
            <p style={{ fontSize: 13, color: 'rgba(245,158,11,0.6)', textAlign: 'center' }}>Dostigao si najviši nivo. Prava legenda terena.</p>
          )}
        </div>
      </section>

      {/* ══ SCHEDULE CTA ══════════════════════════════════════════════════ */}
      <section className="scroll-reveal mb-10" style={{ transitionDelay: '0.2s' }}>
        <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 24, padding: '32px 36px', background: 'linear-gradient(135deg, rgba(249,115,22,0.12) 0%, rgba(99,102,241,0.08) 100%)', border: '1px solid rgba(249,115,22,0.18)' }}>
          <div style={{ position: 'absolute', top: -60, right: -60, width: 220, height: 220, borderRadius: '50%', background: 'radial-gradient(circle, rgba(249,115,22,0.14) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 32, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 240 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <CalendarPlus size={20} color="#fb923c" />
                <h2 style={{ fontSize: 20, fontWeight: 800, color: 'white' }}>Zakaži igru</h2>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.40)', fontSize: 14, lineHeight: 1.7, marginBottom: 18 }}>
                Izaberi teren, odredi vreme i pozovi ekipu. Za manje od minute imaš organizovanu igru.
              </p>
              <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                {['Izaberi teren', 'Odredi vreme', 'Pozovi ekipu'].map((step, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(249,115,22,0.20)', border: '1px solid rgba(249,115,22,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, color: '#fb923c', flexShrink: 0 }}>
                      {i + 1}
                    </div>
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.50)', fontWeight: 500 }}>{step}</span>
                  </div>
                ))}
              </div>
            </div>
            <Link href="/courts" className="btn-shimmer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'white', fontWeight: 700, fontSize: 15, padding: '13px 28px', borderRadius: 14, boxShadow: '0 8px 28px rgba(249,115,22,0.28)', whiteSpace: 'nowrap', flexShrink: 0 }}>
              Zakaži odmah <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ══ PIKAP KODEKS ══════════════════════════════════════════════════ */}
      <section className="scroll-reveal" style={{ transitionDelay: '0.25s' }}>
        <div style={{ marginBottom: 16 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(249,115,22,0.55)', marginBottom: 4 }}>Kultura igre</p>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: 'white' }}>Pikap kodeks</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          {KODEKS.map(({ Icon, title, desc }) => (
            <div key={title} style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '22px 22px' }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.16)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                <Icon size={19} color="rgba(251,146,60,0.75)" />
              </div>
              <h3 style={{ fontWeight: 700, fontSize: 15, color: 'white', marginBottom: 7 }}>{title}</h3>
              <p style={{ color: 'rgba(255,255,255,0.30)', fontSize: 13, lineHeight: 1.7 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}
