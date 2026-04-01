import { useCallback, useEffect, useMemo, type ReactNode } from 'react'

import { useAuthStore } from '@/app/store/authStore'
import { useSettingsStore } from '@/app/store/settingsStore'
import { updateUserProfileFields } from '@/lib/firebase/userProfileRepository'
import i18n from '@/i18n/config'
import { LOCAL_STORAGE_LANGUAGE_KEY } from '@/shared/constants/i18n.constants'
import { AppLanguage } from '@/shared/domain'

import { LanguageContext } from './language-context'

function persistLanguageLocal(next: AppLanguage) {
  try {
    localStorage.setItem(LOCAL_STORAGE_LANGUAGE_KEY, next)
  } catch {
    /* ignore */
  }
}

function syncDocumentLang(next: AppLanguage) {
  if (typeof document === 'undefined') {
    return
  }

  document.documentElement.lang = next
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const language = useSettingsStore((state) => state.language)
  const setLanguageInStore = useSettingsStore((state) => state.setLanguage)
  const user = useAuthStore((state) => state.user)

  const setLanguage = useCallback(
    (next: AppLanguage) => {
      setLanguageInStore(next)
      persistLanguageLocal(next)
      syncDocumentLang(next)
      void i18n.changeLanguage(next)
      const uid = user?.uid
      if (uid) {
        void updateUserProfileFields(uid, { language: next })
      }
    },
    [setLanguageInStore, user?.uid],
  )

  useEffect(() => {
    syncDocumentLang(language)
    persistLanguageLocal(language)
    void i18n.changeLanguage(language)
  }, [language])

  const value = useMemo(() => ({ language, setLanguage }), [language, setLanguage])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
