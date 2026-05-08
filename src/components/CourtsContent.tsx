'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { List, Map } from 'lucide-react'
import CourtCard from './CourtCard'
import { Court } from '@/types'

const CourtMap = dynamic(() => import('./CourtMap'), {
  ssr: false,
  loading: () => <div className="rounded-2xl bg-white/4 animate-pulse" style={{ height: '420px' }} />,
})

interface Props {
  courts: Court[]
  countMap: Record<string, number>
}

export default function CourtsContent({ courts, countMap }: Props) {
  const [view, setView] = useState<'list' | 'map'>('list')

  return (
    <>
      {/* View toggle */}
      <div className="flex items-center gap-2 mb-5">
        <button
          onClick={() => setView('list')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
            view === 'list'
              ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
              : 'text-white/35 hover:text-white/60 border border-transparent'
          }`}
        >
          <List size={14} />
          Lista
        </button>
        <button
          onClick={() => setView('map')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
            view === 'map'
              ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
              : 'text-white/35 hover:text-white/60 border border-transparent'
          }`}
        >
          <Map size={14} />
          Mapa
        </button>
      </div>

      {view === 'list' ? (
        courts.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
            {courts.map(court => (
              <CourtCard
                key={court.id}
                court={court}
                sessionCount={countMap[court.id] ?? 0}
              />
            ))}
          </div>
        ) : (
          <div className="glass rounded-2xl text-center py-16 text-white/30">
            <p className="font-medium">Nema terena još uvek</p>
            <p className="text-sm mt-1 text-white/20">Dodaj teren u Supabase</p>
          </div>
        )
      ) : (
        <div className="glass rounded-2xl overflow-hidden">
          <CourtMap courts={courts} height="clamp(260px, 55vw, 420px)" />
        </div>
      )}
    </>
  )
}
