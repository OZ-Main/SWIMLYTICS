export function formatRaceClock(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) {
    return '—'
  }
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds - m * 60
  if (m === 0) {
    return s.toFixed(2)
  }
  const secPart = s.toFixed(2).padStart(5, '0')
  return `${m}:${secPart}`
}

export function formatDurationSeconds(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) {
    return '—'
  }
  const s = Math.floor(totalSeconds)
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  }
  return `${m}:${String(sec).padStart(2, '0')}`
}

export function formatPacePer100(secondsPer100: number): string {
  if (!Number.isFinite(secondsPer100) || secondsPer100 <= 0) {
    return '—'
  }
  const s = Math.floor(secondsPer100)
  const m = Math.floor(s / 60)
  const sec = s % 60
  const tenths = Math.round((secondsPer100 - s) * 10)
  const secPart =
    tenths > 0 ? `${String(sec).padStart(2, '0')}.${tenths}` : String(sec).padStart(2, '0')
  return `${m}:${secPart.padStart(4, '0')} /100m`
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
  const parts = trimmed.split(':').map((p) => p.trim())
  if (parts.some((p) => p === '' || Number.isNaN(Number(p)))) {
    return null
  }
  const nums = parts.map((p) => Number(p))
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
