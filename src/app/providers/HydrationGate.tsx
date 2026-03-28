import * as React from 'react'

import { usePersonalBestsStore } from '@/app/store/personalBestsStore'
import { useSettingsStore } from '@/app/store/settingsStore'
import { useWorkoutStore } from '@/app/store/workoutStore'
import { SEED_PERSONAL_BESTS, SEED_WORKOUTS } from '@/shared/constants/seedData'

function storesHydrated(): boolean {
  return (
    useWorkoutStore.persist.hasHydrated() &&
    usePersonalBestsStore.persist.hasHydrated() &&
    useSettingsStore.persist.hasHydrated()
  )
}

export function HydrationGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = React.useState(storesHydrated)

  React.useEffect(() => {
    if (storesHydrated()) {
      setReady(true)
      return
    }

    const markReady = () => {
      if (storesHydrated()) {
        setReady(true)
      }
    }

    const unsub1 = useWorkoutStore.persist.onFinishHydration(markReady)
    const unsub2 = usePersonalBestsStore.persist.onFinishHydration(markReady)
    const unsub3 = useSettingsStore.persist.onFinishHydration(markReady)
    markReady()

    return () => {
      unsub1()
      unsub2()
      unsub3()
    }
  }, [])

  React.useEffect(() => {
    if (!ready) {
      return
    }
    const { workouts, replaceAllWorkouts } = useWorkoutStore.getState()
    const { personalBests, replaceAllPersonalBests } = usePersonalBestsStore.getState()
    const { initialSampleApplied, setInitialSampleApplied } = useSettingsStore.getState()

    if (!initialSampleApplied && workouts.length === 0 && personalBests.length === 0) {
      replaceAllWorkouts(SEED_WORKOUTS)
      replaceAllPersonalBests(SEED_PERSONAL_BESTS)
      setInitialSampleApplied(true)
    }
  }, [ready])

  if (!ready) {
    return (
      <div className="px-page-padding-x flex min-h-screen flex-col items-center justify-center gap-stack bg-background">
        <div className="h-10 w-10 animate-pulse rounded-full bg-muted" aria-hidden />
        <p className="text-body text-muted-foreground" role="status">
          Loading SWIMLYTICS…
        </p>
      </div>
    )
  }

  return <>{children}</>
}
