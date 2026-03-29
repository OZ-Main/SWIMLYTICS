import { WORKOUT_FILTER_ALL } from '@/shared/constants/workoutFilter.constants'
import type { AthleteTrainingType, Stroke } from '@/shared/domain'

export type StatisticsTrainingTypeFilter = 'all' | AthleteTrainingType

export type StatisticsStrokeFilter = typeof WORKOUT_FILTER_ALL | Stroke

export type StatisticsFilters = {
  dateFrom: string | null
  dateTo: string | null
  athleteId: string | null
  trainingType: StatisticsTrainingTypeFilter
  stroke: StatisticsStrokeFilter
}
