import { ISO_DATE_STRING_LENGTH } from '@/shared/constants/calendar.constants'

export const SETTINGS_DATA = {
  EXPORT_FILENAME_PREFIX: 'swimlytics-export-',
  EXPORT_FILE_EXTENSION: '.json',
} as const

export function buildExportDownloadFilename(isoDateSlice: string): string {
  return `${SETTINGS_DATA.EXPORT_FILENAME_PREFIX}${isoDateSlice}${SETTINGS_DATA.EXPORT_FILE_EXTENSION}`
}

export function exportFilenameDateSlice(isoTimestamp: string): string {
  return isoTimestamp.slice(0, ISO_DATE_STRING_LENGTH)
}
