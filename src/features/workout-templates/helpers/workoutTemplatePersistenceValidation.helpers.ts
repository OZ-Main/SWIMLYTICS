import {
  validateGymSessionBlocksForPersistence,
  validateSwimmingSessionBlocksForPersistence,
  type PersistenceValidationResult,
} from '@/features/sessions/helpers/trainingSessionValidation.helpers'
import { WORKOUT_TEMPLATE_FIELD_LIMITS } from '@/shared/constants/sessionPersistenceValidation.constants'
import { POOL_LENGTH_VALUES } from '@/shared/constants/workoutValidation.constants'
import { AthleteTrainingType, type PoolLength } from '@/shared/domain'
import type { WorkoutTemplate } from '@/shared/types/domain.types'

function validationFailure(message: string): PersistenceValidationResult {
  return { ok: false, message }
}

function validationSuccess(): PersistenceValidationResult {
  return { ok: true }
}

function isAllowedPoolLength(value: number): value is PoolLength {
  return (POOL_LENGTH_VALUES as readonly number[]).includes(value)
}

export function validateWorkoutTemplateForPersistence(
  template: WorkoutTemplate,
): PersistenceValidationResult {
  const trimmedTitle = template.title.trim()
  if (trimmedTitle.length < WORKOUT_TEMPLATE_FIELD_LIMITS.TITLE_MIN_TRIM_LENGTH) {
    return validationFailure('Template title is required.')
  }

  if (template.title.length > WORKOUT_TEMPLATE_FIELD_LIMITS.TITLE_MAX_LENGTH) {
    return validationFailure(
      `Template title must be at most ${WORKOUT_TEMPLATE_FIELD_LIMITS.TITLE_MAX_LENGTH} characters.`,
    )
  }

  if (template.description.length > WORKOUT_TEMPLATE_FIELD_LIMITS.DESCRIPTION_MAX_LENGTH) {
    return validationFailure(
      `Description must be at most ${WORKOUT_TEMPLATE_FIELD_LIMITS.DESCRIPTION_MAX_LENGTH} characters.`,
    )
  }

  if (template.targetGroup.length > WORKOUT_TEMPLATE_FIELD_LIMITS.TARGET_GROUP_MAX_LENGTH) {
    return validationFailure(
      `Target group must be at most ${WORKOUT_TEMPLATE_FIELD_LIMITS.TARGET_GROUP_MAX_LENGTH} characters.`,
    )
  }

  if (template.tags.length > WORKOUT_TEMPLATE_FIELD_LIMITS.TAGS_MAX_COUNT) {
    return validationFailure(`At most ${WORKOUT_TEMPLATE_FIELD_LIMITS.TAGS_MAX_COUNT} tags are allowed.`)
  }

  for (const tag of template.tags) {
    if (tag.length > WORKOUT_TEMPLATE_FIELD_LIMITS.TAG_MAX_LENGTH) {
      return validationFailure(
        `Each tag must be at most ${WORKOUT_TEMPLATE_FIELD_LIMITS.TAG_MAX_LENGTH} characters.`,
      )
    }
  }

  if (template.blocks.length === 0) {
    return validationFailure('Add at least one training block.')
  }

  if (template.trainingType === AthleteTrainingType.Swimming) {
    const blocksResult = validateSwimmingSessionBlocksForPersistence(template.blocks)
    if (!blocksResult.ok) {
      return blocksResult
    }

    if (!isAllowedPoolLength(template.defaultPoolLength)) {
      return validationFailure('Default pool length must be 25 or 50 m.')
    }

    return validationSuccess()
  }

  return validateGymSessionBlocksForPersistence(template.blocks)
}
