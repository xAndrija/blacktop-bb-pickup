export default function Loading() {
  return (
    <div className="page-bg min-h-screen">
      <div style={{ height: 82, borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(8,8,15,0.88)' }} />
      <main className="max-w-lg mx-auto px-6 md:px-10 py-10">
        <div style={{ marginBottom: 32 }}>
          <div className="skeleton" style={{ width: 80, height: 11, borderRadius: 6, marginBottom: 10 }} />
          <div className="skeleton" style={{ width: 200, height: 34, borderRadius: 8 }} />
        </div>
        <div className="skeleton" style={{ height: 120, borderRadius: 20, marginBottom: 16 }} />
        <div className="skeleton" style={{ height: 320, borderRadius: 20 }} />
      </main>
    </div>
  )
}
