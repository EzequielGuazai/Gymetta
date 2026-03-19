'use client'
import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { WORKOUT_DAYS, getExerciseById } from '@/lib/workoutData'
import { formatDate, isoToday, totalVolume, getMaxWeight } from '@/lib/utils'
import type { WorkoutLog, Measurement } from '@/types'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid } from 'recharts'
import { format, subDays, parseISO } from 'date-fns'
import { Scale, TrendingUp, Dumbbell, Plus, X } from 'lucide-react'

export default function ProgressoPage() {
  const [logs, setLogs] = useState<WorkoutLog[]>([])
  const [measurements, setMeasurements] = useState<Measurement[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const [activeEx, setActiveEx] = useState<string>('a1_supino_barra')
  const [showAddMeas, setShowAddMeas] = useState(false)
  const [newMeas, setNewMeas] = useState({ weight_kg: '', body_fat: '', notes: '' })
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    setUserId(user.id)
    const [{ data: wl }, { data: ms }] = await Promise.all([
      supabase.from('workout_logs').select('*').eq('user_id', user.id).order('date').limit(500),
      supabase.from('measurements').select('*').eq('user_id', user.id).order('date').limit(100),
    ])
    if (wl) setLogs(wl)
    if (ms) setMeasurements(ms)
  }, [])

  useEffect(() => { load() }, [load])

  async function addMeasurement() {
    if (!userId) return
    setSaving(true)
    await supabase.from('measurements').insert({
      user_id: userId,
      date: isoToday(),
      weight_kg: parseFloat(newMeas.weight_kg) || null,
      body_fat: parseFloat(newMeas.body_fat) || null,
      notes: newMeas.notes || null,
    })
    setNewMeas({ weight_kg: '', body_fat: '', notes: '' })
    setShowAddMeas(false)
    setSaving(false)
    load()
  }

  // Exercise progress chart data
  const exLogs = logs.filter(l => l.exercise_id === activeEx)
  const exChartData = exLogs.map(l => ({
    date: format(parseISO(l.date), 'dd/MM'),
    max: getMaxWeight([l]),
    vol: totalVolume(l.sets),
  }))

  // Weekly volume
  const last12Weeks = [...Array(12)].map((_, i) => {
    const start = format(subDays(new Date(), (11 - i) * 7 + 6), 'yyyy-MM-dd')
    const end = format(subDays(new Date(), (11 - i) * 7), 'yyyy-MM-dd')
    const vol = logs.filter(l => l.date >= start && l.date <= end).reduce((a, l) => a + totalVolume(l.sets), 0)
    return { week: `S${i + 1}`, vol: Math.round(vol) }
  })

  // All exercises with logged data
  const loggedExercises = [...new Set(logs.map(l => l.exercise_id))].map(id => ({
    id, name: getExerciseById(id)?.name ?? id,
    count: logs.filter(l => l.exercise_id === id).length,
    maxWeight: getMaxWeight(logs.filter(l => l.exercise_id === id)),
  }))

  const weightData = measurements.filter(m => m.weight_kg).map(m => ({
    date: format(parseISO(m.date), 'dd/MM'),
    kg: m.weight_kg,
  }))

  return (
    <div className="p-4 md:p-6 max-w-3xl space-y-5">
      <h1 className="text-xl font-bold">Progresso</h1>

      {/* Weight */}
      <section className="card p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Scale size={16} className="text-accent-3" />
            <p className="text-sm font-semibold">Peso corporal</p>
          </div>
          <button onClick={() => setShowAddMeas(!showAddMeas)} className="btn-ghost text-xs flex items-center gap-1">
            <Plus size={12} />Adicionar
          </button>
        </div>

        {showAddMeas && (
          <div className="bg-bg-3 border border-border rounded p-3 mb-4 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs text-txt-2 font-medium">Nova medição — {format(new Date(), 'dd/MM/yyyy')}</p>
              <button onClick={() => setShowAddMeas(false)}><X size={14} className="text-txt-3" /></button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="label block mb-1">Peso (kg)</label>
                <input className="input text-sm" type="number" step="0.1"
                  value={newMeas.weight_kg} onChange={e => setNewMeas(p => ({ ...p, weight_kg: e.target.value }))} placeholder="70.5" />
              </div>
              <div>
                <label className="label block mb-1">% Gordura (opcional)</label>
                <input className="input text-sm" type="number" step="0.1"
                  value={newMeas.body_fat} onChange={e => setNewMeas(p => ({ ...p, body_fat: e.target.value }))} placeholder="15" />
              </div>
            </div>
            <button className="btn-primary w-full" onClick={addMeasurement} disabled={saving}>
              {saving ? 'A guardar...' : 'Guardar'}
            </button>
          </div>
        )}

        {weightData.length > 1 ? (
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={weightData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#252525" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#555' }} />
              <YAxis domain={['auto', 'auto']} tick={{ fontSize: 10, fill: '#555' }} width={32} />
              <Tooltip contentStyle={{ background: '#1c1c1c', border: '1px solid #303030', borderRadius: 6, fontSize: 12 }}
                labelStyle={{ color: '#999' }} itemStyle={{ color: '#22c55e' }} />
              <Line type="monotone" dataKey="kg" stroke="#22c55e" strokeWidth={2} dot={{ fill: '#22c55e', r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-20 flex items-center justify-center text-xs text-txt-3">
            Adiciona medições para ver o gráfico de peso
          </div>
        )}

        {measurements.length > 0 && (
          <div className="mt-3 space-y-1">
            {measurements.slice(-5).reverse().map(m => (
              <div key={m.id} className="flex justify-between text-xs py-1 border-b border-border last:border-0">
                <span className="text-txt-3">{formatDate(m.date)}</span>
                <div className="flex gap-3">
                  {m.weight_kg && <span className="font-mono text-txt">{m.weight_kg} kg</span>}
                  {m.body_fat && <span className="font-mono text-txt-2">{m.body_fat}% gord.</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Volume semana */}
      <section className="card p-4">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={16} className="text-accent" />
          <p className="text-sm font-semibold">Volume por semana</p>
        </div>
        {logs.length > 0 ? (
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={last12Weeks}>
              <CartesianGrid strokeDasharray="3 3" stroke="#252525" />
              <XAxis dataKey="week" tick={{ fontSize: 10, fill: '#555' }} />
              <YAxis tick={{ fontSize: 10, fill: '#555' }} width={40}
                tickFormatter={v => v > 1000 ? `${Math.round(v/1000)}k` : v.toString()} />
              <Tooltip contentStyle={{ background: '#1c1c1c', border: '1px solid #303030', borderRadius: 6, fontSize: 12 }}
                labelStyle={{ color: '#999' }} itemStyle={{ color: '#22c55e' }}
                formatter={(v: number) => [`${v.toLocaleString()} kg`, 'Volume']} />
              <Bar dataKey="vol" fill="#22c55e" opacity={0.8} radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-20 flex items-center justify-center text-xs text-txt-3">
            Regista treinos para ver o volume semanal
          </div>
        )}
      </section>

      {/* Exercise progress */}
      {loggedExercises.length > 0 && (
        <section className="card p-4">
          <div className="flex items-center gap-2 mb-3">
            <Dumbbell size={16} className="text-accent-2" />
            <p className="text-sm font-semibold">Evolução por exercício</p>
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-2 mb-4 scrollbar-none">
            {loggedExercises.map(ex => (
              <button key={ex.id} onClick={() => setActiveEx(ex.id)}
                className={`text-xs px-3 py-1.5 rounded-sm border whitespace-nowrap transition-colors flex-shrink-0
                  ${activeEx === ex.id ? 'bg-accent-bg border-accent-dim text-accent' : 'border-border text-txt-2 hover:border-border-2'}`}>
                {ex.name.split(' ').slice(0,3).join(' ')}
              </button>
            ))}
          </div>

          {exChartData.length > 1 ? (
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={exChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#252525" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#555' }} />
                <YAxis tick={{ fontSize: 10, fill: '#555' }} width={32} />
                <Tooltip contentStyle={{ background: '#1c1c1c', border: '1px solid #303030', borderRadius: 6, fontSize: 12 }}
                  labelStyle={{ color: '#999' }} itemStyle={{ color: '#f59e0b' }}
                  formatter={(v: number) => [`${v} kg`, 'Carga máxima']} />
                <Line type="monotone" dataKey="max" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b', r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-16 flex items-center justify-center text-xs text-txt-3">
              Regista mais treinos para ver a evolução
            </div>
          )}

          {/* Exercise history */}
          <div className="mt-3 space-y-1 max-h-48 overflow-y-auto">
            {exLogs.slice().reverse().slice(0, 10).map(l => (
              <div key={l.id} className="flex justify-between text-xs py-1.5 border-b border-border last:border-0">
                <span className="text-txt-3">{formatDate(l.date)}</span>
                <span className="font-mono text-txt-2">{l.sets.map((s,i) => `${s.weight}×${s.reps}`).join(' · ')}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
