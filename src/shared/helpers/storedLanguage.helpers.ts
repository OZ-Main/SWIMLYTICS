import { LOCAL_STORAGE_LANGUAGE_KEY } from '@/shared/constants/i18n.constants'
import { AppLanguage } from '@/shared/domain'

import { isAppLanguage } from './appLanguage.helpers'

export function readStoredAppLanguage(): AppLanguage {
  if (typeof window === 'undefined') {
    return AppLanguage.English
  }

  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_LANGUAGE_KEY)
    if (stored && isAppLanguage(stored)) {
      return stored
    }
  } catch {
    /* ignore */
  }

  return AppLanguage.English
}
