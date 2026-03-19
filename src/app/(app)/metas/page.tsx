'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ALL_EXERCISES, getExerciseById } from '@/lib/workoutData'
import { getMaxWeight, getProgressPercent, formatDate } from '@/lib/utils'
import type { Goal, WorkoutLog } from '@/types'
import { Target, Plus, Check, Trash2, Trophy, X } from 'lucide-react'

export default function MetasPage() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [logs, setLogs] = useState<WorkoutLog[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ exercise_id: 'a1_supino_barra', target_weight: '', target_date: '' })
  const [saving, setSaving] = useState(false)
  const [refresh, setRefresh] = useState(0)

  useEffect(() => {
    const supabase = createClient()
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setUserId(user.id)
      const [{ data: gl }, { data: wl }] = await Promise.all([
        supabase.from('goals').select('*').eq('user_id', user.id).order('created_at'),
        supabase.from('workout_logs').select('*').eq('user_id', user.id).limit(500),
      ])
      if (gl) setGoals(gl as Goal[])
      if (wl) setLogs(wl as WorkoutLog[])
    }
    load()
  }, [refresh])

  async function addGoal() {
    if (!userId || !form.target_weight) return
    setSaving(true)
    const supabase = createClient()
    await supabase.from('goals').insert({
      user_id: userId,
      exercise_id: form.exercise_id,
      target_weight: parseFloat(form.target_weight),
      target_date: form.target_date || null,
    })
    setShowAdd(false)
    setForm({ exercise_id: 'a1_supino_barra', target_weight: '', target_date: '' })
    setSaving(false)
    setRefresh(r => r + 1)
  }

  async function deleteGoal(id: string) {
    const supabase = createClient()
    await supabase.from('goals').delete().eq('id', id)
    setRefresh(r => r + 1)
  }

  async function markAchieved(id: string) {
    const supabase = createClient()
    await supabase.from('goals').update({ achieved_at: new Date().toISOString() }).eq('id', id)
    setRefresh(r => r + 1)
  }

  function getStatus(goal: Goal) {
    const exLogs = logs.filter(l => l.exercise_id === goal.exercise_id)
    const currentMax = getMaxWeight(exLogs)
    const startWeight = exLogs.length > 0 ? (exLogs[0]?.sets[0]?.weight ?? 0) : 0
    const pct = getProgressPercent(currentMax, goal.target_weight, startWeight)
    const daysLeft = goal.target_date
      ? Math.ceil((new Date(goal.target_date).getTime() - Date.now()) / 86400000)
      : null
    return { currentMax, pct, daysLeft }
  }

  const active = goals.filter(g => !g.achieved_at)
  const achieved = goals.filter(g => !!g.achieved_at)

  return (
    <div className="p-4 md:p-6 max-w-2xl space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Metas</h1>
        <button onClick={() => setShowAdd(!showAdd)} className="btn-ghost flex items-center gap-1.5 text-sm">
          <Plus size={14} />Nova meta
        </button>
      </div>

      {showAdd && (
        <div className="card p-4 border-accent-dim">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold">Definir nova meta</p>
            <button onClick={() => setShowAdd(false)}><X size={15} className="text-txt-3" /></button>
          </div>
          <div className="space-y-3">
            <div>
              <label className="label block mb-1">Exercício</label>
              <select className="input text-sm bg-bg-3"
                value={form.exercise_id} onChange={e => setForm(p => ({ ...p, exercise_id: e.target.value }))}>
                {ALL_EXERCISES.map(ex => (
                  <option key={ex.id} value={ex.id}>{ex.name}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="label block mb-1">Carga alvo (kg)</label>
                <input className="input text-sm" type="number" step="0.5"
                  value={form.target_weight} onChange={e => setForm(p => ({ ...p, target_weight: e.target.value }))} placeholder="100" />
              </div>
              <div>
                <label className="label block mb-1">Data limite</label>
                <input className="input text-sm" type="date"
                  value={form.target_date} onChange={e => setForm(p => ({ ...p, target_date: e.target.value }))} />
              </div>
            </div>
            <button className="btn-primary w-full" onClick={addGoal} disabled={saving}>
              {saving ? 'A guardar...' : 'Criar meta'}
            </button>
          </div>
        </div>
      )}

      {active.length > 0 ? (
        <section>
          <p className="label mb-2">Metas ativas</p>
          <div className="space-y-3">
            {active.map(goal => {
              const ex = getExerciseById(goal.exercise_id)
              const { currentMax, pct, daysLeft } = getStatus(goal)
              const isNearDeadline = daysLeft !== null && daysLeft <= 14 && daysLeft >= 0
              const isOverdue = daysLeft !== null && daysLeft < 0
              return (
                <div key={goal.id} className="card p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm font-semibold">{ex?.name ?? goal.exercise_id}</p>
                      <p className="text-xs text-txt-3 mt-0.5">
                        Meta: <span className="text-accent-2 font-mono">{goal.target_weight} kg</span>
                        {goal.target_date && (
                          <> · <span className={isOverdue ? 'text-accent-red' : isNearDeadline ? 'text-accent-2' : 'text-txt-3'}>
                            {isOverdue ? `${Math.abs(daysLeft!)} dias em atraso` : daysLeft === 0 ? 'Hoje!' : `${daysLeft} dias`}
                          </span></>
                        )}
                      </p>
                    </div>
                    <div className="flex gap-1.5">
                      {pct >= 100 && (
                        <button onClick={() => markAchieved(goal.id)}
                          className="text-accent hover:bg-accent hover:text-black p-1.5 rounded transition-colors">
                          <Check size={14} />
                        </button>
                      )}
                      <button onClick={() => deleteGoal(goal.id)} className="text-txt-3 hover:text-accent-red p-1.5 rounded">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex-1 h-2 bg-bg-4 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${Math.min(pct, 100)}%`,
                          background: pct >= 100 ? '#22c55e' : isNearDeadline ? '#f59e0b' : '#3b82f6'
                        }} />
                    </div>
                    <span className="text-xs font-mono text-txt-2 w-10 text-right">{pct}%</span>
                  </div>

                  <div className="flex justify-between text-[11px] text-txt-3 font-mono">
                    <span>Atual: {currentMax > 0 ? `${currentMax} kg` : 'sem registo'}</span>
                    <span>Falta: {currentMax < goal.target_weight ? `${(goal.target_weight - currentMax).toFixed(1)} kg` : '✓'}</span>
                  </div>

                  {isOverdue && currentMax < goal.target_weight && (
                    <div className="mt-3 p-2 rounded bg-accent-redbg border border-red-900 text-xs text-red-400">
                      Meta em atraso. Tenta aumentar 2.5 kg esta semana e sê consistente nos treinos.
                    </div>
                  )}
                  {isNearDeadline && !isOverdue && currentMax < goal.target_weight && (
                    <div className="mt-3 p-2 rounded bg-accent-2bg border border-amber-800 text-xs text-amber-500">
                      Faltam {daysLeft} dias. Precisas de {((goal.target_weight - currentMax) / Math.max(1, (daysLeft ?? 7) / 7)).toFixed(1)} kg/semana.
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>
      ) : !showAdd && (
        <div className="card p-8 text-center">
          <Target size={32} className="text-txt-3 mx-auto mb-3" />
          <p className="text-sm font-medium mb-1">Sem metas definidas</p>
          <p className="text-xs text-txt-3 mb-4">Define um peso alvo num exercício e acompanha o progresso.</p>
          <button onClick={() => setShowAdd(true)} className="btn-primary">Criar primeira meta</button>
        </div>
      )}

      {achieved.length > 0 && (
        <section>
          <p className="label mb-2">Conquistadas 🏆</p>
          <div className="space-y-2">
            {achieved.map(goal => {
              const ex = getExerciseById(goal.exercise_id)
              return (
                <div key={goal.id} className="card p-3 border-accent-dim bg-accent-bg flex items-center gap-3">
                  <Trophy size={16} className="text-accent flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{ex?.name}</p>
                    <p className="text-xs text-accent">
                      {goal.target_weight} kg atingido · {formatDate(goal.achieved_at!.split('T')[0])}
                    </p>
                  </div>
                  <button onClick={() => deleteGoal(goal.id)} className="text-txt-3 hover:text-accent-red p-1">
                    <X size={13} />
                  </button>
                </div>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}
