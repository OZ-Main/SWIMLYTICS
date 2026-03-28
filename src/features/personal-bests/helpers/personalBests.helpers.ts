import { parseISO } from 'date-fns'

import { STROKE_LABELS, STROKE_ORDER } from '@/shared/constants/strokeLabels'
import type { PersonalBestDistance, Stroke } from '@/shared/domain'
import type { PersonalBest } from '@/shared/types/domain.types'

const STROKE_SORT_INDEX: Record<Stroke, number> = STROKE_ORDER.reduce(
  (sortIndexByStroke, stroke, index) => {
    sortIndexByStroke[stroke] = index
    return sortIndexByStroke
  },
  {} as Record<Stroke, number>,
)

function strokeSortKey(stroke: Stroke): number {
  return STROKE_SORT_INDEX[stroke] ?? 999
}

export function sortPersonalBestsDisplay(allPersonalBests: PersonalBest[]): PersonalBest[] {
  return [...allPersonalBests].sort((left, right) => {
    if (left.stroke !== right.stroke) {
      return strokeSortKey(left.stroke) - strokeSortKey(right.stroke)
    }
    if (left.distance !== right.distance) {
      return left.distance - right.distance
    }
    return parseISO(left.date).getTime() - parseISO(right.date).getTime()
  })
}

export function findBestPriorPbSameEvent(
  allPersonalBests: PersonalBest[],
  currentMark: PersonalBest,
): PersonalBest | null {
  const priorMarks = allPersonalBests.filter(
    (candidate) =>
      candidate.athleteId === currentMark.athleteId &&
      candidate.stroke === currentMark.stroke &&
      candidate.distance === currentMark.distance &&
      candidate.id !== currentMark.id &&
      parseISO(candidate.date).getTime() < parseISO(currentMark.date).getTime(),
  )
  if (priorMarks.length === 0) {
    return null
  }
  return priorMarks.reduce((bestSoFar, candidate) =>
    candidate.timeSeconds < bestSoFar.timeSeconds ? candidate : bestSoFar,
  )
}

export function formatImprovementVsPriorBest(
  currentSeconds: number,
  priorBestSeconds: number | null,
): string {
  if (priorBestSeconds === null) {
    return 'First mark at this event'
  }
  const delta = currentSeconds - priorBestSeconds
  if (delta < 0) {
    return `${Math.abs(delta).toFixed(2)}s faster than prior best`
  }
  if (delta > 0) {
    return `${delta.toFixed(2)}s slower than prior best`
  }
  return 'Same as prior best'
}

export function distanceLabel(distanceMeters: PersonalBestDistance): string {
  return `${distanceMeters} m`
}

/** Full event label for tables and confirmations (stroke + distance). */
export function personalBestEventLabel(personalBest: PersonalBest): string {
  return `${STROKE_LABELS[personalBest.stroke]} · ${personalBest.distance} m`
}
