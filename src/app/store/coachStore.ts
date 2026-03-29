import { create } from 'zustand'

import { useAuthStore } from '@/app/store/authStore'
import { updateUserProfileFields } from '@/lib/firebase/userProfileRepository'
import type { Coach } from '@/shared/types/domain.types'

type CoachState = {
  coach: Coach | null
  profileReady: boolean
  setProfileReady: (ready: boolean) => void
  setCoachDisplayName: (displayName: string) => Promise<void>
  replaceCoach: (nextCoach: Coach) => void
  resetCoachState: () => void
}

export const useCoachStore = create<CoachState>((set, getState) => ({
  coach: null,
  profileReady: false,
  setProfileReady: (ready) => set({ profileReady: ready }),
  setCoachDisplayName: async (displayName) => {
    const uid = useAuthStore.getState().user?.uid
    if (!uid) {
      return
    }
    const currentCoach = getState().coach
    if (currentCoach) {
      set({ coach: { ...currentCoach, displayName } })
    }
    await updateUserProfileFields(uid, { displayName })
  },
  replaceCoach: (nextCoach) => set({ coach: nextCoach }),
  resetCoachState: () => set({ coach: null, profileReady: false }),
}))
