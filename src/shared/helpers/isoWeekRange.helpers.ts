import { endOfWeek, format, startOfWeek } from 'date-fns'

import { weekOptionsMonday } from '@/shared/constants/calendar.constants'
import { DATE_FORMAT } from '@/shared/constants/dateDisplay.constants'

/** ISO calendar dates (`yyyy-MM-dd`) for the Monday–Sunday week containing `referenceDate`. */
export function isoWeekRangeStrings(referenceDate: Date = new Date()): {
  dateFrom: string
  dateTo: string
} {
  const start = startOfWeek(referenceDate, weekOptionsMonday)
  const end = endOfWeek(referenceDate, weekOptionsMonday)
  return {
    dateFrom: format(start, DATE_FORMAT.STATS_WEEK_BUCKET_KEY),
    dateTo: format(end, DATE_FORMAT.STATS_WEEK_BUCKET_KEY),
  }
}
