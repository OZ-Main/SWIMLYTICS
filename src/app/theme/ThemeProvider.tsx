import * as React from 'react'

import { useSettingsStore } from '@/app/store/settingsStore'
import { ResolvedTheme, ThemeMode } from '@/shared/domain'

import { ThemeContext } from './theme-context'

function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') {
    return ResolvedTheme.Light
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? ResolvedTheme.Dark
    : ResolvedTheme.Light
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSettingsStore((settingsStore) => settingsStore.theme)
  const setTheme = useSettingsStore((settingsStore) => settingsStore.setTheme)

  const resolvedTheme: ResolvedTheme =
    theme === ThemeMode.System
      ? getSystemTheme()
      : theme === ThemeMode.Dark
        ? ResolvedTheme.Dark
        : ResolvedTheme.Light

  React.useEffect(() => {
    const root = document.documentElement
    root.classList.remove(ResolvedTheme.Light, ResolvedTheme.Dark)
    root.classList.add(resolvedTheme)
  }, [resolvedTheme])

  React.useEffect(() => {
    if (theme !== ThemeMode.System) {
      return
    }
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => {
      const next = mq.matches ? ResolvedTheme.Dark : ResolvedTheme.Light
      document.documentElement.classList.remove(ResolvedTheme.Light, ResolvedTheme.Dark)
      document.documentElement.classList.add(next)
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [theme])

  const value = React.useMemo(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
    }),
    [theme, resolvedTheme, setTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
