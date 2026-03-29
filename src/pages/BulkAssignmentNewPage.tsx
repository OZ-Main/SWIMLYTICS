import { ClipboardList, Users } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'

import { useAthleteStore } from '@/app/store/athleteStore'
import { useTrainingSessionStore } from '@/app/store/trainingSessionStore'
import { useWorkoutTemplateStore } from '@/app/store/workoutTemplateStore'
import EmptyState from '@/components/feedback/EmptyState'
import PageHeader from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  areAllAthleteIdsSelected,
  nextAthleteSelectionAfterSelectAllFilteredToggle,
} from '@/features/assignments/helpers/athleteAssignmentSelection.helpers'
import {
  filterAthletesEligibleForWorkoutTemplate,
  filterAthletesForAssignmentTable,
} from '@/features/assignments/helpers/filterAthletesForAssignment.helpers'
import {
  bulkAssignmentCheckboxClassName,
  bulkAssignmentToolbarClassName,
} from '@/features/assignments/styles/bulkAssignmentPage.styles'
import { validateTrainingSessionForPersistence } from '@/features/sessions/helpers/trainingSessionValidation.helpers'
import { createTrainingSessionsFromWorkoutTemplate } from '@/features/workout-templates/helpers/createTrainingSessionsFromWorkoutTemplate.helpers'
import { validateWorkoutTemplateForPersistence } from '@/features/workout-templates/helpers/workoutTemplatePersistenceValidation.helpers'
import { workoutTemplateBlockCount } from '@/features/workout-templates/helpers/workoutTemplateSummary.helpers'
import { coachFirestoreErrorMessage } from '@/lib/firebase/coachFirestoreErrorMessage.helpers'
import { ATHLETE_TRAINING_TYPE_LABELS } from '@/shared/constants/athleteTrainingTypeLabels'
import { APP_ROUTE } from '@/shared/constants/routes.constants'
import { WORKOUT_FILTER_ALL } from '@/shared/constants/workoutFilter.constants'
import { AthleteTrainingType } from '@/shared/domain'
import { isValidIsoCalendarDateString } from '@/shared/helpers/isoCalendarDate.helpers'
import { athleteGroupDisplayLabel } from '@/shared/helpers/athleteGroupDisplay.helpers'

