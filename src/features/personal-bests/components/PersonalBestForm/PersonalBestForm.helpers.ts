import { TIME } from '@/shared/constants/time.constants'
import { Stroke } from '@/shared/domain'
import type { PersonalBest } from '@/shared/types/domain.types'

import type { PersonalBestFormValues } from './PersonalBestForm.validation'

export function personalBestToFormValues(pb: PersonalBest): PersonalBestFormValues {
  const mins = Math.floor(pb.timeSeconds / TIME.SECONDS_PER_MINUTE)
  const secs = pb.timeSeconds - mins * TIME.SECONDS_PER_MINUTE
  return {
    stroke: pb.stroke ?? Stroke.Freestyle,
    distance: String(pb.distance),
    timeMinutes: mins,
    timeSeconds: Number(secs.toFixed(2)),
    date: pb.date,
    notes: pb.notes,
  }
}
