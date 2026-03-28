import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Outlet, useLocation } from 'react-router-dom'

import { pageTransition } from '@/lib/motion'

/**
 * Route-level enter/exit. Keeps shell static; only the main outlet animates.
 */
export default function PageTransitionOutlet() {
  const location = useLocation()
  const reducedMotion = useReducedMotion()

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        className="w-full"
        initial={reducedMotion ? false : pageTransition.initial}
        animate={pageTransition.animate}
        exit={reducedMotion ? undefined : pageTransition.exit}
        transition={pageTransition.transition(reducedMotion)}
      >
        <Outlet />
      </motion.div>
    </AnimatePresence>
  )
}
