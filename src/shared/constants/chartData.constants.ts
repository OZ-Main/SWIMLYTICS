/**
 * Recharts `dataKey` / series `name` values — must match tooltip formatters.
 */
export const CHART_DATA_KEY = {
  VALUE: 'value',
  NAME: 'name',
  PACE: 'pace',
  DATE: 'date',
  METERS: 'meters',
  WEEK_LABEL: 'weekLabel',
  MONTH_LABEL: 'monthLabel',
} as const

export const CHART_SERIES_NAME = {
  METERS: 'Meters',
  PACE: 'Pace',
  /** Total session time (tooltip uses duration formatter). */
  DURATION: 'Duration',
} as const
