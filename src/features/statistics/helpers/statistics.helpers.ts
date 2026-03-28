import { format, parse, parseISO, startOfWeek } from 'date-fns'

import { CALENDAR_MONTH_PAD, weekOptionsMonday } from '@/shared/constants/calendar.constants'
import { STATISTICS_AGGREGATE } from '@/shared/constants/chartRanges.constants'
import { DATE_FORMAT } from '@/shared/constants/dateDisplay.constants'
import type { Stroke, Workout } from '@/shared/types/domain.types'

export type StatisticsAggregate = {
  workoutCount: number
  totalDistanceMeters: number
  totalDurationSeconds: number
  averageDistanceMeters: number
  averageDurationSeconds: number
  bestPacePer100: number | null
  longestWorkout: Workout | null
  mostFrequentStroke: Stroke | null
  weeklyTotalsMeters: { weekLabel: string; meters: number }[]
  monthlyTotalsMeters: { monthLabel: string; meters: number }[]
}

function modeStroke(workouts: Workout[]): Stroke | null {
  if (workouts.length === 0) {
    return null
  }
  const counts = new Map<Stroke, number>()
  for (const w of workouts) {
    counts.set(w.stroke, (counts.get(w.stroke) ?? 0) + 1)
  }
  let best: Stroke | null = null
  let bestN = 0
  for (const [stroke, n] of counts) {
    if (n > bestN) {
      bestN = n
      best = stroke
    }
  }
  return best
}

function formatMonthKey(monthKey: string): string {
  const [y, m] = monthKey.split('-')
  if (!y || !m) {
    return monthKey
  }
  const d = new Date(Number(y), Number(m) - 1, 1)
  return format(d, DATE_FORMAT.STATS_MONTH_LABEL)
}

export function buildStatisticsAggregate(workouts: Workout[]): StatisticsAggregate {
  const n = workouts.length
  if (n === 0) {
    return {
      workoutCount: 0,
      totalDistanceMeters: 0,
      totalDurationSeconds: 0,
      averageDistanceMeters: 0,
      averageDurationSeconds: 0,
      bestPacePer100: null,
      longestWorkout: null,
      mostFrequentStroke: null,
      weeklyTotalsMeters: [],
      monthlyTotalsMeters: [],
    }
  }

  const totalDistanceMeters = workouts.reduce((a, w) => a + w.distance, 0)
  const totalDurationSeconds = workouts.reduce((a, w) => a + w.duration, 0)
  const paces = workouts.map((w) => w.averagePacePer100).filter((p) => p > 0)
  const bestPacePer100 = paces.length > 0 ? Math.min(...paces) : null

  let longest: Workout | null = null
  for (const w of workouts) {
    if (!longest || w.distance > longest.distance) {
      longest = w
    }
  }

  const byWeek = new Map<string, number>()
  const byMonth = new Map<string, number>()
  for (const w of workouts) {
    const d = parseISO(w.date)
    const weekStart = startOfWeek(d, weekOptionsMonday)
    const weekKey = format(weekStart, DATE_FORMAT.STATS_WEEK_BUCKET_KEY)
    byWeek.set(weekKey, (byWeek.get(weekKey) ?? 0) + w.distance)
    const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(CALENDAR_MONTH_PAD, '0')}`
    byMonth.set(monthKey, (byMonth.get(monthKey) ?? 0) + w.distance)
  }

  const weeklyTotalsMeters = [...byWeek.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-STATISTICS_AGGREGATE.WEEKLY_BUCKETS_SHOWN)
    .map(([weekKey, meters]) => ({
      weekLabel: format(
        parse(weekKey, DATE_FORMAT.STATS_WEEK_BUCKET_KEY, new Date()),
        DATE_FORMAT.STATS_WEEK_LABEL,
      ),
      meters: Math.round(meters),
    }))

  const monthlyTotalsMeters = [...byMonth.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-STATISTICS_AGGREGATE.MONTHLY_BUCKETS_SHOWN)
    .map(([monthKey, meters]) => ({
      monthLabel: formatMonthKey(monthKey),
      meters: Math.round(meters),
    }))

  return {
    workoutCount: n,
    totalDistanceMeters,
    totalDurationSeconds,
    averageDistanceMeters: totalDistanceMeters / n,
    averageDurationSeconds: totalDurationSeconds / n,
    bestPacePer100,
    longestWorkout: longest,
    mostFrequentStroke: modeStroke(workouts),
    weeklyTotalsMeters,
    monthlyTotalsMeters,
  }
}
