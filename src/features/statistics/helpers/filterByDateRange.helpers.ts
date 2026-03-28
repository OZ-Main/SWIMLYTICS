import { isWithinInterval, parseISO } from 'date-fns'

import type { StatisticsFilters } from '@/features/statistics/types/statistics-filters.types'
import type { Workout } from '@/shared/types/domain.types'

export function filterWorkoutsForStatistics(
  workouts: Workout[],
  filters: StatisticsFilters,
): Workout[] {
  if (!filters.dateFrom && !filters.dateTo) {
    return workouts
  }
  const start = filters.dateFrom ? parseISO(filters.dateFrom) : parseISO('1970-01-01')
  const end = filters.dateTo ? parseISO(filters.dateTo) : new Date()
  return workouts.filter((w) => isWithinInterval(parseISO(w.date), { start, end }))
}
