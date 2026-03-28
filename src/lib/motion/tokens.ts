/**
 * Central motion timing (milliseconds). Mirrors CSS variables in `globals.css`.
 * Use for Framer Motion and any JS-driven animation.
 */
export const MOTION_MS = {
  fast: 140,
  normal: 220,
  slow: 320,
} as const

/** Cubic-bezier tuples for Framer Motion `ease`. */
export const MOTION_EASE = {
  /** Default UI — snappy, neutral */
  standard: [0.2, 0, 0, 1] as const,
  /** Emphasis — slightly more weight */
  emphasized: [0.22, 1, 0.36, 1] as const,
  /** Decelerate — settle-in */
  decelerate: [0, 0, 0.2, 1] as const,
  /** Out — exits / overlays */
  out: [0.16, 1, 0.3, 1] as const,
} as const
