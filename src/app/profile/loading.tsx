export default function Loading() {
  return (
    <div className="page-bg min-h-screen">
      <div style={{ height: 82, borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(8,8,15,0.88)' }} />
      <main className="max-w-4xl mx-auto px-6 md:px-10 py-10">
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="skeleton" style={{ height: 300, borderRadius: 20 }} />
            <div className="skeleton" style={{ height: 120, borderRadius: 16 }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="skeleton" style={{ height: 160, borderRadius: 16 }} />
            <div className="skeleton" style={{ height: 60, borderRadius: 12 }} />
          </div>
        </div>
      </main>
    </div>
  )
}
