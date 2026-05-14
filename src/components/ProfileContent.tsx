'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Camera, Check, Loader2, Mail, CalendarDays, Lock, ChevronRight } from 'lucide-react'

interface Props {
  userId: string
  email: string
  initialUsername: string
  initialAvatarUrl: string | null
  memberSince: string
}

export default function ProfileContent({ userId, email, initialUsername, initialAvatarUrl, memberSince }: Props) {
  const [savedUsername, setSavedUsername] = useState(initialUsername)
  const [username, setUsername] = useState(initialUsername)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(initialAvatarUrl)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const initial = (savedUsername || email || '?')[0].toUpperCase()
  const changed = username.trim() !== savedUsername && username.trim() !== ''

  const memberDate = memberSince
    ? new Date(memberSince).toLocaleDateString('sr-Latn-RS', { day: 'numeric', month: 'long', year: 'numeric' })
    : '—'

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError('')

    const supabase = createClient()
    const ext = file.name.split('.').pop()
    const path = `${userId}/avatar.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(path, file, { upsert: true })

    if (uploadError) {
      setError('Greška pri uploadu: ' + uploadError.message)
      setUploading(false)
      return
    }

    const { data } = supabase.storage.from('avatars').getPublicUrl(path)
    const url = data.publicUrl + '?v=' + Date.now()

    await supabase.from('profiles').update({ avatar_url: url }).eq('id', userId)
    setAvatarUrl(url)
    setUploading(false)
    router.refresh()
  }

  async function handleSave() {
    if (!changed) return
    setSaving(true)
    setError('')

    const supabase = createClient()
    const { error: err } = await supabase
      .from('profiles')
      .update({ username: username.trim() })
      .eq('id', userId)

    if (err) {
      const msg = err.code === '23505'
        ? `Korisničko ime "${username.trim()}" je već zauzeto. Izaberi drugo.`
        : 'Greška pri čuvanju: ' + err.message
      setError(msg)
    } else {
      setSavedUsername(username.trim())
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
      router.refresh()
    }
    setSaving(false)
  }

  return (
    <main className="w-full px-6 md:px-10 py-10 max-w-7xl mx-auto">

      {/* Page title */}
      <div className="mb-8">
        <p style={{ color: 'rgba(255,255,255,0.30)', fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 6 }}>Nalog</p>
        <h1 style={{ fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.02em' }}>
          Moj <span className="gradient-text">profil</span>
        </h1>
      </div>

      {/* Two-column grid */}
      <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-4 md:gap-6 items-start">

        {/* LEFT: Avatar + account info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* Avatar card */}
          <div
            style={{
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 24, padding: '36px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center',
            }}
          >
            <div style={{ position: 'relative', marginBottom: 12 }}>
              <div style={{
                width: 136, height: 136, borderRadius: '50%', overflow: 'hidden',
                background: 'rgba(249,115,22,0.15)', border: '2px solid rgba(249,115,22,0.30)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fb923c', fontWeight: 900, fontSize: 46, position: 'relative',
              }}>
                {avatarUrl
                  ? <Image src={avatarUrl} alt="avatar" fill style={{ objectFit: 'cover' }} />
                  : initial}
              </div>
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                style={{
                  position: 'absolute', bottom: 2, right: 2,
                  width: 32, height: 32, borderRadius: '50%',
                  background: uploading ? 'rgba(249,115,22,0.6)' : '#f97316',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '2px solid #08080f', cursor: 'pointer', transition: 'background 0.2s',
                }}
              >
                {uploading
                  ? <Loader2 size={14} color="white" style={{ animation: 'spin-cw 0.8s linear infinite' }} />
                  : <Camera size={14} color="white" />}
              </button>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarUpload} />
            </div>

            <p style={{ color: 'white', fontWeight: 800, fontSize: 18, marginBottom: 2, textAlign: 'center' }}>
              {savedUsername || '—'}
            </p>
            <p style={{ color: 'rgba(255,255,255,0.28)', fontSize: 13, textAlign: 'center', marginBottom: 0 }}>{email}</p>
          </div>

          {/* Account info */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, overflow: 'hidden' }}>
            {[
              { Icon: Mail, label: 'Email adresa', value: email },
              { Icon: CalendarDays, label: 'Član od', value: memberDate },
            ].map(({ Icon, label, value }, i, arr) => (
              <div
                key={label}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px',
                  borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                }}
              >
                <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.16)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={14} color="rgba(251,146,60,0.7)" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ color: 'rgba(255,255,255,0.28)', fontSize: 10, fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: 2 }}>{label}</p>
                  <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Username edit + thin section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 24, padding: 'clamp(20px, 4vw, 36px)' }}>

          <p style={{ color: 'rgba(255,255,255,0.30)', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>
            Korisničko ime
          </p>
          <p style={{ color: 'white', fontWeight: 700, fontSize: 18, marginBottom: 28 }}>
            Promeni korisničko ime
          </p>

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: 'rgba(248,113,113,0.9)', borderRadius: 12, padding: '10px 14px', fontSize: 13, marginBottom: 22 }}>
              {error}
            </div>
          )}

          {/* Username input */}
          <div style={{ marginBottom: 24 }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: 7 }}>Novo korisničko ime</p>
            <input
              value={username}
              onChange={e => setUsername(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSave()}
              placeholder={savedUsername || 'Unesite korisničko ime'}
              style={{
                width: '100%', background: 'rgba(255,255,255,0.05)',
                border: `1px solid ${changed ? 'rgba(249,115,22,0.45)' : 'rgba(255,255,255,0.10)'}`,
                borderRadius: 14, padding: '13px 16px', color: 'white', fontSize: 15,
                outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s',
              }}
              onFocus={e => (e.target.style.borderColor = 'rgba(249,115,22,0.55)')}
              onBlur={e => (e.target.style.borderColor = changed ? 'rgba(249,115,22,0.45)' : 'rgba(255,255,255,0.10)')}
            />
          </div>

          <button
            onClick={handleSave}
            disabled={saving || !changed}
            className="btn-shimmer"
            style={{
              color: 'white', fontWeight: 700, fontSize: 15,
              padding: '13px 32px', borderRadius: 14, display: 'inline-flex', alignItems: 'center',
              gap: 8, opacity: (saving || !changed) ? 0.40 : 1,
              cursor: (saving || !changed) ? 'not-allowed' : 'pointer',
              transition: 'opacity 0.2s',
            }}
          >
            {saving
              ? <><Loader2 size={16} style={{ animation: 'spin-cw 0.8s linear infinite' }} /> Čuvanje…</>
              : saved
              ? <><Check size={16} /> Sačuvano!</>
              : 'Sačuvaj izmene'}
          </button>
        </div>

        {/* Thin security shortcut */}
        <Link
          href="/settings"
          style={{
            display: 'flex', alignItems: 'center', gap: 14,
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 16, padding: '14px 20px', textDecoration: 'none',
            transition: 'border-color 0.2s, background 0.2s',
          }}
          onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(249,115,22,0.30)'; el.style.background = 'rgba(249,115,22,0.04)' }}
          onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(255,255,255,0.07)'; el.style.background = 'rgba(255,255,255,0.03)' }}
        >
          <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.16)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Lock size={14} color="rgba(251,146,60,0.7)" />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ color: 'rgba(255,255,255,0.28)', fontSize: 10, fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: 2 }}>Sigurnost</p>
            <p style={{ color: 'rgba(255,255,255,0.70)', fontSize: 13 }}>Promena lozinke i podešavanja naloga</p>
          </div>
          <ChevronRight size={15} color="rgba(255,255,255,0.20)" style={{ flexShrink: 0 }} />
        </Link>

        </div>{/* end right column */}
      </div>
    </main>
  )
}
