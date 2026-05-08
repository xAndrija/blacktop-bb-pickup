'use client'

import { useState, useEffect } from 'react'
import { Bell, BellOff, Loader2 } from 'lucide-react'

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  return Uint8Array.from([...rawData].map(c => c.charCodeAt(0)))
}

export default function PushToggle() {
  const [status, setStatus] = useState<'loading' | 'unsupported' | 'denied' | 'subscribed' | 'unsubscribed'>('loading')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      setStatus('unsupported')
      return
    }
    navigator.serviceWorker.register('/sw.js').then(async reg => {
      const existing = await reg.pushManager.getSubscription()
      if (existing) {
        setStatus('subscribed')
      } else if (Notification.permission === 'denied') {
        setStatus('denied')
      } else {
        setStatus('unsubscribed')
      }
    })
  }, [])

  async function subscribe() {
    setSaving(true)
    try {
      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!),
      })
      const res = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sub),
      })
      if (!res.ok) {
        console.error('Push subscribe API error:', await res.text())
        throw new Error('API error')
      }
      setStatus('subscribed')
    } catch (e) {
      console.error('Push subscribe failed:', e)
      setStatus(Notification.permission === 'denied' ? 'denied' : 'unsubscribed')
    }
    setSaving(false)
  }

  async function unsubscribe() {
    setSaving(true)
    try {
      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.getSubscription()
      await sub?.unsubscribe()
      await fetch('/api/push/subscribe', { method: 'DELETE' })
      setStatus('unsubscribed')
    } catch {}
    setSaving(false)
  }

  const isOn = status === 'subscribed'

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {isOn
          ? <Bell size={16} color="#fb923c" />
          : <BellOff size={16} color="rgba(255,255,255,0.30)" />
        }
        <div>
          <p style={{ color: 'rgba(255,255,255,0.70)', fontSize: 14, margin: 0 }}>
            {status === 'subscribed' ? 'Obaveštenja uključena' : 'Obaveštenja isključena'}
          </p>
          {status === 'denied' && (
            <p style={{ color: 'rgba(239,68,68,0.70)', fontSize: 12, margin: '2px 0 0' }}>
              Dozvoli notifikacije u podešavanjima browsera
            </p>
          )}
          {status === 'unsupported' && (
            <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12, margin: '2px 0 0' }}>
              Browser ne podržava push notifikacije
            </p>
          )}
        </div>
      </div>

      {status === 'loading' || saving ? (
        <Loader2 size={18} color="rgba(255,255,255,0.30)" style={{ animation: 'spin-cw 0.8s linear infinite', flexShrink: 0 }} />
      ) : status !== 'unsupported' && status !== 'denied' ? (
        <button
          type="button"
          onClick={isOn ? unsubscribe : subscribe}
          style={{
            width: 44, height: 24, borderRadius: 999, border: 'none', cursor: 'pointer',
            background: isOn ? 'linear-gradient(90deg,#f97316,#f59e0b)' : 'rgba(255,255,255,0.10)',
            position: 'relative', transition: 'background 0.25s', flexShrink: 0,
          }}
        >
          <span style={{
            position: 'absolute', top: 3, left: isOn ? 23 : 3,
            width: 18, height: 18, borderRadius: '50%', background: 'white',
            transition: 'left 0.25s', boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
          }} />
        </button>
      ) : null}
    </div>
  )
}
