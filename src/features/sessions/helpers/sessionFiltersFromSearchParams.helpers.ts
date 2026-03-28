import type { SessionListFilters } from '@/features/sessions/types/session-filters.types'
import { WORKOUT_FILTER_ALL } from '@/shared/constants/workoutFilter.constants'
import { SESSIONS_SEARCH_PARAMS } from '@/shared/constants/sessionsUrlSearch.constants'
import { Stroke } from '@/shared/domain'

const STROKE_VALUES = new Set<string>(Object.values(Stroke))

export function sessionListFiltersFromSearchParams(
  searchParams: URLSearchParams,
): SessionListFilters {
  const strokeFromQuery = searchParams.get(SESSIONS_SEARCH_PARAMS.stroke)
  const strokeFilter =
    strokeFromQuery && STROKE_VALUES.has(strokeFromQuery)
      ? (strokeFromQuery as Stroke)
      : WORKOUT_FILTER_ALL

  const dateFromRaw = searchParams.get(SESSIONS_SEARCH_PARAMS.dateFrom)
  const dateToRaw = searchParams.get(SESSIONS_SEARCH_PARAMS.dateTo)

  return {
    dateFrom: dateFromRaw && dateFromRaw !== '' ? dateFromRaw : null,
    dateTo: dateToRaw && dateToRaw !== '' ? dateToRaw : null,
    stroke: strokeFilter,
    effortLevel: WORKOUT_FILTER_ALL,
    search: '',
  }
}
