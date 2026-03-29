import { useCallback, useEffect, useMemo, type ReactNode } from 'react'

import { useAuthStore } from '@/app/store/authStore'
import { useSettingsStore } from '@/app/store/settingsStore'
import { updateUserProfileFields } from '@/lib/firebase/userProfileRepository'
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

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSettingsStore((settingsStore) => settingsStore.theme)
  const setThemeInStore = useSettingsStore((settingsStore) => settingsStore.setTheme)
  const user = useAuthStore((authStore) => authStore.user)

  const setTheme = useCallback(
    (nextTheme: ThemeMode) => {
      setThemeInStore(nextTheme)
      const uid = user?.uid
      if (uid) {
        void updateUserProfileFields(uid, { theme: nextTheme })
      }
    },
    [setThemeInStore, user?.uid],
  )

  const resolvedTheme: ResolvedTheme =
    theme === ThemeMode.System
      ? getSystemTheme()
      : theme === ThemeMode.Dark
        ? ResolvedTheme.Dark
        : ResolvedTheme.Light

  useEffect(() => {
    const root = document.documentElement
    root.classList.remove(ResolvedTheme.Light, ResolvedTheme.Dark)
    root.classList.add(resolvedTheme)
  }, [resolvedTheme])

  useEffect(() => {
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

  const value = useMemo(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
    }),
    [theme, resolvedTheme, setTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
