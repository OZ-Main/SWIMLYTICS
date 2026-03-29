import { WORKOUT_TEMPLATE_FIELD_LIMITS } from '@/shared/constants/sessionPersistenceValidation.constants'

export function parseWorkoutTemplateTagsInput(rawInput: string): string[] {
  const seen = new Set<string>()
  const result: string[] = []
  for (const segment of rawInput.split(',')) {
    const trimmed = segment.trim()
    if (trimmed.length === 0) {
      continue
    }

    const key = trimmed.toLowerCase()
    if (seen.has(key)) {
      continue
    }

    seen.add(key)
    result.push(trimmed)
    if (result.length >= WORKOUT_TEMPLATE_FIELD_LIMITS.TAGS_MAX_COUNT) {
      break
    }
  }

  return result
}

export function formatWorkoutTemplateTagsForInput(tags: string[]): string {
  return tags.join(', ')
}
