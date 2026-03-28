import { parseISO } from 'date-fns'

import type { WorkoutFilters } from '@/features/workouts/types/workout-filters.types'
import { WORKOUT_FILTER_ALL } from '@/shared/constants/workoutFilter.constants'
import { STROKE_LABELS } from '@/shared/constants/strokeLabels'
import type { Workout } from '@/shared/types/domain.types'

export function filterWorkouts(workouts: Workout[], filters: WorkoutFilters): Workout[] {
  const q = filters.search.trim().toLowerCase()
  return workouts.filter((w) => {
    if (filters.stroke !== WORKOUT_FILTER_ALL && w.stroke !== filters.stroke) {
      return false
    }
    if (filters.effortLevel !== WORKOUT_FILTER_ALL && w.effortLevel !== filters.effortLevel) {
      return false
    }
    if (filters.dateFrom) {
      if (w.date < filters.dateFrom) {
        return false
      }
    }
    if (filters.dateTo) {
      if (w.date > filters.dateTo) {
        return false
      }
    }
    if (q) {
      const hay = [w.notes, STROKE_LABELS[w.stroke], w.effortLevel, w.date].join(' ').toLowerCase()
      if (!hay.includes(q)) {
        return false
      }
    }
    return true
  })
}

export function sortWorkoutsByDateDesc(workouts: Workout[]): Workout[] {
  return [...workouts].sort((a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime())
}
