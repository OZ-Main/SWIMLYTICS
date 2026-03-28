import { z } from 'zod'

import { EffortLevel, PoolLength, Stroke } from '@/shared/domain'
import { TIME } from '@/shared/constants/time.constants'
import {
  WORKOUT_DISTANCE,
  WORKOUT_DURATION,
  WORKOUT_NOTES,
  WORKOUT_PACE,
} from '@/shared/constants/workoutValidation.constants'
import type { PoolLength as PoolLengthT, Workout } from '@/shared/types/domain.types'
import { totalSecondsFromMinutesAndSeconds } from '@/shared/helpers/duration.helpers'

export const workoutFormSchema = z
  .object({
    date: z.string().min(1, 'Date is required'),
    poolLength: z.coerce.number().pipe(z.nativeEnum(PoolLength)),
    stroke: z.nativeEnum(Stroke),
    distance: z.coerce
      .number()
      .min(WORKOUT_DISTANCE.MIN_METERS, 'Distance must be at least 25 m')
      .max(WORKOUT_DISTANCE.MAX_METERS, 'Distance looks unrealistic'),
    durationMinutes: z.coerce
      .number()
      .min(0, 'Minutes cannot be negative')
      .max(WORKOUT_DURATION.MAX_MINUTES, 'Duration looks unrealistic'),
    durationSeconds: z.coerce
      .number()
      .min(0, 'Seconds cannot be negative')
      .max(WORKOUT_DURATION.MAX_SECONDS_COMPONENT, 'Seconds must be 0–59'),
    effortLevel: z.nativeEnum(EffortLevel),
    notes: z.string().max(WORKOUT_NOTES.MAX_LENGTH, 'Notes are too long').optional().default(''),
  })
  .superRefine((data, ctx) => {
    const totalSec = totalSecondsFromMinutesAndSeconds(data.durationMinutes, data.durationSeconds)
    if (totalSec <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Duration must be greater than zero',
        path: ['durationMinutes'],
      })
    }
    if (data.distance > 0 && totalSec > 0) {
      const pace = (totalSec / data.distance) * 100
      if (pace < WORKOUT_PACE.MIN_SEC_PER_100M) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Pace is extremely fast — check distance and duration',
          path: ['distance'],
        })
      }
      if (pace > WORKOUT_PACE.MAX_SEC_PER_100M) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Pace is very slow — check inputs',
          path: ['durationMinutes'],
        })
      }
    }
  })

export type WorkoutFormValues = z.infer<typeof workoutFormSchema>

export function workoutFormValuesToDurationSeconds(values: WorkoutFormValues): number {
  return totalSecondsFromMinutesAndSeconds(values.durationMinutes, values.durationSeconds)
}

export function buildWorkoutPayload(
  values: WorkoutFormValues,
  opts: { id: string; poolLength: PoolLengthT },
): Workout {
  const duration = workoutFormValuesToDurationSeconds(values)
  const pace = duration > 0 && values.distance > 0 ? (duration / values.distance) * 100 : 0
  return {
    id: opts.id,
    date: values.date,
    poolLength: opts.poolLength,
    stroke: values.stroke,
    distance: values.distance,
    duration,
    averagePacePer100: pace,
    effortLevel: values.effortLevel,
    notes: values.notes ?? '',
  }
}

export function workoutToFormValues(w: Workout): WorkoutFormValues {
  const mins = Math.floor(w.duration / TIME.SECONDS_PER_MINUTE)
  const secs = w.duration % TIME.SECONDS_PER_MINUTE
  return {
    date: w.date,
    poolLength: w.poolLength,
    stroke: w.stroke,
    distance: w.distance,
    durationMinutes: mins,
    durationSeconds: secs,
    effortLevel: w.effortLevel,
    notes: w.notes,
  }
}
