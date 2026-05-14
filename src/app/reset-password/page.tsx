'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Logo from '@/components/Logo'
import { Lock, Eye, EyeOff, Check, ShieldCheck, Loader2 } from 'lucide-react'

export default function ResetPasswordPage() {
  const [ready, setReady] = useState(false)
  const [sessionError, setSessionError] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setReady(true)
      }
    })
    // Timeout — if no PASSWORD_RECOVERY event after 6s, link is invalid/expired
    const timeout = setTimeout(() => {
      setSessionError('Link je istekao ili nije validan. Zatraži novi u Podešavanjima.')
    }, 6000)

    return () => {
      subscription.unsubscribe()
      clearTimeout(timeout)
    }
  }, [])

  const hasMinLength = password.length >= 6
  const hasUppercase = /[A-Z]/.test(password[0] ?? '')
  const hasNumber = /[0-9]/.test(password)
  const metCount = [hasMinLength, hasUppercase, hasNumber].filter(Boolean).length
  const strengthColor = metCount === 1 ? '#ef4444' : metCount === 2 ? '#f97316' : '#22c55e'
  const match = password === confirm && confirm.length > 0
  const canSubmit = metCount === 3 && match

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!canSubmit) return
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error: err } = await supabase.auth.updateUser({ password })
    if (err) {
      const msg = err.message.toLowerCase().includes('different')
        ? 'Nova lozinka mora biti različita od stare.'
        : 'Greška: ' + err.message
      setError(msg)
    } else {
      setDone(true)
      setTimeout(() => router.push('/dashboard'), 2500)
    }
    setLoading(false)
  }

  return (
    <div style={{ background: '#08080f', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ width: '100%', maxWidth: 390 }}>

        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
            <Logo size={72} />
          </div>
          <h1 className="gradient-text" style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>Nova lozinka</h1>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14 }}>Unesi svoju novu lozinku</p>
        </div>

        <div className="glass rounded-2xl p-6">
          {done ? (
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <ShieldCheck size={40} color="#22c55e" style={{ margin: '0 auto 16px' }} />
              <p style={{ color: 'white', fontWeight: 700, fontSize: 16, marginBottom: 6 }}>Lozinka je promenjena!</p>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14 }}>Preusmeravamo te na dashboard…</p>
            </div>
          ) : sessionError && !ready ? (
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <p style={{ color: 'rgba(248,113,113,0.9)', fontSize: 14, marginBottom: 16 }}>{sessionError}</p>
              <button onClick={() => router.push('/settings')} style={{ color: '#fb923c', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>
                Idi na Podešavanja →
              </button>
            </div>
          ) : !ready ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <Loader2 size={28} color="#fb923c" style={{ animation: 'spin-cw 0.8s linear infinite', margin: '0 auto 12px' }} />
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14 }}>Proveravamo link…</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {error && (
                <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: 'rgba(248,113,113,0.9)', borderRadius: 12, padding: '10px 14px', fontSize: 13 }}>
                  {error}
                </div>
              )}

              {[
                { label: 'Nova lozinka', value: password, set: setPassword, show: showPass, toggle: () => setShowPass(v => !v) },
                { label: 'Potvrdi lozinku', value: confirm, set: setConfirm, show: showConfirm, toggle: () => setShowConfirm(v => !v) },
              ].map(field => (
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
                      style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 14, padding: '13px 44px 13px 16px', color: 'white', fontSize: 16, outline: 'none', boxSizing: 'border-box' }}
                      onFocus={e => (e.target.style.borderColor = 'rgba(249,115,22,0.55)')}
                      onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.10)')}
                    />
                    <button type="button" onClick={field.toggle} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.25)', padding: 0, display: 'flex' }}>
                      {field.show ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              ))}

              {password.length > 0 && (
                <div>
                  <div style={{ display: 'flex', gap: 4, marginBottom: 10 }}>
                    {[0, 1, 2].map(i => (
                      <div key={i} style={{ flex: 1, height: 4, borderRadius: 999, background: i < metCount ? strengthColor : 'rgba(255,255,255,0.08)', transition: 'background 0.3s' }} />
                    ))}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {[
                      { label: 'Min. 6 karaktera', met: hasMinLength },
                      { label: 'Počinje velikim slovom', met: hasUppercase },
                      { label: 'Sadrži broj', met: hasNumber },
                    ].map(({ label, met }) => (
                      <span key={label} style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 6, color: met ? 'rgba(74,222,128,0.85)' : 'rgba(255,255,255,0.25)' }}>
                        <span style={{ width: 14, height: 14, borderRadius: '50%', border: `1.5px solid ${met ? 'rgba(74,222,128,0.7)' : 'rgba(255,255,255,0.15)'}`, background: met ? 'rgba(34,197,94,0.15)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
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
                style={{ width: '100%', color: 'white', fontWeight: 700, fontSize: 15, padding: '13px', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 4, opacity: (!canSubmit || loading) ? 0.45 : 1, cursor: (!canSubmit || loading) ? 'not-allowed' : 'pointer' }}
              >
                {loading
                  ? <><Loader2 size={16} style={{ animation: 'spin-cw 0.8s linear infinite' }} /> Čuvanje…</>
                  : <><Lock size={15} /> Sačuvaj novu lozinku</>
                }
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
