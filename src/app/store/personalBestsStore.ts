import { create } from 'zustand'

import {
  deletePersonalBestDocument,
  writePersonalBestDocument,
} from '@/lib/firebase/coachDataRepository'
import { useAuthStore } from '@/app/store/authStore'
import type { PersonalBest } from '@/shared/types/domain.types'

function requireCoachUid(): string {
  const uid = useAuthStore.getState().user?.uid
  if (!uid) {
    throw new Error('You must be signed in to change personal bests.')
  }

  return uid
}

type PersonalBestsState = {
  personalBests: PersonalBest[]
  addPersonalBest: (personalBest: PersonalBest) => Promise<void>
  updatePersonalBest: (personalBest: PersonalBest) => Promise<void>
  deletePersonalBest: (personalBestId: string) => Promise<void>
  replaceAllPersonalBests: (nextPersonalBests: PersonalBest[]) => void
}

export const usePersonalBestsStore = create<PersonalBestsState>(() => ({
  personalBests: [],
  addPersonalBest: async (personalBest) => {
    await writePersonalBestDocument(requireCoachUid(), personalBest)
  },
  updatePersonalBest: async (updatedPersonalBest) => {
    await writePersonalBestDocument(requireCoachUid(), updatedPersonalBest)
  },
  deletePersonalBest: async (personalBestId) => {
    await deletePersonalBestDocument(requireCoachUid(), personalBestId)
  },
  replaceAllPersonalBests: (nextPersonalBests) => {
    usePersonalBestsStore.setState({ personalBests: nextPersonalBests })
  },
}))
