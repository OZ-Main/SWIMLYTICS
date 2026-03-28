import { parseISO } from 'date-fns'

import type { SessionListFilters } from '@/features/sessions/types/session-filters.types'
import { swimmingSessionContainsStroke } from '@/features/sessions/helpers/sessionTotals.helpers'
import { WORKOUT_FILTER_ALL } from '@/shared/constants/workoutFilter.constants'
import { STROKE_LABELS } from '@/shared/constants/strokeLabels'
import { isSwimmingTrainingSession } from '@/shared/helpers/sessionType.helpers'
import { SESSION_BLOCK_KIND, type TrainingSession } from '@/shared/types/domain.types'

function sessionHasEffortLevel(
  session: TrainingSession,
  effortLevel: SessionListFilters['effortLevel'],
): boolean {
  if (effortLevel === WORKOUT_FILTER_ALL) {
    return true
  }
  return session.blocks.some((block) => block.effortLevel === effortLevel)
}

export function filterTrainingSessions(
  sessions: TrainingSession[],
  filters: SessionListFilters,
): TrainingSession[] {
  const searchQuery = filters.search.trim().toLowerCase()
  return sessions.filter((session) => {
    if (filters.stroke !== WORKOUT_FILTER_ALL) {
      if (!isSwimmingTrainingSession(session) || !swimmingSessionContainsStroke(session, filters.stroke)) {
        return false
      }
    }
    if (!sessionHasEffortLevel(session, filters.effortLevel)) {
      return false
    }
    if (filters.dateFrom && session.date < filters.dateFrom) {
      return false
    }
    if (filters.dateTo && session.date > filters.dateTo) {
      return false
    }
    if (searchQuery) {
      const blockText = session.blocks
        .map((block) => {
          if (block.kind === SESSION_BLOCK_KIND.Swimming) {
            return [
              block.title,
              block.notes,
              STROKE_LABELS[block.stroke],
            ].join(' ')
          }
          return [block.title, block.notes, block.focus].join(' ')
        })
        .join(' ')
      const searchableText = [
        session.sessionTitle,
        session.notes,
        blockText,
        session.date,
      ]
        .join(' ')
        .toLowerCase()
      if (!searchableText.includes(searchQuery)) {
        return false
      }
    }
    return true
  })
}

export function sortTrainingSessionsByDateDesc(sessions: TrainingSession[]): TrainingSession[] {
  return [...sessions].sort(
    (firstSession, secondSession) =>
      parseISO(secondSession.date).getTime() - parseISO(firstSession.date).getTime(),
  )
}
