import { create } from 'zustand'

import {
  deleteAthleteDocument,
  writeAthleteDocument,
} from '@/lib/firebase/coachDataRepository'
import { useAuthStore } from '@/app/store/authStore'
import type { Athlete } from '@/shared/types/domain.types'

function requireCoachUid(): string {
  const uid = useAuthStore.getState().user?.uid
  if (!uid) {
    throw new Error('You must be signed in to change athletes.')
  }
  return uid
}

type AthleteState = {
  athletes: Athlete[]
  addAthlete: (athlete: Athlete) => Promise<void>
  updateAthlete: (athlete: Athlete) => Promise<void>
  deleteAthlete: (athleteId: string) => Promise<void>
  replaceAllAthletes: (nextAthletes: Athlete[]) => void
}

export const useAthleteStore = create<AthleteState>(() => ({
  athletes: [],
  addAthlete: async (athlete) => {
    await writeAthleteDocument(requireCoachUid(), athlete)
  },
  updateAthlete: async (updatedAthlete) => {
    await writeAthleteDocument(requireCoachUid(), updatedAthlete)
  },
  deleteAthlete: async (athleteId) => {
    await deleteAthleteDocument(requireCoachUid(), athleteId)
  },
  replaceAllAthletes: (nextAthletes) => {
    useAthleteStore.setState({ athletes: nextAthletes })
  },
}))
