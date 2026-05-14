'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Lock, Mail, Loader2, ShieldCheck } from 'lucide-react'

interface Props {
  email: string
}

export default function SettingsContent({ email }: Props) {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleResetPassword() {
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://blktop.it.com/reset-password',
    })
    if (err) {
      setError('Greška: ' + err.message)
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  return (
    <main className="max-w-4xl mx-auto px-6 md:px-10 py-10">

      <div className="mb-8">
        <p className="text-white/30 text-xs font-bold uppercase tracking-widest mb-1">Nalog</p>
        <h1 className="text-3xl font-black text-white">Pode<span className="gradient-text">šavanja</span></h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">

        <div
          className="rounded-3xl p-7"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(249,115,22,0.10)', border: '1px solid rgba(249,115,22,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Lock size={17} color="#fb923c" />
            </div>
            <div>
              <p style={{ color: 'white', fontWeight: 700, fontSize: 15 }}>Promena lozinke</p>
              <p style={{ color: 'rgba(255,255,255,0.28)', fontSize: 12 }}>{email}</p>
            </div>
          </div>

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: 'rgba(248,113,113,0.9)', borderRadius: 12, padding: '10px 14px', fontSize: 13, marginBottom: 18 }}>
              {error}
            </div>
          )}

          {sent ? (
            <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)', color: 'rgba(74,222,128,0.9)', borderRadius: 12, padding: '14px 16px', fontSize: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
              <ShieldCheck size={18} />
              <div>
                <p style={{ fontWeight: 700, marginBottom: 2 }}>Link je poslat!</p>
                <p style={{ fontSize: 13, opacity: 0.8 }}>Proveri email {email} i klikni na link za promenu lozinke.</p>
              </div>
            </div>
          ) : (
            <>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14, marginBottom: 20, lineHeight: 1.6 }}>
                Poslaćemo ti email sa linkom na koji treba da klikneš da bi promenio lozinku.
              </p>
              <button
                onClick={handleResetPassword}
                disabled={loading}
                className="btn-shimmer"
                style={{
                  width: '100%', color: 'white', fontWeight: 700, fontSize: 15,
                  padding: '13px', borderRadius: 14, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', gap: 8,
                  opacity: loading ? 0.5 : 1,
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                {loading
                  ? <><Loader2 size={16} style={{ animation: 'spin-cw 0.8s linear infinite' }} /> Slanje…</>
                  : <><Mail size={15} /> Pošalji link za promenu lozinke</>
                }
              </button>
            </>
          )}
        </div>

      </div>

      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        marginTop: 24, paddingTop: 20,
        display: 'flex', gap: 20,
      }}>
        <Link href="/privacy" style={{ color: 'rgba(255,255,255,0.25)', fontSize: 13, textDecoration: 'none' }}>
          Politika privatnosti
        </Link>
        <Link href="/terms" style={{ color: 'rgba(255,255,255,0.25)', fontSize: 13, textDecoration: 'none' }}>
          Uslovi korišćenja
        </Link>
      </div>

    </main>
  )
}
