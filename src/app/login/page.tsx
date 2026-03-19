'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Dumbbell, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false) }
    else router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
            <Dumbbell size={20} className="text-black" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-txt">Força</h1>
            <p className="text-xs text-txt-3">Treino AB Personalizado</p>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-base font-semibold mb-1">Entrar</h2>
          <p className="text-xs text-txt-3 mb-5">Acede ao teu plano de treino</p>

          <form onSubmit={handleLogin} className="space-y-3">
            <div>
              <label className="label block mb-1">Email</label>
              <input className="input" type="email" value={email}
                onChange={e => setEmail(e.target.value)} placeholder="tu@email.com" required />
            </div>
            <div>
              <label className="label block mb-1">Password</label>
              <input className="input" type="password" value={password}
                onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
            </div>
            {error && <p className="text-xs text-accent-red bg-accent-redbg border border-red-900 rounded p-2">{error}</p>}
            <button className="btn-primary w-full flex items-center justify-center gap-2 mt-1" type="submit" disabled={loading}>
              {loading && <Loader2 size={14} className="animate-spin" />}
              {loading ? 'A entrar...' : 'Entrar'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-txt-3 mt-4">
          Não tens conta?{' '}
          <Link href="/signup" className="text-accent hover:underline">Criar conta</Link>
        </p>
      </div>
    </div>
  )
}
