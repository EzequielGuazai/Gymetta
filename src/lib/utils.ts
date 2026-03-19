import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, parseISO, isToday, isYesterday, differenceInDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { WorkoutLog } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date) {
  const d = typeof date === 'string' ? parseISO(date) : date
  if (isToday(d)) return 'Hoje'
  if (isYesterday(d)) return 'Ontem'
  return format(d, "d 'de' MMM", { locale: ptBR })
}

export function isoToday() {
  return format(new Date(), 'yyyy-MM-dd')
}

export function computeStreak(logs: WorkoutLog[], scheduledDays: string[]): number {
  if (logs.length === 0) return 0
  const dates = [...new Set(logs.map(l => l.date))].sort().reverse()
  let streak = 0
  let checkDate = new Date()

  for (let i = 0; i < 90; i++) {
    const ds = format(checkDate, 'yyyy-MM-dd')
    const dow = format(checkDate, 'EEEEEE', { locale: ptBR }).toLowerCase()
    const isScheduled = scheduledDays.includes(dow) || scheduledDays.includes(checkDate.getDay().toString())

    if (isScheduled) {
      if (dates.includes(ds)) {
        streak++
      } else if (differenceInDays(new Date(), checkDate) > 0) {
        break
      }
    }
    checkDate.setDate(checkDate.getDate() - 1)
  }
  return streak
}

export function totalVolume(sets: WorkoutLog['sets']): number {
  return sets.reduce((acc, s) => acc + s.weight * s.reps, 0)
}

export function getMaxWeight(logs: WorkoutLog[]): number {
  return Math.max(0, ...logs.flatMap(l => l.sets.map(s => s.weight)))
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
  return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
}
