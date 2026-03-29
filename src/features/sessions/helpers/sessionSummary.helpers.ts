import { STROKE_LABELS } from '@/shared/constants/strokeLabels'
import { SWIMMING_BLOCK_CATEGORY_LABEL } from '@/shared/constants/swimmingBlockCategoryLabels'
import type { SwimmingTrainingSession } from '@/shared/types/domain.types'

import { calculateSwimmingBlockDistanceMeters } from './sessionBlockDistance.helpers'
import {
  getSwimmingSessionPrimaryStroke,
  getSwimmingSessionTotalDistanceMeters,
  getSwimmingSessionTotalDurationSeconds,
} from './sessionTotals.helpers'

export type SwimmingSessionSummary = {
  totalDistanceMeters: number
  totalDurationSeconds: number
  blockCount: number
  primaryStrokeLabel: string | null
  shortBlockSummary: string
}

function buildShortSwimmingBlockSummary(session: SwimmingTrainingSession, maxParts: number): string {
  const sortedBlocks = [...session.blocks].sort(
    (leftBlock, rightBlock) => leftBlock.orderIndex - rightBlock.orderIndex,
  )
  const parts: string[] = []
  for (const block of sortedBlocks.slice(0, maxParts)) {
    const categoryLabel = SWIMMING_BLOCK_CATEGORY_LABEL[block.category]
    const meters = calculateSwimmingBlockDistanceMeters(block)
    parts.push(`${categoryLabel} ${meters}m`)
  }

  if (sortedBlocks.length > maxParts) {
    parts.push(`+${sortedBlocks.length - maxParts}`)
  }

  return parts.join(' · ')
}

export function buildSwimmingSessionSummary(
  session: SwimmingTrainingSession,
  maxParts: number = 3,
): SwimmingSessionSummary {
  const primaryStroke = getSwimmingSessionPrimaryStroke(session)
  return {
    totalDistanceMeters: getSwimmingSessionTotalDistanceMeters(session),
    totalDurationSeconds: getSwimmingSessionTotalDurationSeconds(session),
    blockCount: session.blocks.length,
    primaryStrokeLabel: primaryStroke ? STROKE_LABELS[primaryStroke] : null,
    shortBlockSummary: buildShortSwimmingBlockSummary(session, maxParts),
  }
}
