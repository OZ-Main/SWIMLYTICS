import type { StatisticsFilters } from '@/features/statistics/types/statistics-filters.types'
import { STATISTICS_SEARCH_PARAMS } from '@/shared/constants/statisticsUrlSearch.constants'
import { WORKOUT_FILTER_ALL } from '@/shared/constants/workoutFilter.constants'
import { AthleteTrainingType, Stroke } from '@/shared/domain'

const STROKES = new Set<string>(Object.values(Stroke))

export function statisticsFiltersFromSearchParams(params: URLSearchParams): StatisticsFilters {
  const trainingTypeParam = params.get(STATISTICS_SEARCH_PARAMS.trainingType)
  const trainingType: StatisticsFilters['trainingType'] =
    trainingTypeParam === AthleteTrainingType.Swimming ||
    trainingTypeParam === AthleteTrainingType.Gym
      ? trainingTypeParam
      : 'all'

  const strokeFromQuery = params.get(STATISTICS_SEARCH_PARAMS.stroke)
  const strokeFilter =
    strokeFromQuery && STROKES.has(strokeFromQuery)
      ? (strokeFromQuery as Stroke)
      : WORKOUT_FILTER_ALL

  return {
    dateFrom: params.get(STATISTICS_SEARCH_PARAMS.dateFrom) || null,
    dateTo: params.get(STATISTICS_SEARCH_PARAMS.dateTo) || null,
    athleteId: params.get(STATISTICS_SEARCH_PARAMS.athleteId) || null,
    trainingType,
    stroke: strokeFilter,
  }
}
