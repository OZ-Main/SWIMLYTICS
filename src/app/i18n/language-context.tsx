import { createContext } from 'react'

import type { AppLanguage } from '@/shared/domain'

export type LanguageContextValue = {
  language: AppLanguage
  setLanguage: (next: AppLanguage) => void
}

export const LanguageContext = createContext<LanguageContextValue | null>(null)
