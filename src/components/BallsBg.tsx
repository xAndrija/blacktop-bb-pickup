const CSS = `
@keyframes bb-a {
  0%, 100% { transform: translate(0px,   0px)   rotate(0deg);   }
  50%       { transform: translate(110px, -85px) rotate(180deg); }
}
@keyframes bb-b {
  0%, 100% { transform: translate(0px,    0px)  rotate(0deg);    }
  50%       { transform: translate(-95px, 75px) rotate(-180deg); }
}
@keyframes bb-c {
  0%, 100% { transform: translate(0px,   0px)    rotate(0deg);   }
  33%       { transform: translate(75px,  -105px) rotate(120deg); }
  66%       { transform: translate(-85px, 65px)   rotate(240deg); }
}
@keyframes bb-d {
  0%, 100% { transform: translate(0px,    0px)   rotate(0deg);   }
  25%       { transform: translate(-115px,-65px)  rotate(90deg);  }
  75%       { transform: translate(90px,   95px)  rotate(270deg); }
}
`

/* Depth layers: far → mid → near */
const BALLS = [
  /* — far layer (small · slow · dim) — */
  { id: 0, size: 46, x: '12%',  y: '18%',  anim: 'bb-b', dur: 32, delay: 0,   opacity: 0.11 },
  { id: 1, size: 52, x: '72%',  y: '12%',  anim: 'bb-a', dur: 28, delay: -10, opacity: 0.10 },
  { id: 2, size: 42, x: '88%',  y: '58%',  anim: 'bb-c', dur: 36, delay: -18, opacity: 0.09 },
  /* — mid layer — */
  { id: 3, size: 70, x: '55%',  y: '70%',  anim: 'bb-d', dur: 22, delay: -6,  opacity: 0.16 },
  { id: 4, size: 64, x: '28%',  y: '62%',  anim: 'bb-a', dur: 26, delay: -14, opacity: 0.15 },
  { id: 5, size: 76, x: '78%',  y: '30%',  anim: 'bb-b', dur: 20, delay: -4,  opacity: 0.17 },
  /* — near layer (large · fast · bright) — */
  { id: 6, size: 96, x: '4%',   y: '44%',  anim: 'bb-c', dur: 16, delay: -8,  opacity: 0.22 },
  { id: 7, size: 88, x: '60%',  y: '82%',  anim: 'bb-d', dur: 18, delay: -2,  opacity: 0.20 },
]

function Ball({ size, id }: { size: number; id: number }) {
  const g  = `bbg-${id}`
  const ri = `bbr-${id}`
  const sp = `bbs-${id}`
  const rl = `bbl-${id}`

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: 'block' }}>
      <defs>
        <radialGradient id={g} cx="34%" cy="26%" r="88%">
          <stop offset="0%"   stopColor="#ffd9b0" />
          <stop offset="8%"   stopColor="#ffb070" />
          <stop offset="22%"  stopColor="#f97316" />
          <stop offset="48%"  stopColor="#d05a14" />
          <stop offset="78%"  stopColor="#8a3008" />
          <stop offset="100%" stopColor="#3a1203" />
        </radialGradient>
        <radialGradient id={ri} cx="50%" cy="50%" r="50%">
          <stop offset="65%" stopColor="#000" stopOpacity={0}  />
          <stop offset="100%" stopColor="#000" stopOpacity={0.80} />
        </radialGradient>
        <radialGradient id={sp} cx="30%" cy="22%" r="34%">
          <stop offset="0%"   stopColor="#fff" stopOpacity={0.60} />
          <stop offset="50%"  stopColor="#ffe2c0" stopOpacity={0.18} />
          <stop offset="100%" stopColor="#fff" stopOpacity={0}  />
        </radialGradient>
        <radialGradient id={rl} cx="74%" cy="72%" r="30%">
          <stop offset="0%"   stopColor="#ffb070" stopOpacity={0}    />
          <stop offset="70%"  stopColor="#ff9550" stopOpacity={0.30} />
          <stop offset="100%" stopColor="#ff9550" stopOpacity={0}    />
        </radialGradient>
      </defs>

      {/* Base colour */}
      <circle cx="50" cy="50" r="48" fill={`url(#${g})`} />
      {/* Rim darkening */}
      <circle cx="50" cy="50" r="48" fill={`url(#${ri})`} />
      {/* Seam shadow pass */}
      <g fill="none" stroke="#1a0604" strokeWidth="3.5" strokeLinecap="round" opacity={0.50}>
        <line x1="2"  y1="50" x2="98" y2="50" />
        <line x1="50" y1="2"  x2="50" y2="98" />
        <path d="M 50 2 A 27 48 0 0 0 50 98" />
        <path d="M 50 2 A 27 48 0 0 1 50 98" />
      </g>
      {/* Seam colour pass */}
      <g fill="none" stroke="#2a0c06" strokeWidth="2.2" strokeLinecap="round">
        <line x1="2"  y1="50" x2="98" y2="50" />
        <line x1="50" y1="2"  x2="50" y2="98" />
        <path d="M 50 2 A 27 48 0 0 0 50 98" />
        <path d="M 50 2 A 27 48 0 0 1 50 98" />
      </g>
      {/* Rim-light from lower right */}
      <circle cx="50" cy="50" r="48" fill={`url(#${rl})`} />
      {/* Specular highlight */}
      <circle cx="50" cy="50" r="48" fill={`url(#${sp})`} />
    </svg>
  )
}

export default function BallsBg() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        {BALLS.map(b => (
          <div
            key={b.id}
            style={{
              position: 'absolute',
              left: b.x,
              top:  b.y,
              opacity: b.opacity,
              animation: `${b.anim} ${b.dur}s ease-in-out ${b.delay}s infinite`,
              willChange: 'transform',
            }}
          >
            <Ball size={b.size} id={b.id} />
          </div>
        ))}
      </div>
    </>
  )
}
