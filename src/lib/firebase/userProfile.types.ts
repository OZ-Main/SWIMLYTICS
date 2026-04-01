import type { AppLanguage, ThemeMode } from '@/shared/domain'

export type FirestoreUserProfileFields = {
  displayName: string
  createdAt: string
  email?: string | null
  theme: ThemeMode
  language: AppLanguage
  initialSampleApplied: boolean
}
