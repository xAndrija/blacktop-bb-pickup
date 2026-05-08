'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, CalendarDays, LogOut, Map, LayoutGrid, Settings, User, Zap } from 'lucide-react'
import Logo from './Logo'

interface Props {
  username: string
  email: string
  avatarUrl?: string | null
  backHref?: string
  backLabel?: string
}

interface NavItemProps {
  href: string
  icon: React.ReactNode
  label: string
  active: boolean
}

function NavItem({ href, icon, label, active }: NavItemProps) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
        active
          ? 'bg-orange-500/18 text-orange-300 border border-orange-500/28'
          : 'text-white/42 hover:text-white/72 hover:bg-white/5 border border-transparent'
      }`}
    >
      {icon}
      {label}
    </Link>
  )
}

export default function Header({ username, email, avatarUrl, backHref, backLabel }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const initial = (username || email || '?')[0].toUpperCase()

  return (
    <>
    <header
      className="sticky top-0 z-40 border-b border-white/8"
      style={{
        height: '82px', minHeight: '82px', maxHeight: '82px', overflow: 'visible',
        background: 'rgba(8,8,15,0.88)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      <div
        className="w-full px-4 md:px-10 grid items-center grid-cols-2 md:grid-cols-[1fr_auto_1fr]"
        style={{ height: '82px' }}
      >

        {/* Left: logo */}
        <div className="flex items-center gap-3">
          {backHref && (
            <Link
              href={backHref}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all"
            >
              <ArrowLeft size={15} />
              {backLabel && <span className="text-sm font-medium max-w-[140px] truncate">{backLabel}</span>}
            </Link>
          )}
          <Link href="/dashboard" className="flex items-center gap-2 select-none">
            <div className="w-10 h-10 md:w-14 md:h-14 shrink-0 flex items-center justify-center">
              <Logo size={40} />
            </div>
            <span className="font-bold text-base md:text-lg gradient-text whitespace-nowrap">BLKTOP</span>
          </Link>
        </div>

        {/* Center: navigation (desktop only) */}
        <nav className="hidden md:flex items-center gap-1">
          <NavItem
            href="/courts"
            icon={<LayoutGrid size={15} />}
            label="Tereni"
            active={pathname === '/courts' || pathname.startsWith('/courts/')}
          />
          <NavItem
            href="/map"
            icon={<Map size={15} />}
            label="Mapa"
            active={pathname === '/map'}
          />
          <NavItem
            href="/games"
            icon={<Zap size={15} />}
            label="Igre"
            active={pathname === '/games'}
          />
        </nav>

        {/* Right: user avatar */}
        <div className="flex justify-end">
          <div className="relative" ref={ref}>
            <button
              onClick={() => setOpen(o => !o)}
              className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl transition-all ${open ? 'bg-white/8' : 'hover:bg-white/5'}`}
            >
              <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-lg border shrink-0 overflow-hidden ${
                open
                  ? 'bg-orange-500/30 border-orange-500/60 text-orange-200'
                  : 'bg-orange-500/15 border-orange-500/30 text-orange-300'
              }`}>
                {avatarUrl
                  ? <img src={avatarUrl} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : initial}
              </div>
              <span className="text-white/55 text-base hidden sm:block max-w-[160px] truncate">
                {username || email}
              </span>
            </button>

            {open && (
              <div
                className="rounded-2xl overflow-hidden"
                style={{
                  position: 'fixed',
                  top: '90px',
                  right: '16px',
                  width: '240px',
                  zIndex: 9999,
                  background: 'rgba(14, 14, 20, 0.98)',
                  backdropFilter: 'blur(24px)',
                  border: '1px solid rgba(255,255,255,0.10)',
                  boxShadow: '0 16px 48px rgba(0,0,0,0.8)',
                }}
              >
                <div className="px-4 py-3.5 border-b border-white/8">
                  <p className="text-white font-semibold text-sm">{username}</p>
                  <p className="text-white/30 text-xs mt-0.5 truncate">{email}</p>
                </div>

                <div className="py-1.5">
                  <Link href="/my-games" onClick={() => setOpen(false)} className="w-full text-left px-4 py-2.5 text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-3">
                    <CalendarDays size={15} className="text-white/35 shrink-0" />
                    <span>Moje igre</span>
                  </Link>
                  <Link href="/profile" onClick={() => setOpen(false)} className="w-full text-left px-4 py-2.5 text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-3">
                    <User size={15} className="text-white/35 shrink-0" />
                    <span>Moj profil</span>
                  </Link>
                  <Link href="/settings" onClick={() => setOpen(false)} className="w-full text-left px-4 py-2.5 text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-3">
                    <Settings size={15} className="text-white/35 shrink-0" />
                    <span>Podešavanja</span>
                  </Link>
                </div>

                <div className="border-t border-white/8 py-1.5">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-400/70 hover:text-red-400 hover:bg-red-500/5 transition-colors flex items-center gap-3"
                  >
                    <LogOut size={15} className="text-red-400/60 shrink-0" />
                    <span>Odjava</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </header>

    {/* Mobile bottom nav */}
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-2 py-1"
      style={{
        background: 'rgba(8,8,15,0.97)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        paddingBottom: 'max(8px, env(safe-area-inset-bottom))',
      }}
    >
      {[
        { href: '/courts', icon: <LayoutGrid size={22} />, label: 'Tereni', active: pathname === '/courts' || pathname.startsWith('/courts/') },
        { href: '/map',    icon: <Map size={22} />,        label: 'Mapa',   active: pathname === '/map' },
        { href: '/games',  icon: <Zap size={22} />,        label: 'Igre',   active: pathname === '/games' },
      ].map(item => (
        <Link
          key={item.href}
          href={item.href}
          className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors"
          style={{ color: item.active ? '#fb923c' : 'rgba(255,255,255,0.30)' }}
        >
          {item.icon}
          <span style={{ fontSize: 10, fontWeight: 600, lineHeight: 1 }}>{item.label}</span>
        </Link>
      ))}
    </nav>
    </>
  )
}
