import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { STORAGE_KEYS } from '@/lib/storage/storageKeys'
import { ThemeMode } from '@/shared/domain'

type SettingsState = {
  theme: ThemeMode
  initialSampleApplied: boolean
  setTheme: (nextTheme: ThemeMode) => void
  setInitialSampleApplied: (applied: boolean) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (setState) => ({
      theme: ThemeMode.System,
      initialSampleApplied: false,
      setTheme: (nextTheme) => setState({ theme: nextTheme }),
      setInitialSampleApplied: (applied) => setState({ initialSampleApplied: applied }),
    }),
    {
      name: STORAGE_KEYS.SETTINGS,
      storage: createJSONStorage(() => localStorage),
      partialize: (persistedSlice) => ({
        theme: persistedSlice.theme,
        initialSampleApplied: persistedSlice.initialSampleApplied,
      }),
    },
  ),
)
