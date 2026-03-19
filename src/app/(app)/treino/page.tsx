'use client'
import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { WORKOUT_DAYS, WEEK_SCHEDULE, JS_DAY_TO_KEY } from '@/lib/workoutData'
import { isoToday, cn } from '@/lib/utils'
import type { WorkoutLog, SetData, Exercise } from '@/types'
import { ChevronDown, ChevronUp, Play, Check, RotateCcw, ExternalLink, Timer, Info } from 'lucide-react'

const WEEK_ORDER = ['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom']
const DAY_LABELS: Record<string, string> = {
  seg: 'Seg', ter: 'Ter', qua: 'Qua', qui: 'Qui', sex: 'Sex', sab: 'Sáb', dom: 'Dom',
}

export default function TreinoPage() {
  const todayDow = JS_DAY_TO_KEY[new Date().getDay()]
  const [selectedDow, setSelectedDow] = useState(todayDow)
  const [logs, setLogs] = useState<WorkoutLog[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [restTimer, setRestTimer] = useState<number | null>(null)
  const supabase = createClient()

  const selectedWorkout = WEEK_SCHEDULE[selectedDow]

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    setUserId(user.id)
    const { data } = await supabase
      .from('workout_logs')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', isoToday())
      .order('created_at')
    if (data) setLogs(data as WorkoutLog[])
  }, [supabase])

  useEffect(() => { load() }, [load])

  useEffect(() => {
    if (restTimer === null || restTimer <= 0) return
    const t = setTimeout(() => setRestTimer(r => r !== null ? r - 1 : null), 1000)
    return () => clearTimeout(t)
  }, [restTimer])

  function isLoggedToday(exId: string) {
    return logs.some(l => l.exercise_id === exId)
  }

  const dayWorkout = selectedWorkout ? WORKOUT_DAYS[selectedWorkout] : null
  const doneCount = dayWorkout?.exercises.filter(e => isLoggedToday(e.id)).length ?? 0
  const total = dayWorkout?.exercises.length ?? 0

  return (
    <div className="p-4 md:p-6 max-w-2xl">
      <div className="mb-5">
        <h1 className="text-xl font-bold mb-4">Treino</h1>
        <div className="flex gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {WEEK_ORDER.map(dow => {
            const wk = WEEK_SCHEDULE[dow]
            const isToday = dow === JS_DAY_TO_KEY[new Date().getDay()]
            return (
              <button key={dow} onClick={() => setSelectedDow(dow)}
                className={cn(
                  'flex flex-col items-center px-3 py-2 rounded border text-xs transition-all flex-shrink-0',
                  selectedDow === dow ? 'bg-accent-bg border-accent-dim text-accent' : 'bg-bg-2 border-border text-txt-2 hover:border-border-2',
                  isToday && selectedDow !== dow && 'border-border-2'
                )}>
                <span className="font-medium">{DAY_LABELS[dow]}</span>
                <span className={cn('text-[10px] mt-0.5', wk ? 'text-accent' : 'text-txt-3')}>
                  {wk ? WORKOUT_DAYS[wk].shortLabel : '—'}
                </span>
                {isToday && <span className="w-1 h-1 rounded-full bg-accent mt-1" />}
              </button>
            )
          })}
        </div>
      </div>

      {!dayWorkout ? <RestDay /> : (
        <>
          <div className="card p-3 mb-4 flex items-center gap-3">
            <div className="flex-1">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-txt-2">{dayWorkout.label}</span>
                <span className="font-mono text-txt-3">{doneCount}/{total}</span>
              </div>
              <div className="h-1.5 bg-bg-4 rounded-full overflow-hidden">
                <div className="h-full bg-accent rounded-full transition-all duration-500"
                  style={{ width: `${total > 0 ? (doneCount / total) * 100 : 0}%` }} />
              </div>
            </div>
            {doneCount === total && total > 0 && <span className="badge-green whitespace-nowrap">✓ Completo!</span>}
          </div>

          {restTimer !== null && restTimer > 0 && (
            <div className="card p-3 mb-4 bg-accent-3bg border-blue-800 flex items-center gap-3">
              <Timer size={16} className="text-accent-3" />
              <div className="flex-1">
                <p className="text-xs text-accent-3 font-medium">Descanso</p>
                <div className="h-1 bg-blue-900 rounded-full mt-1 overflow-hidden">
                  <div className="h-full bg-accent-3 rounded-full transition-all"
                    style={{ width: `${(restTimer / 120) * 100}%` }} />
                </div>
              </div>
              <span className="text-lg font-mono font-bold text-accent-3">
                {Math.floor(restTimer / 60)}:{String(restTimer % 60).padStart(2, '0')}
              </span>
              <button onClick={() => setRestTimer(null)} className="text-txt-3 hover:text-txt"><RotateCcw size={14} /></button>
            </div>
          )}

          <div className="space-y-2">
            {dayWorkout.exercises.map(ex => (
              <ExerciseCard key={ex.id} exercise={ex} dayKey={selectedWorkout!} userId={userId}
                isLoggedToday={isLoggedToday(ex.id)} isExpanded={expanded === ex.id}
                onToggle={() => setExpanded(expanded === ex.id ? null : ex.id)}
                onLogged={() => { load(); setRestTimer(ex.type === 'compound' ? 120 : 60) }} />
            ))}
          </div>

          {selectedWorkout && ['a1', 'a2'].includes(selectedWorkout) && (
            <div className="card p-3 mt-3 flex items-center gap-2 border-accent-dim">
              <Info size={14} className="text-accent flex-shrink-0" />
              <p className="text-xs text-txt-2">Não esqueças o treino de abdômen hoje — 3 séries de prancha ou crunch.</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

interface ExerciseCardProps {
  exercise: Exercise
  dayKey: string
  userId: string | null
  isLoggedToday: boolean
  isExpanded: boolean
  onToggle: () => void
  onLogged: () => void
}

function ExerciseCard({ exercise, dayKey, userId, isLoggedToday, isExpanded, onToggle, onLogged }: ExerciseCardProps) {
  const [sets, setSets] = useState<SetData[]>(
    Array.from({ length: exercise.sets }, () => ({ weight: 0, reps: 0 }))
  )
  const [saving, setSaving] = useState(false)
  const [lastLog, setLastLog] = useState<WorkoutLog | null>(null)
  const supabase = createClient()

  useEffect(() => {
    if (!userId || !isExpanded) return
    supabase.from('workout_logs').select('*')
      .eq('user_id', userId).eq('exercise_id', exercise.id)
      .order('date', { ascending: false }).limit(1).maybeSingle()
      .then(({ data }) => { if (data) setLastLog(data as WorkoutLog) })
  }, [isExpanded, userId, exercise.id, supabase])

  function updateSet(i: number, field: 'weight' | 'reps', val: string) {
    setSets(prev => prev.map((s, idx) => idx === i ? { ...s, [field]: parseFloat(val) || 0 } : s))
  }

  async function logExercise() {
    if (!userId) return
    setSaving(true)
    await supabase.from('workout_logs').upsert(
      { user_id: userId, exercise_id: exercise.id, day_key: dayKey, date: isoToday(), sets },
      { onConflict: 'user_id,exercise_id,date' }
    )
    setSaving(false)
    onLogged()
  }

  const ytUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(exercise.ytQuery)}`

  return (
    <div className={cn('card overflow-hidden transition-all', isLoggedToday && 'border-accent-dim')}>
      <button className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-bg-3 transition-colors" onClick={onToggle}>
        <span className="text-xl">{exercise.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold">{exercise.name}</span>
            {isLoggedToday && <Check size={13} className="text-accent" />}
          </div>
          <div className="flex gap-1.5 mt-1">
            <span className={exercise.type === 'compound' ? 'badge-green' : 'badge-amber'}>
              {exercise.type === 'compound' ? 'Composto' : 'Acessório'}
            </span>
            <span className="text-[10px] text-txt-3 font-mono self-center">
              {exercise.sets}×{exercise.reps} · {exercise.rest}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {lastLog && !isExpanded && (
            <span className="text-[10px] text-txt-3 font-mono hidden sm:block">{lastLog.sets[0]?.weight}kg</span>
          )}
          {isExpanded ? <ChevronUp size={15} className="text-txt-3" /> : <ChevronDown size={15} className="text-txt-3" />}
        </div>
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 border-t border-border space-y-3 pt-3">
          <p className="text-xs text-txt-2 leading-relaxed">{exercise.desc}</p>
          <p className="text-[11px] text-txt-3">
            <span className="uppercase tracking-wide text-[10px]">Músculo: </span>{exercise.muscle}
          </p>

          {lastLog && (
            <div className="bg-bg-3 rounded p-2 border border-border">
              <p className="text-[10px] text-txt-3 mb-1 uppercase tracking-wide">Última sessão</p>
              <p className="text-xs font-mono text-txt-2">
                {lastLog.sets.map((s, i) => `S${i + 1}: ${s.weight}kg×${s.reps}`).join('  ·  ')}
              </p>
            </div>
          )}

          <div>
            <p className="label mb-2">Regista as séries de hoje</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {sets.map((s, i) => (
                <div key={i} className="bg-bg-3 border border-border-2 rounded p-2">
                  <p className="text-[10px] text-txt-3 mb-1.5">Série {i + 1}</p>
                  <div className="flex gap-1.5">
                    <input className="input text-xs px-2 py-1.5 flex-1 min-w-0" type="number"
                      placeholder={lastLog?.sets[i]?.weight?.toString() ?? 'kg'}
                      value={s.weight || ''} onChange={e => updateSet(i, 'weight', e.target.value)} step="0.5" min="0" />
                    <input className="input text-xs px-2 py-1.5 flex-1 min-w-0" type="number"
                      placeholder={lastLog?.sets[i]?.reps?.toString() ?? 'reps'}
                      value={s.reps || ''} onChange={e => updateSet(i, 'reps', e.target.value)} min="1" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button className="btn-primary flex-1 flex items-center justify-center gap-2"
              onClick={logExercise} disabled={saving}>
              {saving ? 'A guardar...' : isLoggedToday ? '↻ Atualizar' : '✓ Registar exercício'}
            </button>
            <a href={ytUrl} target="_blank" rel="noopener noreferrer"
              className="btn-ghost flex items-center gap-1.5 flex-shrink-0 text-sm">
              <Play size={12} />Como fazer<ExternalLink size={10} className="opacity-50" />
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

function RestDay() {
  return (
    <div className="card p-8 text-center">
      <p className="text-4xl mb-3">😴</p>
      <h2 className="text-base font-semibold mb-2">Dia de descanso</h2>
      <p className="text-sm text-txt-2 leading-relaxed">O músculo cresce durante o descanso.<br />Come bem, bebe água e dorme 7–8 horas.</p>
    </div>
  )
}
