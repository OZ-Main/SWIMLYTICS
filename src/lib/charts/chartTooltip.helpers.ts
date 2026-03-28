import { format, parseISO } from 'date-fns'

import { ISO_DATE_REGEX } from '@/shared/constants/calendar.constants'
import { DATE_FORMAT } from '@/shared/constants/dateDisplay.constants'
import { CHART_DATA_KEY, CHART_SERIES_NAME } from '@/shared/constants/chartData.constants'
import { formatDurationSeconds, formatPacePer100 } from '@/shared/helpers/formatters'

export type TooltipPayloadEntry = {
  name?: string
  value?: number | string
  dataKey?: string | number
}

export function formatChartTooltipLabel(label: string): string {
  if (ISO_DATE_REGEX.test(label)) {
    try {
      return format(parseISO(label), DATE_FORMAT.TOOLTIP_ISO_DATE)
    } catch {
      return label
    }
  }
  return label
}

export function formatChartTooltipValue(entry: TooltipPayloadEntry): string {
  const value = entry.value
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return String(value ?? '')
  }

  const name = String(entry.name ?? '')
  const dataKey = String(entry.dataKey ?? '')

  if (name === CHART_SERIES_NAME.PACE || dataKey === CHART_DATA_KEY.PACE) {
    return formatPacePer100(value)
  }

  if (name === CHART_SERIES_NAME.DURATION) {
    return formatDurationSeconds(value)
  }

  if (
    name === CHART_SERIES_NAME.METERS ||
    dataKey === CHART_DATA_KEY.METERS ||
    dataKey === CHART_DATA_KEY.VALUE ||
    name === CHART_DATA_KEY.VALUE
  ) {
    return `${Math.round(value).toLocaleString()} m`
  }

  return value.toLocaleString(undefined, { maximumFractionDigits: 2 })
}
