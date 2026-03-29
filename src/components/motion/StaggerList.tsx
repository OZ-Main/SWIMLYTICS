import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

import {
  staggerContainer,
  staggerContainerReduced,
  staggerItem,
  staggerItemReduced,
} from '@/lib/motion'
import { cn } from '@/shared/utils/cn'

type StaggerListProps = {
  className?: string
  children: ReactNode
}

export function StaggerList({ className, children }: StaggerListProps) {
  const reduced = useReducedMotion()
  return (
    <motion.ul
      className={cn(className)}
      initial="hidden"
      animate="visible"
      variants={reduced ? staggerContainerReduced : staggerContainer}
    >
      {children}
    </motion.ul>
  )
}

type StaggerItemProps = {
  className?: string
  children: ReactNode
}

export function StaggerItem({ className, children }: StaggerItemProps) {
  const reduced = useReducedMotion()
  return (
    <motion.li className={cn(className)} variants={reduced ? staggerItemReduced : staggerItem}>
      {children}
    </motion.li>
  )
}
