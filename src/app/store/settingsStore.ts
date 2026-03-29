import { create } from 'zustand'

import { ThemeMode } from '@/shared/domain'

type SettingsState = {
  theme: ThemeMode
  initialSampleApplied: boolean
  setTheme: (nextTheme: ThemeMode) => void
  setInitialSampleApplied: (applied: boolean) => void
}

export const useSettingsStore = create<SettingsState>((set) => ({
  theme: ThemeMode.System,
  initialSampleApplied: false,
  setTheme: (nextTheme) => set({ theme: nextTheme }),
  setInitialSampleApplied: (applied) => set({ initialSampleApplied: applied }),
}))
