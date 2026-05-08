export default function Loading() {
  return (
    <div className="page-bg min-h-screen">
      <div style={{ height: 82, borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(8,8,15,0.88)' }} />
      <main className="w-full px-6 md:px-10 py-10 max-w-3xl mx-auto">
        <div style={{ marginBottom: 32 }}>
          <div className="skeleton" style={{ width: 120, height: 11, borderRadius: 6, marginBottom: 10 }} />
          <div className="skeleton" style={{ width: 260, height: 38, borderRadius: 8 }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 32 }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 76, borderRadius: 14 }} />
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 86, borderRadius: 16 }} />
          ))}
        </div>
      </main>
    </div>
  )
}
