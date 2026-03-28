import { ThemeMode } from '@/shared/domain'

export const THEME_MODE_LABEL: Record<ThemeMode, string> = {
  [ThemeMode.Light]: 'Light',
  [ThemeMode.Dark]: 'Dark',
  [ThemeMode.System]: 'System',
}
