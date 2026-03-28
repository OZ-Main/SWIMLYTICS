import { zodResolver } from '@hookform/resolvers/zod'
import * as React from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { computeAveragePacePer100 } from '@/features/workouts/helpers/pace.helpers'
import { ISO_DATE_STRING_LENGTH } from '@/shared/constants/calendar.constants'
import { EFFORT_LABELS, EFFORT_LEVEL_ORDER } from '@/shared/constants/effortLabels'
import { FORM_SYNC_KEY } from '@/shared/constants/formSync.constants'
import { STROKE_LABELS, STROKE_ORDER } from '@/shared/constants/strokeLabels'
import {
  WORKOUT_DISTANCE,
  WORKOUT_DURATION,
  WORKOUT_FORM_DEFAULTS,
} from '@/shared/constants/workoutValidation.constants'
import { EffortLevel, PoolLength, Stroke } from '@/shared/domain'
import { totalSecondsFromMinutesAndSeconds } from '@/shared/helpers/duration.helpers'
import { formatPacePer100 } from '@/shared/helpers/formatters'
import type { Workout } from '@/shared/types/domain.types'

import {
  buildWorkoutPayload,
  type WorkoutFormValues,
  workoutFormSchema,
  workoutToFormValues,
} from './WorkoutForm.validation'

type WorkoutFormProps = {
  mode: 'create' | 'edit'
  initialWorkout?: Workout | null
  onSubmit: (workout: Workout) => void
  onCancel?: () => void
}

function defaultCreateValues(): WorkoutFormValues {
  return {
    date: new Date().toISOString().slice(0, ISO_DATE_STRING_LENGTH),
    poolLength: PoolLength.Meters25,
    stroke: Stroke.Freestyle,
    distance: WORKOUT_FORM_DEFAULTS.DISTANCE_METERS,
    durationMinutes: WORKOUT_FORM_DEFAULTS.DURATION_MINUTES,
    durationSeconds: WORKOUT_FORM_DEFAULTS.DURATION_SECONDS,
    effortLevel: EffortLevel.Moderate,
    notes: '',
  }
}

export default function WorkoutForm({
  mode,
  initialWorkout,
  onSubmit,
  onCancel,
}: WorkoutFormProps) {
  const form = useForm<WorkoutFormValues>({
    resolver: zodResolver(workoutFormSchema),
    defaultValues: initialWorkout ? workoutToFormValues(initialWorkout) : defaultCreateValues(),
  })

  const workoutSyncKey = initialWorkout?.id ?? FORM_SYNC_KEY.NEW_ENTITY

  React.useEffect(() => {
    form.reset(initialWorkout ? workoutToFormValues(initialWorkout) : defaultCreateValues())
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset when switching workout or create/edit mode, not on store object identity
  }, [workoutSyncKey, form, mode])

  const watchedDistance = form.watch('distance')
  const watchedMin = form.watch('durationMinutes')
  const watchedSec = form.watch('durationSeconds')

  const previewPace = React.useMemo(() => {
    const d = Number(watchedDistance)
    const sec = totalSecondsFromMinutesAndSeconds(Number(watchedMin), Number(watchedSec))
    if (!Number.isFinite(d) || d <= 0 || sec <= 0) {
      return null
    }
    return computeAveragePacePer100(d, sec)
  }, [watchedDistance, watchedMin, watchedSec])

  function handleSubmit(values: WorkoutFormValues) {
    const id = mode === 'edit' && initialWorkout ? initialWorkout.id : crypto.randomUUID()
    const workout = buildWorkoutPayload(values, { id, poolLength: values.poolLength })
    onSubmit(workout)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="max-w-2xl space-y-form"
        noValidate
        autoComplete="on"
      >
        <div className="grid gap-form-field sm:grid-cols-2">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="poolLength"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pool length</FormLabel>
                <Select
                  onValueChange={(v) => field.onChange(Number(v))}
                  value={String(field.value)}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pool" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={String(PoolLength.Meters25)}>25 m</SelectItem>
                    <SelectItem value={String(PoolLength.Meters50)}>50 m</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>Short course or long course pool.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="stroke"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stroke</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Stroke" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {STROKE_ORDER.map((s) => (
                    <SelectItem key={s} value={s}>
                      {STROKE_LABELS[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-form-field sm:grid-cols-2">
          <FormField
            control={form.control}
            name="distance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Distance (m)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={WORKOUT_DISTANCE.MIN_METERS}
                    step={WORKOUT_DISTANCE.STEP_METERS}
                    {...field}
                  />
                </FormControl>
                <FormDescription>Total meters for this session.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-form-field">
            <FormField
              control={form.control}
              name="durationMinutes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minutes</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="durationSeconds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Seconds</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      max={WORKOUT_DURATION.MAX_SECONDS_COMPONENT}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {previewPace !== null ? (
          <p className="text-body-sm text-muted-foreground">
            Average pace:{' '}
            <span className="font-medium text-foreground">{formatPacePer100(previewPace)}</span>
          </p>
        ) : null}

        <FormField
          control={form.control}
          name="effortLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Effort</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Effort" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {EFFORT_LEVEL_ORDER.map((e) => (
                    <SelectItem key={e} value={e}>
                      {EFFORT_LABELS[e]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Sets, splits, how you felt…"
                  className="min-h-form-textarea resize-y"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-wrap gap-3 pt-2">
          <Button type="submit">{mode === 'create' ? 'Save workout' : 'Update workout'}</Button>
          {onCancel ? (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          ) : null}
        </div>
      </form>
    </Form>
  )
}
