/** date-fns display patterns reused across charts and tables. */
export const DATE_FORMAT = {
  CHART_WEEK_START: 'MMM d',
  CHART_MONTH_SHORT: 'MMM yy',
  STATS_WEEK_LABEL: "MMM d ''yy",
  STATS_MONTH_LABEL: 'MMM yyyy',
  STATS_WEEK_BUCKET_KEY: 'yyyy-MM-dd',
  LIST_ROW: 'MMM d, yyyy',
  TOOLTIP_ISO_DATE: 'MMM d, yyyy',
  WORKOUT_DETAIL_HEADING: 'EEEE, MMM d, yyyy',
} as const

export const PACE_AXIS_LABEL = 'sec/100m' as const
