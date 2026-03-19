export interface Profile {
  id: string
  name: string
  weight_kg: number | null
  height_cm: number | null
  goal: string
  program: string
  avatar_color: string
  created_at: string
}

export interface SetData {
  weight: number
  reps: number
}

export interface WorkoutLog {
  id: string
  user_id: string
  exercise_id: string
  day_key: string
  date: string
  sets: SetData[]
  notes?: string
}

export interface Measurement {
  id: string
  user_id: string
  date: string
  weight_kg: number | null
  body_fat: number | null
  notes?: string
}

export interface Goal {
  id: string
  user_id: string
  exercise_id: string
  target_weight: number
  target_date: string | null
  achieved_at: string | null
  created_at: string
}

export interface Exercise {
  id: string
  name: string
  sets: number
  reps: string
  rest: string
  type: 'compound' | 'accessory'
  muscle: string
  desc: string
  ytQuery: string
  emoji: string
}

export interface WorkoutDay {
  key: string
  label: string
  shortLabel: string
  type: 'upper' | 'lower'
  intensity: 'heavy' | 'volume'
  exercises: Exercise[]
}

export type DayOfWeek = 'seg' | 'ter' | 'qua' | 'qui' | 'sex' | 'sab' | 'dom'

export interface DashboardStats {
  totalSessions: number
  currentStreak: number
  longestStreak: number
  totalVolume: number
  missedDays: number
  weekCompletion: number
}
