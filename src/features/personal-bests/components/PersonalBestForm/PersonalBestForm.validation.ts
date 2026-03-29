import { z } from 'zod'

import { personalBestDistanceFormValuesForStroke } from '@/shared/constants/personalBestDistance.constants'
import {
  PERSONAL_BEST_NOTES,
  PERSONAL_BEST_TIME,
} from '@/shared/constants/personalBestValidation.constants'
import { PersonalBestDistance, Stroke } from '@/shared/domain'
import { totalSecondsFromMinutesAndSeconds } from '@/shared/helpers/duration.helpers'

export const personalBestFormSchema = z
  .object({
    stroke: z.nativeEnum(Stroke),
    distance: z.string().min(1, 'Distance is required'),
    timeMinutes: z.coerce.number().min(0).max(PERSONAL_BEST_TIME.MAX_MINUTES),
    timeSeconds: z.coerce
      .number()
      .min(0)
      .max(
        PERSONAL_BEST_TIME.MAX_SECONDS_FRACTION,
        'Seconds must be below 60; add minutes for longer times',
      ),
    date: z.string().min(1, 'Date is required'),
    notes: z.string().max(PERSONAL_BEST_NOTES.MAX_LENGTH).optional().default(''),
  })
  .superRefine((data, ctx) => {
    const allowed = new Set(personalBestDistanceFormValuesForStroke(data.stroke))
    if (!allowed.has(data.distance)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          data.stroke === Stroke.Im
            ? 'IM events are 100 m, 200 m, or 400 m only'
            : 'Pick a valid distance for this stroke',
        path: ['distance'],
      })
    }

    const total = totalSecondsFromMinutesAndSeconds(data.timeMinutes, data.timeSeconds)
    if (total <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Time must be greater than zero',
        path: ['timeSeconds'],
      })
    }
  })

export type PersonalBestFormValues = z.infer<typeof personalBestFormSchema>

export function personalBestFormToTimeSeconds(values: PersonalBestFormValues): number {
  return totalSecondsFromMinutesAndSeconds(values.timeMinutes, values.timeSeconds)
}

const PB_DISTANCE_NUMBERS = new Set(
  Object.values(PersonalBestDistance).filter((v): v is number => typeof v === 'number'),
)

export function parsePbDistance(value: PersonalBestFormValues['distance']): PersonalBestDistance {
  const n = Number(value)
  if (!PB_DISTANCE_NUMBERS.has(n)) {
    throw new Error('Invalid personal best distance')
  }

  return n as PersonalBestDistance
}
