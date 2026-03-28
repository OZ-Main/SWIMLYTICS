import { Stroke } from '@/shared/domain'
import type {
  GymTrainingSession,
  SwimmingSessionBlock,
  SwimmingTrainingSession,
} from '@/shared/types/domain.types'

import { calculateSwimmingBlockDistanceMeters } from './sessionBlockDistance.helpers'

export function getSwimmingSessionTotalDistanceMeters(session: SwimmingTrainingSession): number {
  return session.blocks.reduce(
    (totalMeters, block) => totalMeters + calculateSwimmingBlockDistanceMeters(block),
    0,
  )
}

export function getSwimmingSessionTotalDurationSeconds(session: SwimmingTrainingSession): number {
  return session.blocks.reduce((totalSeconds, block) => totalSeconds + block.durationSeconds, 0)
}

export function getSwimmingSessionWeightedPacePer100Seconds(
  session: SwimmingTrainingSession,
): number {
  const totalDistanceMeters = getSwimmingSessionTotalDistanceMeters(session)
  const totalDurationSeconds = getSwimmingSessionTotalDurationSeconds(session)
  return totalDistanceMeters > 0 ? (totalDurationSeconds / totalDistanceMeters) * 100 : 0
}

export function getGymSessionTotalDurationSeconds(session: GymTrainingSession): number {
  return session.blocks.reduce((totalSeconds, block) => totalSeconds + block.durationSeconds, 0)
}

export function swimmingSessionContainsStroke(
  session: SwimmingTrainingSession,
  stroke: Stroke,
): boolean {
  return session.blocks.some((block) => block.stroke === stroke)
}

export function getSwimmingSessionPrimaryStroke(session: SwimmingTrainingSession): Stroke | null {
  const distanceByStroke = new Map<Stroke, number>()
  for (const block of session.blocks) {
    const blockMeters = calculateSwimmingBlockDistanceMeters(block)
    distanceByStroke.set(block.stroke, (distanceByStroke.get(block.stroke) ?? 0) + blockMeters)
  }
  let primaryStroke: Stroke | null = null
  let maxMeters = 0
  for (const [stroke, meters] of distanceByStroke) {
    if (meters > maxMeters) {
      maxMeters = meters
      primaryStroke = stroke
    }
  }
  return primaryStroke
}

export function formatSwimmingBlockDistanceSummary(block: SwimmingSessionBlock): string {
  const totalMeters = calculateSwimmingBlockDistanceMeters(block)
  if (block.repetitions > 1 && block.distancePerRepMeters > 0) {
    return `${block.repetitions}×${block.distancePerRepMeters} m (${totalMeters} m)`
  }
  return `${totalMeters} m`
}
