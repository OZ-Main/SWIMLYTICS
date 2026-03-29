import { create } from 'zustand'

import {
  bulkWriteTrainingSessionDocuments,
  deleteTrainingSessionDocument,
  writeTrainingSessionDocument,
} from '@/lib/firebase/coachDataRepository'
import { useAuthStore } from '@/app/store/authStore'
import type { TrainingSession } from '@/shared/types/domain.types'

function requireCoachUid(): string {
  const uid = useAuthStore.getState().user?.uid
  if (!uid) {
    throw new Error('You must be signed in to change training sessions.')
  }

  return uid
}

type TrainingSessionState = {
  trainingSessions: TrainingSession[]
  addTrainingSession: (session: TrainingSession) => Promise<void>
  bulkAddTrainingSessions: (sessions: TrainingSession[]) => Promise<void>
  updateTrainingSession: (session: TrainingSession) => Promise<void>
  deleteTrainingSession: (sessionId: string) => Promise<void>
  replaceAllTrainingSessions: (nextSessions: TrainingSession[]) => void
}

export const useTrainingSessionStore = create<TrainingSessionState>(() => ({
  trainingSessions: [],
  addTrainingSession: async (session) => {
    await writeTrainingSessionDocument(requireCoachUid(), session)
  },
  bulkAddTrainingSessions: async (sessions) => {
    await bulkWriteTrainingSessionDocuments(requireCoachUid(), sessions)
  },
  updateTrainingSession: async (updatedSession) => {
    await writeTrainingSessionDocument(requireCoachUid(), updatedSession)
  },
  deleteTrainingSession: async (sessionId) => {
    await deleteTrainingSessionDocument(requireCoachUid(), sessionId)
  },
  replaceAllTrainingSessions: (nextSessions) => {
    useTrainingSessionStore.setState({ trainingSessions: nextSessions })
  },
}))
