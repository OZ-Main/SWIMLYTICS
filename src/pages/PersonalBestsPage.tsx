import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

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
import { formatRaceClock } from '@/shared/helpers/formatters'
import type { PersonalBest } from '@/shared/types/domain.types'
import { format, parseISO } from 'date-fns'

export default function PersonalBestsPage() {
  const items = usePersonalBestsStore((s) => s.personalBests)
  const addPersonalBest = usePersonalBestsStore((s) => s.addPersonalBest)
  const updatePersonalBest = usePersonalBestsStore((s) => s.updatePersonalBest)
  const deletePersonalBest = usePersonalBestsStore((s) => s.deletePersonalBest)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<PersonalBest | null>(null)
  const [deleting, setDeleting] = useState<PersonalBest | null>(null)

  const rows = sortPersonalBestsDisplay(items)

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
      toast.success('Personal best updated')
    } else {
      addPersonalBest(pb)
      toast.success('Personal best added')
    }
    setDialogOpen(false)
    setEditing(null)
  }

  function handleDelete() {
    if (!deleting) {
      return
    }
    deletePersonalBest(deleting.id)
    toast.success('Personal best removed')
    setDeleting(null)
  }

  return (
    <div className="page-stack">
      <PageHeader
        title="Personal bests"
        description="Track official times by stroke and distance, and compare each mark to your prior best in that event."
        actions={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" aria-hidden />
            Add personal best
          </Button>
        }
      />

      {items.length === 0 ? (
        <EmptyState
          icon={Plus}
          title="No personal bests"
          description="Record your fastest swims by stroke (IM: 100 / 200 / 400 m only) and standard distances."
          action={<Button onClick={openCreate}>Add a PB</Button>}
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
              {rows.map((pb) => {
                const prior = findBestPriorPbSameEvent(items, pb)
                const improvement = formatImprovementVsPriorBest(
                  pb.timeSeconds,
                  prior?.timeSeconds ?? null,
                )
                return (
                  <TableRow key={pb.id}>
                    <TableCell className="font-medium">{personalBestEventLabel(pb)}</TableCell>
                    <TableCell className="font-mono tabular-nums">
                      {formatRaceClock(pb.timeSeconds)}
                    </TableCell>
                    <TableCell>{format(parseISO(pb.date), DATE_FORMAT.LIST_ROW)}</TableCell>
                    <TableCell className="max-w-[220px] text-body-sm text-muted-foreground">
                      {improvement}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate text-body-sm">
                      {pb.notes || '—'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Edit"
                        onClick={() => openEdit(pb)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Delete"
                        onClick={() => setDeleting(pb)}
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
            <DialogTitle>{editing ? 'Edit personal best' : 'New personal best'}</DialogTitle>
            <DialogDescription>
              Times support decimals in the seconds field for hundredths.
            </DialogDescription>
          </DialogHeader>
          <PersonalBestForm
            key={editing?.id ?? FORM_SYNC_KEY.NEW_ENTITY}
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
            <DialogTitle>Remove personal best?</DialogTitle>
            <DialogDescription>
              {deleting
                ? `Remove ${personalBestEventLabel(deleting)} (${formatRaceClock(deleting.timeSeconds)}) from your local records?`
                : 'This entry will be deleted from your local records.'}
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
