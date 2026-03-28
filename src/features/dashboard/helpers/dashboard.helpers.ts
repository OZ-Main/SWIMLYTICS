import {
  endOfMonth,
  endOfWeek,
  format,
  isWithinInterval,
  parseISO,
  startOfMonth,
  startOfWeek,
} from 'date-fns'

import { weekOptionsMonday } from '@/shared/constants/calendar.constants'
import { DASHBOARD_CHART } from '@/shared/constants/chartRanges.constants'
import { DATE_FORMAT } from '@/shared/constants/dateDisplay.constants'
import { STROKE_ORDER } from '@/shared/constants/strokeLabels'
import type { Stroke } from '@/shared/domain'
import type {
  DashboardSummary,
  NamedChartPoint,
  StrokeSlice,
  TimeSeriesPoint,
  Workout,
} from '@/shared/types/domain.types'

export function buildDashboardSummary(
  workouts: Workout[],
  referenceDate: Date = new Date(),
): DashboardSummary {
  const totalWorkouts = workouts.length
  const totalDistanceMeters = workouts.reduce((a, w) => a + w.distance, 0)
  const totalDurationSeconds = workouts.reduce((a, w) => a + w.duration, 0)
  const averagePacePer100Seconds =
    totalDistanceMeters > 0 ? (totalDurationSeconds / totalDistanceMeters) * 100 : null

  const weekStart = startOfWeek(referenceDate, weekOptionsMonday)
  const weekEnd = endOfWeek(referenceDate, weekOptionsMonday)
  const currentWeekDistanceMeters = workouts
    .filter((w) => isWithinInterval(parseISO(w.date), { start: weekStart, end: weekEnd }))
    .reduce((a, w) => a + w.distance, 0)

  return {
    totalWorkouts,
    totalDistanceMeters,
    totalDurationSeconds,
    averagePacePer100Seconds,
    currentWeekDistanceMeters,
  }
}

export function buildWeeklyDistanceSeries(
  workouts: Workout[],
  weeksBack: number = DASHBOARD_CHART.WEEKLY_WEEKS,
  referenceDate: Date = new Date(),
): NamedChartPoint[] {
  const points: NamedChartPoint[] = []
  for (let i = weeksBack - 1; i >= 0; i--) {
    const anchor = new Date(referenceDate)
    anchor.setDate(anchor.getDate() - i * 7)
    const start = startOfWeek(anchor, weekOptionsMonday)
    const end = endOfWeek(anchor, weekOptionsMonday)
    const distance = workouts
      .filter((w) => isWithinInterval(parseISO(w.date), { start, end }))
      .reduce((a, w) => a + w.distance, 0)
    points.push({
      name: format(start, DATE_FORMAT.CHART_WEEK_START),
      value: Math.round(distance),
    })
  }
  return points
}

export function buildMonthlyVolumeSeries(
  workouts: Workout[],
  monthsBack: number = DASHBOARD_CHART.MONTHLY_MONTHS,
  referenceDate: Date = new Date(),
): NamedChartPoint[] {
  const points: NamedChartPoint[] = []
  for (let i = monthsBack - 1; i >= 0; i--) {
    const anchor = new Date(referenceDate.getFullYear(), referenceDate.getMonth() - i, 1)
    const start = startOfMonth(anchor)
    const end = endOfMonth(anchor)
    const distance = workouts
      .filter((w) => isWithinInterval(parseISO(w.date), { start, end }))
      .reduce((a, w) => a + w.distance, 0)
    points.push({
      name: format(start, DATE_FORMAT.CHART_MONTH_SHORT),
      value: Math.round(distance),
    })
  }
  return points
}

export function buildStrokeDistribution(workouts: Workout[]): StrokeSlice[] {
  const map = new Map<Stroke, { count: number; distanceMeters: number }>()
  for (const w of workouts) {
    const cur = map.get(w.stroke) ?? { count: 0, distanceMeters: 0 }
    cur.count += 1
    cur.distanceMeters += w.distance
    map.set(w.stroke, cur)
  }
  return STROKE_ORDER.filter((s) => map.has(s)).map((stroke) => {
    const v = map.get(stroke)!
    return {
      stroke,
      count: v.count,
      distanceMeters: v.distanceMeters,
    }
  })
}

export function buildPaceTrendSeries(workouts: Workout[]): TimeSeriesPoint[] {
  return [...workouts]
    .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime())
    .map((w) => ({
      date: w.date,
      value: w.averagePacePer100,
    }))
}
