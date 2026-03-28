import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'sonner'

import { useAthleteStore } from '@/app/store/athleteStore'
import { usePersonalBestsStore } from '@/app/store/personalBestsStore'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import EmptyState from '@/components/feedback/EmptyState'
import PageHeader from '@/components/layout/PageHeader'
import PersonalBestForm from '@/features/personal-bests/components/PersonalBestForm'
import {
  findBestPriorPbSameEvent,
  formatImprovementVsPriorBest,
  personalBestEventLabel,
  sortPersonalBestsDisplay,
} from '@/features/personal-bests/helpers/personalBests.helpers'
import { DATE_FORMAT } from '@/shared/constants/dateDisplay.constants'
import { FORM_SYNC_KEY } from '@/shared/constants/formSync.constants'
import { athleteDetailPath, ROUTE_PARAM } from '@/shared/constants/routes.constants'
import { AthleteTrainingType } from '@/shared/domain'
import { formatRaceClock } from '@/shared/helpers/formatters'
import type { PersonalBest } from '@/shared/types/domain.types'
import { format, parseISO } from 'date-fns'

export default function PersonalBestsPage() {
  const params = useParams()
  const athleteId = params[ROUTE_PARAM.athleteId]

  const athlete = useAthleteStore((athleteStore) =>
    athleteId
      ? athleteStore.athletes.find((candidateAthlete) => candidateAthlete.id === athleteId)
      : undefined,
  )

  const allPersonalBestsInStore = usePersonalBestsStore(
    (personalBestsStore) => personalBestsStore.personalBests,
  )
  const athletePersonalBests = useMemo(
    () =>
      athleteId
        ? allPersonalBestsInStore.filter(
            (personalBest) => personalBest.athleteId === athleteId,
          )
        : [],
    [allPersonalBestsInStore, athleteId],
  )

  const addPersonalBest = usePersonalBestsStore(
    (personalBestsStore) => personalBestsStore.addPersonalBest,
  )
  const updatePersonalBest = usePersonalBestsStore(
    (personalBestsStore) => personalBestsStore.updatePersonalBest,
  )
  const deletePersonalBest = usePersonalBestsStore(
    (personalBestsStore) => personalBestsStore.deletePersonalBest,
  )

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<PersonalBest | null>(null)
  const [deleting, setDeleting] = useState<PersonalBest | null>(null)

  const rows = sortPersonalBestsDisplay(athletePersonalBests)

  function openCreate() {
    setEditing(null)
    setDialogOpen(true)
  }

  function openEdit(pb: PersonalBest) {
    setEditing(pb)
    setDialogOpen(true)
  }

  function handleFormSubmit(pb: PersonalBest) {
    if (editing) {
      updatePersonalBest(pb)
      toast.success('Best time updated')
    } else {
      addPersonalBest(pb)
      toast.success('Best time added')
    }
    setDialogOpen(false)
    setEditing(null)
  }

  function handleDelete() {
    if (!deleting) {
      return
    }
    deletePersonalBest(deleting.id)
    toast.success('Entry removed')
    setDeleting(null)
  }

  if (!athleteId || !athlete) {
    return (
      <div className="page-stack">
        <PageHeader
          title="Athlete not found"
          description="Open personal bests from a swimming athlete profile."
        />
      </div>
    )
  }

  if (athlete.trainingType !== AthleteTrainingType.Swimming) {
    return (
      <div className="page-stack">
        <PageHeader
          title="Not available"
          description="Personal bests apply to swimming athletes. Switch training type to swimming in the athlete profile, or use session log for gym history."
          actions={
            <Button asChild variant="outline">
              <Link to={athleteDetailPath(athlete.id)}>Back to athlete</Link>
            </Button>
          }
        />
      </div>
    )
  }

  return (
    <div className="page-stack">
      <PageHeader
        title={`Best times — ${athlete.fullName}`}
        description="Official marks by stroke and distance. Each row compares to the athlete's prior best in that event."
        actions={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" aria-hidden />
            Add best time
          </Button>
        }
      />

      <Button variant="ghost" className="w-fit" asChild>
        <Link to={athleteDetailPath(athlete.id)}>← Back to athlete</Link>
      </Button>

      {athletePersonalBests.length === 0 ? (
        <EmptyState
          icon={Plus}
          title="No best times yet"
          description="Record pool race times by stroke (IM: 100 / 200 / 400 m only) and standard distances."
          action={<Button onClick={openCreate}>Add a time</Button>}
        />
      ) : (
        <div className="surface-panel motion-mount-surface overflow-hidden">
          <Table className="table-density">
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((personalBestRow) => {
                const priorBestSameEvent = findBestPriorPbSameEvent(
                  athletePersonalBests,
                  personalBestRow,
                )
                const improvement = formatImprovementVsPriorBest(
                  personalBestRow.timeSeconds,
                  priorBestSameEvent?.timeSeconds ?? null,
                )
                return (
                  <TableRow key={personalBestRow.id}>
                    <TableCell className="font-medium">
                      {personalBestEventLabel(personalBestRow)}
                    </TableCell>
                    <TableCell className="font-mono tabular-nums">
                      {formatRaceClock(personalBestRow.timeSeconds)}
                    </TableCell>
                    <TableCell>
                      {format(parseISO(personalBestRow.date), DATE_FORMAT.LIST_ROW)}
                    </TableCell>
                    <TableCell className="max-w-[220px] text-body-sm text-muted-foreground">
                      {improvement}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate text-body-sm">
                      {personalBestRow.notes || '—'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Edit"
                        onClick={() => openEdit(personalBestRow)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Delete"
                        onClick={() => setDeleting(personalBestRow)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit best time' : 'New best time'}</DialogTitle>
            <DialogDescription>
              Times support decimals in the seconds field for hundredths.
            </DialogDescription>
          </DialogHeader>
          <PersonalBestForm
            key={editing?.id ?? FORM_SYNC_KEY.NEW_ENTITY}
            athleteId={athlete.id}
            mode={editing ? 'edit' : 'create'}
            initial={editing}
            onSubmit={handleFormSubmit}
            onCancel={() => setDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleting} onOpenChange={() => setDeleting(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove best time?</DialogTitle>
            <DialogDescription>
              {deleting
                ? `Remove ${personalBestEventLabel(deleting)} (${formatRaceClock(deleting.timeSeconds)}) from ${athlete.fullName}'s records?`
                : 'This entry will be deleted from local records.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleting(null)}>
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
