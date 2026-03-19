'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { cn, avatarInitials } from '@/lib/utils'
import type { Profile } from '@/types'
import {
  LayoutDashboard, Dumbbell, TrendingUp, Target,
  User, LogOut, Menu, X, ChevronRight, Activity
} from 'lucide-react'

const NAV = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/treino', icon: Dumbbell, label: 'Treino' },
  { href: '/progresso', icon: TrendingUp, label: 'Progresso' },
  { href: '/metas', icon: Target, label: 'Metas' },
  { href: '/perfil', icon: User, label: 'Perfil' },
]

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      supabase.from('profiles').select('*').eq('id', user.id).single()
        .then(({ data }) => { if (data) setProfile(data) })
    })
  }, [])

  async function logout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-bg flex">
      {/* Sidebar desktop */}
      <aside className="hidden md:flex flex-col w-56 border-r border-border bg-bg-2 fixed h-full z-30">
        <div className="flex items-center gap-2.5 px-4 py-4 border-b border-border">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
            <Activity size={16} className="text-black" />
          </div>
          <div>
            <p className="text-sm font-bold text-txt leading-none">Força</p>
            <p className="text-[10px] text-txt-3 mt-0.5">Treino AB</p>
          </div>
        </div>

        <nav className="flex-1 px-2 py-3 space-y-0.5">
          {NAV.map(({ href, icon: Icon, label }) => (
            <Link key={href} href={href}
              className={cn(
                'flex items-center gap-2.5 px-3 py-2 rounded text-sm transition-colors',
                pathname.startsWith(href)
                  ? 'bg-accent-bg text-accent border border-accent-dim'
                  : 'text-txt-2 hover:text-txt hover:bg-bg-3'
              )}>
              <Icon size={15} />
              {label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-border px-2 py-3">
          {profile && (
            <div className="flex items-center gap-2.5 px-3 py-2 mb-1">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-black flex-shrink-0"
                style={{ background: profile.avatar_color || '#22c55e' }}>
                {avatarInitials(profile.name)}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-txt truncate">{profile.name}</p>
                {profile.weight_kg && (
                  <p className="text-[10px] text-txt-3">{profile.weight_kg} kg</p>
                )}
              </div>
            </div>
          )}
          <button onClick={logout}
            className="flex items-center gap-2.5 px-3 py-2 rounded text-sm text-txt-3 hover:text-accent-red hover:bg-accent-redbg w-full transition-colors">
            <LogOut size={14} />
            Sair
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-30 bg-bg-2 border-b border-border px-4 h-12 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-accent rounded flex items-center justify-center">
            <Activity size={14} className="text-black" />
          </div>
          <span className="text-sm font-bold">Força</span>
        </div>
        <button onClick={() => setOpen(!open)} className="text-txt-2 p-1">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden fixed inset-0 z-20 bg-black/60" onClick={() => setOpen(false)}>
          <div className="absolute left-0 top-12 bottom-0 w-56 bg-bg-2 border-r border-border p-2"
            onClick={e => e.stopPropagation()}>
            <nav className="space-y-0.5">
              {NAV.map(({ href, icon: Icon, label }) => (
                <Link key={href} href={href} onClick={() => setOpen(false)}
                  className={cn(
                    'flex items-center gap-2.5 px-3 py-2.5 rounded text-sm transition-colors',
                    pathname.startsWith(href)
                      ? 'bg-accent-bg text-accent border border-accent-dim'
                      : 'text-txt-2 hover:text-txt hover:bg-bg-3'
                  )}>
                  <Icon size={15} />
                  {label}
                  <ChevronRight size={12} className="ml-auto opacity-40" />
                </Link>
              ))}
            </nav>
            <div className="border-t border-border mt-3 pt-3">
              {profile && (
                <div className="flex items-center gap-2.5 px-3 py-2 mb-1">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-black flex-shrink-0"
                    style={{ background: profile.avatar_color || '#22c55e' }}>
                    {avatarInitials(profile.name)}
                  </div>
                  <p className="text-xs font-medium text-txt truncate">{profile.name}</p>
                </div>
              )}
              <button onClick={logout}
                className="flex items-center gap-2.5 px-3 py-2 rounded text-sm text-txt-3 hover:text-accent-red w-full">
                <LogOut size={14} />Sair
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main */}
      <main className="flex-1 md:ml-56 pt-12 md:pt-0 min-h-screen">
        {children}
      </main>
    </div>
  )
}