export default function BulkAssignmentNewPage() {
  const athletes = useAthleteStore((athleteStore) => athleteStore.athletes)
  const workoutTemplates = useWorkoutTemplateStore(
    (workoutTemplateStore) => workoutTemplateStore.workoutTemplates,
  )
  const bulkAddTrainingSessions = useTrainingSessionStore(
    (trainingSessionStore) => trainingSessionStore.bulkAddTrainingSessions,
  )

  const sortedTemplates = useMemo(
    () => [...workoutTemplates].sort((left, right) => left.title.localeCompare(right.title)),
    [workoutTemplates],
  )

  const [selectedTemplateId, setSelectedTemplateId] = useState('')
  const [assignmentCalendarDate, setAssignmentCalendarDate] = useState(() =>
    new Date().toISOString().slice(0, 10),
  )
  const [trainingTypeFilter, setTrainingTypeFilter] = useState<
    typeof WORKOUT_FILTER_ALL | AthleteTrainingType
  >(WORKOUT_FILTER_ALL)
  const [groupQuery, setGroupQuery] = useState('')
  const [nameQuery, setNameQuery] = useState('')
  const [selectedAthleteIds, setSelectedAthleteIds] = useState(() => new Set<string>())

  const selectedTemplate = sortedTemplates.find(
    (candidate) => candidate.id === selectedTemplateId,
  )

  useEffect(() => {
    setSelectedAthleteIds(new Set())
  }, [selectedTemplateId])

  useEffect(() => {
    if (!selectedTemplate) {
      return
    }

    setTrainingTypeFilter(selectedTemplate.trainingType)
  }, [selectedTemplate])

  const eligibleAthletes = useMemo(() => {
    if (!selectedTemplate) {
      return []
    }

    return filterAthletesEligibleForWorkoutTemplate(athletes, selectedTemplate)
  }, [athletes, selectedTemplate])

  const filteredAthletes = useMemo(() => {
    return filterAthletesForAssignmentTable(eligibleAthletes, {
      trainingType: trainingTypeFilter,
      groupQuery,
      nameQuery,
    })
  }, [eligibleAthletes, trainingTypeFilter, groupQuery, nameQuery])

  const filteredAthleteIds = useMemo(
    () => filteredAthletes.map((athlete) => athlete.id),
    [filteredAthletes],
  )

  const allFilteredSelected = areAllAthleteIdsSelected(filteredAthleteIds, selectedAthleteIds)

  async function handleBulkAssign() {
    if (!selectedTemplate) {
      toast.error('Choose a workout template.')
      return
    }

    if (assignmentCalendarDate.trim().length === 0) {
      toast.error('Choose an assignment date.')
      return
    }

    if (!isValidIsoCalendarDateString(assignmentCalendarDate)) {
      toast.error('Choose a valid assignment date.')
      return
    }

    if (workoutTemplateBlockCount(selectedTemplate) === 0) {
      toast.error('This template has no blocks. Edit the template first.')
      return
    }

    const templateValidation = validateWorkoutTemplateForPersistence(selectedTemplate)
    if (!templateValidation.ok) {
      toast.error(templateValidation.message)
      return
    }

    const athleteIds = [...selectedAthleteIds]
    if (athleteIds.length === 0) {
      toast.error('Select at least one athlete.')
      return
    }

    const sessions = createTrainingSessionsFromWorkoutTemplate(
      selectedTemplate,
      athleteIds,
      assignmentCalendarDate,
    )

    for (const session of sessions) {
      const sessionValidation = validateTrainingSessionForPersistence(session)
      if (!sessionValidation.ok) {
        toast.error(sessionValidation.message)
        return
      }
    }

    try {
      await bulkAddTrainingSessions(sessions)
      toast.success(`Assigned ${sessions.length} session${sessions.length === 1 ? '' : 's'}`)
      setSelectedAthleteIds(new Set())
    } catch (error) {
      toast.error(coachFirestoreErrorMessage(error, 'Could not assign sessions.'))
    }
  }

  return (
    <div className="page-stack">
      <PageHeader
        title="Bulk assign workout"
        description="Pick a template and date, filter your roster, then create real sessions for every selected athlete."
        actions={
          <Button variant="outline" asChild>
            <Link to={APP_ROUTE.workoutTemplates}>Workout templates</Link>
          </Button>
        }
      />

      <div className={bulkAssignmentToolbarClassName}>
        <div className="min-w-[12rem] flex-1 space-y-tight">
          <Label htmlFor="bulk-template">Workout template</Label>
          <Select value={selectedTemplateId} onValueChange={setSelectedTemplateId}>
            <SelectTrigger id="bulk-template">
              <SelectValue placeholder="Select a template" />
            </SelectTrigger>
            <SelectContent>
              {sortedTemplates.map((workoutTemplate) => (
                <SelectItem key={workoutTemplate.id} value={workoutTemplate.id}>
                  {workoutTemplate.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="min-w-[10rem] space-y-tight">
          <Label htmlFor="bulk-date">Session date</Label>
          <Input
            id="bulk-date"
            type="date"
            value={assignmentCalendarDate}
            onChange={(changeEvent) => setAssignmentCalendarDate(changeEvent.target.value)}
          />
        </div>

        <div className="min-w-[10rem] flex-1 space-y-tight">
          <Label htmlFor="bulk-training-type">Training type filter</Label>
          <Select
            value={trainingTypeFilter}
            disabled={!selectedTemplate}
            onValueChange={(value) =>
              setTrainingTypeFilter(
                value === WORKOUT_FILTER_ALL ? WORKOUT_FILTER_ALL : (value as AthleteTrainingType),
              )
            }
          >
            <SelectTrigger id="bulk-training-type">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={WORKOUT_FILTER_ALL}>All</SelectItem>
              {(Object.values(AthleteTrainingType) as AthleteTrainingType[]).map(
                (trainingTypeOption) => (
                  <SelectItem key={trainingTypeOption} value={trainingTypeOption}>
                    {ATHLETE_TRAINING_TYPE_LABELS[trainingTypeOption]}
                  </SelectItem>
                ),
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="min-w-[10rem] flex-1 space-y-tight">
          <Label htmlFor="bulk-group">Group contains</Label>
          <Input
            id="bulk-group"
            value={groupQuery}
            onChange={(changeEvent) => setGroupQuery(changeEvent.target.value)}
            placeholder="Filter group…"
            disabled={!selectedTemplate}
          />
        </div>

        <div className="min-w-[10rem] flex-1 space-y-tight">
          <Label htmlFor="bulk-name">Name contains</Label>
          <Input
            id="bulk-name"
            value={nameQuery}
            onChange={(changeEvent) => setNameQuery(changeEvent.target.value)}
            placeholder="Search name…"
            disabled={!selectedTemplate}
          />
        </div>
      </div>

      {!selectedTemplate ? (
        <EmptyState
          icon={ClipboardList}
          title="Choose a template"
          description="Templates are limited to athletes with the same training type (pool vs gym)."
        />
      ) : eligibleAthletes.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No eligible athletes"
          description={`Add or update athletes to ${ATHLETE_TRAINING_TYPE_LABELS[selectedTemplate.trainingType].toLowerCase()} to assign this template.`}
        />
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-tight">
            <p className="text-body-sm text-muted-foreground">
              {filteredAthletes.length} athlete{filteredAthletes.length === 1 ? '' : 's'} shown ·{' '}
              {selectedAthleteIds.size} selected
            </p>
            <div className="flex flex-wrap gap-tight">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  setSelectedAthleteIds(
                    nextAthleteSelectionAfterSelectAllFilteredToggle({
                      filteredAthleteIds,
                      selectedAthleteIds,
                    }),
                  )
                }
              >
                {allFilteredSelected ? 'Clear filtered selection' : 'Select all filtered'}
              </Button>
              <Button type="button" size="sm" onClick={handleBulkAssign}>
                Assign to selected
              </Button>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <span className="sr-only">Select</span>
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Group</TableHead>
                <TableHead>Training type</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAthletes.map((rosterAthlete) => (
                <TableRow key={rosterAthlete.id}>
                  <TableCell>
                    <input
                      type="checkbox"
                      className={bulkAssignmentCheckboxClassName}
                      checked={selectedAthleteIds.has(rosterAthlete.id)}
                      onChange={() => {
                        setSelectedAthleteIds((previous) => {
                          const next = new Set(previous)
                          if (next.has(rosterAthlete.id)) {
                            next.delete(rosterAthlete.id)
                          } else {
                            next.add(rosterAthlete.id)
                          }

                          return next
                        })
                      }}
                      aria-label={`Select ${rosterAthlete.fullName}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{rosterAthlete.fullName}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {athleteGroupDisplayLabel(rosterAthlete.group)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {ATHLETE_TRAINING_TYPE_LABELS[rosterAthlete.trainingType]}
                  </TableCell>
                  <TableCell className="max-w-xs truncate text-muted-foreground">
                    {rosterAthlete.notes.trim() || '—'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}
    </div>
  )
}
