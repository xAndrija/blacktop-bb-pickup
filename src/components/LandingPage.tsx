'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { MapPin, CalendarPlus, Users, ArrowRight, Zap, Clock } from 'lucide-react'
import Logo from './Logo'

/* ─── Orbit dot ─────────────────────────────────────────────────────────── */

function OrbitDot({ r, dur, delay = 0, color, size = 7, startAngle = 0 }: {
  r: number; dur: number; delay?: number; color: string; size?: number; startAngle?: number
}) {
  return (
    <div style={{
      position: 'absolute',
      width: r * 2, height: r * 2,
      top: '50%', left: '50%',
      marginTop: -r, marginLeft: -r,
      animation: `spin-cw ${dur}s linear infinite`,
      animationDelay: `${-delay}s`,
      transform: `rotate(${startAngle}deg)`,
    }}>
      <div style={{
        position: 'absolute',
        top: -size / 2, left: '50%', marginLeft: -size / 2,
        width: size, height: size,
        borderRadius: '50%',
        background: color,
        boxShadow: `0 0 ${size * 2.5}px ${color}`,
      }} />
    </div>
  )
}

/* ─── Spinning ring ─────────────────────────────────────────────────────── */

function Ring({ inset, dur, dir = 'cw', accent, dashed = false }: {
  inset: number; dur: number; dir?: 'cw' | 'ccw'; accent: string; dashed?: boolean
}) {
  return (
    <div style={{
      position: 'absolute',
      inset,
      borderRadius: '50%',
      border: dashed
        ? `1px dashed rgba(249,115,22,0.12)`
        : `1px solid rgba(249,115,22,0.08)`,
      borderTop: `2px solid ${accent}`,
      animation: `spin-${dir === 'cw' ? 'cw' : 'ccw'} ${dur}s linear infinite`,
    }} />
  )
}

/* ─── Steps data ────────────────────────────────────────────────────────── */

const steps = [
  { num: '01', icon: Zap,          title: 'Registruj se',    desc: 'Napravi nalog za 30 sekundi. Bez kreditne kartice.' },
  { num: '02', icon: MapPin,        title: 'Izaberi teren',   desc: 'Pregledaj terene na mapi i vidi gde se igra danas.' },
  { num: '03', icon: CalendarPlus,  title: 'Zakaži ili se pridruži', desc: 'Kreiraj igru ili se prijavi na postojeću.' },
]

const features = [
  { Icon: MapPin,  title: 'Interaktivna mapa',   desc: 'Svi beogradski tereni na jednom mestu sa live pregledom igara.' },
  { Icon: Users,   title: 'Pravi igrači',         desc: 'Uvek znaš ko dolazi i koliko mesta je ostalo.' },
  { Icon: Clock,   title: 'Brzo i jednostavno',   desc: 'Od registracije do prve igre za manje od minuta.' },
]

const stats = [
  { value: '10+',  label: 'terena u Beogradu' },
  { value: '5min', label: 'do prve igre' },
  { value: '0 RSD', label: 'košta korišćenje' },
]

/* ─── Main component ────────────────────────────────────────────────────── */

