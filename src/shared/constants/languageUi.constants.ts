import { AppLanguage } from '@/shared/domain'

export const APP_LANGUAGE_OPTIONS = [
  AppLanguage.English,
  AppLanguage.Romanian,
  AppLanguage.Russian,
] as const

/** Native endonyms for the language picker (not translated). */
export const APP_LANGUAGE_NATIVE_LABEL: Record<AppLanguage, string> = {
  [AppLanguage.English]: 'English',
  [AppLanguage.Romanian]: 'Română',
  [AppLanguage.Russian]: 'Русский',
}
