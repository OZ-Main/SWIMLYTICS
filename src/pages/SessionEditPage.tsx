import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'

import { useTrainingSessionStore } from '@/app/store/trainingSessionStore'
import PageHeader from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import SessionBuilder from '@/features/sessions/components/SessionBuilder'
import { ROUTE_PARAM, sessionDetailPath } from '@/shared/constants/routes.constants'
import type { TrainingSession } from '@/shared/types/domain.types'

export default function SessionEditPage() {
  const params = useParams()
  const athleteId = params[ROUTE_PARAM.athleteId]
  const sessionId = params[ROUTE_PARAM.sessionId]
  const trainingSessions = useTrainingSessionStore(
    (trainingSessionStore) => trainingSessionStore.trainingSessions,
  )

  const persistedSession =
    sessionId && athleteId
      ? trainingSessions.find(
          (candidateSession) =>
            candidateSession.id === sessionId && candidateSession.athleteId === athleteId,
        )
      : undefined

  const mismatch =
    persistedSession && athleteId && persistedSession.athleteId !== athleteId

  if (!sessionId || !athleteId || !persistedSession || mismatch) {
    return (
      <div className="page-stack">
        <PageHeader title="Session not found" description="This session may have been removed." />
      </div>
    )
  }

  return <SessionEditFormInner key={sessionId} persistedSession={persistedSession} />
}

type SessionEditFormInnerProps = {
  persistedSession: TrainingSession
}

function SessionEditFormInner({ persistedSession }: SessionEditFormInnerProps) {
  const navigate = useNavigate()
  const updateTrainingSession = useTrainingSessionStore(
    (trainingSessionStore) => trainingSessionStore.updateTrainingSession,
  )
  const [draftSession, setDraftSession] = useState<TrainingSession>(persistedSession)

  async function handleSave() {
    if (draftSession.blocks.length === 0) {
      toast.error('Keep at least one training block.')
      return
    }
    const now = new Date().toISOString()
    const toSave: TrainingSession = {
      ...draftSession,
      updatedAt: now,
    }
    try {
      await updateTrainingSession(toSave)
      toast.success('Session updated')
      navigate(sessionDetailPath(toSave.athleteId, toSave.id))
    } catch {
      toast.error('Could not update session.')
    }
  }

  return (
    <div className="page-stack">
      <PageHeader
        title="Edit session"
        description="Adjust blocks — totals update from all parts."
      />
      <SessionBuilder session={draftSession} onChange={setDraftSession} />
      <div className="form-footer-actions">
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            navigate(sessionDetailPath(persistedSession.athleteId, persistedSession.id))
          }
        >
          Cancel
        </Button>
        <Button type="button" onClick={handleSave}>
          Save changes
        </Button>
      </div>
    </div>
  )
}
