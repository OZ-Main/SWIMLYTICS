import {
  GYM_SESSION_DURATION_SECONDS_MAX,
  SESSION_PERSISTENCE_FIELD_LIMITS,
  SWIM_SESSION_DURATION_SECONDS_MAX,
} from '@/shared/constants/sessionPersistenceValidation.constants'
import {
  GYM_SESSION_FOCUS,
  POOL_LENGTH_VALUES,
  WORKOUT_DISTANCE,
  WORKOUT_NOTES,
} from '@/shared/constants/workoutValidation.constants'
import { AthleteTrainingType, PoolLength } from '@/shared/domain'
import { isValidIsoCalendarDateString } from '@/shared/helpers/isoCalendarDate.helpers'
import { SESSION_BLOCK_KIND } from '@/shared/types/domain.types'
import type {
  GymSessionBlock,
  GymTrainingSession,
  SwimmingSessionBlock,
  SwimmingTrainingSession,
  TrainingSession,
} from '@/shared/types/domain.types'

export type PersistenceValidationResult =
  | { ok: true }
  | { ok: false; message: string }

function validationFailure(message: string): PersistenceValidationResult {
  return { ok: false, message }
}

function validationSuccess(): PersistenceValidationResult {
  return { ok: true }
}

function isAllowedPoolLength(value: number): value is PoolLength {
  return (POOL_LENGTH_VALUES as readonly number[]).includes(value)
}

function validateFiniteNonNegativeInteger(
  value: number,
  max: number,
  fieldLabel: string,
  blockLabel: string,
): PersistenceValidationResult {
  if (!Number.isFinite(value) || !Number.isInteger(value) || value < 0 || value > max) {
    return validationFailure(`${blockLabel}: ${fieldLabel} must be between 0 and ${max}.`)
  }

  return validationSuccess()
}

function validateSwimmingSessionBlockForPersistence(
  block: SwimmingSessionBlock,
  blockNumber: number,
): PersistenceValidationResult {
  const blockLabel = `Block ${blockNumber}`

  if (block.title.length > SESSION_PERSISTENCE_FIELD_LIMITS.BLOCK_TITLE_MAX_LENGTH) {
    return validationFailure(
      `${blockLabel}: title must be at most ${SESSION_PERSISTENCE_FIELD_LIMITS.BLOCK_TITLE_MAX_LENGTH} characters.`,
    )
  }

  if (block.notes.length > WORKOUT_NOTES.MAX_LENGTH) {
    return validationFailure(`${blockLabel}: notes must be at most ${WORKOUT_NOTES.MAX_LENGTH} characters.`)
  }

  if (block.kind !== SESSION_BLOCK_KIND.Swimming) {
    return validationFailure(`${blockLabel}: invalid block kind.`)
  }

  if (!isAllowedPoolLength(block.poolLength)) {
    return validationFailure(`${blockLabel}: pool length must be 25 or 50.`)
  }

  const repetitionsResult = validateFiniteNonNegativeInteger(
    block.repetitions,
    SESSION_PERSISTENCE_FIELD_LIMITS.SWIM_REPETITIONS_MAX,
    'Repetitions',
    blockLabel,
  )
  if (!repetitionsResult.ok) {
    return repetitionsResult
  }

  if (
    !Number.isFinite(block.distancePerRepMeters) ||
    block.distancePerRepMeters < 0 ||
    block.distancePerRepMeters > WORKOUT_DISTANCE.MAX_METERS
  ) {
    return validationFailure(
      `${blockLabel}: distance per rep must be between 0 and ${WORKOUT_DISTANCE.MAX_METERS} m.`,
    )
  }

  if (
    !Number.isFinite(block.explicitTotalDistanceMeters) ||
    block.explicitTotalDistanceMeters < 0 ||
    block.explicitTotalDistanceMeters > WORKOUT_DISTANCE.MAX_METERS
  ) {
    return validationFailure(
      `${blockLabel}: total distance must be between 0 and ${WORKOUT_DISTANCE.MAX_METERS} m.`,
    )
  }

  if (
    !Number.isFinite(block.durationSeconds) ||
    !Number.isInteger(block.durationSeconds) ||
    block.durationSeconds < 0 ||
    block.durationSeconds > SWIM_SESSION_DURATION_SECONDS_MAX
  ) {
    return validationFailure(
      `${blockLabel}: duration must be between 0 and ${SWIM_SESSION_DURATION_SECONDS_MAX} seconds.`,
    )
  }

  if (block.intervalSendoffSeconds !== null) {
    if (
      !Number.isFinite(block.intervalSendoffSeconds) ||
      !Number.isInteger(block.intervalSendoffSeconds) ||
      block.intervalSendoffSeconds < 0 ||
      block.intervalSendoffSeconds > SESSION_PERSISTENCE_FIELD_LIMITS.INTERVAL_SENDOFF_MAX_SECONDS
    ) {
      return validationFailure(
        `${blockLabel}: send-off interval must be between 0 and ${SESSION_PERSISTENCE_FIELD_LIMITS.INTERVAL_SENDOFF_MAX_SECONDS} seconds.`,
      )
    }
  }

  return validationSuccess()
}

