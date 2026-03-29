import { create } from 'zustand'

import { useAuthStore } from '@/app/store/authStore'
import {
  deleteWorkoutTemplateDocument,
  writeWorkoutTemplateDocument,
} from '@/lib/firebase/coachDataRepository'
import type { WorkoutTemplate } from '@/shared/types/domain.types'

function requireCoachUid(): string {
  const uid = useAuthStore.getState().user?.uid
  if (!uid) {
    throw new Error('You must be signed in to change workout templates.')
  }

  return uid
}

type WorkoutTemplateState = {
  workoutTemplates: WorkoutTemplate[]
  addWorkoutTemplate: (template: WorkoutTemplate) => Promise<void>
  updateWorkoutTemplate: (template: WorkoutTemplate) => Promise<void>
  deleteWorkoutTemplate: (templateId: string) => Promise<void>
  replaceAllWorkoutTemplates: (nextTemplates: WorkoutTemplate[]) => void
}

export const useWorkoutTemplateStore = create<WorkoutTemplateState>(() => ({
  workoutTemplates: [],
  addWorkoutTemplate: async (template) => {
    await writeWorkoutTemplateDocument(requireCoachUid(), template)
  },
  updateWorkoutTemplate: async (template) => {
    await writeWorkoutTemplateDocument(requireCoachUid(), template)
  },
  deleteWorkoutTemplate: async (templateId) => {
    await deleteWorkoutTemplateDocument(requireCoachUid(), templateId)
  },
  replaceAllWorkoutTemplates: (nextTemplates) => {
    useWorkoutTemplateStore.setState({ workoutTemplates: nextTemplates })
  },
}))
