export const CHART_TICK_PX = 12

/** Tick font size when the chart container is below Tailwind `sm`. */
export const CHART_TICK_PX_COMPACT = 10

export const CHART_BAR_RADIUS: [number, number, number, number] = [4, 4, 0, 0]

export const RECHARTS_MARGIN_DEFAULT = {
  top: 12,
  right: 12,
  left: 4,
  bottom: 8,
} as const

export const RECHARTS_MARGIN_TIGHT_LEFT = {
  top: 12,
  right: 8,
  left: 0,
  bottom: 4,
} as const

/** Narrow-viewport bar/area chart margins (pairs with `CHART_TICK_PX_COMPACT`). */
export const RECHARTS_MARGIN_TIGHT_COMPACT = {
  top: 8,
  right: 4,
  left: 0,
  bottom: 2,
} as const

export const RECHARTS_MARGIN_DEFAULT_COMPACT = {
  top: 8,
  right: 6,
  left: 2,
  bottom: 6,
} as const

export const CHART_Y_AXIS_WIDTH_BAR = 44

export const CHART_Y_AXIS_WIDTH_BAR_COMPACT = 32

export const CHART_Y_AXIS_WIDTH_LINE = 40

export const CHART_Y_AXIS_WIDTH_LINE_COMPACT = 28
