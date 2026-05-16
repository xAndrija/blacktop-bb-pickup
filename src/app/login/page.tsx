'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import Logo from '@/components/Logo'
import BallsBg from '@/components/BallsBg'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      const msg = error.message.toLowerCase()
      const translated =
        msg.includes('invalid login') || msg.includes('invalid credentials')
          ? 'Pogrešan email ili lozinka.'
          : msg.includes('email not confirmed')
          ? 'Email adresa nije potvrđena. Proveri inbox.'
          : msg.includes('too many')
          ? 'Previše pokušaja. Sačekaj malo i pokušaj ponovo.'
          : msg.includes('network')
          ? 'Problem sa konekcijom. Pokušaj ponovo.'
          : error.message
      setError(translated)
      setLoading(false)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
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
          <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: 15 }}>Nađi igru, povedi ekipu</p>
        </div>

        <div className="glass rounded-2xl p-6">
          <h2 className="text-white font-semibold text-lg mb-5">Prijavi se</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-300 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

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
                placeholder="Unesite lozinku"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-orange-500/20 mt-2"
            >
              {loading ? 'Prijavljivanje…' : 'Prijavi se'}
            </button>
          </form>
        </div>

        <p className="text-center mt-5 text-white/30 text-sm">
          Nemaš nalog?{' '}
          <Link href="/register" className="text-orange-400 hover:text-orange-300 font-medium">
            Registruj se
          </Link>
        </p>
      </div>
    </div>
  )
}
