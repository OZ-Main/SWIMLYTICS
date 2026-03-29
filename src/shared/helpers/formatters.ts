export function formatRaceClock(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) {
    return '—'
  }

  const wholeMinutes = Math.floor(totalSeconds / 60)
  const subMinuteSeconds = totalSeconds - wholeMinutes * 60
  if (wholeMinutes === 0) {
    return subMinuteSeconds.toFixed(2)
  }

  const secPart = subMinuteSeconds.toFixed(2).padStart(5, '0')
  return `${wholeMinutes}:${secPart}`
}

export function formatDurationSeconds(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) {
    return '—'
  }

  const totalWholeSeconds = Math.floor(totalSeconds)
  const hours = Math.floor(totalWholeSeconds / 3600)
  const minutes = Math.floor((totalWholeSeconds % 3600) / 60)
  const seconds = totalWholeSeconds % 60
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }

  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

export function formatPacePer100(secondsPer100: number): string {
  if (!Number.isFinite(secondsPer100) || secondsPer100 <= 0) {
    return '—'
  }

  const wholeSeconds = Math.floor(secondsPer100)
  const paceMinutes = Math.floor(wholeSeconds / 60)
  const paceSeconds = wholeSeconds % 60
  const tenths = Math.round((secondsPer100 - wholeSeconds) * 10)
  const secPart =
    tenths > 0
      ? `${String(paceSeconds).padStart(2, '0')}.${tenths}`
      : String(paceSeconds).padStart(2, '0')
  return `${paceMinutes}:${secPart.padStart(4, '0')} /100m`
}

export function formatDistanceMeters(meters: number): string {
  if (!Number.isFinite(meters) || meters < 0) {
    return '—'
  }

  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(1)} km`
  }

  return `${Math.round(meters)} m`
}

export function parseFlexibleDurationToSeconds(input: string): number | null {
  const trimmed = input.trim()
  if (!trimmed) {
    return null
  }

  const parts = trimmed.split(':').map((segment) => segment.trim())
  if (parts.some((segment) => segment === '' || Number.isNaN(Number(segment)))) {
    return null
  }

  const nums = parts.map((segment) => Number(segment))
  if (nums.length === 1) {
    return nums[0]
  }

  if (nums.length === 2) {
    return nums[0] * 60 + nums[1]
  }

  if (nums.length === 3) {
    return nums[0] * 3600 + nums[1] * 60 + nums[2]
  }

  return null
}
