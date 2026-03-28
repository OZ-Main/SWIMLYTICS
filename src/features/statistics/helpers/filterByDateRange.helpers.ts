import { isWithinInterval, parseISO } from 'date-fns'

import { swimmingSessionContainsStroke } from '@/features/sessions/helpers/sessionTotals.helpers'
import type { StatisticsFilters } from '@/features/statistics/types/statistics-filters.types'
import { WORKOUT_FILTER_ALL } from '@/shared/constants/workoutFilter.constants'
import { isSwimmingTrainingSession } from '@/shared/helpers/sessionType.helpers'
import type { TrainingSession } from '@/shared/types/domain.types'

export function filterTrainingSessionsForStatistics(
  sessions: TrainingSession[],
  filters: StatisticsFilters,
): TrainingSession[] {
  let matchingSessions = sessions

  if (filters.athleteId) {
    matchingSessions = matchingSessions.filter(
      (session) => session.athleteId === filters.athleteId,
    )
  }

  if (filters.trainingType !== 'all') {
    matchingSessions = matchingSessions.filter(
      (session) => session.trainingType === filters.trainingType,
    )
  }

  if (filters.stroke !== WORKOUT_FILTER_ALL) {
    const stroke = filters.stroke
    matchingSessions = matchingSessions.filter(
      (session) =>
        isSwimmingTrainingSession(session) && swimmingSessionContainsStroke(session, stroke),
    )
  }

  if (!filters.dateFrom && !filters.dateTo) {
    return matchingSessions
  }

  const rangeStart = filters.dateFrom ? parseISO(filters.dateFrom) : parseISO('1970-01-01')
  const rangeEnd = filters.dateTo ? parseISO(filters.dateTo) : new Date()
  return matchingSessions.filter((session) =>
    isWithinInterval(parseISO(session.date), { start: rangeStart, end: rangeEnd }),
  )
}
