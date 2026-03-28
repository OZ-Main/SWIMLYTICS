import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { STORAGE_KEYS } from '@/lib/storage/storageKeys'
import { ThemeMode } from '@/shared/domain'

type SettingsState = {
  theme: ThemeMode
  initialSampleApplied: boolean
  setTheme: (theme: ThemeMode) => void
  setInitialSampleApplied: (value: boolean) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: ThemeMode.System,
      initialSampleApplied: false,
      setTheme: (theme) => set({ theme }),
      setInitialSampleApplied: (value) => set({ initialSampleApplied: value }),
    }),
    {
      name: STORAGE_KEYS.SETTINGS,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        theme: state.theme,
        initialSampleApplied: state.initialSampleApplied,
      }),
    },
  ),
)
