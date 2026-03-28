import { useLayoutEffect, useState } from 'react'

import { useTheme } from '@/app/theme/useTheme'

import { type ResolvedChartTheme, resolveChartTheme } from './resolveChartTheme'

export function useChartTheme(): ResolvedChartTheme {
  const { resolvedTheme } = useTheme()
  const [theme, setTheme] = useState<ResolvedChartTheme>(resolveChartTheme)

  useLayoutEffect(() => {
    setTheme(resolveChartTheme())
  }, [resolvedTheme])

  return theme
}
