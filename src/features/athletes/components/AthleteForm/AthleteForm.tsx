import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
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
import { ATHLETE_GROUP_MAX_LENGTH } from '@/shared/constants/athleteGroup.constants'
import { ATHLETE_TRAINING_TYPE_LABELS } from '@/shared/constants/athleteTrainingTypeLabels'
import { FORM_SYNC_KEY } from '@/shared/constants/formSync.constants'
import { AthleteTrainingType } from '@/shared/domain'
import type { Athlete } from '@/shared/types/domain.types'

const athleteFormSchema = z.object({
  fullName: z.string().min(1, 'Name is required').max(120),
  trainingType: z.nativeEnum(AthleteTrainingType),
  group: z.string().max(ATHLETE_GROUP_MAX_LENGTH).optional().default(''),
  notes: z.string().max(2000).optional().default(''),
})

export type AthleteFormValues = z.infer<typeof athleteFormSchema>

type AthleteFormProps = {
  mode: 'create' | 'edit'
  initial?: Athlete | null
  onSubmit: (athlete: Athlete) => void
  onCancel?: () => void
}

function defaultCreate(): AthleteFormValues {
  return {
    fullName: '',
    trainingType: AthleteTrainingType.Swimming,
    group: '',
    notes: '',
  }
}

function athleteToValues(a: Athlete): AthleteFormValues {
  return {
    fullName: a.fullName,
    trainingType: a.trainingType,
    group: a.group,
    notes: a.notes,
  }
}

export default function AthleteForm({ mode, initial, onSubmit, onCancel }: AthleteFormProps) {
  const form = useForm<AthleteFormValues>({
    resolver: zodResolver(athleteFormSchema),
    defaultValues: initial ? athleteToValues(initial) : defaultCreate(),
  })

  const syncKey = initial?.id ?? FORM_SYNC_KEY.NEW_ENTITY

  useEffect(() => {
    form.reset(initial ? athleteToValues(initial) : defaultCreate())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [syncKey, form, mode])

  function handleSubmit(values: AthleteFormValues) {
    const id = mode === 'edit' && initial ? initial.id : crypto.randomUUID()
    const createdAt = mode === 'edit' && initial ? initial.createdAt : new Date().toISOString()
    onSubmit({
      id,
      fullName: values.fullName.trim(),
      trainingType: values.trainingType,
      group: values.group?.trim() ?? '',
      notes: values.notes?.trim() ?? '',
      createdAt,
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="max-w-xl space-y-form" noValidate>
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full name</FormLabel>
              <FormControl>
                <Input placeholder="Athlete name" autoComplete="name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="trainingType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Training type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {(Object.values(AthleteTrainingType) as AthleteTrainingType[]).map(
                    (trainingTypeOption) => (
                      <SelectItem key={trainingTypeOption} value={trainingTypeOption}>
                        {ATHLETE_TRAINING_TYPE_LABELS[trainingTypeOption]}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="group"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Group</FormLabel>
              <FormControl>
                <Input
                  placeholder="Squad, lane group, rehab track…"
                  maxLength={ATHLETE_GROUP_MAX_LENGTH}
                  {...field}
                />
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
              <FormLabel>Training notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Goals, limitations, periodization notes…"
                  className="min-h-form-textarea resize-y"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-wrap gap-3 pt-2">
          <Button type="submit">{mode === 'create' ? 'Create athlete' : 'Save changes'}</Button>
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
