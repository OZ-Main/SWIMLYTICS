import { format, parseISO } from 'date-fns'
import { ClipboardList, LayoutTemplate, Pencil, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation()
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
      toast.success(t('templates.deletedToast'))
      setTemplatePendingDeleteId(null)
    } catch {
      toast.error(t('templates.deleteFailedToast'))
    }
  }

  return (
    <div className="page-stack">
      <PageHeader
        title={t('templates.title')}
        description={t('templates.description')}
        actions={
          <div className="flex flex-wrap gap-tight">
            <Button variant="outline" asChild>
              <Link to={APP_ROUTE.assignmentsNew}>
                <ClipboardList className="h-4 w-4" aria-hidden />
                {t('templates.bulkAssign')}
              </Link>
            </Button>
            <Button asChild>
              <Link to={APP_ROUTE.workoutTemplateNew}>
                <Plus className="h-4 w-4" aria-hidden />
                {t('templates.newTemplate')}
              </Link>
            </Button>
          </div>
        }
      />

      {sortedTemplates.length === 0 ? (
        <EmptyState
          icon={LayoutTemplate}
          title={t('templates.emptyTitle')}
          description={t('templates.emptyDescription')}
          action={
            <Button asChild>
              <Link to={APP_ROUTE.workoutTemplateNew}>{t('templates.createTemplate')}</Link>
            </Button>
          }
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('templates.tableTitle')}</TableHead>
              <TableHead>{t('templates.tableSummary')}</TableHead>
              <TableHead>{t('templates.tableTargetGroup')}</TableHead>
              <TableHead>{t('templates.tableUpdated')}</TableHead>
              <TableHead className="text-right">{t('templates.tableActions')}</TableHead>
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
                  {workoutTemplate.targetGroup.trim() || t('dashboard.dash')}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {format(parseISO(workoutTemplate.updatedAt), 'MMM d, yyyy')}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-tight">
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={workoutTemplateEditPath(workoutTemplate.id)}>
                        <Pencil className="h-4 w-4" aria-hidden />
                        {t('templates.edit')}
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
                      {t('templates.delete')}
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
            <DialogTitle>{t('templates.deleteDialogTitle')}</DialogTitle>
            <DialogDescription>
              {templatePendingDelete
                ? t('templates.deleteDialogDescriptionNamed', {
                    title: templatePendingDelete.title,
                  })
                : t('templates.deleteDialogDescriptionFallback')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setTemplatePendingDeleteId(null)}>
              {t('common.cancel')}
            </Button>
            <Button type="button" variant="destructive" onClick={handleConfirmDelete}>
              {t('templates.deleteConfirm')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
