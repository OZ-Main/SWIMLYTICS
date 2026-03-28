import { format, parse, parseISO, startOfWeek } from 'date-fns'

import { calculateSwimmingBlockDistanceMeters } from '@/features/sessions/helpers/sessionBlockDistance.helpers'
import {
  getGymSessionTotalDurationSeconds,
  getSwimmingSessionTotalDistanceMeters,
  getSwimmingSessionTotalDurationSeconds,
  getSwimmingSessionWeightedPacePer100Seconds,
} from '@/features/sessions/helpers/sessionTotals.helpers'
import { CALENDAR_MONTH_PAD, weekOptionsMonday } from '@/shared/constants/calendar.constants'
import { STATISTICS_AGGREGATE } from '@/shared/constants/chartRanges.constants'
import { DATE_FORMAT } from '@/shared/constants/dateDisplay.constants'
import {
  filterGymTrainingSessions,
  filterSwimmingTrainingSessions,
} from '@/shared/helpers/sessionType.helpers'
import type { Stroke } from '@/shared/domain'
import type {
  GymTrainingSession,
  SwimmingTrainingSession,
  TrainingSession,
} from '@/shared/types/domain.types'

export type SwimmingStatisticsAggregate = {
  sessionCount: number
  totalDistanceMeters: number
  totalDurationSeconds: number
  averageDistanceMeters: number
  averageDurationSeconds: number
  bestPacePer100: number | null
  longestSwimmingSession: SwimmingTrainingSession | null
  mostFrequentStroke: Stroke | null
  weeklyTotalsMeters: { weekLabel: string; meters: number }[]
  monthlyTotalsMeters: { monthLabel: string; meters: number }[]
}

export type GymStatisticsAggregate = {
  sessionCount: number
  totalDurationSeconds: number
  averageDurationSeconds: number
  longestGymSession: GymTrainingSession | null
  weeklyTotalsSeconds: { weekLabel: string; seconds: number }[]
  monthlyTotalsSeconds: { monthLabel: string; seconds: number }[]
}

function resolveMostFrequentStrokeByBlockDistance(
  swimmingSessions: SwimmingTrainingSession[],
): Stroke | null {
  if (swimmingSessions.length === 0) {
    return null
  }
  const distanceByStroke = new Map<Stroke, number>()
  for (const session of swimmingSessions) {
    for (const block of session.blocks) {
      const blockMeters = calculateSwimmingBlockDistanceMeters(block)
      distanceByStroke.set(block.stroke, (distanceByStroke.get(block.stroke) ?? 0) + blockMeters)
    }
  }
  let winningStroke: Stroke | null = null
  let highestMeters = 0
  for (const [stroke, meters] of distanceByStroke) {
    if (meters > highestMeters) {
      highestMeters = meters
      winningStroke = stroke
    }
  }
  return winningStroke
}

function formatMonthBucketLabel(monthKey: string): string {
  const [yearPart, monthPart] = monthKey.split('-')
  if (!yearPart || !monthPart) {
    return monthKey
  }
  const monthDate = new Date(Number(yearPart), Number(monthPart) - 1, 1)
  return format(monthDate, DATE_FORMAT.STATS_MONTH_LABEL)
}

export function buildSwimmingStatisticsAggregate(
  swimmingSessions: SwimmingTrainingSession[],
): SwimmingStatisticsAggregate {
  const sessionCount = swimmingSessions.length
  if (sessionCount === 0) {
    return {
      sessionCount: 0,
      totalDistanceMeters: 0,
      totalDurationSeconds: 0,
      averageDistanceMeters: 0,
      averageDurationSeconds: 0,
      bestPacePer100: null,
      longestSwimmingSession: null,
      mostFrequentStroke: null,
      weeklyTotalsMeters: [],
      monthlyTotalsMeters: [],
    }
  }

  const totalDistanceMeters = swimmingSessions.reduce(
    (totalMeters, session) => totalMeters + getSwimmingSessionTotalDistanceMeters(session),
    0,
  )
  const totalDurationSeconds = swimmingSessions.reduce(
    (totalSeconds, session) => totalSeconds + getSwimmingSessionTotalDurationSeconds(session),
    0,
  )
  const positivePaces = swimmingSessions
    .map((session) => getSwimmingSessionWeightedPacePer100Seconds(session))
    .filter((paceSeconds) => paceSeconds > 0)
  const bestPacePer100 = positivePaces.length > 0 ? Math.min(...positivePaces) : null

  let longestSwimmingSession: SwimmingTrainingSession | null = null
  let longestDistanceMeters = 0
  for (const session of swimmingSessions) {
    const sessionMeters = getSwimmingSessionTotalDistanceMeters(session)
    if (!longestSwimmingSession || sessionMeters > longestDistanceMeters) {
      longestDistanceMeters = sessionMeters
      longestSwimmingSession = session
    }
  }

  const distanceByWeekKey = new Map<string, number>()
  const distanceByMonthKey = new Map<string, number>()
  for (const session of swimmingSessions) {
    const sessionDate = parseISO(session.date)
    const sessionMeters = getSwimmingSessionTotalDistanceMeters(session)
    const weekStart = startOfWeek(sessionDate, weekOptionsMonday)
    const weekBucketKey = format(weekStart, DATE_FORMAT.STATS_WEEK_BUCKET_KEY)
    distanceByWeekKey.set(weekBucketKey, (distanceByWeekKey.get(weekBucketKey) ?? 0) + sessionMeters)
    const monthBucketKey = `${sessionDate.getFullYear()}-${String(sessionDate.getMonth() + 1).padStart(CALENDAR_MONTH_PAD, '0')}`
    distanceByMonthKey.set(
      monthBucketKey,
      (distanceByMonthKey.get(monthBucketKey) ?? 0) + sessionMeters,
    )
  }

  const weeklyTotalsMeters = [...distanceByWeekKey.entries()]
    .sort(([leftWeekKey], [rightWeekKey]) => leftWeekKey.localeCompare(rightWeekKey))
    .slice(-STATISTICS_AGGREGATE.WEEKLY_BUCKETS_SHOWN)
    .map(([weekBucketKey, meters]) => ({
      weekLabel: format(
        parse(weekBucketKey, DATE_FORMAT.STATS_WEEK_BUCKET_KEY, new Date()),
        DATE_FORMAT.STATS_WEEK_LABEL,
      ),
      meters: Math.round(meters),
    }))

  const monthlyTotalsMeters = [...distanceByMonthKey.entries()]
    .sort(([leftMonthKey], [rightMonthKey]) => leftMonthKey.localeCompare(rightMonthKey))
    .slice(-STATISTICS_AGGREGATE.MONTHLY_BUCKETS_SHOWN)
    .map(([monthBucketKey, meters]) => ({
      monthLabel: formatMonthBucketLabel(monthBucketKey),
      meters: Math.round(meters),
    }))

  return {
    sessionCount,
    totalDistanceMeters,
    totalDurationSeconds,
    averageDistanceMeters: totalDistanceMeters / sessionCount,
    averageDurationSeconds: totalDurationSeconds / sessionCount,
    bestPacePer100,
    longestSwimmingSession,
    mostFrequentStroke: resolveMostFrequentStrokeByBlockDistance(swimmingSessions),
    weeklyTotalsMeters,
    monthlyTotalsMeters,
  }
}

