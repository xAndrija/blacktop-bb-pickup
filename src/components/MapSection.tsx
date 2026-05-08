'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import Link from 'next/link'
import { Court } from '@/types'

function FlyToUser({ pos }: { pos: [number, number] }) {
  const map = useMap()
  useEffect(() => {
    map.flyTo(pos, 14, { duration: 1.8 })
  }, [pos, map])
  return null
}

function makeCourtIcon() {
  return L.divIcon({
    html: `<div style="width:20px;height:20px;background:linear-gradient(135deg,#f97316,#f59e0b);border-radius:50%;border:2.5px solid white;box-shadow:0 2px 14px rgba(249,115,22,0.65)"></div>`,
    className: '',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -14],
  })
}

const userIcon = L.divIcon({
  html: `<div style="width:16px;height:16px;background:#3b82f6;border-radius:50%;border:2.5px solid white;box-shadow:0 0 0 6px rgba(59,130,246,0.22)"></div>`,
  className: '',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
})

interface Props {
  courts: Court[]
  headerHeight: number
}

export default function MapSection({ courts, headerHeight }: Props) {
  const [userPos, setUserPos] = useState<[number, number] | null>(null)
  const [locAsked, setLocAsked] = useState(false)

  useEffect(() => {
    if (!navigator.geolocation) return
    setLocAsked(true)
    navigator.geolocation.getCurrentPosition(
      pos => setUserPos([pos.coords.latitude, pos.coords.longitude]),
      () => {}
    )
  }, [])

  const height = `calc(100vh - ${headerHeight}px)`

  return (
    <div style={{ position: 'relative', height, width: '100%' }}>
      <MapContainer
        center={[44.8125, 20.4612]}
        zoom={12}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          maxZoom={19}
        />

        {userPos && <FlyToUser pos={userPos} />}

        {courts.map(court => (
          <Marker key={court.id} position={[court.lat, court.lng]} icon={makeCourtIcon()}>
            <Popup>
              <div style={{ minWidth: 140 }}>
                <p style={{ fontWeight: 700, fontSize: 13, margin: '0 0 3px' }}>{court.name}</p>
                <p style={{ fontSize: 11, color: '#888', margin: '0 0 8px' }}>{court.location_name}</p>
                <a
                  href={`/courts/${court.id}`}
                  style={{ display: 'inline-block', background: 'linear-gradient(90deg,#f97316,#f59e0b)', color: 'white', fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 8, textDecoration: 'none' }}
                >
                  Vidi teren →
                </a>
              </div>
            </Popup>
          </Marker>
        ))}

        {userPos && (
          <Marker position={userPos} icon={userIcon}>
            <Popup>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 600 }}>Ti si ovde</p>
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Overlay: courts count + locate button */}
      <div style={{ position: 'absolute', top: 16, left: 16, zIndex: 1000, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ background: 'rgba(8,8,15,0.88)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 14, padding: '10px 16px', color: 'white' }}>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Tereni</p>
          <p style={{ fontSize: 22, fontWeight: 800, margin: 0, background: 'linear-gradient(135deg,#fb923c,#f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{courts.length}</p>
        </div>
        {!userPos && locAsked && (
          <div style={{ background: 'rgba(8,8,15,0.88)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 14, padding: '10px 14px', color: 'rgba(255,255,255,0.45)', fontSize: 12 }}>
            Lokacija nedostupna
          </div>
        )}
      </div>
    </div>
  )
}
