import * as React from 'react'

import { useAthleteStore } from '@/app/store/athleteStore'
import { useCoachStore } from '@/app/store/coachStore'
import { usePersonalBestsStore } from '@/app/store/personalBestsStore'
import { useSettingsStore } from '@/app/store/settingsStore'
import { useTrainingSessionStore } from '@/app/store/trainingSessionStore'
import { migrateLegacyStorage } from '@/lib/storage/migrateLegacyStorage'
import {
  SEED_ATHLETES,
  SEED_PERSONAL_BESTS,
  SEED_TRAINING_SESSIONS,
} from '@/shared/constants/seedData'

function storesHydrated(): boolean {
  return (
    useTrainingSessionStore.persist.hasHydrated() &&
    usePersonalBestsStore.persist.hasHydrated() &&
    useSettingsStore.persist.hasHydrated() &&
    useAthleteStore.persist.hasHydrated() &&
    useCoachStore.persist.hasHydrated()
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

    const unsubscribeSessions = useTrainingSessionStore.persist.onFinishHydration(markReady)
    const unsubscribePersonalBests = usePersonalBestsStore.persist.onFinishHydration(markReady)
    const unsubscribeSettings = useSettingsStore.persist.onFinishHydration(markReady)
    const unsubscribeAthletes = useAthleteStore.persist.onFinishHydration(markReady)
    const unsubscribeCoach = useCoachStore.persist.onFinishHydration(markReady)
    markReady()

    return () => {
      unsubscribeSessions()
      unsubscribePersonalBests()
      unsubscribeSettings()
      unsubscribeAthletes()
      unsubscribeCoach()
    }
  }, [])

  React.useEffect(() => {
    if (!ready) {
      return
    }
    migrateLegacyStorage()

    const { trainingSessions, replaceAllTrainingSessions } = useTrainingSessionStore.getState()
    const { personalBests, replaceAllPersonalBests } = usePersonalBestsStore.getState()
    const { athletes, replaceAllAthletes } = useAthleteStore.getState()
    const { initialSampleApplied, setInitialSampleApplied } = useSettingsStore.getState()

    if (
      !initialSampleApplied &&
      athletes.length === 0 &&
      trainingSessions.length === 0 &&
      personalBests.length === 0
    ) {
      replaceAllAthletes(SEED_ATHLETES)
      replaceAllTrainingSessions(SEED_TRAINING_SESSIONS)
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
