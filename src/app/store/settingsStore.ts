import { create } from 'zustand'

import { AppLanguage, ThemeMode } from '@/shared/domain'
import { readStoredAppLanguage } from '@/shared/helpers/storedLanguage.helpers'

type SettingsState = {
  theme: ThemeMode
  language: AppLanguage
  initialSampleApplied: boolean
  setTheme: (nextTheme: ThemeMode) => void
  setLanguage: (nextLanguage: AppLanguage) => void
  setInitialSampleApplied: (applied: boolean) => void
}

export const useSettingsStore = create<SettingsState>((set) => ({
  theme: ThemeMode.System,
  language: readStoredAppLanguage(),
  initialSampleApplied: false,
  setTheme: (nextTheme) => set({ theme: nextTheme }),
  setLanguage: (nextLanguage) => set({ language: nextLanguage }),
  setInitialSampleApplied: (applied) => set({ initialSampleApplied: applied }),
}))
