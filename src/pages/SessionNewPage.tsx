import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'

import { useAthleteStore } from '@/app/store/athleteStore'
import { useTrainingSessionStore } from '@/app/store/trainingSessionStore'
import PageHeader from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import SessionBuilder from '@/features/sessions/components/SessionBuilder'
import {
  createDraftGymTrainingSession,
  createDraftSwimmingTrainingSession,
} from '@/features/sessions/helpers/sessionFactories.helpers'
import { ROUTE_PARAM, sessionDetailPath } from '@/shared/constants/routes.constants'
import { AthleteTrainingType, PoolLength } from '@/shared/domain'
import type { TrainingSession } from '@/shared/types/domain.types'

export default function SessionNewPage() {
  const params = useParams()
  const athleteId = params[ROUTE_PARAM.athleteId]
  const navigate = useNavigate()
  const addTrainingSession = useTrainingSessionStore(
    (trainingSessionStore) => trainingSessionStore.addTrainingSession,
  )
  const athlete = useAthleteStore((athleteStore) =>
    athleteId
      ? athleteStore.athletes.find((candidateAthlete) => candidateAthlete.id === athleteId)
      : undefined,
  )

  const [draftSession, setDraftSession] = useState<TrainingSession | null>(null)

  useEffect(() => {
    if (!athleteId || !athlete) {
      return
    }
    setDraftSession((current) => {
      if (current) {
        return current
      }
      return athlete.trainingType === AthleteTrainingType.Gym
        ? createDraftGymTrainingSession(athleteId)
        : createDraftSwimmingTrainingSession(athleteId, PoolLength.Meters25)
    })
  }, [athleteId, athlete])

  if (!athleteId || !athlete) {
    return (
      <div className="page-stack">
        <PageHeader
          title="Athlete not found"
          description="Choose an athlete before logging a session."
        />
      </div>
    )
  }

  if (!draftSession) {
    return (
      <div className="page-stack">
        <PageHeader title="New session" description="Preparing the session builder…" />
        <p className="text-body-sm text-muted-foreground" role="status">
          Loading…
        </p>
      </div>
    )
  }

  async function handleSave() {
    if (!athleteId || !draftSession) {
      return
    }
    if (draftSession.blocks.length === 0) {
      toast.error('Add at least one training block.')
      return
    }
    const now = new Date().toISOString()
    const toSave: TrainingSession = {
      ...draftSession,
      updatedAt: now,
      createdAt: draftSession.createdAt || now,
    }
    try {
      await addTrainingSession(toSave)
      toast.success('Session saved')
      navigate(sessionDetailPath(athleteId, toSave.id))
    } catch {
      toast.error('Could not save session.')
    }
  }

  const title =
    athlete.trainingType === AthleteTrainingType.Gym
      ? 'New gym session'
      : 'New pool session'
  const description =
    athlete.trainingType === AthleteTrainingType.Gym
      ? `Build a session from parts — duration adds up for ${athlete.fullName}.`
      : `Add warm-up, main sets, and cool-down as separate blocks for ${athlete.fullName}.`

  return (
    <div className="page-stack">
      <PageHeader title={title} description={description} />
      <SessionBuilder session={draftSession} onChange={setDraftSession} />
      <div className="form-footer-actions">
        <Button type="button" variant="outline" onClick={() => navigate(-1)}>
          Cancel
        </Button>
        <Button type="button" onClick={handleSave}>
          Save session
        </Button>
      </div>
    </div>
  )
}
