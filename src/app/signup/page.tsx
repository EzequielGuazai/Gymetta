'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Dumbbell, Loader2 } from 'lucide-react'

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', weight: '', height: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  function set(k: string, v: string) { setForm(f => ({ ...f, [k]: v })) }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data, error: signupErr } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { name: form.name } },
    })
    if (signupErr) { setError(signupErr.message); setLoading(false); return }

    if (data.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        name: form.name,
        weight_kg: parseFloat(form.weight) || null,
        height_cm: parseFloat(form.height) || null,
      })
    }
    router.push('/dashboard')
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
            <p className="text-xs text-txt-3">Cria o teu perfil</p>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-base font-semibold mb-1">Nova conta</h2>
          <p className="text-xs text-txt-3 mb-5">Vamos personalizar o teu plano</p>

          <form onSubmit={handleSignup} className="space-y-3">
            <div>
              <label className="label block mb-1">Nome</label>
              <input className="input" value={form.name} onChange={e => set('name', e.target.value)}
                placeholder="O teu nome" required />
            </div>
            <div>
              <label className="label block mb-1">Email</label>
              <input className="input" type="email" value={form.email} onChange={e => set('email', e.target.value)}
                placeholder="tu@email.com" required />
            </div>
            <div>
              <label className="label block mb-1">Password</label>
              <input className="input" type="password" value={form.password} onChange={e => set('password', e.target.value)}
                placeholder="mínimo 6 caracteres" minLength={6} required />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="label block mb-1">Peso (kg)</label>
                <input className="input" type="number" value={form.weight} onChange={e => set('weight', e.target.value)}
                  placeholder="60" step="0.5" />
              </div>
              <div>
                <label className="label block mb-1">Altura (cm)</label>
                <input className="input" type="number" value={form.height} onChange={e => set('height', e.target.value)}
                  placeholder="175" />
              </div>
            </div>
            {error && <p className="text-xs text-accent-red bg-accent-redbg border border-red-900 rounded p-2">{error}</p>}
            <button className="btn-primary w-full flex items-center justify-center gap-2 mt-1" type="submit" disabled={loading}>
              {loading && <Loader2 size={14} className="animate-spin" />}
              {loading ? 'A criar...' : 'Criar conta'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-txt-3 mt-4">
          Já tens conta?{' '}
          <Link href="/login" className="text-accent hover:underline">Entrar</Link>
        </p>
      </div>
    </div>
  )
}
