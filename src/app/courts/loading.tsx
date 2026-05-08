export default function Loading() {
  return (
    <div className="page-bg min-h-screen">
      {/* Header skeleton */}
      <div style={{ height: 82, borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(8,8,15,0.88)' }} />

      <main className="w-full px-6 md:px-10 py-10 max-w-7xl mx-auto">
        <div style={{ marginBottom: 40 }}>
          <div className="skeleton" style={{ width: 140, height: 12, borderRadius: 6, marginBottom: 12 }} />
          <div className="skeleton" style={{ width: 260, height: 36, borderRadius: 8, marginBottom: 8 }} />
          <div className="skeleton" style={{ width: 180, height: 36, borderRadius: 8 }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{ borderRadius: 20, overflow: 'hidden', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="skeleton" style={{ height: 190 }} />
              <div style={{ padding: '13px 18px 16px' }}>
                <div className="skeleton" style={{ width: '70%', height: 13, borderRadius: 6, marginBottom: 10 }} />
                <div className="skeleton" style={{ width: '40%', height: 11, borderRadius: 6 }} />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
