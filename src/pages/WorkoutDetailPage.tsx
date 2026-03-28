import { Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'

import { useWorkoutStore } from '@/app/store/workoutStore'
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
import PageHeader from '@/components/layout/PageHeader'
import { DATE_FORMAT } from '@/shared/constants/dateDisplay.constants'
import { EFFORT_LABELS } from '@/shared/constants/effortLabels'
import { APP_ROUTE, ROUTE_PARAM, workoutEditPath } from '@/shared/constants/routes.constants'
import { STROKE_LABELS } from '@/shared/constants/strokeLabels'
import {
  formatDistanceMeters,
  formatDurationSeconds,
  formatPacePer100,
} from '@/shared/helpers/formatters'
import { format, parseISO } from 'date-fns'

export default function WorkoutDetailPage() {
  const params = useParams()
  const workoutId = params[ROUTE_PARAM.workoutId]
  const navigate = useNavigate()
  const workouts = useWorkoutStore((s) => s.workouts)
  const deleteWorkout = useWorkoutStore((s) => s.deleteWorkout)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const workout = workoutId ? workouts.find((w) => w.id === workoutId) : undefined

  if (!workoutId || !workout) {
    return (
      <div className="page-stack">
        <PageHeader
          title="Workout not found"
          description="This session may have been removed."
          actions={
            <Button asChild variant="outline">
              <Link to={APP_ROUTE.workouts}>Back to workouts</Link>
            </Button>
          }
        />
      </div>
    )
  }

  const w = workout

  function handleDelete() {
    deleteWorkout(w.id)
    toast.success('Workout deleted')
    setConfirmOpen(false)
    navigate(APP_ROUTE.workouts)
  }

  return (
    <div className="page-stack">
      <div className="page-toolbar sm:items-start">
        <div>
          <p className="section-label">Session</p>
          <h1 className="mt-tight text-display-lg">
            {format(parseISO(w.date), DATE_FORMAT.WORKOUT_DETAIL_HEADING)}
          </h1>
          <div className="mt-stack flex flex-wrap gap-tight">
            <Badge variant="secondary">{STROKE_LABELS[w.stroke]}</Badge>
            <Badge variant="outline">{EFFORT_LABELS[w.effortLevel]}</Badge>
            <Badge variant="outline">{w.poolLength} m pool</Badge>
          </div>
        </div>
        <div className="flex flex-wrap gap-tight">
          <Button variant="outline" asChild>
            <Link to={workoutEditPath(w.id)}>
              <Pencil className="h-4 w-4" aria-hidden />
              Edit
            </Link>
          </Button>
          <Button variant="destructive" onClick={() => setConfirmOpen(true)}>
            <Trash2 className="h-4 w-4" aria-hidden />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-stack md:grid-cols-3">
        <Card className="overflow-hidden border-border/60 shadow-card">
          <CardHeader className="border-b border-border/40 bg-muted/15 py-section-sm">
            <CardTitle className="font-display text-heading-sm text-muted-foreground">
              Distance
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-card">
            <p className="font-display text-heading-xl font-semibold text-foreground">
              {formatDistanceMeters(w.distance)}
            </p>
          </CardContent>
        </Card>
        <Card className="overflow-hidden border-border/60 shadow-card">
          <CardHeader className="border-b border-border/40 bg-muted/15 py-section-sm">
            <CardTitle className="font-display text-heading-sm text-muted-foreground">
              Duration
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-card">
            <p className="font-display text-heading-xl font-semibold text-foreground">
              {formatDurationSeconds(w.duration)}
            </p>
          </CardContent>
        </Card>
        <Card className="overflow-hidden border-border/60 shadow-card">
          <CardHeader className="border-b border-border/40 bg-muted/15 py-section-sm">
            <CardTitle className="font-display text-heading-sm text-muted-foreground">
              Avg pace
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-card">
            <p className="font-display text-heading-xl font-semibold text-foreground">
              {formatPacePer100(w.averagePacePer100)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden border-border/60 shadow-card">
        <CardHeader className="border-b border-border/40 bg-muted/15 py-section-sm">
          <CardTitle className="font-display text-heading-sm">Notes</CardTitle>
        </CardHeader>
        <CardContent className="pt-card text-body leading-relaxed">
          {w.notes.trim() ? (
            <p className="whitespace-pre-wrap text-foreground">{w.notes}</p>
          ) : (
            <p className="text-muted-foreground">No notes.</p>
          )}
        </CardContent>
      </Card>

      <Separator />

      <Button variant="ghost" asChild>
        <Link to={APP_ROUTE.workouts}>← All workouts</Link>
      </Button>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete workout?</DialogTitle>
            <DialogDescription>
              This removes the session from history and charts. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