export function buildGymStatisticsAggregate(
  gymSessions: GymTrainingSession[],
): GymStatisticsAggregate {
  const sessionCount = gymSessions.length
  if (sessionCount === 0) {
    return {
      sessionCount: 0,
      totalDurationSeconds: 0,
      averageDurationSeconds: 0,
      longestGymSession: null,
      weeklyTotalsSeconds: [],
      monthlyTotalsSeconds: [],
    }
  }

  const totalDurationSeconds = gymSessions.reduce(
    (totalSeconds, session) => totalSeconds + getGymSessionTotalDurationSeconds(session),
    0,
  )

  let longestGymSession: GymTrainingSession | null = null
  let longestSeconds = 0
  for (const session of gymSessions) {
    const sessionSeconds = getGymSessionTotalDurationSeconds(session)
    if (!longestGymSession || sessionSeconds > longestSeconds) {
      longestSeconds = sessionSeconds
      longestGymSession = session
    }
  }

  const secondsByWeekKey = new Map<string, number>()
  const secondsByMonthKey = new Map<string, number>()
  for (const session of gymSessions) {
    const sessionDate = parseISO(session.date)
    const sessionSeconds = getGymSessionTotalDurationSeconds(session)
    const weekStart = startOfWeek(sessionDate, weekOptionsMonday)
    const weekBucketKey = format(weekStart, DATE_FORMAT.STATS_WEEK_BUCKET_KEY)
    secondsByWeekKey.set(
      weekBucketKey,
      (secondsByWeekKey.get(weekBucketKey) ?? 0) + sessionSeconds,
    )
    const monthBucketKey = `${sessionDate.getFullYear()}-${String(sessionDate.getMonth() + 1).padStart(CALENDAR_MONTH_PAD, '0')}`
    secondsByMonthKey.set(
      monthBucketKey,
      (secondsByMonthKey.get(monthBucketKey) ?? 0) + sessionSeconds,
    )
  }

  const weeklyTotalsSeconds = [...secondsByWeekKey.entries()]
    .sort(([leftWeekKey], [rightWeekKey]) => leftWeekKey.localeCompare(rightWeekKey))
    .slice(-STATISTICS_AGGREGATE.WEEKLY_BUCKETS_SHOWN)
    .map(([weekBucketKey, seconds]) => ({
      weekLabel: format(
        parse(weekBucketKey, DATE_FORMAT.STATS_WEEK_BUCKET_KEY, new Date()),
        DATE_FORMAT.STATS_WEEK_LABEL,
      ),
      seconds: Math.round(seconds),
    }))

  const monthlyTotalsSeconds = [...secondsByMonthKey.entries()]
    .sort(([leftMonthKey], [rightMonthKey]) => leftMonthKey.localeCompare(rightMonthKey))
    .slice(-STATISTICS_AGGREGATE.MONTHLY_BUCKETS_SHOWN)
    .map(([monthBucketKey, seconds]) => ({
      monthLabel: formatMonthBucketLabel(monthBucketKey),
      seconds: Math.round(seconds),
    }))

  return {
    sessionCount,
    totalDurationSeconds,
    averageDurationSeconds: totalDurationSeconds / sessionCount,
    longestGymSession,
    weeklyTotalsSeconds,
    monthlyTotalsSeconds,
  }
}

export function splitTrainingSessionsByModality(sessions: TrainingSession[]): {
  swimming: SwimmingTrainingSession[]
  gym: GymTrainingSession[]
} {
  return {
    swimming: filterSwimmingTrainingSessions(sessions),
    gym: filterGymTrainingSessions(sessions),
  }
}
