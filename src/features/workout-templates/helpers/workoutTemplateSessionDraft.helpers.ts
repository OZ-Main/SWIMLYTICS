import {
  createDraftGymTrainingSession,
  createDraftSwimmingTrainingSession,
} from '@/features/sessions/helpers/sessionFactories.helpers'
import { WORKOUT_TEMPLATE_BUILDER_PLACEHOLDER_ATHLETE_ID } from '@/shared/constants/workoutTemplateBuilder.constants'
import { AthleteTrainingType, PoolLength } from '@/shared/domain'
import type {
  GymTrainingSession,
  GymWorkoutTemplate,
  SwimmingTrainingSession,
  SwimmingWorkoutTemplate,
  TrainingSession,
  WorkoutTemplate,
} from '@/shared/types/domain.types'

export function createTrainingSessionDraftForWorkoutTemplate(
  trainingType: AthleteTrainingType,
  defaultPoolLength: PoolLength,
): TrainingSession {
  if (trainingType === AthleteTrainingType.Gym) {
    return createDraftGymTrainingSession(WORKOUT_TEMPLATE_BUILDER_PLACEHOLDER_ATHLETE_ID)
  }

  return createDraftSwimmingTrainingSession(
    WORKOUT_TEMPLATE_BUILDER_PLACEHOLDER_ATHLETE_ID,
    defaultPoolLength,
  )
}

export function buildSwimmingWorkoutTemplateFromSessionDraft(
  draftSession: SwimmingTrainingSession,
  meta: {
    id: string
    targetGroup: string
    tags: string[]
    createdAt: string
    updatedAt: string
  },
): SwimmingWorkoutTemplate {
  return {
    id: meta.id,
    title: draftSession.sessionTitle.trim() || 'Untitled template',
    description: draftSession.notes,
    targetGroup: meta.targetGroup.trim(),
    tags: meta.tags,
    createdAt: meta.createdAt,
    updatedAt: meta.updatedAt,
    trainingType: AthleteTrainingType.Swimming,
    defaultPoolLength: draftSession.defaultPoolLength,
    blocks: draftSession.blocks,
  }
}

export function buildGymWorkoutTemplateFromSessionDraft(
  draftSession: GymTrainingSession,
  meta: {
    id: string
    targetGroup: string
    tags: string[]
    createdAt: string
    updatedAt: string
  },
): GymWorkoutTemplate {
  return {
    id: meta.id,
    title: draftSession.sessionTitle.trim() || 'Untitled template',
    description: draftSession.notes,
    targetGroup: meta.targetGroup.trim(),
    tags: meta.tags,
    createdAt: meta.createdAt,
    updatedAt: meta.updatedAt,
    trainingType: AthleteTrainingType.Gym,
    blocks: draftSession.blocks,
  }
}

export function swimmingWorkoutTemplateToStubTrainingSession(
  template: SwimmingWorkoutTemplate,
): SwimmingTrainingSession {
  const now = new Date().toISOString()
  const calendarDate = now.slice(0, 10)
  return {
    id: template.id,
    athleteId: WORKOUT_TEMPLATE_BUILDER_PLACEHOLDER_ATHLETE_ID,
    date: calendarDate,
    sessionTitle: template.title,
    notes: template.description,
    createdAt: template.createdAt,
    updatedAt: now,
    trainingType: AthleteTrainingType.Swimming,
    defaultPoolLength: template.defaultPoolLength,
    blocks: template.blocks,
  }
}

export function gymWorkoutTemplateToStubTrainingSession(template: GymWorkoutTemplate): GymTrainingSession {
  const now = new Date().toISOString()
  const calendarDate = now.slice(0, 10)
  return {
    id: template.id,
    athleteId: WORKOUT_TEMPLATE_BUILDER_PLACEHOLDER_ATHLETE_ID,
    date: calendarDate,
    sessionTitle: template.title,
    notes: template.description,
    createdAt: template.createdAt,
    updatedAt: now,
    trainingType: AthleteTrainingType.Gym,
    blocks: template.blocks,
  }
}

export function workoutTemplateToStubTrainingSession(template: WorkoutTemplate): TrainingSession {
  if (template.trainingType === AthleteTrainingType.Swimming) {
    return swimmingWorkoutTemplateToStubTrainingSession(template)
  }

  return gymWorkoutTemplateToStubTrainingSession(template)
}
