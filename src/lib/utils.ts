import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, isToday, isYesterday, differenceInDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { WorkoutLog } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date) {
  const d = typeof date === 'string' ? new Date(date + 'T00:00:00') : date
  if (isToday(d)) return 'Hoje'
  if (isYesterday(d)) return 'Ontem'
  return format(d, "d 'de' MMM", { locale: ptBR })
}

export function isoToday() {
  return format(new Date(), 'yyyy-MM-dd')
}

export function computeStreak(logs: WorkoutLog[]): number {
  if (logs.length === 0) return 0
  const SCHEDULED_JS_DAYS = [1, 2, 4, 5] // Mon, Tue, Thu, Fri
  const loggedDates = new Set(logs.map(l => l.date))
  let streak = 0
  const today = new Date()

  for (let i = 0; i < 90; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const dow = d.getDay()
    const ds = format(d, 'yyyy-MM-dd')

    if (!SCHEDULED_JS_DAYS.includes(dow)) continue

    if (loggedDates.has(ds)) {
      streak++
    } else if (differenceInDays(today, d) > 0) {
      break
    }
  }
  return streak
}

export function totalVolume(sets: WorkoutLog['sets']): number {
  return sets.reduce((acc, s) => acc + (s.weight || 0) * (s.reps || 0), 0)
}

export function getMaxWeight(logs: WorkoutLog[]): number {
  const all = logs.flatMap(l => l.sets.map(s => s.weight || 0))
  return all.length > 0 ? Math.max(0, ...all) : 0
}

export function getBmi(weight: number, height: number): number {
  const h = height / 100
  return Math.round((weight / (h * h)) * 10) / 10
}

export function getProgressPercent(current: number, target: number, start: number): number {
  if (target <= start) return 100
  return Math.min(100, Math.round(((current - start) / (target - start)) * 100))
}

export function avatarInitials(name: string): string {
  return name.split(' ').slice(0, 2).map(n => n[0] ?? '').join('').toUpperCase() || '?'
}
