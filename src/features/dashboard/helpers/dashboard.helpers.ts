import {
  endOfMonth,
  endOfWeek,
  format,
  isWithinInterval,
  parseISO,
  startOfMonth,
  startOfWeek,
} from 'date-fns'

import { calculateSwimmingBlockDistanceMeters } from '@/features/sessions/helpers/sessionBlockDistance.helpers'
import {
  getGymSessionTotalDurationSeconds,
  getSwimmingSessionTotalDistanceMeters,
  getSwimmingSessionTotalDurationSeconds,
  getSwimmingSessionWeightedPacePer100Seconds,
} from '@/features/sessions/helpers/sessionTotals.helpers'
import { weekOptionsMonday } from '@/shared/constants/calendar.constants'
import { DATE_FORMAT } from '@/shared/constants/dateDisplay.constants'
import { STROKE_ORDER } from '@/shared/constants/strokeLabels'
import type { Stroke } from '@/shared/domain'
import type {
  DashboardSummary,
  GymDashboardSummary,
  GymTrainingSession,
  NamedChartPoint,
  StrokeSlice,
  SwimmingTrainingSession,
  TimeSeriesPoint,
} from '@/shared/types/domain.types'

const dashboardWeeklyWeeks = 8
const dashboardMonthlyMonths = 6

export function buildDashboardSummary(
  swimmingSessions: SwimmingTrainingSession[],
  referenceDate: Date = new Date(),
): DashboardSummary {
  const totalSessions = swimmingSessions.length
  const totalDistanceMeters = swimmingSessions.reduce(
    (totalMeters, session) => totalMeters + getSwimmingSessionTotalDistanceMeters(session),
    0,
  )
  const totalDurationSeconds = swimmingSessions.reduce(
    (totalSeconds, session) => totalSeconds + getSwimmingSessionTotalDurationSeconds(session),
    0,
  )
  const averagePacePer100Seconds =
    totalDistanceMeters > 0 ? (totalDurationSeconds / totalDistanceMeters) * 100 : null

  const weekStart = startOfWeek(referenceDate, weekOptionsMonday)
  const weekEnd = endOfWeek(referenceDate, weekOptionsMonday)
  const currentWeekDistanceMeters = swimmingSessions
    .filter((session) =>
      isWithinInterval(parseISO(session.date), { start: weekStart, end: weekEnd }),
    )
    .reduce(
      (totalMeters, session) => totalMeters + getSwimmingSessionTotalDistanceMeters(session),
      0,
    )

  return {
    totalSessions,
    totalDistanceMeters,
    totalDurationSeconds,
    averagePacePer100Seconds,
    currentWeekDistanceMeters,
  }
}

export function buildGymDashboardSummary(
  gymSessions: GymTrainingSession[],
  referenceDate: Date = new Date(),
): GymDashboardSummary {
  const sessionCount = gymSessions.length
  const totalDurationSeconds = gymSessions.reduce(
    (totalSeconds, session) => totalSeconds + getGymSessionTotalDurationSeconds(session),
    0,
  )
  const weekStart = startOfWeek(referenceDate, weekOptionsMonday)
  const weekEnd = endOfWeek(referenceDate, weekOptionsMonday)
  const currentWeekDurationSeconds = gymSessions
    .filter((session) =>
      isWithinInterval(parseISO(session.date), { start: weekStart, end: weekEnd }),
    )
    .reduce(
      (totalSeconds, session) => totalSeconds + getGymSessionTotalDurationSeconds(session),
      0,
    )

  return {
    sessionCount,
    totalDurationSeconds,
    currentWeekDurationSeconds,
  }
}

export function buildWeeklyDistanceSeries(
  swimmingSessions: SwimmingTrainingSession[],
  weeksBack: number = dashboardWeeklyWeeks,
  referenceDate: Date = new Date(),
): NamedChartPoint[] {
  const points: NamedChartPoint[] = []
  for (let weekOffset = weeksBack - 1; weekOffset >= 0; weekOffset--) {
    const anchorDate = new Date(referenceDate)
    anchorDate.setDate(anchorDate.getDate() - weekOffset * 7)
    const intervalStart = startOfWeek(anchorDate, weekOptionsMonday)
    const intervalEnd = endOfWeek(anchorDate, weekOptionsMonday)
    const distance = swimmingSessions
      .filter((session) =>
        isWithinInterval(parseISO(session.date), { start: intervalStart, end: intervalEnd }),
      )
      .reduce(
        (totalMeters, session) => totalMeters + getSwimmingSessionTotalDistanceMeters(session),
        0,
      )
    points.push({
      name: format(intervalStart, DATE_FORMAT.CHART_WEEK_START),
      value: Math.round(distance),
    })
  }
  return points
}

