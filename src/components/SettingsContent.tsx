'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Lock, Mail, Loader2, ShieldCheck, Bell, BellOff, Trash2, AlertTriangle } from 'lucide-react'

interface Props {
  email: string
  userId: string
  initialNotify: boolean
}

export default function SettingsContent({ email, userId, initialNotify }: Props) {
  const [pwLoading, setPwLoading] = useState(false)
  const [pwSent, setPwSent] = useState(false)
  const [pwError, setPwError] = useState('')

  const [notify, setNotify] = useState(initialNotify)
  const [notifyLoading, setNotifyLoading] = useState(false)

  const [deleteStep, setDeleteStep] = useState<'idle' | 'confirm'>('idle')
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  const router = useRouter()

  async function handleResetPassword() {
    setPwLoading(true)
    setPwError('')
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://blktop.it.com/reset-password',
    })
    if (error) setPwError('Greška: ' + error.message)
    else setPwSent(true)
    setPwLoading(false)
  }

  async function handleToggleNotify() {
    const next = !notify
    setNotify(next)
    setNotifyLoading(true)
    const supabase = createClient()
    const { error } = await supabase.from('profiles').update({ notify_on_join: next }).eq('id', userId)
    if (error) {
      console.error('[notify] upsert error:', error)
      setNotify(!next) // revert
    }
    setNotifyLoading(false)
  }

  async function handleDeleteAccount() {
    setDeleteLoading(true)
    setDeleteError('')
    const res = await fetch('/api/account/delete', { method: 'DELETE' })
    if (!res.ok) {
      setDeleteError('Greška pri brisanju naloga. Pokušaj ponovo.')
      setDeleteLoading(false)
      return
    }
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <main style={{ maxWidth: 560, margin: '0 auto', padding: '40px 24px' }}>

      <div style={{ marginBottom: 32 }}>
        <p style={{ color: 'rgba(255,255,255,0.30)', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4 }}>Nalog</p>
        <h1 style={{ fontSize: 30, fontWeight: 900, color: 'white', margin: 0 }}>
          Pode<span className="gradient-text">šavanja</span>
        </h1>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* Password */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 24, padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ width: 38, height: 38, borderRadius: 11, background: 'rgba(249,115,22,0.10)', border: '1px solid rgba(249,115,22,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Lock size={16} color="#fb923c" />
            </div>
            <div>
              <p style={{ color: 'white', fontWeight: 700, fontSize: 14, margin: 0 }}>Promena lozinke</p>
              <p style={{ color: 'rgba(255,255,255,0.28)', fontSize: 12, margin: 0 }}>{email}</p>
            </div>
          </div>

          {pwError && (
            <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: 'rgba(248,113,113,0.9)', borderRadius: 12, padding: '10px 14px', fontSize: 13, marginBottom: 16 }}>
              {pwError}
            </div>
          )}

          {pwSent ? (
            <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)', color: 'rgba(74,222,128,0.9)', borderRadius: 12, padding: '14px 16px', fontSize: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
              <ShieldCheck size={18} />
              <div>
                <p style={{ fontWeight: 700, marginBottom: 2, margin: 0 }}>Link je poslat!</p>
                <p style={{ fontSize: 13, opacity: 0.8, margin: 0 }}>Proveri email i klikni na link za promenu lozinke.</p>
              </div>
            </div>
          ) : (
            <>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14, marginBottom: 18, lineHeight: 1.6 }}>
                Poslaćemo ti email sa linkom za promenu lozinke.
              </p>
              <button
                onClick={handleResetPassword}
                disabled={pwLoading}
                className="btn-shimmer"
                style={{ width: '100%', color: 'white', fontWeight: 700, fontSize: 14, padding: '12px', borderRadius: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: pwLoading ? 0.5 : 1, cursor: pwLoading ? 'not-allowed' : 'pointer' }}
              >
                {pwLoading
                  ? <><Loader2 size={15} style={{ animation: 'spin-cw 0.8s linear infinite' }} /> Slanje…</>
                  : <><Mail size={14} /> Pošalji link za promenu lozinke</>}
              </button>
            </>
          )}
        </div>

        {/* Notifications */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 24, padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ width: 38, height: 38, borderRadius: 11, background: notify ? 'rgba(249,115,22,0.10)' : 'rgba(255,255,255,0.04)', border: `1px solid ${notify ? 'rgba(249,115,22,0.22)' : 'rgba(255,255,255,0.10)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.3s' }}>
              {notify ? <Bell size={16} color="#fb923c" /> : <BellOff size={16} color="rgba(255,255,255,0.35)" />}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ color: 'white', fontWeight: 700, fontSize: 14, margin: 0 }}>Email notifikacije</p>
              <p style={{ color: notify ? 'rgba(251,146,60,0.7)' : 'rgba(255,255,255,0.28)', fontSize: 12, margin: 0, transition: 'color 0.3s' }}>{notify ? 'Uključene' : 'Isključene'}</p>
            </div>
            {/* Toggle */}
            <div
              onClick={notifyLoading ? undefined : handleToggleNotify}
              style={{ width: 46, height: 26, borderRadius: 999, background: notify ? '#f97316' : 'rgba(255,255,255,0.12)', position: 'relative', cursor: notifyLoading ? 'wait' : 'pointer', transition: 'background 0.25s', flexShrink: 0, border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div style={{ position: 'absolute', top: 3, left: notify ? 23 : 3, width: 18, height: 18, borderRadius: '50%', background: 'white', transition: 'left 0.25s', boxShadow: '0 1px 4px rgba(0,0,0,0.35)' }} />
            </div>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.30)', fontSize: 13, lineHeight: 1.6, margin: 0 }}>
            Primi email kada se neko pridruži igri koju si organizovao.
          </p>
        </div>

        {/* Delete account */}
        <div style={{ background: 'rgba(239,68,68,0.03)', border: '1px solid rgba(239,68,68,0.12)', borderRadius: 24, padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ width: 38, height: 38, borderRadius: 11, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.20)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Trash2 size={16} color="#f87171" />
            </div>
            <div>
              <p style={{ color: 'white', fontWeight: 700, fontSize: 14, margin: 0 }}>Brisanje naloga</p>
              <p style={{ color: 'rgba(248,113,113,0.5)', fontSize: 12, margin: 0 }}>Nepovratna akcija</p>
            </div>
          </div>

          {deleteStep === 'idle' ? (
            <>
              <p style={{ color: 'rgba(255,255,255,0.30)', fontSize: 13, lineHeight: 1.6, marginBottom: 18 }}>
                Svi tvoji podaci, igre i profil biće trajno obrisani.
              </p>
              <button
                onClick={() => setDeleteStep('confirm')}
                style={{ color: 'rgba(248,113,113,0.85)', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.20)', borderRadius: 12, padding: '11px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
              >
                <Trash2 size={14} /> Obriši nalog
              </button>
            </>
          ) : (
            <>
              <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.18)', borderRadius: 12, padding: '14px 16px', marginBottom: 14, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <AlertTriangle size={15} color="rgba(248,113,113,0.8)" style={{ flexShrink: 0, marginTop: 1 }} />
                <p style={{ color: 'rgba(248,113,113,0.85)', fontSize: 13, lineHeight: 1.6, margin: 0 }}>
                  Da li si siguran? Ova akcija je <strong>nepovratna</strong>. Svi podaci biće trajno izbrisani.
                </p>
              </div>
              {deleteError && (
                <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: 'rgba(248,113,113,0.9)', borderRadius: 12, padding: '10px 14px', fontSize: 13, marginBottom: 12 }}>
                  {deleteError}
                </div>
              )}
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={() => setDeleteStep('idle')}
                  style={{ flex: 1, color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 12, padding: '11px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
                >
                  Otkaži
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteLoading}
                  style={{ flex: 1, color: 'white', background: 'rgba(220,38,38,0.80)', border: 'none', borderRadius: 12, padding: '11px', fontSize: 14, fontWeight: 700, cursor: deleteLoading ? 'not-allowed' : 'pointer', opacity: deleteLoading ? 0.6 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                >
                  {deleteLoading
                    ? <><Loader2 size={14} style={{ animation: 'spin-cw 0.8s linear infinite' }} /> Brisanje…</>
                    : 'Da, obriši nalog'}
                </button>
              </div>
            </>
          )}
        </div>

      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: 24, paddingTop: 20, display: 'flex', gap: 20 }}>
        <Link href="/privacy" style={{ color: 'rgba(255,255,255,0.25)', fontSize: 13, textDecoration: 'none' }}>Politika privatnosti</Link>
        <Link href="/terms" style={{ color: 'rgba(255,255,255,0.25)', fontSize: 13, textDecoration: 'none' }}>Uslovi korišćenja</Link>
      </div>

    </main>
  )
}
