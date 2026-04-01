import { AppLanguage } from '@/shared/domain'

export function isAppLanguage(value: string): value is AppLanguage {
  return (Object.values(AppLanguage) as string[]).includes(value)
}

export function parseAppLanguage(value: unknown): AppLanguage {
  if (value === AppLanguage.English || value === AppLanguage.Romanian || value === AppLanguage.Russian) {
    return value
  }

  return AppLanguage.English
}
