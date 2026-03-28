/** Recharts layout numbers (pixels / degrees) with domain meaning. */
export const PIE_CHART_LAYOUT = {
  INNER_RADIUS: 56,
  OUTER_RADIUS: 88,
  PADDING_ANGLE_DEG: 2,
} as const

/** Smaller pie for narrow containers (mobile); keeps slice + legend readable. */
export const PIE_CHART_LAYOUT_COMPACT = {
  INNER_RADIUS: 44,
  OUTER_RADIUS: 70,
  PADDING_ANGLE_DEG: 2,
} as const

export const LINE_POINT_STYLE = {
  DOT_RADIUS: 3,
  ACTIVE_DOT_RADIUS: 4,
  STROKE_WIDTH: 2,
} as const
