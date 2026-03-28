import { WORKOUT_FILTER_ALL } from '@/shared/constants/workoutFilter.constants'
import type { EffortLevel, Stroke } from '@/shared/domain'

export type WorkoutFilters = {
  dateFrom: string | null
  dateTo: string | null
  stroke: Stroke | typeof WORKOUT_FILTER_ALL
  effortLevel: EffortLevel | typeof WORKOUT_FILTER_ALL
  search: string
}
