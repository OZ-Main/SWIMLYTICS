const ISO_CALENDAR_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

export function isValidIsoCalendarDateString(value: string): boolean {
  const trimmed = value.trim()
  if (!ISO_CALENDAR_DATE_PATTERN.test(trimmed)) {
    return false
  }

  const parsed = Date.parse(`${trimmed}T12:00:00.000Z`)

  return Number.isFinite(parsed)
}
