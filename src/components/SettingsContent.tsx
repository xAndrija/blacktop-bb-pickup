'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Lock, Eye, EyeOff, Check, Loader2, ShieldCheck } from 'lucide-react'

interface Props {
  email: string
}

export default function SettingsContent({ email }: Props) {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const hasMinLength = newPassword.length >= 6
  const hasUppercase = /[A-Z]/.test(newPassword[0] ?? '')
  const hasNumber = /[0-9]/.test(newPassword)
  const metCount = [hasMinLength, hasUppercase, hasNumber].filter(Boolean).length
  const newValid = metCount === 3
  const match = newPassword === confirmPassword && confirmPassword.length > 0
  const canSubmit = currentPassword.length > 0 && newValid && match

  const strengthColor = metCount === 0 ? 'rgba(255,255,255,0.10)' : metCount === 1 ? '#ef4444' : metCount === 2 ? '#f97316' : '#22c55e'

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!canSubmit) return
    setLoading(true)
    setError('')
    setSuccess(false)

    const supabase = createClient()

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password: currentPassword })
    if (signInError) {
      setError('Trenutna lozinka nije ispravna.')
      setLoading(false)
      return
    }

    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword })
    if (updateError) {
      setError('Greška pri promeni lozinke: ' + updateError.message)
    } else {
      setSuccess(true)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
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


      {/* Password section */}
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

        {success && (
          <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)', color: 'rgba(74,222,128,0.9)', borderRadius: 12, padding: '10px 14px', fontSize: 13, marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
            <ShieldCheck size={15} /> Lozinka je uspešno promenjena!
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {([
            { label: 'Trenutna lozinka', value: currentPassword, set: setCurrentPassword, show: showCurrent, toggle: () => setShowCurrent(v => !v) },
            { label: 'Nova lozinka', value: newPassword, set: setNewPassword, show: showNew, toggle: () => setShowNew(v => !v) },
            { label: 'Potvrdi novu lozinku', value: confirmPassword, set: setConfirmPassword, show: showConfirm, toggle: () => setShowConfirm(v => !v) },
          ] as const).map(field => (
            <div key={field.label}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.30)', marginBottom: 8 }}>
                {field.label}
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={field.show ? 'text' : 'password'}
                  value={field.value}
                  onChange={e => field.set(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: '100%', background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.10)', borderRadius: 14,
                    padding: '13px 44px 13px 16px', color: 'white', fontSize: 15,
                    outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s',
                  }}
                  onFocus={e => (e.target.style.borderColor = 'rgba(249,115,22,0.55)')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.10)')}
                />
                <button
                  type="button"
                  onClick={field.toggle}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.25)', padding: 0, display: 'flex' }}
                >
                  {field.show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          ))}

          {newPassword.length > 0 && (
            <div>
              <div style={{ display: 'flex', gap: 4, marginBottom: 10 }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{
                    flex: 1, height: 4, borderRadius: 999,
                    background: i < metCount ? strengthColor : 'rgba(255,255,255,0.08)',
                    transition: 'background 0.3s',
                  }} />
                ))}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {([
                  { label: 'Min. 6 karaktera', met: hasMinLength },
                  { label: 'Počinje velikim slovom', met: hasUppercase },
                  { label: 'Sadrži broj', met: hasNumber },
                ] as const).map(({ label, met }) => (
                  <span key={label} style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 6, color: met ? 'rgba(74,222,128,0.85)' : 'rgba(255,255,255,0.25)', transition: 'color 0.2s' }}>
                    <span style={{ width: 14, height: 14, borderRadius: '50%', border: `1.5px solid ${met ? 'rgba(74,222,128,0.7)' : 'rgba(255,255,255,0.15)'}`, background: met ? 'rgba(34,197,94,0.15)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }}>
                      {met && <Check size={8} color="rgba(74,222,128,0.9)" />}
                    </span>
                    {label}
                  </span>
                ))}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={!canSubmit || loading}
            className="btn-shimmer"
            style={{
              width: '100%', color: 'white', fontWeight: 700, fontSize: 15,
              padding: '13px', borderRadius: 14, display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: 8, marginTop: 4,
              opacity: (!canSubmit || loading) ? 0.45 : 1,
              cursor: (!canSubmit || loading) ? 'not-allowed' : 'pointer',
              transition: 'opacity 0.2s',
            }}
          >
            {loading
              ? <><Loader2 size={16} style={{ animation: 'spin-cw 0.8s linear infinite' }} /> Menjanje…</>
              : <><Lock size={15} /> Promeni lozinku</>
            }
          </button>
        </form>
      </div>

      </div>{/* end grid */}

      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        marginTop: 24,
        paddingTop: 20,
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
