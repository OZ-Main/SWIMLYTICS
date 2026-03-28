import { useMediaQuery } from '@/lib/hooks/useMediaQuery'
import {
  CHART_TICK_PX,
  CHART_TICK_PX_COMPACT,
  CHART_Y_AXIS_WIDTH_BAR,
  CHART_Y_AXIS_WIDTH_BAR_COMPACT,
  CHART_Y_AXIS_WIDTH_LINE,
  CHART_Y_AXIS_WIDTH_LINE_COMPACT,
  RECHARTS_MARGIN_DEFAULT,
  RECHARTS_MARGIN_DEFAULT_COMPACT,
  RECHARTS_MARGIN_TIGHT_COMPACT,
  RECHARTS_MARGIN_TIGHT_LEFT,
} from '@/shared/constants/chartUi.constants'
import { PIE_CHART_LAYOUT, PIE_CHART_LAYOUT_COMPACT } from '@/shared/constants/chartLayout.constants'
import { MEDIA_QUERY_MIN_SM } from '@/shared/constants/tailwindBreakpointMedia.constants'

/** Recharts tick sizes, margins, and pie radii aligned with Tailwind `sm` (see `MEDIA_QUERY_MIN_SM`). */
export function useResponsiveChartLayout() {
  const isSmUp = useMediaQuery(MEDIA_QUERY_MIN_SM)

  return {
    isSmUp,
    tickFontSize: isSmUp ? CHART_TICK_PX : CHART_TICK_PX_COMPACT,
    yAxisWidthBar: isSmUp ? CHART_Y_AXIS_WIDTH_BAR : CHART_Y_AXIS_WIDTH_BAR_COMPACT,
    yAxisWidthLine: isSmUp ? CHART_Y_AXIS_WIDTH_LINE : CHART_Y_AXIS_WIDTH_LINE_COMPACT,
    marginTight: isSmUp ? { ...RECHARTS_MARGIN_TIGHT_LEFT } : { ...RECHARTS_MARGIN_TIGHT_COMPACT },
    marginDefault: isSmUp ? { ...RECHARTS_MARGIN_DEFAULT } : { ...RECHARTS_MARGIN_DEFAULT_COMPACT },
    pieLayout: isSmUp ? PIE_CHART_LAYOUT : PIE_CHART_LAYOUT_COMPACT,
  }
}
