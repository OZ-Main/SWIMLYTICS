import { TIME } from '@/shared/constants/time.constants'

export function totalSecondsFromMinutesAndSeconds(minutes: number, seconds: number): number {
  return minutes * TIME.SECONDS_PER_MINUTE + seconds
}
