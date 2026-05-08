'use client'

import dynamic from 'next/dynamic'
import { Court } from '@/types'

const CourtMap = dynamic(() => import('./CourtMap'), {
  ssr: false,
  loading: () => <div className="rounded-2xl bg-white/4 animate-pulse" style={{ height: '360px' }} />,
})

interface Props {
  courts: Court[]
}

export default function CourtsMapSection({ courts }: Props) {
  return <CourtMap courts={courts} height="360px" />
}
