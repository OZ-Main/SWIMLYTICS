import { AthleteTrainingType } from '@/shared/domain'
import type { Athlete, WorkoutTemplate } from '@/shared/types/domain.types'

export function filterAthletesEligibleForWorkoutTemplate(
  athletes: Athlete[],
  template: WorkoutTemplate,
): Athlete[] {
  return athletes.filter((athlete) => athlete.trainingType === template.trainingType)
}

export type AthleteAssignmentTableFilter = {
  trainingType: AthleteTrainingType | 'all'
  groupQuery: string
  nameQuery: string
}

export function filterAthletesForAssignmentTable(
  athletes: Athlete[],
  filter: AthleteAssignmentTableFilter,
): Athlete[] {
  let next = athletes

  if (filter.trainingType !== 'all') {
    next = next.filter((athlete) => athlete.trainingType === filter.trainingType)
  }

  const groupNeedle = filter.groupQuery.trim().toLowerCase()
  if (groupNeedle.length > 0) {
    next = next.filter((athlete) => athlete.group.toLowerCase().includes(groupNeedle))
  }

  const nameNeedle = filter.nameQuery.trim().toLowerCase()
  if (nameNeedle.length > 0) {
    next = next.filter((athlete) => athlete.fullName.toLowerCase().includes(nameNeedle))
  }

  return next
}
