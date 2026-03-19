'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { avatarInitials, getBmi, formatDate, isoToday } from '@/lib/utils'
import type { Profile } from '@/types'
import { Check, Loader2 } from 'lucide-react'

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#a855f7', '#ec4899', '#06b6d4']
const SUPPLEMENTS = [
  { id: 'creatine', name: 'Creatina', dose: '5g/dia', timing: 'Qualquer hora, todos os dias', notes: 'Aumenta força e volume muscular. Toma mesmo nos dias sem treino.' },
  { id: 'whey', name: 'Whey Protein', dose: '25–30g por dose', timing: 'Pós-treino ou entre refeições', notes: 'Completa a ingestão proteica diária. Alvo: 2g proteína/kg de peso.' },
  { id: 'carbs', name: 'Carboidratos pré-treino', dose: 'Arroz, batata, aveia', timing: '1 hora antes do treino', notes: 'O combustível do treino. Sem carboidratos = sem energia = sem progresso.' },
]

export default function PerfilPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [totalSessions, setTotalSessions] = useState(0)
  const [form, setForm] = useState({ name: '', weight_kg: '', height_cm: '', avatar_color: '#22c55e' })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [email, setEmail] = useState('')
  const [refresh, setRefresh] = useState(0)

  useEffect(() => {
    const supabase = createClient()
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setEmail(user.email ?? '')
      const [{ data: prof }, { data: wl }] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('workout_logs').select('date').eq('user_id', user.id),
      ])
      if (prof) {
        setProfile(prof as Profile)
        setForm({
          name: prof.name ?? '',
          weight_kg: prof.weight_kg?.toString() ?? '',
          height_cm: prof.height_cm?.toString() ?? '',
          avatar_color: prof.avatar_color ?? '#22c55e',
        })
      }
      if (wl) setTotalSessions(new Set(wl.map((l: { date: string }) => l.date)).size)
    }
    load()
  }, [refresh])

  async function saveProfile() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    setSaving(true)
    await supabase.from('profiles').update({
      name: form.name,
      weight_kg: parseFloat(form.weight_kg) || null,
      height_cm: parseFloat(form.height_cm) || null,
      avatar_color: form.avatar_color,
      updated_at: new Date().toISOString(),
    }).eq('id', user.id)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    setRefresh(r => r + 1)
  }

  async function clearData() {
    if (!confirm('Apagar TODOS os registos de treino? Esta ação é irreversível.')) return
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await Promise.all([
      supabase.from('workout_logs').delete().eq('user_id', user.id),
      supabase.from('measurements').delete().eq('user_id', user.id),
      supabase.from('goals').delete().eq('user_id', user.id),
    ])
    setRefresh(r => r + 1)
  }

  const weight = parseFloat(form.weight_kg)
  const height = parseFloat(form.height_cm)
  const bmi = weight && height ? getBmi(weight, height) : null
  const bmiLabel = bmi ? (bmi < 18.5 ? 'Abaixo do peso' : bmi < 25 ? 'Peso normal' : 'Acima do peso') : null
  const targetProtein = weight ? Math.round(weight * 2) : null
  const targetCalories = weight ? Math.round(weight * 44) : null

  return (
    <div className="p-4 md:p-6 max-w-2xl space-y-5">
      <h1 className="text-xl font-bold">Perfil</h1>

      <div className="card p-4 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold text-black flex-shrink-0"
          style={{ background: form.avatar_color }}>
          {avatarInitials(form.name || profile?.name || '?')}
        </div>
        <div className="flex-1">
          <p className="font-semibold text-sm">{profile?.name}</p>
          <p className="text-xs text-txt-3">{email}</p>
          <p className="text-xs text-txt-3 mt-0.5">
            Desde {formatDate((profile?.created_at ?? isoToday()).split('T')[0])}
          </p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-2xl font-bold font-mono text-accent">{totalSessions}</p>
          <p className="text-[10px] text-txt-3">sessões</p>
        </div>
      </div>

      <div className="card p-4 space-y-3">
        <p className="text-sm font-semibold mb-1">Editar perfil</p>
        <div>
          <label className="label block mb-1">Nome</label>
          <input className="input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="O teu nome" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="label block mb-1">Peso (kg)</label>
            <input className="input" type="number" step="0.5" value={form.weight_kg}
              onChange={e => setForm(p => ({ ...p, weight_kg: e.target.value }))} placeholder="60" />
          </div>
          <div>
            <label className="label block mb-1">Altura (cm)</label>
            <input className="input" type="number" value={form.height_cm}
              onChange={e => setForm(p => ({ ...p, height_cm: e.target.value }))} placeholder="175" />
          </div>
        </div>
        <div>
          <label className="label block mb-2">Cor do avatar</label>
          <div className="flex gap-2">
            {COLORS.map(c => (
              <button key={c} onClick={() => setForm(p => ({ ...p, avatar_color: c }))}
                className="w-7 h-7 rounded-full transition-transform hover:scale-110 flex items-center justify-center"
                style={{ background: c }}>
                {form.avatar_color === c && <Check size={12} className="text-black font-bold" />}
              </button>
            ))}
          </div>
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={saveProfile} disabled={saving}>
          {saving && <Loader2 size={13} className="animate-spin" />}
          {saved ? '✓ Guardado!' : 'Guardar alterações'}
        </button>
      </div>

      {bmi && (
        <div className="card p-4">
          <p className="text-sm font-semibold mb-3">Análise corporal</p>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="bg-bg-3 rounded p-3">
              <p className="text-[10px] text-txt-3 uppercase tracking-wide mb-1">IMC</p>
              <p className="text-2xl font-bold font-mono">{bmi}</p>
              <p className="text-xs text-txt-3 mt-1">{bmiLabel}</p>
            </div>
            <div className="bg-bg-3 rounded p-3">
              <p className="text-[10px] text-txt-3 uppercase tracking-wide mb-1">Objetivo</p>
              <p className="text-lg font-bold text-accent">{weight < 65 ? '+5 kg' : '+3 kg'}</p>
              <p className="text-xs text-txt-3 mt-1">massa muscular</p>
            </div>
          </div>
          {targetProtein && targetCalories && (
            <>
              <p className="text-xs text-txt-3 uppercase tracking-wide mb-2">Metas nutricionais diárias</p>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-bg-3 rounded p-2.5 text-center">
                  <p className="text-sm font-bold font-mono text-accent">{targetCalories}</p>
                  <p className="text-[10px] text-txt-3">kcal</p>
                </div>
                <div className="bg-bg-3 rounded p-2.5 text-center">
                  <p className="text-sm font-bold font-mono text-accent-2">{targetProtein}g</p>
                  <p className="text-[10px] text-txt-3">proteína</p>
                </div>
                <div className="bg-bg-3 rounded p-2.5 text-center">
                  <p className="text-sm font-bold font-mono text-accent-3">{Math.round(weight * 0.6)}L</p>
                  <p className="text-[10px] text-txt-3">água</p>
                </div>
              </div>
              {weight < 65 && (
                <p className="text-xs text-accent-2 bg-accent-2bg border border-amber-800 rounded p-2 mt-3">
                  Sendo magro ({weight} kg), o maior desafio é comer o suficiente. Se não estás a ganhar peso, adiciona 200–300 kcal à tua dieta.
                </p>
              )}
            </>
          )}
        </div>
      )}

      <div className="card p-4">
        <p className="text-sm font-semibold mb-3">Guia de suplementação</p>
        <div className="space-y-3">
          {SUPPLEMENTS.map(s => (
            <div key={s.id} className="border border-border rounded p-3">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium">{s.name}</p>
                <span className="badge-green">{s.dose}</span>
              </div>
              <p className="text-xs text-accent-2 mb-1">{s.timing}</p>
              <p className="text-xs text-txt-3 leading-relaxed">{s.notes}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4 border-red-900">
        <p className="text-sm font-semibold mb-3 text-accent-red">Zona de perigo</p>
        <button className="btn-danger w-full" onClick={clearData}>
          Apagar todos os dados de treino
        </button>
      </div>
    </div>
  )
}
