import { TIME } from '@/shared/constants/time.constants'

export function totalSecondsFromMinutesAndSeconds(minutes: number, seconds: number): number {
  return minutes * TIME.SECONDS_PER_MINUTE + seconds
}

export function formatTrainingBlockDurationMinutesField(durationSeconds: number): string {
  if (!Number.isFinite(durationSeconds) || durationSeconds <= 0) {
    return ''
  }

  const minutes = durationSeconds / TIME.SECONDS_PER_MINUTE
  const rounded = Math.round(minutes * 100) / 100

  return String(rounded)
}

export function parseTrainingBlockDurationMinutesToSeconds(
  raw: string,
  maxMinutes: number,
): number {
  const trimmed = raw.trim()
  if (trimmed === '') {
    return 0
  }

  const minutes = Number(trimmed)
  if (!Number.isFinite(minutes) || minutes < 0) {
    return 0
  }

  const cappedMinutes = Math.min(minutes, maxMinutes)

  return Math.round(cappedMinutes * TIME.SECONDS_PER_MINUTE)
}
