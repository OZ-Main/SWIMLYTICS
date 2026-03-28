import { FilterX, Plus, Search } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

import { useWorkoutStore } from '@/app/store/workoutStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import EmptyState from '@/components/feedback/EmptyState'
import PageHeader from '@/components/layout/PageHeader'
import WorkoutTableRow from '@/features/workouts/components/WorkoutTableRow'
import {
  filterWorkouts,
  sortWorkoutsByDateDesc,
} from '@/features/workouts/helpers/filterWorkouts.helpers'
import { workoutFiltersFromSearchParams } from '@/features/workouts/helpers/workoutFiltersFromSearchParams.helpers'
import type { WorkoutFilters } from '@/features/workouts/types/workout-filters.types'
import { EFFORT_LABELS, EFFORT_OPTIONS } from '@/shared/constants/effortLabels'
import { APP_ROUTE } from '@/shared/constants/routes.constants'
import { STROKE_FILTER_OPTIONS, STROKE_LABELS } from '@/shared/constants/strokeLabels'
import { WORKOUT_FILTER_ALL } from '@/shared/constants/workoutFilter.constants'

const DEFAULT_FILTERS: WorkoutFilters = {
  dateFrom: null,
  dateTo: null,
  stroke: WORKOUT_FILTER_ALL,
  effortLevel: WORKOUT_FILTER_ALL,
  search: '',
}

export default function WorkoutsPage() {
  const workouts = useWorkoutStore((s) => s.workouts)
  const [searchParams] = useSearchParams()
  const [filters, setFilters] = useState<WorkoutFilters>(() =>
    workoutFiltersFromSearchParams(searchParams),
  )

  useEffect(() => {
    setFilters(workoutFiltersFromSearchParams(searchParams))
  }, [searchParams])

  const filtered = useMemo(() => {
    const f = filterWorkouts(workouts, filters)
    return sortWorkoutsByDateDesc(f)
  }, [workouts, filters])

  const filtersActive =
    filters.search.trim() !== '' ||
    filters.dateFrom != null ||
    filters.dateTo != null ||
    filters.stroke !== WORKOUT_FILTER_ALL ||
    filters.effortLevel !== WORKOUT_FILTER_ALL

  function clearFilters() {
    setFilters({ ...DEFAULT_FILTERS })
  }

  return (
    <div className="page-stack">
      <PageHeader
        title="Workouts"
        description="Browse history, filter by stroke or effort, and open details."
        actions={
          <Button asChild>
            <Link to={APP_ROUTE.workoutNew}>
              <Plus className="h-4 w-4" aria-hidden />
              New workout
            </Link>
          </Button>
        }
      />

      <div className="form-filter-panel sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative sm:col-span-2">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search notes, stroke, date…"
            className="pl-9"
            value={filters.search}
            onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value }))}
            aria-label="Search workouts"
          />
        </div>
        <div className="grid grid-cols-2 gap-stack sm:contents">
          <Input
            type="date"
            aria-label="From date"
            value={filters.dateFrom ?? ''}
            onChange={(e) =>
              setFilters((p) => ({
                ...p,
                dateFrom: e.target.value || null,
              }))
            }
          />
          <Input
            type="date"
            aria-label="To date"
            value={filters.dateTo ?? ''}
            onChange={(e) =>
              setFilters((p) => ({
                ...p,
                dateTo: e.target.value || null,
              }))
            }
          />
        </div>
        <Select
          value={filters.stroke}
          onValueChange={(v) =>
            setFilters((p) => ({
              ...p,
              stroke: v as WorkoutFilters['stroke'],
            }))
          }
        >
          <SelectTrigger aria-label="Stroke filter">
            <SelectValue placeholder="Stroke" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={WORKOUT_FILTER_ALL}>All strokes</SelectItem>
            {STROKE_FILTER_OPTIONS.filter((s) => s !== WORKOUT_FILTER_ALL).map((s) => (
              <SelectItem key={s} value={s}>
                {STROKE_LABELS[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filters.effortLevel}
          onValueChange={(v) =>
            setFilters((p) => ({
              ...p,
              effortLevel: v as WorkoutFilters['effortLevel'],
            }))
          }
        >
          <SelectTrigger aria-label="Effort filter">
            <SelectValue placeholder="Effort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={WORKOUT_FILTER_ALL}>All effort</SelectItem>
            {EFFORT_OPTIONS.filter((e) => e !== WORKOUT_FILTER_ALL).map((e) => (
              <SelectItem key={e} value={e}>
                {EFFORT_LABELS[e]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {workouts.length === 0 ? (
        <EmptyState
          icon={Plus}
          title="No workouts logged"
          description="Create your first entry to populate this list and the dashboard."
          action={
            <Button asChild>
              <Link to={APP_ROUTE.workoutNew}>Log workout</Link>
            </Button>
          }
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={FilterX}
          title="No matches"
          description="Nothing in your history fits these filters. Reset them or adjust dates, stroke, or search."
          action={
            filtersActive ? (
              <Button type="button" onClick={clearFilters}>
                Clear filters
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="surface-panel motion-mount-surface overflow-hidden">
          <Table className="table-density">
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Stroke</TableHead>
                <TableHead>Distance</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Pace</TableHead>
                <TableHead>Effort</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((w) => (
                <WorkoutTableRow key={w.id} workout={w} />
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
