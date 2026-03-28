import type { AthleteTrainingType, Stroke } from '@/shared/domain'
import { WORKOUT_FILTER_ALL } from '@/shared/constants/workoutFilter.constants'

export type StatisticsTrainingTypeFilter = 'all' | AthleteTrainingType

export type StatisticsStrokeFilter = typeof WORKOUT_FILTER_ALL | Stroke

export type StatisticsFilters = {
  dateFrom: string | null
  dateTo: string | null
  /** When set, only workouts for this athlete. */
  athleteId: string | null
  trainingType: StatisticsTrainingTypeFilter
  /** Swimming-only filter (ignored for gym rows). */
  stroke: StatisticsStrokeFilter
}
