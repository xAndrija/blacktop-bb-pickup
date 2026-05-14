'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import Logo from '@/components/Logo'
import BallsBg from '@/components/BallsBg'

export default function RegisterPage() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const hasMinLength = password.length >= 6
  const hasUppercase = /[A-Z]/.test(password[0] ?? '')
  const hasNumber = /[0-9]/.test(password)
  const metCount = [hasMinLength, hasUppercase, hasNumber].filter(Boolean).length
  const strengthColor = metCount === 0 ? 'rgba(255,255,255,0.10)' : metCount === 1 ? '#ef4444' : metCount === 2 ? '#f97316' : '#22c55e'

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (metCount < 3) {
      setError('Lozinka mora imati min. 6 karaktera, početi velikim slovom i sadržati broj.')
      return
    }
    setLoading(true)
    setError('')

    const supabase = createClient()

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username } },
    })

    if (signUpError || !data.user) {
      setError(signUpError?.message ?? 'Greška pri registraciji')
      setLoading(false)
      return
    }

    // Profile is created automatically via database trigger (handle_new_user)
    window.location.href = '/dashboard'
  }

  return (
    <div style={{ position: 'relative', background: '#08080f', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', overflow: 'hidden' }}>
      <BallsBg />

      <div className="w-full" style={{ maxWidth: 390, position: 'relative', zIndex: 1 }}>

        <div className="text-center" style={{ marginBottom: 36 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
            <Logo size={88} />
          </div>
          <h1 className="gradient-text" style={{ fontSize: 32, fontWeight: 800, marginBottom: 6 }}>BLKTOP</h1>
          <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: 15 }}>Pridruži se zajednici igrača</p>
        </div>

        <div className="glass rounded-2xl p-6">
          <h2 className="text-white font-semibold text-lg mb-5">Napravi nalog</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-300 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs text-white/40 uppercase tracking-wider mb-2">Korisničko ime</label>
              <input
                type="text"
                required
                minLength={3}
                maxLength={20}
                value={username}
                onChange={e => setUsername(e.target.value.toLowerCase().replace(/\s/g, ''))}
                className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500/60 placeholder:text-white/20 transition-colors"
                placeholder="Izaberite korisničko ime"
              />
            </div>

            <div>
              <label className="block text-xs text-white/40 uppercase tracking-wider mb-2">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500/60 placeholder:text-white/20 transition-colors"
                placeholder="Unesite email adresu"
              />
            </div>

            <div>
              <label className="block text-xs text-white/40 uppercase tracking-wider mb-2">Lozinka</label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500/60 placeholder:text-white/20 transition-colors"
                placeholder="Minimum 6 karaktera"
              />
              {password.length > 0 && (
                <div style={{ marginTop: 10 }}>
                  <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
                    {[0, 1, 2].map(i => (
                      <div key={i} style={{
                        flex: 1, height: 4, borderRadius: 999,
                        background: i < metCount ? strengthColor : 'rgba(255,255,255,0.08)',
                        transition: 'background 0.3s',
                      }} />
                    ))}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    {([
                      { label: 'Min. 6 karaktera', met: hasMinLength },
                      { label: 'Počinje velikim slovom', met: hasUppercase },
                      { label: 'Sadrži broj', met: hasNumber },
                    ]).map(({ label, met }) => (
                      <span key={label} style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 6, color: met ? 'rgba(74,222,128,0.85)' : 'rgba(255,255,255,0.25)', transition: 'color 0.2s' }}>
                        <span style={{ width: 14, height: 14, borderRadius: '50%', border: `1.5px solid ${met ? 'rgba(74,222,128,0.7)' : 'rgba(255,255,255,0.15)'}`, background: met ? 'rgba(34,197,94,0.15)' : 'transparent', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }}>
                          {met && <svg width="8" height="8" viewBox="0 0 8 8"><polyline points="1,4 3,6 7,2" fill="none" stroke="rgba(74,222,128,0.9)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                        </span>
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-orange-500/20 mt-2"
            >
              {loading ? 'Registracija…' : 'Registruj se'}
            </button>
          </form>
        </div>

        <p className="text-center mt-5 text-white/30 text-sm">
          Već imaš nalog?{' '}
          <Link href="/login" className="text-orange-400 hover:text-orange-300 font-medium">
            Prijavi se
          </Link>
        </p>
      </div>
    </div>
  )
}
