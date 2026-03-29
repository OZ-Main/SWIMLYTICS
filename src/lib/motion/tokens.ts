export const MOTION_MS = {
  fast: 140,
  normal: 220,
  slow: 320,
} as const

export const MOTION_EASE = {
  standard: [0.2, 0, 0, 1] as const,
  emphasized: [0.22, 1, 0.36, 1] as const,
  decelerate: [0, 0, 0.2, 1] as const,
  out: [0.16, 1, 0.3, 1] as const,
} as const
