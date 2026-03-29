import type { SwimmingSessionBlock } from '@/shared/types/domain.types'

export function calculateSwimmingBlockDistanceMeters(block: SwimmingSessionBlock): number {
  if (block.repetitions > 0 && block.distancePerRepMeters > 0) {
    return block.repetitions * block.distancePerRepMeters
  }

  return Math.max(0, block.explicitTotalDistanceMeters)
}
