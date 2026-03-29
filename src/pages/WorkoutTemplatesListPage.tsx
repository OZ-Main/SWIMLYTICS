import { format, parseISO } from 'date-fns'
import { ClipboardList, LayoutTemplate, Pencil, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'

import { useWorkoutTemplateStore } from '@/app/store/workoutTemplateStore'
import EmptyState from '@/components/feedback/EmptyState'
import PageHeader from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { buildWorkoutTemplateSummaryLine } from '@/features/workout-templates/helpers/workoutTemplateSummary.helpers'
import { APP_ROUTE, workoutTemplateEditPath } from '@/shared/constants/routes.constants'

export default function WorkoutTemplatesListPage() {
  const workoutTemplates = useWorkoutTemplateStore(
    (workoutTemplateStore) => workoutTemplateStore.workoutTemplates,
  )
  const deleteWorkoutTemplate = useWorkoutTemplateStore(
    (workoutTemplateStore) => workoutTemplateStore.deleteWorkoutTemplate,
  )

  const [templatePendingDeleteId, setTemplatePendingDeleteId] = useState<string | null>(null)

  const sortedTemplates = [...workoutTemplates].sort((left, right) =>
    left.title.localeCompare(right.title),
  )

  const templatePendingDelete = templatePendingDeleteId
    ? workoutTemplates.find((candidate) => candidate.id === templatePendingDeleteId)
    : undefined

  async function handleConfirmDelete() {
    if (!templatePendingDeleteId) {
      return
    }

    try {
      await deleteWorkoutTemplate(templatePendingDeleteId)
      toast.success('Template deleted')
      setTemplatePendingDeleteId(null)
    } catch {
      toast.error('Could not delete template.')
    }
  }

  return (
    <div className="page-stack">
      <PageHeader
        title="Workout templates"
        description="Reusable blueprints for pool and gym plans. Assign one template to many athletes in bulk."
        actions={
          <div className="flex flex-wrap gap-tight">
            <Button variant="outline" asChild>
              <Link to={APP_ROUTE.assignmentsNew}>
                <ClipboardList className="h-4 w-4" aria-hidden />
                Bulk assign
              </Link>
            </Button>
            <Button asChild>
              <Link to={APP_ROUTE.workoutTemplateNew}>
                <Plus className="h-4 w-4" aria-hidden />
                New template
              </Link>
            </Button>
          </div>
        }
      />

      {sortedTemplates.length === 0 ? (
        <EmptyState
          icon={LayoutTemplate}
          title="No workout templates yet"
          description="Build a template once, then assign it to any athlete roster that matches the training type."
          action={
            <Button asChild>
              <Link to={APP_ROUTE.workoutTemplateNew}>Create a template</Link>
            </Button>
          }
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Summary</TableHead>
              <TableHead>Target group</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTemplates.map((workoutTemplate) => (
              <TableRow key={workoutTemplate.id}>
                <TableCell className="font-medium">{workoutTemplate.title}</TableCell>
                <TableCell className="text-muted-foreground">
                  {buildWorkoutTemplateSummaryLine(workoutTemplate)}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {workoutTemplate.targetGroup.trim() || '—'}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {format(parseISO(workoutTemplate.updatedAt), 'MMM d, yyyy')}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-tight">
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={workoutTemplateEditPath(workoutTemplate.id)}>
                        <Pencil className="h-4 w-4" aria-hidden />
                        Edit
                      </Link>
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => setTemplatePendingDeleteId(workoutTemplate.id)}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden />
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog
        open={templatePendingDeleteId != null}
        onOpenChange={(open) => {
          if (!open) {
            setTemplatePendingDeleteId(null)
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete workout template?</DialogTitle>
            <DialogDescription>
              {templatePendingDelete
                ? `“${templatePendingDelete.title}” will be removed. Sessions already created from this template stay on the athlete timeline.`
                : 'This template will be removed.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setTemplatePendingDeleteId(null)}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={handleConfirmDelete}>
              Delete template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
