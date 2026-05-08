'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { Court } from '@/types'

function makeCourtIcon(isActive: boolean) {
  const color = isActive
    ? 'linear-gradient(135deg,#f97316,#f59e0b)'
    : 'rgba(255,255,255,0.5)'
  const shadow = isActive
    ? '0 2px 12px rgba(249,115,22,0.7)'
    : '0 1px 4px rgba(0,0,0,0.4)'
  return L.divIcon({
    html: `<div style="width:22px;height:22px;background:${color};border-radius:50%;border:2px solid white;box-shadow:${shadow}"></div>`,
    className: '',
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    popupAnchor: [0, -14],
  })
}

interface Props {
  courts: Court[]
  activeCourt?: Court
  height?: string
}

export default function CourtMap({ courts, activeCourt, height = '280px' }: Props) {
  const [userPos, setUserPos] = useState<[number, number] | null>(null)

  const userIcon = L.divIcon({
    html: `<div style="width:14px;height:14px;background:#3b82f6;border-radius:50%;border:2.5px solid white;box-shadow:0 0 0 5px rgba(59,130,246,0.25)"></div>`,
    className: '',
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  })

  useEffect(() => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      pos => setUserPos([pos.coords.latitude, pos.coords.longitude]),
      () => {}
    )
  }, [])

  const center: [number, number] = activeCourt
    ? [activeCourt.lat, activeCourt.lng]
    : courts.length === 1
      ? [courts[0].lat, courts[0].lng]
      : [44.8125, 20.4612]

  const zoom = activeCourt || courts.length === 1 ? 16 : 13

  return (
    <div style={{ height, width: '100%', borderRadius: '16px', overflow: 'hidden' }}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
        zoomControl={true}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          maxZoom={19}
        />
        {courts.map(court => (
          <Marker
            key={court.id}
            position={[court.lat, court.lng]}
            icon={makeCourtIcon(court.id === activeCourt?.id)}
          >
            <Popup>
              <div style={{ minWidth: '120px' }}>
                <p style={{ fontWeight: '700', fontSize: '13px', margin: '0 0 2px' }}>{court.name}</p>
                <p style={{ fontSize: '11px', color: '#888', margin: 0 }}>{court.location_name}</p>
              </div>
            </Popup>
          </Marker>
        ))}
        {userPos && (
          <Marker position={userPos} icon={userIcon}>
            <Popup>
              <p style={{ margin: 0, fontSize: '12px', fontWeight: '600' }}>Ti si ovde</p>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  )
}
