export default function Loading() {
  return (
    <div className="page-bg min-h-screen">
      <div style={{ height: 82, borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(8,8,15,0.88)' }} />
      <main className="max-w-7xl mx-auto px-6 md:px-10 py-10">
        <div className="skeleton" style={{ height: 220, borderRadius: 20, marginBottom: 24 }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 24 }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 100, borderRadius: 16 }} />
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 72, borderRadius: 16 }} />
          ))}
        </div>
      </main>
    </div>
  )
}
