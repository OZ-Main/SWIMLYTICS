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
import { ISO_DATE_STRING_LENGTH } from '@/shared/constants/calendar.constants'
import { FORM_SYNC_KEY } from '@/shared/constants/formSync.constants'
import { personalBestDistancesForStroke } from '@/shared/constants/personalBestDistance.constants'
import {
  PERSONAL_BEST_FORM_DEFAULTS,
  PERSONAL_BEST_TIME,
} from '@/shared/constants/personalBestValidation.constants'
import { STROKE_LABELS, STROKE_ORDER } from '@/shared/constants/strokeLabels'
import { PersonalBestDistance, Stroke } from '@/shared/domain'
import type { PersonalBest } from '@/shared/types/domain.types'

import { personalBestToFormValues } from './PersonalBestForm.helpers'
import {
  type PersonalBestFormValues,
  parsePbDistance,
  personalBestFormSchema,
  personalBestFormToTimeSeconds,
} from './PersonalBestForm.validation'

type PersonalBestFormProps = {
  athleteId: string
  mode: 'create' | 'edit'
  initial?: PersonalBest | null
  onSubmit: (pb: PersonalBest) => void
  onCancel?: () => void
}

function defaultCreateValues(): PersonalBestFormValues {
  return {
    stroke: Stroke.Freestyle,
    distance: String(PersonalBestDistance.M100),
    timeMinutes: PERSONAL_BEST_FORM_DEFAULTS.TIME_MINUTES,
    timeSeconds: PERSONAL_BEST_FORM_DEFAULTS.TIME_SECONDS,
    date: new Date().toISOString().slice(0, ISO_DATE_STRING_LENGTH),
    notes: '',
  }
}

export default function PersonalBestForm({
  athleteId,
  mode,
  initial,
  onSubmit,
  onCancel,
}: PersonalBestFormProps) {
  const form = useForm<PersonalBestFormValues>({
    resolver: zodResolver(personalBestFormSchema),
    defaultValues: initial ? personalBestToFormValues(initial) : defaultCreateValues(),
  })

  const pbSyncKey = initial?.id ?? FORM_SYNC_KEY.NEW_ENTITY

  React.useEffect(() => {
    form.reset(initial ? personalBestToFormValues(initial) : defaultCreateValues())
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset when switching PB or create flow, not on object identity
  }, [pbSyncKey, form])

  const stroke = form.watch('stroke')

  React.useEffect(() => {
    const allowed = personalBestDistancesForStroke(stroke)
    const allowedStr = new Set(allowed.map(String))
    const current = form.getValues('distance')
    if (!allowedStr.has(current)) {
      form.setValue('distance', String(allowed[0]))
    }
  }, [stroke, form])

  function handleSubmit(values: PersonalBestFormValues) {
    const id = mode === 'edit' && initial ? initial.id : crypto.randomUUID()
    const timeSeconds = personalBestFormToTimeSeconds(values)
    onSubmit({
      id,
      athleteId,
      stroke: values.stroke,
      distance: parsePbDistance(values.distance),
      timeSeconds,
      date: values.date,
      notes: values.notes ?? '',
    })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="max-w-xl space-y-form"
        noValidate
        autoComplete="on"
      >
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
                  {STROKE_ORDER.map((strokeOption) => (
                    <SelectItem key={strokeOption} value={strokeOption}>
                      {STROKE_LABELS[strokeOption]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                IM lists only 100 m, 200 m, and 400 m — standard medley events.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="distance"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Distance</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Distance" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {personalBestDistancesForStroke(stroke).map((distanceMeters) => (
                    <SelectItem key={distanceMeters} value={String(distanceMeters)}>
                      {distanceMeters} m
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-form-field">
          <FormField
            control={form.control}
            name="timeMinutes"
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
            name="timeSeconds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Seconds</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    max={PERSONAL_BEST_TIME.MAX_SECONDS_FRACTION}
                    step={0.01}
                    {...field}
                  />
                </FormControl>
                <FormDescription>Decimal for hundredths (e.g. 26.85).</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea {...field} className="min-h-form-textarea resize-y" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-wrap gap-3 pt-2">
          <Button type="submit">
            {mode === 'create' ? 'Save personal best' : 'Update personal best'}
          </Button>
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
