import { Stroke } from '@/shared/domain'
import { WORKOUT_FILTER_ALL } from '@/shared/constants/workoutFilter.constants'

export const STROKE_ORDER: Stroke[] = [
  Stroke.Freestyle,
  Stroke.Backstroke,
  Stroke.Breaststroke,
  Stroke.Butterfly,
  Stroke.Im,
  Stroke.Drill,
  Stroke.Kick,
]

export const STROKE_FILTER_OPTIONS: (Stroke | typeof WORKOUT_FILTER_ALL)[] = [
  WORKOUT_FILTER_ALL,
  ...STROKE_ORDER,
]

export const STROKE_LABELS: Record<Stroke, string> = {
  [Stroke.Freestyle]: 'Freestyle',
  [Stroke.Backstroke]: 'Backstroke',
  [Stroke.Breaststroke]: 'Breaststroke',
  [Stroke.Butterfly]: 'Butterfly',
  [Stroke.Im]: 'Individual medley',
  [Stroke.Drill]: 'Drill',
  [Stroke.Kick]: 'Kick',
}

export const STROKE_TAILWIND_COLOR: Record<Stroke, string> = {
  [Stroke.Freestyle]: 'stroke-freestyle',
  [Stroke.Backstroke]: 'stroke-backstroke',
  [Stroke.Breaststroke]: 'stroke-breaststroke',
  [Stroke.Butterfly]: 'stroke-butterfly',
  [Stroke.Im]: 'stroke-im',
  [Stroke.Drill]: 'stroke-drill',
  [Stroke.Kick]: 'stroke-kick',
}
