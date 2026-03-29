import { useAthleteStore } from '@/app/store/athleteStore'
import { useCoachStore } from '@/app/store/coachStore'
import { usePersonalBestsStore } from '@/app/store/personalBestsStore'
import { useSettingsStore } from '@/app/store/settingsStore'
import { useTrainingSessionStore } from '@/app/store/trainingSessionStore'
import { useWorkoutTemplateStore } from '@/app/store/workoutTemplateStore'
import { ThemeMode } from '@/shared/domain'

export function resetCoachStoresAfterSignOut(): void {
  useCoachStore.getState().resetCoachState()
  useAthleteStore.getState().replaceAllAthletes([])
  useTrainingSessionStore.getState().replaceAllTrainingSessions([])
  useWorkoutTemplateStore.getState().replaceAllWorkoutTemplates([])
  usePersonalBestsStore.getState().replaceAllPersonalBests([])
  useSettingsStore.getState().setTheme(ThemeMode.System)
  useSettingsStore.getState().setInitialSampleApplied(false)
}
