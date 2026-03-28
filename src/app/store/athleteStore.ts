import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { STORAGE_KEYS } from '@/lib/storage/storageKeys'
import type { Athlete } from '@/shared/types/domain.types'

type AthleteState = {
  athletes: Athlete[]
  addAthlete: (athlete: Athlete) => void
  updateAthlete: (athlete: Athlete) => void
  deleteAthlete: (athleteId: string) => void
  replaceAllAthletes: (nextAthletes: Athlete[]) => void
}

export const useAthleteStore = create<AthleteState>()(
  persist(
    (setState, getState) => ({
      athletes: [],
      addAthlete: (athlete) =>
        setState({ athletes: [athlete, ...getState().athletes] }),
      updateAthlete: (updatedAthlete) =>
        setState({
          athletes: getState().athletes.map((existingAthlete) =>
            existingAthlete.id === updatedAthlete.id ? updatedAthlete : existingAthlete,
          ),
        }),
      deleteAthlete: (athleteId) =>
        setState({
          athletes: getState().athletes.filter(
            (existingAthlete) => existingAthlete.id !== athleteId,
          ),
        }),
      replaceAllAthletes: (nextAthletes) => setState({ athletes: nextAthletes }),
    }),
    {
      name: STORAGE_KEYS.ATHLETES,
      storage: createJSONStorage(() => localStorage),
      partialize: (persistedSlice) => ({ athletes: persistedSlice.athletes }),
    },
  ),
)
