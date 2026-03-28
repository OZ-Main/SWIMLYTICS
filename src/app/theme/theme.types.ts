import type { ResolvedTheme, ThemeMode } from '@/shared/domain'

export type { ResolvedTheme, ThemeMode } from '@/shared/domain'

export type ThemeContextValue = {
  theme: ThemeMode
  resolvedTheme: ResolvedTheme
  setTheme: (theme: ThemeMode) => void
}
