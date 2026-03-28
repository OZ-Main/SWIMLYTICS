import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { STORAGE_KEYS } from '@/lib/storage/storageKeys'
import type { Workout } from '@/shared/types/domain.types'

type WorkoutState = {
  workouts: Workout[]
  addWorkout: (workout: Workout) => void
  updateWorkout: (workout: Workout) => void
  deleteWorkout: (id: string) => void
  replaceAllWorkouts: (workouts: Workout[]) => void
}

export const useWorkoutStore = create<WorkoutState>()(
  persist(
    (set, get) => ({
      workouts: [],
      addWorkout: (workout) => set({ workouts: [workout, ...get().workouts] }),
      updateWorkout: (workout) =>
        set({
          workouts: get().workouts.map((w) => (w.id === workout.id ? workout : w)),
        }),
      deleteWorkout: (id) =>
        set({
          workouts: get().workouts.filter((w) => w.id !== id),
        }),
      replaceAllWorkouts: (workouts) => set({ workouts }),
    }),
    {
      name: STORAGE_KEYS.WORKOUTS,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ workouts: state.workouts }),
    },
  ),
)
