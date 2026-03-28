import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { STORAGE_KEYS } from '@/lib/storage/storageKeys'
import { Stroke } from '@/shared/domain'
import { LEGACY_IMPORT_ATHLETE_ID } from '@/shared/constants/migration.constants'
import type { PersonalBest } from '@/shared/types/domain.types'

type PersonalBestPersistedRow = PersonalBest & { stroke?: Stroke; athleteId?: string }

type PersonalBestsState = {
  personalBests: PersonalBest[]
  addPersonalBest: (personalBest: PersonalBest) => void
  updatePersonalBest: (personalBest: PersonalBest) => void
  deletePersonalBest: (personalBestId: string) => void
  replaceAllPersonalBests: (nextPersonalBests: PersonalBest[]) => void
}

export const usePersonalBestsStore = create<PersonalBestsState>()(
  persist(
    (setState, getState) => ({
      personalBests: [],
      addPersonalBest: (personalBest) =>
        setState({ personalBests: [personalBest, ...getState().personalBests] }),
      updatePersonalBest: (updatedPersonalBest) =>
        setState({
          personalBests: getState().personalBests.map((existingPersonalBest) =>
            existingPersonalBest.id === updatedPersonalBest.id
              ? updatedPersonalBest
              : existingPersonalBest,
          ),
        }),
      deletePersonalBest: (personalBestId) =>
        setState({
          personalBests: getState().personalBests.filter(
            (existingPersonalBest) => existingPersonalBest.id !== personalBestId,
          ),
        }),
      replaceAllPersonalBests: (nextPersonalBests) =>
        setState({ personalBests: nextPersonalBests }),
    }),
    {
      name: STORAGE_KEYS.PERSONAL_BESTS,
      storage: createJSONStorage(() => localStorage),
      partialize: (persistedSlice) => ({ personalBests: persistedSlice.personalBests }),
      merge: (persistedState, currentState): PersonalBestsState => {
        if (persistedState == null || typeof persistedState !== 'object') {
          return currentState
        }
        const rawPersisted = persistedState as { personalBests?: unknown }
        if (!Array.isArray(rawPersisted.personalBests)) {
          return currentState
        }
        const personalBests: PersonalBest[] = rawPersisted.personalBests.map(
          (persistedRowUnknown) => {
            const persistedRow = persistedRowUnknown as PersonalBestPersistedRow
            return {
              ...persistedRow,
              athleteId: persistedRow.athleteId ?? LEGACY_IMPORT_ATHLETE_ID,
              stroke: persistedRow.stroke ?? Stroke.Freestyle,
            }
          },
        )
        return {
          ...currentState,
          personalBests,
        }
      },
    },
  ),
)
