import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { STORAGE_KEYS } from '@/lib/storage/storageKeys'
import { Stroke } from '@/shared/domain'
import type { PersonalBest } from '@/shared/types/domain.types'

/** Older persisted rows may omit `stroke`; default for migration. */
type PbPersisted = PersonalBest & { stroke?: Stroke }

type PersonalBestsState = {
  personalBests: PersonalBest[]
  addPersonalBest: (pb: PersonalBest) => void
  updatePersonalBest: (pb: PersonalBest) => void
  deletePersonalBest: (id: string) => void
  replaceAllPersonalBests: (items: PersonalBest[]) => void
}

export const usePersonalBestsStore = create<PersonalBestsState>()(
  persist(
    (set, get) => ({
      personalBests: [],
      addPersonalBest: (pb) => set({ personalBests: [pb, ...get().personalBests] }),
      updatePersonalBest: (pb) =>
        set({
          personalBests: get().personalBests.map((p) => (p.id === pb.id ? pb : p)),
        }),
      deletePersonalBest: (id) =>
        set({
          personalBests: get().personalBests.filter((p) => p.id !== id),
        }),
      replaceAllPersonalBests: (items) => set({ personalBests: items }),
    }),
    {
      name: STORAGE_KEYS.PERSONAL_BESTS,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ personalBests: state.personalBests }),
      merge: (persistedState, currentState): PersonalBestsState => {
        if (persistedState == null || typeof persistedState !== 'object') {
          return currentState
        }
        const raw = persistedState as { personalBests?: unknown }
        if (!Array.isArray(raw.personalBests)) {
          return currentState
        }
        const personalBests: PersonalBest[] = raw.personalBests.map((item) => {
          const pb = item as PbPersisted
          return {
            ...pb,
            stroke: pb.stroke ?? Stroke.Freestyle,
          }
        })
        return {
          ...currentState,
          personalBests,
        }
      },
    },
  ),
)
