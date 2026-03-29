import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { useWorkoutTemplateStore } from '@/app/store/workoutTemplateStore'
import PageHeader from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import SessionBuilder from '@/features/sessions/components/SessionBuilder'
import {
  buildGymWorkoutTemplateFromSessionDraft,
  buildSwimmingWorkoutTemplateFromSessionDraft,
  createTrainingSessionDraftForWorkoutTemplate,
} from '@/features/workout-templates/helpers/workoutTemplateSessionDraft.helpers'
import { validateWorkoutTemplateForPersistence } from '@/features/workout-templates/helpers/workoutTemplatePersistenceValidation.helpers'
import { parseWorkoutTemplateTagsInput } from '@/features/workout-templates/helpers/workoutTemplateTagsInput.helpers'
import { coachFirestoreErrorMessage } from '@/lib/firebase/coachFirestoreErrorMessage.helpers'
import { ATHLETE_TRAINING_TYPE_LABELS } from '@/shared/constants/athleteTrainingTypeLabels'
import { APP_ROUTE } from '@/shared/constants/routes.constants'
import { WORKOUT_TEMPLATE_FIELD_LIMITS } from '@/shared/constants/sessionPersistenceValidation.constants'
import { WORKOUT_TEMPLATE_SESSION_BUILDER_LABELS } from '@/shared/constants/workoutTemplateEditor.constants'
import { AthleteTrainingType, PoolLength } from '@/shared/domain'
import type { GymTrainingSession, TrainingSession } from '@/shared/types/domain.types'

export default function WorkoutTemplateNewPage() {
  const navigate = useNavigate()
  const addWorkoutTemplate = useWorkoutTemplateStore(
    (workoutTemplateStore) => workoutTemplateStore.addWorkoutTemplate,
  )

  const [editorTrainingType, setEditorTrainingType] = useState(AthleteTrainingType.Swimming)
  const [defaultPoolLength, setDefaultPoolLength] = useState(PoolLength.Meters25)
  const [draftSession, setDraftSession] = useState<TrainingSession>(() =>
    createTrainingSessionDraftForWorkoutTemplate(AthleteTrainingType.Swimming, PoolLength.Meters25),
  )
  const [targetGroup, setTargetGroup] = useState('')
  const [tagsInput, setTagsInput] = useState('')

  useEffect(() => {
    setDraftSession(
      createTrainingSessionDraftForWorkoutTemplate(editorTrainingType, defaultPoolLength),
    )
    // defaultPoolLength is applied when switching to swimming via the pool-length effect below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorTrainingType])

  useEffect(() => {
    if (editorTrainingType !== AthleteTrainingType.Swimming) {
      return
    }

    setDraftSession((current) => {
      if (!current || current.trainingType !== AthleteTrainingType.Swimming) {
        return current
      }

      return { ...current, defaultPoolLength }
    })
  }, [defaultPoolLength, editorTrainingType])

  async function handleSave() {
    const now = new Date().toISOString()
    const templateId = crypto.randomUUID()
    const tags = parseWorkoutTemplateTagsInput(tagsInput)

    const template =
      draftSession.trainingType === AthleteTrainingType.Swimming
        ? buildSwimmingWorkoutTemplateFromSessionDraft(draftSession, {
            id: templateId,
            targetGroup,
            tags,
            createdAt: now,
            updatedAt: now,
          })
        : buildGymWorkoutTemplateFromSessionDraft(draftSession as GymTrainingSession, {
            id: templateId,
            targetGroup,
            tags,
            createdAt: now,
            updatedAt: now,
          })

    const validation = validateWorkoutTemplateForPersistence(template)
    if (!validation.ok) {
      toast.error(validation.message)
      return
    }

    try {
      await addWorkoutTemplate(template)
      toast.success('Template saved')
      navigate(APP_ROUTE.workoutTemplates)
    } catch (error) {
      toast.error(coachFirestoreErrorMessage(error, 'Could not save template.'))
    }
  }

  return (
    <div className="page-stack">
      <PageHeader
        title="New workout template"
        description="Define structure once. You will pick athletes and a date when you bulk-assign."
        actions={
          <Button type="button" variant="outline" onClick={() => navigate(APP_ROUTE.workoutTemplates)}>
            Back to templates
          </Button>
        }
      />

      <div className="grid gap-stack rounded-xl border border-border/60 bg-card/30 p-card lg:grid-cols-2">
        <div className="space-y-form">
          <div className="space-y-tight">
            <Label htmlFor="template-training-type">Training type</Label>
            <Select
              value={editorTrainingType}
              onValueChange={(value) => setEditorTrainingType(value as AthleteTrainingType)}
            >
              <SelectTrigger id="template-training-type">
                <SelectValue />
              </SelectTrigger>
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
          </div>

          {editorTrainingType === AthleteTrainingType.Swimming ? (
            <div className="space-y-tight">
              <Label htmlFor="template-default-pool">Default pool length</Label>
              <Select
                value={String(defaultPoolLength)}
                onValueChange={(value) => setDefaultPoolLength(Number(value) as PoolLength)}
              >
                <SelectTrigger id="template-default-pool">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={String(PoolLength.Meters25)}>25 m</SelectItem>
                  <SelectItem value={String(PoolLength.Meters50)}>50 m</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ) : null}

          <div className="space-y-tight">
            <Label htmlFor="template-target-group">Target group (optional)</Label>
            <Input
              id="template-target-group"
              value={targetGroup}
              maxLength={WORKOUT_TEMPLATE_FIELD_LIMITS.TARGET_GROUP_MAX_LENGTH}
              onChange={(changeEvent) => setTargetGroup(changeEvent.target.value)}
              placeholder="Who this plan is aimed at"
            />
          </div>

          <div className="space-y-tight">
            <Label htmlFor="template-tags">Tags (optional)</Label>
            <Input
              id="template-tags"
              value={tagsInput}
              onChange={(changeEvent) => setTagsInput(changeEvent.target.value)}
              placeholder="Comma-separated labels"
            />
          </div>
        </div>
      </div>

      <SessionBuilder
        session={draftSession}
        onChange={setDraftSession}
        hideDateField
        sessionDetailsHeading={WORKOUT_TEMPLATE_SESSION_BUILDER_LABELS.sessionDetailsHeading}
        sessionTitleLabel={WORKOUT_TEMPLATE_SESSION_BUILDER_LABELS.sessionTitleLabel}
        sessionNotesLabel={WORKOUT_TEMPLATE_SESSION_BUILDER_LABELS.sessionNotesLabel}
      />

      <div className="form-footer-actions">
        <Button type="button" variant="outline" onClick={() => navigate(-1)}>
          Cancel
        </Button>
        <Button type="button" onClick={handleSave}>
          Save template
        </Button>
      </div>
    </div>
  )
}
