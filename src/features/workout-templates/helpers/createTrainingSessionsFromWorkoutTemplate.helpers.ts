import {
  createSwimmingSessionBlockId,
  reindexTrainingSessionBlocks,
} from '@/features/sessions/helpers/sessionFactories.helpers'
import { AthleteTrainingType } from '@/shared/domain'
import type {
  GymSessionBlock,
  GymTrainingSession,
  GymWorkoutTemplate,
  SwimmingSessionBlock,
  SwimmingTrainingSession,
  SwimmingWorkoutTemplate,
  TrainingSession,
  WorkoutTemplate,
} from '@/shared/types/domain.types'

function cloneSwimmingTemplateBlocks(blocks: SwimmingSessionBlock[]): SwimmingSessionBlock[] {
  return reindexTrainingSessionBlocks(
    blocks.map((block) => ({
      ...block,
      id: createSwimmingSessionBlockId(),
    })),
  )
}

function cloneGymTemplateBlocks(blocks: GymSessionBlock[]): GymSessionBlock[] {
  return reindexTrainingSessionBlocks(
    blocks.map((block) => ({
      ...block,
      id: createSwimmingSessionBlockId(),
    })),
  )
}

export function createTrainingSessionsFromWorkoutTemplate(
  template: WorkoutTemplate,
  athleteIds: string[],
  assignmentCalendarDate: string,
): TrainingSession[] {
  const timestampIso = new Date().toISOString()
  const dateNormalized = assignmentCalendarDate.slice(0, 10)

  return athleteIds.map((athleteId) => {
    const sessionId = crypto.randomUUID()

    if (template.trainingType === AthleteTrainingType.Swimming) {
      const swimmingTemplate = template as SwimmingWorkoutTemplate
      const next: SwimmingTrainingSession = {
        id: sessionId,
        athleteId,
        date: dateNormalized,
        sessionTitle: swimmingTemplate.title,
        notes: swimmingTemplate.description,
        createdAt: timestampIso,
        updatedAt: timestampIso,
        trainingType: AthleteTrainingType.Swimming,
        defaultPoolLength: swimmingTemplate.defaultPoolLength,
        blocks: cloneSwimmingTemplateBlocks(swimmingTemplate.blocks),
        sourceTemplateId: swimmingTemplate.id,
      }
      return next
    }

    const gymTemplate = template as GymWorkoutTemplate
    const next: GymTrainingSession = {
      id: sessionId,
      athleteId,
      date: dateNormalized,
      sessionTitle: gymTemplate.title,
      notes: gymTemplate.description,
      createdAt: timestampIso,
      updatedAt: timestampIso,
      trainingType: AthleteTrainingType.Gym,
      blocks: cloneGymTemplateBlocks(gymTemplate.blocks),
      sourceTemplateId: gymTemplate.id,
    }
    return next
  })
}
