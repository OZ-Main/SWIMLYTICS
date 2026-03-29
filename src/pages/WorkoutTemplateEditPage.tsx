import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'

import { useWorkoutTemplateStore } from '@/app/store/workoutTemplateStore'
import PageHeader from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import SessionBuilder from '@/features/sessions/components/SessionBuilder'
import { coachFirestoreErrorMessage } from '@/lib/firebase/coachFirestoreErrorMessage.helpers'
import {
  buildGymWorkoutTemplateFromSessionDraft,
  buildSwimmingWorkoutTemplateFromSessionDraft,
  workoutTemplateToStubTrainingSession,
} from '@/features/workout-templates/helpers/workoutTemplateSessionDraft.helpers'
import { validateWorkoutTemplateForPersistence } from '@/features/workout-templates/helpers/workoutTemplatePersistenceValidation.helpers'
import {
  formatWorkoutTemplateTagsForInput,
  parseWorkoutTemplateTagsInput,
} from '@/features/workout-templates/helpers/workoutTemplateTagsInput.helpers'
import { ATHLETE_TRAINING_TYPE_LABELS } from '@/shared/constants/athleteTrainingTypeLabels'
import { WORKOUT_TEMPLATE_FIELD_LIMITS } from '@/shared/constants/sessionPersistenceValidation.constants'
import { APP_ROUTE, ROUTE_PARAM } from '@/shared/constants/routes.constants'
import { WORKOUT_TEMPLATE_SESSION_BUILDER_LABELS } from '@/shared/constants/workoutTemplateEditor.constants'
import { AthleteTrainingType } from '@/shared/domain'
import type { GymTrainingSession, TrainingSession, WorkoutTemplate } from '@/shared/types/domain.types'

export default function WorkoutTemplateEditPage() {
  const params = useParams()
  const templateId = params[ROUTE_PARAM.templateId]
  const navigate = useNavigate()

  const workoutTemplates = useWorkoutTemplateStore(
    (workoutTemplateStore) => workoutTemplateStore.workoutTemplates,
  )
  const updateWorkoutTemplate = useWorkoutTemplateStore(
    (workoutTemplateStore) => workoutTemplateStore.updateWorkoutTemplate,
  )
  const deleteWorkoutTemplate = useWorkoutTemplateStore(
    (workoutTemplateStore) => workoutTemplateStore.deleteWorkoutTemplate,
  )

  const template = templateId
    ? workoutTemplates.find((candidate) => candidate.id === templateId)
    : undefined

  const [draftSession, setDraftSession] = useState<TrainingSession | null>(null)
  const [targetGroup, setTargetGroup] = useState('')
  const [tagsInput, setTagsInput] = useState('')
  const [removeOpen, setRemoveOpen] = useState(false)

  useEffect(() => {
    if (!template) {
      setDraftSession(null)
      return
    }

    setDraftSession(workoutTemplateToStubTrainingSession(template))
    setTargetGroup(template.targetGroup)
    setTagsInput(formatWorkoutTemplateTagsForInput(template.tags))
    // Avoid depending on `template` object identity — Firestore snapshots create new references often.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateId, template?.updatedAt])

  async function handleSave(currentTemplate: WorkoutTemplate) {
    if (!draftSession) {
      return
    }

    const now = new Date().toISOString()
    const tags = parseWorkoutTemplateTagsInput(tagsInput)

    const nextTemplate =
      draftSession.trainingType === AthleteTrainingType.Swimming
        ? buildSwimmingWorkoutTemplateFromSessionDraft(draftSession, {
            id: currentTemplate.id,
            targetGroup,
            tags,
            createdAt: currentTemplate.createdAt,
            updatedAt: now,
          })
        : buildGymWorkoutTemplateFromSessionDraft(draftSession as GymTrainingSession, {
            id: currentTemplate.id,
            targetGroup,
            tags,
            createdAt: currentTemplate.createdAt,
            updatedAt: now,
          })

    const validation = validateWorkoutTemplateForPersistence(nextTemplate)
    if (!validation.ok) {
      toast.error(validation.message)
      return
    }

    try {
      await updateWorkoutTemplate(nextTemplate)
      toast.success('Template updated')
      navigate(APP_ROUTE.workoutTemplates)
    } catch (error) {
      toast.error(coachFirestoreErrorMessage(error, 'Could not update template.'))
    }
  }

  async function handleDelete() {
    if (!templateId) {
      return
    }

    try {
      await deleteWorkoutTemplate(templateId)
      toast.success('Template deleted')
      setRemoveOpen(false)
      navigate(APP_ROUTE.workoutTemplates)
    } catch (error) {
      toast.error(coachFirestoreErrorMessage(error, 'Could not delete template.'))
    }
  }

  if (!templateId) {
    return (
      <div className="page-stack">
        <PageHeader title="Template not found" description="Missing template id in the URL." />
      </div>
    )
  }

  if (!template) {
    return (
      <div className="page-stack">
        <PageHeader
          title="Template not found"
          description="This template may have been deleted or is still syncing."
          actions={
            <Button type="button" variant="outline" onClick={() => navigate(APP_ROUTE.workoutTemplates)}>
              All templates
            </Button>
          }
        />
      </div>
    )
  }

  if (!draftSession) {
    return (
      <div className="page-stack">
        <PageHeader title="Edit template" description="Loading template builder…" />
        <p className="text-body-sm text-muted-foreground" role="status">
          Loading…
        </p>
      </div>
    )
  }

  return (
    <div className="page-stack">
      <PageHeader
        title="Edit workout template"
        description="Changes apply to future assignments. Existing athlete sessions are not rewritten."
        actions={
          <div className="flex flex-wrap gap-tight">
            <Button type="button" variant="outline" onClick={() => navigate(APP_ROUTE.workoutTemplates)}>
              Back
            </Button>
            <Button type="button" variant="destructive" onClick={() => setRemoveOpen(true)}>
              Delete
            </Button>
          </div>
        }
      />

      <div className="grid gap-stack rounded-xl border border-border/60 bg-card/30 p-card lg:grid-cols-2">
        <div className="space-y-form">
          <div className="space-y-tight">
            <Label>Training type</Label>
            <p className="text-body text-muted-foreground">
              {ATHLETE_TRAINING_TYPE_LABELS[template.trainingType]}
            </p>
          </div>

          <div className="space-y-tight">
            <Label htmlFor="edit-template-target-group">Target group (optional)</Label>
            <Input
              id="edit-template-target-group"
              value={targetGroup}
              maxLength={WORKOUT_TEMPLATE_FIELD_LIMITS.TARGET_GROUP_MAX_LENGTH}
              onChange={(changeEvent) => setTargetGroup(changeEvent.target.value)}
              placeholder="Who this plan is aimed at"
            />
          </div>

          <div className="space-y-tight">
            <Label htmlFor="edit-template-tags">Tags (optional)</Label>
            <Input
              id="edit-template-tags"
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
        <Button type="button" onClick={() => handleSave(template)}>
          Save changes
        </Button>
      </div>

      <Dialog open={removeOpen} onOpenChange={setRemoveOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this template?</DialogTitle>
            <DialogDescription>
              Athlete sessions created from this template stay on their timelines.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setRemoveOpen(false)}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={handleDelete}>
              Delete template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
