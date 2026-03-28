import type { WorkoutFilters } from '@/features/workouts/types/workout-filters.types'
import { WORKOUT_FILTER_ALL } from '@/shared/constants/workoutFilter.constants'
import { WORKOUTS_SEARCH_PARAMS } from '@/shared/constants/workoutsUrlSearch.constants'
import { Stroke } from '@/shared/domain'

const STROKE_VALUES = new Set<string>(Object.values(Stroke))

export function workoutFiltersFromSearchParams(searchParams: URLSearchParams): WorkoutFilters {
  const strokeRaw = searchParams.get(WORKOUTS_SEARCH_PARAMS.stroke)
  const stroke =
    strokeRaw && STROKE_VALUES.has(strokeRaw) ? (strokeRaw as Stroke) : WORKOUT_FILTER_ALL

  const dateFromRaw = searchParams.get(WORKOUTS_SEARCH_PARAMS.dateFrom)
  const dateToRaw = searchParams.get(WORKOUTS_SEARCH_PARAMS.dateTo)

  return {
    dateFrom: dateFromRaw && dateFromRaw !== '' ? dateFromRaw : null,
    dateTo: dateToRaw && dateToRaw !== '' ? dateToRaw : null,
    stroke,
    effortLevel: WORKOUT_FILTER_ALL,
    search: '',
  }
}