export function buildWeeklyGymDurationSeries(
  gymSessions: GymTrainingSession[],
  weeksBack: number = dashboardWeeklyWeeks,
  referenceDate: Date = new Date(),
): NamedChartPoint[] {
  const points: NamedChartPoint[] = []
  for (let weekOffset = weeksBack - 1; weekOffset >= 0; weekOffset--) {
    const anchorDate = new Date(referenceDate)
    anchorDate.setDate(anchorDate.getDate() - weekOffset * 7)
    const intervalStart = startOfWeek(anchorDate, weekOptionsMonday)
    const intervalEnd = endOfWeek(anchorDate, weekOptionsMonday)
    const durationSeconds = gymSessions
      .filter((session) =>
        isWithinInterval(parseISO(session.date), { start: intervalStart, end: intervalEnd }),
      )
      .reduce(
        (totalSeconds, session) => totalSeconds + getGymSessionTotalDurationSeconds(session),
        0,
      )
    points.push({
      name: format(intervalStart, DATE_FORMAT.CHART_WEEK_START),
      value: Math.round(durationSeconds),
    })
  }
  return points
}

export function buildMonthlyVolumeSeries(
  swimmingSessions: SwimmingTrainingSession[],
  monthsBack: number = dashboardMonthlyMonths,
  referenceDate: Date = new Date(),
): NamedChartPoint[] {
  const points: NamedChartPoint[] = []
  for (let monthOffset = monthsBack - 1; monthOffset >= 0; monthOffset--) {
    const anchorDate = new Date(referenceDate.getFullYear(), referenceDate.getMonth() - monthOffset, 1)
    const intervalStart = startOfMonth(anchorDate)
    const intervalEnd = endOfMonth(anchorDate)
    const distance = swimmingSessions
      .filter((session) =>
        isWithinInterval(parseISO(session.date), { start: intervalStart, end: intervalEnd }),
      )
      .reduce(
        (totalMeters, session) => totalMeters + getSwimmingSessionTotalDistanceMeters(session),
        0,
      )
    points.push({
      name: format(intervalStart, DATE_FORMAT.CHART_MONTH_SHORT),
      value: Math.round(distance),
    })
  }
  return points
}

export function buildMonthlyGymDurationSeries(
  gymSessions: GymTrainingSession[],
  monthsBack: number = dashboardMonthlyMonths,
  referenceDate: Date = new Date(),
): NamedChartPoint[] {
  const points: NamedChartPoint[] = []
  for (let monthOffset = monthsBack - 1; monthOffset >= 0; monthOffset--) {
    const anchorDate = new Date(referenceDate.getFullYear(), referenceDate.getMonth() - monthOffset, 1)
    const intervalStart = startOfMonth(anchorDate)
    const intervalEnd = endOfMonth(anchorDate)
    const durationSeconds = gymSessions
      .filter((session) =>
        isWithinInterval(parseISO(session.date), { start: intervalStart, end: intervalEnd }),
      )
      .reduce(
        (totalSeconds, session) => totalSeconds + getGymSessionTotalDurationSeconds(session),
        0,
      )
    points.push({
      name: format(intervalStart, DATE_FORMAT.CHART_MONTH_SHORT),
      value: Math.round(durationSeconds),
    })
  }
  return points
}

export function buildStrokeDistribution(swimmingSessions: SwimmingTrainingSession[]): StrokeSlice[] {
  const strokeTotals = new Map<Stroke, { count: number; distanceMeters: number }>()
  for (const session of swimmingSessions) {
    for (const block of session.blocks) {
      const blockMeters = calculateSwimmingBlockDistanceMeters(block)
      const running = strokeTotals.get(block.stroke) ?? { count: 0, distanceMeters: 0 }
      running.count += 1
      running.distanceMeters += blockMeters
      strokeTotals.set(block.stroke, running)
    }
  }
  return STROKE_ORDER.filter((stroke) => strokeTotals.has(stroke)).map((stroke) => {
    const totals = strokeTotals.get(stroke)!
    return {
      stroke,
      count: totals.count,
      distanceMeters: totals.distanceMeters,
    }
  })
}

export function buildPaceTrendSeries(swimmingSessions: SwimmingTrainingSession[]): TimeSeriesPoint[] {
  return [...swimmingSessions]
    .sort(
      (earlierSession, laterSession) =>
        parseISO(earlierSession.date).getTime() - parseISO(laterSession.date).getTime(),
    )
    .map((session) => ({
      date: session.date,
      value: getSwimmingSessionWeightedPacePer100Seconds(session),
    }))
}
