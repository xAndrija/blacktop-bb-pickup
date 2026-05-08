export default function Loading() {
  return (
    <div className="page-bg min-h-screen">
      <div style={{ height: 82, borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(8,8,15,0.88)' }} />
      <main className="max-w-3xl mx-auto px-4 md:px-8 py-8 space-y-5">
        {/* Hero */}
        <div style={{ borderRadius: 20, overflow: 'hidden', display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 220 }}>
          <div className="skeleton" style={{ minHeight: 220 }} />
          <div style={{ padding: 22, background: 'rgba(255,255,255,0.03)', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div className="skeleton" style={{ width: '80%', height: 22, borderRadius: 6 }} />
            <div className="skeleton" style={{ width: '60%', height: 13, borderRadius: 6 }} />
            <div className="skeleton" style={{ width: '90%', height: 11, borderRadius: 6, marginTop: 4 }} />
            <div className="skeleton" style={{ width: '75%', height: 11, borderRadius: 6 }} />
            <div className="skeleton" style={{ height: 40, borderRadius: 12, marginTop: 'auto' }} />
          </div>
        </div>
        {/* Map */}
        <div className="skeleton" style={{ height: 240, borderRadius: 16 }} />
        {/* Sessions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 90, borderRadius: 16 }} />
          ))}
        </div>
      </main>
    </div>
  )
}