export default function LandingPage() {
  const revealRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in-view') }),
      { threshold: 0.1 }
    )
    revealRef.current?.querySelectorAll('.scroll-reveal').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={revealRef} style={{ background: '#08080f', minHeight: '100vh', color: 'white', overflowX: 'hidden' }}>

      {/* ── Background blobs ────────────────────────────────────────────── */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div className="animate-blob" style={{ position: 'absolute', width: 700, height: 700, top: -180, left: -180, background: 'radial-gradient(circle, rgba(249,115,22,0.09) 0%, transparent 70%)', animationDuration: '13s' }} />
        <div className="animate-blob" style={{ position: 'absolute', width: 500, height: 500, bottom: -60, right: -60, background: 'radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)', animationDelay: '5s', animationDuration: '15s' }} />
      </div>

      {/* ── Nav ─────────────────────────────────────────────────────────── */}
      <nav className="px-4 sm:px-10" style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 82, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Logo size={36} />
          <span className="gradient-text" style={{ fontWeight: 800, fontSize: 17 }}>BLKTOP</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link
            href="/login"
            className="text-white/45 hover:text-white font-semibold text-xs sm:text-sm px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl transition-colors"
          >
            Prijavi se
          </Link>
          <Link
            href="/register"
            className="btn-shimmer text-white font-bold text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl"
            style={{ boxShadow: '0 4px 20px rgba(249,115,22,0.25)' }}
          >
            Registruj se
          </Link>
        </div>
      </nav>

      {/* ══════════════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════════════ */}
      <section style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '64px 24px 80px' }}>

        {/* Dot-grid overlay */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.035) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)',
        }} />

        {/* ── Spinning orbit system ── */}
        <div style={{ position: 'relative', width: 320, height: 320, marginBottom: 44, flexShrink: 0 }}>

          {/* Ambient glow */}
          <div style={{
            position: 'absolute', inset: -60,
            background: 'radial-gradient(circle, rgba(249,115,22,0.18) 0%, transparent 65%)',
            borderRadius: '50%',
          }} />

          {/* Rings */}
          <Ring inset={0}   dur={11}  dir="cw"  accent="rgba(249,115,22,0.55)" />
          <Ring inset={30}  dur={8}   dir="ccw" accent="rgba(251,146,60,0.40)" dashed />
          <Ring inset={62}  dur={5}   dir="cw"  accent="rgba(245,158,11,0.50)" />
          <Ring inset={96}  dur={14}  dir="ccw" accent="rgba(249,115,22,0.35)" dashed />

          {/* Tick marks on outer ring */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => (
            <div key={angle} style={{
              position: 'absolute', inset: 0, borderRadius: '50%',
              transform: `rotate(${angle}deg)`,
            }}>
              <div style={{
                position: 'absolute', top: 2, left: '50%', marginLeft: -1,
                width: 2, height: 8, background: 'rgba(249,115,22,0.4)', borderRadius: 1,
              }} />
            </div>
          ))}

          {/* Orbiting dots */}
          <OrbitDot r={160} dur={11}  delay={0}   color="#f97316" size={8}  startAngle={0} />
          <OrbitDot r={160} dur={11}  delay={5.5} color="#fb923c" size={5}  startAngle={180} />
          <OrbitDot r={130} dur={8}   delay={2}   color="#f59e0b" size={6}  startAngle={90} />
          <OrbitDot r={99}  dur={5}   delay={1}   color="#fb923c" size={5}  startAngle={270} />
          <OrbitDot r={99}  dur={5}   delay={3.5} color="#f97316" size={4}  startAngle={45} />

          {/* Center basketball – simple classic ball */}
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="animate-float animate-pulse-glow">
              <svg width={108} height={108} viewBox="0 0 100 100" style={{ display: 'block' }}>
                <defs>
                  <radialGradient id="hb-base" cx="35%" cy="28%" r="78%">
                    <stop offset="0%"   stopColor="#ffd9b0"/>
                    <stop offset="12%"  stopColor="#ffb060"/>
                    <stop offset="32%"  stopColor="#f97316"/>
                    <stop offset="62%"  stopColor="#c2510f"/>
                    <stop offset="100%" stopColor="#5c1f07"/>
                  </radialGradient>
                  <radialGradient id="hb-rim" cx="50%" cy="50%" r="50%">
                    <stop offset="68%" stopColor="#000" stopOpacity={0}/>
                    <stop offset="100%" stopColor="#000" stopOpacity={0.72}/>
                  </radialGradient>
                  <radialGradient id="hb-spec" cx="30%" cy="22%" r="30%">
                    <stop offset="0%"   stopColor="#fff" stopOpacity={0.58}/>
                    <stop offset="55%"  stopColor="#ffe2c0" stopOpacity={0.15}/>
                    <stop offset="100%" stopColor="#fff"  stopOpacity={0}/>
                  </radialGradient>
                </defs>
                <circle cx="50" cy="50" r="48" fill="url(#hb-base)"/>
                <circle cx="50" cy="50" r="48" fill="url(#hb-rim)"/>
                <g fill="none" stroke="#1a0604" strokeWidth="2.4" strokeLinecap="round" opacity={0.85}>
                  <line x1="2" y1="50" x2="98" y2="50"/>
                  <line x1="50" y1="2" x2="50" y2="98"/>
                  <path d="M 50 2 A 27 48 0 0 0 50 98"/>
                  <path d="M 50 2 A 27 48 0 0 1 50 98"/>
                </g>
                <circle cx="50" cy="50" r="48" fill="url(#hb-spec)"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Badge */}
        <div className="animate-fade-up" style={{ animationDelay: '0.05s', marginBottom: 18 }}>
          <span style={{
            display: 'inline-block', fontSize: 11, fontWeight: 700,
            letterSpacing: '0.13em', textTransform: 'uppercase',
            color: 'rgba(251,146,60,0.85)',
            background: 'rgba(249,115,22,0.08)',
            border: '1px solid rgba(249,115,22,0.20)',
            padding: '6px 16px', borderRadius: 999,
          }}>
            Beograd · Pickup Košarka
          </span>
        </div>

        {/* Title */}
        <h1 className="animate-fade-up" style={{
          animationDelay: '0.15s',
          fontSize: 'clamp(40px, 7.5vw, 76px)',
          fontWeight: 900, lineHeight: 1.04,
          letterSpacing: '-0.03em', marginBottom: 18,
        }}>
          Pronađi igru<br />
          <span className="gradient-text animate-gradient">u svom kraju</span>
        </h1>

        {/* Subtitle */}
        <p className="animate-fade-up" style={{
          animationDelay: '0.28s',
          color: 'rgba(255,255,255,0.38)', fontSize: 18, lineHeight: 1.7,
          maxWidth: 460, marginBottom: 36,
        }}>
          Zakaži pickup igru, pridruži se ekipi i igraj košarku na terenima po celom Beogradu — besplatno.
        </p>

        {/* CTAs */}
        <div className="animate-fade-up" style={{ animationDelay: '0.4s', display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/register" className="btn-shimmer" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            color: 'white', fontWeight: 700, fontSize: 16,
            padding: '14px 32px', borderRadius: 16,
            boxShadow: '0 8px 32px rgba(249,115,22,0.30)',
          }}>
            Počni odmah
            <ArrowRight size={18} />
          </Link>
          <Link href="/login" style={{
            display: 'inline-flex', alignItems: 'center',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.10)',
            backdropFilter: 'blur(12px)',
            color: 'rgba(255,255,255,0.6)', fontWeight: 600, fontSize: 16,
            padding: '14px 28px', borderRadius: 16, transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.color = 'white'; e.currentTarget.style.background = 'rgba(255,255,255,0.09)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
          >
            Prijavi se
          </Link>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          STATS
      ══════════════════════════════════════════════════════════════════ */}
      <section style={{ position: 'relative', zIndex: 10, padding: '0 24px 80px' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1px', maxWidth: 720, margin: '0 auto',
          background: 'rgba(255,255,255,0.06)', borderRadius: 20, overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.08)',
        }}>
          {stats.map((s, i) => (
            <div key={i} className="scroll-reveal" style={{
              background: '#08080f', padding: 'clamp(20px, 5vw, 32px) clamp(10px, 3vw, 24px)', textAlign: 'center',
              transitionDelay: `${i * 0.1}s`,
            }}>
              <div className="gradient-text" style={{ fontSize: 'clamp(22px, 6vw, 36px)', fontWeight: 900, letterSpacing: '-0.03em' }}>{s.value}</div>
              <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 'clamp(10px, 2.5vw, 13px)', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════════════════════════════ */}
      <section style={{ position: 'relative', zIndex: 10, padding: '0 24px 80px' }}>
        <p className="scroll-reveal" style={{ textAlign: 'center', fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(249,115,22,0.6)', marginBottom: 10 }}>
          Kako funkcioniše
        </p>
        <h2 className="scroll-reveal" style={{ textAlign: 'center', fontSize: 32, fontWeight: 800, color: 'rgba(255,255,255,0.88)', marginBottom: 56, transitionDelay: '0.08s' }}>
          Tri koraka do igre
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3" style={{ maxWidth: 900, margin: '0 auto', gap: '1rem' }}>
          {steps.map((s, i) => (
            <div key={s.num} className="scroll-reveal" style={{ transitionDelay: `${0.1 + i * 0.12}s`, display: 'flex' }}>
              <div style={{
                flex: 1,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 20, padding: '28px 24px',
                position: 'relative', overflow: 'hidden',
              }}>
                {/* Step number watermark */}
                <div style={{
                  position: 'absolute', top: -10, right: 16,
                  fontSize: 80, fontWeight: 900, color: 'rgba(249,115,22,0.06)',
                  lineHeight: 1, userSelect: 'none',
                }}>
                  {s.num}
                </div>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: 44, height: 44, borderRadius: 12,
                  background: 'rgba(249,115,22,0.12)',
                  border: '1px solid rgba(249,115,22,0.22)',
                  marginBottom: 16,
                }}>
                  <s.icon size={20} color="#fb923c" />
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(249,115,22,0.6)', marginBottom: 8 }}>
                  Korak {s.num}
                </div>
                <h3 style={{ fontWeight: 700, fontSize: 18, color: 'white', marginBottom: 8 }}>{s.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: 14, lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          FEATURES
      ══════════════════════════════════════════════════════════════════ */}
      <section style={{ position: 'relative', zIndex: 10, padding: '0 24px 80px' }}>
        <p className="scroll-reveal" style={{ textAlign: 'center', fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(249,115,22,0.6)', marginBottom: 10 }}>
          Sve na jednom mestu
        </p>
        <h2 className="scroll-reveal" style={{ textAlign: 'center', fontSize: 32, fontWeight: 800, color: 'rgba(255,255,255,0.88)', marginBottom: 48, transitionDelay: '0.08s' }}>
          Zašto BLKTOP
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', maxWidth: 1000, margin: '0 auto' }}>
          {features.map((f, i) => (
            <div key={f.title} className="scroll-reveal glass-card" style={{ borderRadius: 20, padding: '28px 24px', transitionDelay: `${0.1 + i * 0.1}s` }}>
              <div style={{ width: 46, height: 46, borderRadius: 13, background: 'rgba(249,115,22,0.10)', border: '1px solid rgba(249,115,22,0.20)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <f.Icon size={20} color="#fb923c" />
              </div>
              <h3 style={{ fontWeight: 700, fontSize: 17, color: 'white', marginBottom: 8 }}>{f.title}</h3>
              <p style={{ color: 'rgba(255,255,255,0.37)', fontSize: 14, lineHeight: 1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════════════════════════════════ */}
      <section style={{ position: 'relative', zIndex: 10, padding: '0 24px 96px', textAlign: 'center' }}>
        <div className="scroll-reveal" style={{
          maxWidth: 580, margin: '0 auto',
          background: 'linear-gradient(135deg, rgba(249,115,22,0.08) 0%, rgba(99,102,241,0.05) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(249,115,22,0.18)',
          borderRadius: 28, padding: '56px 40px',
        }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <Users size={26} color="#fb923c" />
          </div>
          <h2 style={{ fontSize: 34, fontWeight: 900, marginBottom: 12, letterSpacing: '-0.02em' }}>
            Spreman da igraš?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: 16, marginBottom: 32, lineHeight: 1.65 }}>
            Registruj se besplatno i nađi svoju prvu igru za manje od minuta.
          </p>
          <Link href="/register" className="btn-shimmer" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            color: 'white', fontWeight: 700, fontSize: 16,
            padding: '14px 36px', borderRadius: 16,
            boxShadow: '0 8px 32px rgba(249,115,22,0.30)',
          }}>
            Pridruži se odmah
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer style={{
        position: 'relative', zIndex: 10,
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '24px 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Logo size={24} />
          <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 13 }}>BLKTOP</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          <Link href="/privacy" style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12, textDecoration: 'none' }}>
            Politika privatnosti
          </Link>
          <Link href="/terms" style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12, textDecoration: 'none' }}>
            Uslovi korišćenja
          </Link>
          <span style={{ color: 'rgba(255,255,255,0.1)', fontSize: 12 }}>
            © 2026 · Beograd, Srbija
          </span>
        </div>
      </footer>
    </div>
  )
}
