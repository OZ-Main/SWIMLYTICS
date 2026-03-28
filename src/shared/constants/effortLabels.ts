import { EffortLevel } from '@/shared/domain'
import { WORKOUT_FILTER_ALL } from '@/shared/constants/workoutFilter.constants'

export const EFFORT_LABELS: Record<EffortLevel, string> = {
  [EffortLevel.Easy]: 'Easy',
  [EffortLevel.Moderate]: 'Moderate',
  [EffortLevel.Hard]: 'Hard',
  [EffortLevel.Race]: 'Race pace',
}

export const EFFORT_OPTIONS: (EffortLevel | typeof WORKOUT_FILTER_ALL)[] = [
  WORKOUT_FILTER_ALL,
  EffortLevel.Easy,
  EffortLevel.Moderate,
  EffortLevel.Hard,
  EffortLevel.Race,
]

/** Form / display order (excludes filter sentinel). */
export const EFFORT_LEVEL_ORDER: EffortLevel[] = [
  EffortLevel.Easy,
  EffortLevel.Moderate,
  EffortLevel.Hard,
  EffortLevel.Race,
]
