import { ATHLETE_GROUP_EMPTY_LABEL } from '@/shared/constants/athleteGroup.constants'

export function athleteGroupDisplayLabel(group: string): string {
  const trimmed = group.trim()
  if (trimmed.length === 0) {
    return ATHLETE_GROUP_EMPTY_LABEL
  }

  return trimmed
}
