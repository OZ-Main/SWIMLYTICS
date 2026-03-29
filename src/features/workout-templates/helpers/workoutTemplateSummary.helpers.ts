import { ATHLETE_TRAINING_TYPE_LABELS } from '@/shared/constants/athleteTrainingTypeLabels'
import type { WorkoutTemplate } from '@/shared/types/domain.types'

export function workoutTemplateBlockCount(template: WorkoutTemplate): number {
  return template.blocks.length
}

export function workoutTemplateTrainingTypeLabel(template: WorkoutTemplate): string {
  return ATHLETE_TRAINING_TYPE_LABELS[template.trainingType]
}

export function buildWorkoutTemplateSummaryLine(template: WorkoutTemplate): string {
  const blockCount = workoutTemplateBlockCount(template)
  const typeLabel = workoutTemplateTrainingTypeLabel(template)
  return `${typeLabel} · ${blockCount} blocks`
}
