import { parseISO } from 'date-fns'

import { STROKE_LABELS, STROKE_ORDER } from '@/shared/constants/strokeLabels'
import type { PersonalBestDistance, Stroke } from '@/shared/domain'
import type { PersonalBest } from '@/shared/types/domain.types'

const STROKE_SORT_INDEX: Record<Stroke, number> = STROKE_ORDER.reduce(
  (acc, s, i) => {
    acc[s] = i
    return acc
  },
  {} as Record<Stroke, number>,
)

function strokeSortKey(stroke: Stroke): number {
  return STROKE_SORT_INDEX[stroke] ?? 999
}

export function sortPersonalBestsDisplay(items: PersonalBest[]): PersonalBest[] {
  return [...items].sort((a, b) => {
    if (a.stroke !== b.stroke) {
      return strokeSortKey(a.stroke) - strokeSortKey(b.stroke)
    }
    if (a.distance !== b.distance) {
      return a.distance - b.distance
    }
    return parseISO(a.date).getTime() - parseISO(b.date).getTime()
  })
}

export function findBestPriorPbSameEvent(
  items: PersonalBest[],
  current: PersonalBest,
): PersonalBest | null {
  const prior = items.filter(
    (p) =>
      p.stroke === current.stroke &&
      p.distance === current.distance &&
      p.id !== current.id &&
      parseISO(p.date).getTime() < parseISO(current.date).getTime(),
  )
  if (prior.length === 0) {
    return null
  }
  return prior.reduce((best, p) => (p.timeSeconds < best.timeSeconds ? p : best))
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

export function distanceLabel(d: PersonalBestDistance): string {
  return `${d} m`
}

/** Full event label for tables and confirmations (stroke + distance). */
export function personalBestEventLabel(pb: PersonalBest): string {
  return `${STROKE_LABELS[pb.stroke]} · ${pb.distance} m`
}
