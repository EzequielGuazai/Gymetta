'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatDate, isoToday, computeStreak, totalVolume } from '@/lib/utils'
import { WORKOUT_DAYS, WEEK_SCHEDULE, JS_DAY_TO_KEY } from '@/lib/workoutData'
import type { Profile, WorkoutLog, Measurement } from '@/types'
import Link from 'next/link'
import { format, subDays } from 'date-fns'
import { Flame, TrendingUp, Calendar, Zap, ChevronRight, Dumbbell, Scale, AlertCircle, CheckCircle2 } from 'lucide-react'

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [logs, setLogs] = useState<WorkoutLog[]>([])
  const [measurements, setMeasurements] = useState<Measurement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const [{ data: prof }, { data: wlogs }, { data: meas }] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('workout_logs').select('*').eq('user_id', user.id).order('date', { ascending: false }).limit(200),
        supabase.from('measurements').select('*').eq('user_id', user.id).order('date', { ascending: false }).limit(30),
      ])
      if (prof) setProfile(prof as Profile)
      if (wlogs) setLogs(wlogs as WorkoutLog[])
      if (meas) setMeasurements(meas as Measurement[])
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <PageLoader />

  const today = isoToday()
  const todayDow = JS_DAY_TO_KEY[new Date().getDay()]
  const todayWorkout = WEEK_SCHEDULE[todayDow]
  const todayLogs = logs.filter(l => l.date === today)
  const todayComplete = todayWorkout
    ? WORKOUT_DAYS[todayWorkout]?.exercises.every(ex => todayLogs.some(l => l.exercise_id === ex.id))
    : false

  const streak = computeStreak(logs)

  const weekStart = format(subDays(new Date(), 6), 'yyyy-MM-dd')
  const weekLogs = logs.filter(l => l.date >= weekStart)
  const weekSessionDates = new Set(weekLogs.map(l => l.date))
  const weekVolume = weekLogs.reduce((acc, l) => acc + totalVolume(l.sets), 0)

  const last7Dates = [...Array(7)].map((_, i) => format(subDays(new Date(), i), 'yyyy-MM-dd')).reverse()
  const missed = last7Dates.filter(d => {
    const dow = JS_DAY_TO_KEY[new Date(d + 'T00:00:00').getDay()]
    const scheduled = WEEK_SCHEDULE[dow]
    if (!scheduled) return false
    return !logs.some(l => l.date === d) && d < today
  })

  const recentWeight = measurements[0]?.weight_kg
  const oldWeight = measurements.length > 1 ? measurements[measurements.length - 1].weight_kg : null
  const weightDiff = recentWeight && oldWeight ? +(recentWeight - oldWeight).toFixed(1) : null

  return (
    <div className="p-4 md:p-6 max-w-3xl">
      <div className="mb-6">
        <p className="text-xs text-txt-3 uppercase tracking-widest mb-1">{formatDate(new Date())}</p>
        <h1 className="text-xl font-bold">Olá{profile?.name ? `, ${profile.name.split(' ')[0]}` : ''}! 👋</h1>
        <p className="text-sm text-txt-2 mt-1">
          {todayWorkout
            ? todayComplete
              ? 'Treino de hoje completo! Excelente trabalho 💪'
              : `Tens ${WORKOUT_DAYS[todayWorkout]?.label} hoje`
            : 'Dia de descanso. Recupera bem!'}
        </p>
      </div>

      {todayWorkout && (
        <Link href="/treino" className="block card p-4 mb-4 border-accent-dim hover:border-accent transition-colors group">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${todayComplete ? 'bg-accent-bg' : 'bg-bg-3'}`}>
                {todayComplete
                  ? <CheckCircle2 size={20} className="text-accent" />
                  : <Dumbbell size={20} className="text-txt-2" />}
              </div>
              <div>
                <p className="text-sm font-semibold">{WORKOUT_DAYS[todayWorkout].label}</p>
                <p className="text-xs text-txt-3">
                  {todayComplete
                    ? `${todayLogs.length} exercícios registados`
                    : `${todayLogs.length}/${WORKOUT_DAYS[todayWorkout].exercises.length} exercícios feitos`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!todayComplete && <span className="badge-green">Iniciar</span>}
              <ChevronRight size={16} className="text-txt-3 group-hover:text-accent transition-colors" />
            </div>
          </div>
          {!todayComplete && todayLogs.length > 0 && (
            <div className="mt-3">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-txt-2">Progresso de hoje</span>
                <span className="text-txt-3">{Math.round(todayLogs.length / WORKOUT_DAYS[todayWorkout].exercises.length * 100)}%</span>
              </div>
              <div className="h-1.5 bg-bg-4 rounded-full overflow-hidden">
                <div className="h-full bg-accent rounded-full transition-all"
                  style={{ width: `${todayLogs.length / WORKOUT_DAYS[todayWorkout].exercises.length * 100}%` }} />
              </div>
            </div>
          )}
        </Link>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <StatCard icon={<Flame size={16} className="text-orange-400" />} label="Sequência" value={`${streak}`} sub="dias" />
        <StatCard icon={<Calendar size={16} className="text-accent" />} label="Esta semana" value={`${weekSessionDates.size}/4`} sub="treinos" />
        <StatCard icon={<Zap size={16} className="text-accent-2" />} label="Volume semana"
          value={weekVolume > 0 ? `${Math.round(weekVolume / 1000)}k` : '—'} sub="kg total" />
        <StatCard icon={<Scale size={16} className="text-accent-3" />} label="Peso atual"
          value={recentWeight ? `${recentWeight}` : '—'}
          sub={weightDiff !== null ? `${weightDiff > 0 ? '+' : ''}${weightDiff} kg` : 'kg'} />
      </div>

      {missed.length > 0 && (
        <div className="card p-3 mb-4 border-amber-800 bg-accent-2bg flex items-start gap-3">
          <AlertCircle size={16} className="text-accent-2 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-accent-2">
              {missed.length} treino{missed.length > 1 ? 's' : ''} em falta esta semana
            </p>
            <p className="text-xs text-amber-700 mt-0.5">
              Não te preocupes — continua o plano e mantém a consistência.
            </p>
          </div>
        </div>
      )}

      <div className="card p-4 mb-4">
        <p className="text-xs text-txt-3 uppercase tracking-widest mb-3">Últimos 7 dias</p>
        <div className="flex gap-1.5">
          {last7Dates.map(date => {
            const dow = JS_DAY_TO_KEY[new Date(date + 'T00:00:00').getDay()]
            const scheduled = WEEK_SCHEDULE[dow]
            const hasLog = logs.some(l => l.date === date)
            const isT = date === today
            const isFuture = date > today
            return (
              <div key={date} className="flex-1 flex flex-col items-center gap-1">
                <div className={`w-full aspect-square rounded-sm flex items-center justify-center text-[9px] font-bold transition-colors
                  ${isT ? 'ring-1 ring-accent' : ''}
                  ${hasLog ? 'bg-accent text-black' : scheduled && !isFuture ? 'bg-accent-redbg text-accent-red' : 'bg-bg-3 text-txt-3'}`}>
                  {hasLog ? '✓' : scheduled && !isFuture ? '✗' : '·'}
                </div>
                <span className="text-[9px] text-txt-3">
                  {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'][new Date(date + 'T00:00:00').getDay()]}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {logs.length > 0 ? (
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-txt-3 uppercase tracking-widest">Atividade recente</p>
            <Link href="/progresso" className="text-xs text-accent hover:underline">Ver tudo</Link>
          </div>
          <div className="space-y-2">
            {[...new Set(logs.slice(0, 10).map(l => l.date))].slice(0, 4).map(date => {
              const dayLogs = logs.filter(l => l.date === date)
              const dayKey = dayLogs[0]?.day_key
              const label = dayKey ? WORKOUT_DAYS[dayKey]?.shortLabel : '?'
              const vol = dayLogs.reduce((acc, l) => acc + totalVolume(l.sets), 0)
              return (
                <div key={date} className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
                  <div className="flex items-center gap-2.5">
                    <span className="badge-green">{label}</span>
                    <span className="text-sm">{formatDate(date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-txt-3">{dayLogs.length} ex.</span>
                    {vol > 0 && <span className="text-xs font-mono text-txt-2">{vol.toLocaleString()} kg</span>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="card p-8 text-center">
          <Dumbbell size={32} className="text-txt-3 mx-auto mb-3" />
          <p className="text-sm font-medium mb-1">Primeiro treino!</p>
          <p className="text-xs text-txt-3 mb-4">Vai ao separador Treino e regista o teu primeiro exercício.</p>
          <Link href="/treino" className="btn-primary inline-block">Começar treino</Link>
        </div>
      )}
    </div>
  )
}

function StatCard({ icon, label, value, sub }: { icon: React.ReactNode, label: string, value: string, sub: string }) {
  return (
    <div className="card p-3">
      <div className="flex items-center gap-1.5 mb-2">{icon}<span className="text-[11px] text-txt-3 uppercase tracking-wide">{label}</span></div>
      <p className="text-2xl font-bold font-mono text-txt leading-none">{value}</p>
      <p className="text-xs text-txt-3 mt-0.5">{sub}</p>
    </div>
  )
}

function PageLoader() {
  return (
    <div className="p-6 space-y-3 max-w-3xl">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="card p-4 animate-pulse">
          <div className="h-4 bg-bg-3 rounded w-1/3 mb-2" />
          <div className="h-3 bg-bg-3 rounded w-2/3" />
        </div>
      ))}
    </div>
  )
}