function validateGymSessionBlockForPersistence(
  block: GymSessionBlock,
  blockNumber: number,
): PersistenceValidationResult {
  const blockLabel = `Block ${blockNumber}`

  if (block.title.length > SESSION_PERSISTENCE_FIELD_LIMITS.BLOCK_TITLE_MAX_LENGTH) {
    return validationFailure(
      `${blockLabel}: title must be at most ${SESSION_PERSISTENCE_FIELD_LIMITS.BLOCK_TITLE_MAX_LENGTH} characters.`,
    )
  }

  if (block.notes.length > WORKOUT_NOTES.MAX_LENGTH) {
    return validationFailure(`${blockLabel}: notes must be at most ${WORKOUT_NOTES.MAX_LENGTH} characters.`)
  }

  if (block.kind !== SESSION_BLOCK_KIND.Gym) {
    return validationFailure(`${blockLabel}: invalid block kind.`)
  }

  if (block.focus.length > GYM_SESSION_FOCUS.MAX_LENGTH) {
    return validationFailure(
      `${blockLabel}: focus must be at most ${GYM_SESSION_FOCUS.MAX_LENGTH} characters.`,
    )
  }

  if (
    !Number.isFinite(block.durationSeconds) ||
    !Number.isInteger(block.durationSeconds) ||
    block.durationSeconds < 0 ||
    block.durationSeconds > GYM_SESSION_DURATION_SECONDS_MAX
  ) {
    return validationFailure(
      `${blockLabel}: duration must be between 0 and ${GYM_SESSION_DURATION_SECONDS_MAX} seconds.`,
    )
  }

  return validationSuccess()
}

export function validateSwimmingSessionBlocksForPersistence(
  blocks: SwimmingSessionBlock[],
): PersistenceValidationResult {
  for (let index = 0; index < blocks.length; index++) {
    const blockResult = validateSwimmingSessionBlockForPersistence(blocks[index], index + 1)
    if (!blockResult.ok) {
      return blockResult
    }
  }

  return validationSuccess()
}

export function validateGymSessionBlocksForPersistence(blocks: GymSessionBlock[]): PersistenceValidationResult {
  for (let index = 0; index < blocks.length; index++) {
    const blockResult = validateGymSessionBlockForPersistence(blocks[index], index + 1)
    if (!blockResult.ok) {
      return blockResult
    }
  }

  return validationSuccess()
}

export function validateTrainingSessionForPersistence(
  session: TrainingSession,
): PersistenceValidationResult {
  if (!session.athleteId.trim()) {
    return validationFailure('Session is missing an athlete.')
  }

  if (session.sessionTitle.length > SESSION_PERSISTENCE_FIELD_LIMITS.SESSION_TITLE_MAX_LENGTH) {
    return validationFailure(
      `Session name must be at most ${SESSION_PERSISTENCE_FIELD_LIMITS.SESSION_TITLE_MAX_LENGTH} characters.`,
    )
  }

  if (session.notes.length > WORKOUT_NOTES.MAX_LENGTH) {
    return validationFailure(`Session notes must be at most ${WORKOUT_NOTES.MAX_LENGTH} characters.`)
  }

  if (!isValidIsoCalendarDateString(session.date)) {
    return validationFailure('Choose a valid session date.')
  }

  if (session.blocks.length === 0) {
    return validationFailure('Add at least one training block.')
  }

  if (session.trainingType === AthleteTrainingType.Swimming) {
    const swimSession = session as SwimmingTrainingSession
    if (!isAllowedPoolLength(swimSession.defaultPoolLength)) {
      return validationFailure('Default pool length must be 25 or 50 m.')
    }

    return validateSwimmingSessionBlocksForPersistence(swimSession.blocks)
  }

  return validateGymSessionBlocksForPersistence((session as GymTrainingSession).blocks)
}
