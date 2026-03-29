import { Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { format, parseISO } from 'date-fns'

import { useTrainingSessionStore } from '@/app/store/trainingSessionStore'
import PageHeader from '@/components/layout/PageHeader'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { buildSwimmingSessionSummary } from '@/features/sessions/helpers/sessionSummary.helpers'
import {
  formatSwimmingBlockDistanceSummary,
  getGymSessionTotalDurationSeconds,
  getSwimmingSessionTotalDistanceMeters,
  getSwimmingSessionTotalDurationSeconds,
  getSwimmingSessionWeightedPacePer100Seconds,
} from '@/features/sessions/helpers/sessionTotals.helpers'
import { DATE_FORMAT } from '@/shared/constants/dateDisplay.constants'
import { EFFORT_LABELS } from '@/shared/constants/effortLabels'
import { GYM_BLOCK_CATEGORY_LABEL } from '@/shared/constants/gymBlockCategoryLabels'
import {
  APP_ROUTE,
  athleteDetailPath,
  ROUTE_PARAM,
  sessionEditPath,
} from '@/shared/constants/routes.constants'
import { STROKE_LABELS } from '@/shared/constants/strokeLabels'
import { SWIMMING_BLOCK_CATEGORY_LABEL } from '@/shared/constants/swimmingBlockCategoryLabels'
import {
  formatDistanceMeters,
  formatDurationSeconds,
  formatPacePer100,
} from '@/shared/helpers/formatters'
import { isGymTrainingSession, isSwimmingTrainingSession } from '@/shared/helpers/sessionType.helpers'

export default function SessionDetailPage() {
  const params = useParams()
  const athleteId = params[ROUTE_PARAM.athleteId]
  const sessionId = params[ROUTE_PARAM.sessionId]
  const navigate = useNavigate()
  const trainingSessions = useTrainingSessionStore(
    (trainingSessionStore) => trainingSessionStore.trainingSessions,
  )
  const deleteTrainingSession = useTrainingSessionStore(
    (trainingSessionStore) => trainingSessionStore.deleteTrainingSession,
  )
  const [confirmOpen, setConfirmOpen] = useState(false)

  const session =
    sessionId && athleteId
      ? trainingSessions.find(
          (candidateSession) =>
            candidateSession.id === sessionId && candidateSession.athleteId === athleteId,
        )
      : undefined

  const mismatch = session && athleteId && session.athleteId !== athleteId

  if (!sessionId || !athleteId || !session || mismatch) {
    return (
      <div className="page-stack">
        <PageHeader
          title="Session not found"
          description="This session may have been removed or the link is invalid."
          actions={
            <Button asChild variant="outline">
              <Link to={APP_ROUTE.athletes}>Athletes</Link>
            </Button>
          }
        />
      </div>
    )
  }

  const activeSession = session
  const backHref = athleteDetailPath(athleteId)

  function handleDelete() {
    deleteTrainingSession(activeSession.id)
    toast.success('Session removed')
    setConfirmOpen(false)
    navigate(backHref)
  }

  if (isGymTrainingSession(activeSession)) {
    const sortedBlocks = [...activeSession.blocks].sort(
      (left, right) => left.orderIndex - right.orderIndex,
    )
    const totalSeconds = getGymSessionTotalDurationSeconds(activeSession)
    return (
      <div className="page-stack">
        <div className="page-toolbar sm:items-start">
          <div>
            <p className="section-label">Gym session</p>
            <h1 className="mt-tight text-heading-xl sm:text-display-lg">
              {activeSession.sessionTitle.trim()
                ? activeSession.sessionTitle
                : format(parseISO(activeSession.date), DATE_FORMAT.WORKOUT_DETAIL_HEADING)}
            </h1>
            <p className="mt-tight text-body-sm text-muted-foreground">
              {format(parseISO(activeSession.date), DATE_FORMAT.LIST_ROW)} · {sortedBlocks.length}{' '}
              blocks
            </p>
          </div>
          <div className="flex w-full min-w-0 flex-col gap-tight sm:w-auto sm:flex-row sm:flex-wrap">
            <Button variant="outline" asChild className="min-h-10 w-full touch-manipulation sm:min-h-10 sm:min-h-0 sm:w-auto">
              <Link to={sessionEditPath(athleteId, activeSession.id)}>
                <Pencil className="h-4 w-4" aria-hidden />
                Edit
              </Link>
            </Button>
            <Button
              variant="destructive"
              className="min-h-10 w-full touch-manipulation sm:min-h-10 sm:min-h-0 sm:w-auto"
              onClick={() => setConfirmOpen(true)}
            >
              <Trash2 className="h-4 w-4" aria-hidden />
              Delete
            </Button>
          </div>
        </div>

        <Card className="overflow-hidden">
          <CardHeader className="page-section-header">
            <CardTitle className="page-section-title text-muted-foreground">
              Total duration
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-card">
            <p className="font-display text-kpi tabular-nums text-foreground">
              {formatDurationSeconds(totalSeconds)}
            </p>
          </CardContent>
        </Card>

        <div className="space-y-stack">
          <p className="section-label">Training parts</p>
          {sortedBlocks.map((block, index) => (
            <Card key={block.id}>
              <CardHeader className="nested-card-header">
                <div className="flex flex-col gap-tight sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                  <CardTitle className="font-display text-heading-sm">
                    {index + 1}. {block.title}
                  </CardTitle>
                  <Badge variant="secondary" className="w-fit">
                    {GYM_BLOCK_CATEGORY_LABEL[block.category]}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-tight pt-card text-body-sm">
                <p>
                  <span className="text-muted-foreground">Focus:</span>{' '}
                  <span className="font-medium text-foreground">{block.focus || '—'}</span>
                </p>
                <p>
                  <span className="text-muted-foreground">Duration:</span>{' '}
                  {formatDurationSeconds(block.durationSeconds)}
                </p>
                <p>
                  <span className="text-muted-foreground">Effort:</span>{' '}
                  {EFFORT_LABELS[block.effortLevel]}
                </p>
                {block.notes.trim() ? (
                  <p className="whitespace-pre-wrap text-muted-foreground">{block.notes}</p>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>

        <SessionNotesCard notes={activeSession.notes} />

        <Separator />

        <Button variant="ghost" asChild>
          <Link to={backHref}>← Back to athlete</Link>
        </Button>

        <DeleteSessionDialog
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
          onConfirm={handleDelete}
          trainingModality="gym"
        />
      </div>
    )
  }

  if (!isSwimmingTrainingSession(activeSession)) {
    return null
  }

  const sortedSwimBlocks = [...activeSession.blocks].sort(
    (left, right) => left.orderIndex - right.orderIndex,
  )
  const swimSummary = buildSwimmingSessionSummary(activeSession, 4)
  const pace = getSwimmingSessionWeightedPacePer100Seconds(activeSession)

  return (
    <div className="page-stack">
      <div className="page-toolbar sm:items-start">
        <div>
          <p className="section-label">Pool session</p>
          <h1 className="mt-tight text-heading-xl sm:text-display-lg">
            {activeSession.sessionTitle.trim()
              ? activeSession.sessionTitle
              : format(parseISO(activeSession.date), DATE_FORMAT.WORKOUT_DETAIL_HEADING)}
          </h1>
          <p className="mt-tight text-body-sm text-muted-foreground">
            {swimSummary.primaryStrokeLabel ? `Lead stroke: ${swimSummary.primaryStrokeLabel}` : null}
            {swimSummary.primaryStrokeLabel ? ' · ' : ''}
            {sortedSwimBlocks.length} blocks
          </p>
        </div>
        <div className="flex w-full min-w-0 flex-col gap-tight sm:w-auto sm:flex-row sm:flex-wrap">
          <Button variant="outline" asChild className="min-h-10 w-full touch-manipulation sm:min-h-10 sm:min-h-0 sm:w-auto">
            <Link to={sessionEditPath(athleteId, activeSession.id)}>
              <Pencil className="h-4 w-4" aria-hidden />
              Edit
            </Link>
          </Button>
          <Button
            variant="destructive"
            className="min-h-10 w-full touch-manipulation sm:min-h-10 sm:min-h-0 sm:w-auto"
            onClick={() => setConfirmOpen(true)}
          >
            <Trash2 className="h-4 w-4" aria-hidden />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-stack sm:grid-cols-2 md:grid-cols-3">
        <Card className="overflow-hidden">
          <CardHeader className="page-section-header">
            <CardTitle className="page-section-title text-muted-foreground">Distance</CardTitle>
          </CardHeader>
          <CardContent className="pt-card">
            <p className="font-display text-kpi tabular-nums text-foreground">
              {formatDistanceMeters(getSwimmingSessionTotalDistanceMeters(activeSession))}
            </p>
          </CardContent>
        </Card>
        <Card className="overflow-hidden">
          <CardHeader className="page-section-header">
            <CardTitle className="page-section-title text-muted-foreground">Duration</CardTitle>
          </CardHeader>
          <CardContent className="pt-card">
            <p className="font-display text-kpi tabular-nums text-foreground">
              {formatDurationSeconds(getSwimmingSessionTotalDurationSeconds(activeSession))}
            </p>
          </CardContent>
        </Card>
        <Card className="overflow-hidden">
          <CardHeader className="page-section-header">
            <CardTitle className="page-section-title text-muted-foreground">Avg pace</CardTitle>
          </CardHeader>
          <CardContent className="pt-card">
            <p className="font-display text-kpi tabular-nums text-foreground">
              {pace > 0 ? formatPacePer100(pace) : '—'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-stack">
        <p className="section-label">Training parts</p>
        {sortedSwimBlocks.map((block, index) => (
          <Card key={block.id}>
            <CardHeader className="nested-card-header">
              <div className="flex flex-col gap-tight sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                <CardTitle className="font-display text-heading-sm">
                  {index + 1}. {block.title}
                </CardTitle>
                <div className="flex flex-wrap gap-tight">
                  <Badge variant="secondary">{SWIMMING_BLOCK_CATEGORY_LABEL[block.category]}</Badge>
                  <Badge variant="outline">{STROKE_LABELS[block.stroke]}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-tight pt-card text-body-sm">
              <p>
                <span className="text-muted-foreground">Distance:</span>{' '}
                <span className="font-medium text-foreground">
                  {formatSwimmingBlockDistanceSummary(block)}
                </span>
              </p>
              <p>
                <span className="text-muted-foreground">Duration:</span>{' '}
                {formatDurationSeconds(block.durationSeconds)}
              </p>
              <p>
                <span className="text-muted-foreground">Effort:</span>{' '}
                {EFFORT_LABELS[block.effortLevel]}
              </p>
              <p>
                <span className="text-muted-foreground">Pool:</span> {block.poolLength} m
              </p>
              {block.notes.trim() ? (
                <p className="whitespace-pre-wrap text-muted-foreground">{block.notes}</p>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </div>

      <SessionNotesCard notes={activeSession.notes} />

      <Separator />

      <Button variant="ghost" asChild>
        <Link to={backHref}>← Back to athlete</Link>
      </Button>

      <DeleteSessionDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={handleDelete}
        trainingModality="pool"
      />
    </div>
  )
}

function SessionNotesCard({ notes }: { notes: string }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="page-section-header">
        <CardTitle className="page-section-title">Session notes</CardTitle>
      </CardHeader>
      <CardContent className="pt-card text-body leading-relaxed">
        {notes.trim() ? (
          <p className="whitespace-pre-wrap text-foreground">{notes}</p>
        ) : (
          <p className="text-muted-foreground">No notes.</p>
        )}
      </CardContent>
    </Card>
  )
}

type DeleteSessionDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  trainingModality: 'pool' | 'gym'
}

function DeleteSessionDialog({
  open,
  onOpenChange,
  onConfirm,
  trainingModality,
}: DeleteSessionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete session?</DialogTitle>
          <DialogDescription>
            Removes this {trainingModality === 'pool' ? 'pool' : 'gym'} session from history and
            analytics. This cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
