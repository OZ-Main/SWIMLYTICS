import { useMediaQuery } from '@/lib/hooks/useMediaQuery'
import {
  MEDIA_QUERY_MIN_LG,
  MEDIA_QUERY_MIN_SM,
} from '@/shared/constants/tailwindBreakpointMedia.constants'

export function useResponsiveChartLayout() {
  const isSmUp = useMediaQuery(MEDIA_QUERY_MIN_SM)
  const isLgUp = useMediaQuery(MEDIA_QUERY_MIN_LG)

  return {
    isSmUp,
    isLgUp,
    marginTight: isSmUp
      ? { top: 12, right: 8, left: 0, bottom: 4 }
      : { top: 8, right: 4, left: 0, bottom: 2 },
    marginDefault: isSmUp
      ? { top: 12, right: 12, left: 4, bottom: 8 }
      : { top: 8, right: 6, left: 2, bottom: 6 },
    yAxisWidthBar: isSmUp ? 44 : 32,
    yAxisWidthLine: isSmUp ? 40 : 28,
  }
}
