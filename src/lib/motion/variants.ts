import { MOTION_EASE, MOTION_MS } from './tokens'

const sec = (ms: number) => ms / 1000

export const pageTransition = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
  transition: (reducedMotion: boolean | null) =>
    reducedMotion
      ? { duration: 0 }
      : {
          duration: sec(MOTION_MS.normal),
          ease: MOTION_EASE.standard,
        },
} as const

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.035,
      delayChildren: 0.04,
    },
  },
} as const

export const staggerContainerReduced = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0, delayChildren: 0 },
  },
} as const

export const staggerItem = {
  hidden: { opacity: 0, y: 5 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: sec(MOTION_MS.normal),
      ease: MOTION_EASE.standard,
    },
  },
} as const

export const staggerItemReduced = {
  hidden: { opacity: 1, y: 0 },
  visible: { opacity: 1, y: 0 },
} as const
