'use client'

import dynamic from 'next/dynamic'
import { Court } from '@/types'

const MapSection = dynamic(() => import('./MapSection'), {
  ssr: false,
  loading: () => (
    <div style={{ flex: 1, background: '#0e0e16', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
      <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: 14 }}>Učitavanje mape…</div>
    </div>
  ),
})

export default function MapLoader({ courts, headerHeight }: { courts: Court[]; headerHeight: number }) {
  return <MapSection courts={courts} headerHeight={headerHeight} />
}
