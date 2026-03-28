import { FilterX, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'

import { useAthleteStore } from '@/app/store/athleteStore'
import { usePersonalBestsStore } from '@/app/store/personalBestsStore'
import { useTrainingSessionStore } from '@/app/store/trainingSessionStore'
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import EmptyState from '@/components/feedback/EmptyState'
import PageHeader from '@/components/layout/PageHeader'
import DashboardCharts from '@/features/dashboard/components/DashboardCharts'
import GymDashboardCharts from '@/features/dashboard/components/GymDashboardCharts'
import {
  buildDashboardSummary,
  buildGymDashboardSummary,
  buildMonthlyGymDurationSeries,
  buildMonthlyVolumeSeries,
  buildPaceTrendSeries,
  buildStrokeDistribution,
  buildWeeklyDistanceSeries,
  buildWeeklyGymDurationSeries,
} from '@/features/dashboard/helpers/dashboard.helpers'
import SessionTableRow from '@/features/sessions/components/SessionTableRow'
import {
  filterTrainingSessions,
  sortTrainingSessionsByDateDesc,
} from '@/features/sessions/helpers/filterTrainingSessions.helpers'
import { sessionListFiltersFromSearchParams } from '@/features/sessions/helpers/sessionFiltersFromSearchParams.helpers'
import { buildSwimmingSessionSummary } from '@/features/sessions/helpers/sessionSummary.helpers'
import { getGymSessionTotalDurationSeconds } from '@/features/sessions/helpers/sessionTotals.helpers'
import type { SessionListFilters } from '@/features/sessions/types/session-filters.types'
import { ATHLETE_TRAINING_TYPE_LABELS } from '@/shared/constants/athleteTrainingTypeLabels'
import { DASHBOARD_CHART } from '@/shared/constants/chartRanges.constants'
import { EFFORT_LABELS, EFFORT_OPTIONS } from '@/shared/constants/effortLabels'
import { RESPONSIVE_SM_BUTTON_STRETCH_CLASS } from '@/shared/constants/responsiveTouchTarget.constants'
import {
  APP_ROUTE,
  athleteEditPath,
  athletePersonalBestsPath,
  athleteSessionNewPath,
  ROUTE_PARAM,
  sessionDetailPath,
} from '@/shared/constants/routes.constants'
import { STROKE_FILTER_OPTIONS, STROKE_LABELS } from '@/shared/constants/strokeLabels'
import { WORKOUT_FILTER_ALL } from '@/shared/constants/workoutFilter.constants'
import { AthleteTrainingType } from '@/shared/domain'
import { formatDistanceMeters, formatDurationSeconds } from '@/shared/helpers/formatters'
import {
  filterGymTrainingSessions,
  filterSwimmingTrainingSessions,
  isGymTrainingSession,
  isSwimmingTrainingSession,
  trainingSessionsForAthlete,
} from '@/shared/helpers/sessionType.helpers'
import { format, parseISO } from 'date-fns'

const DEFAULT_FILTERS: SessionListFilters = {
  dateFrom: null,
  dateTo: null,
  stroke: WORKOUT_FILTER_ALL,
  effortLevel: WORKOUT_FILTER_ALL,
  search: '',
}

export default function AthleteDetailPage() {
  const params = useParams()
  const athleteId = params[ROUTE_PARAM.athleteId]
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [filters, setFilters] = useState<SessionListFilters>(() =>
    sessionListFiltersFromSearchParams(searchParams),
  )
  const [removeOpen, setRemoveOpen] = useState(false)

  const athlete = useAthleteStore((athleteStore) =>
    athleteId
      ? athleteStore.athletes.find((candidateAthlete) => candidateAthlete.id === athleteId)
      : undefined,
  )
  const deleteAthlete = useAthleteStore((athleteStore) => athleteStore.deleteAthlete)
  const trainingSessions = useTrainingSessionStore(
    (trainingSessionStore) => trainingSessionStore.trainingSessions,
  )
  const deleteTrainingSession = useTrainingSessionStore(
    (trainingSessionStore) => trainingSessionStore.deleteTrainingSession,
  )
  const personalBests = usePersonalBestsStore(
    (personalBestsStore) => personalBestsStore.personalBests,
  )
  const deletePersonalBest = usePersonalBestsStore(
    (personalBestsStore) => personalBestsStore.deletePersonalBest,
  )

  useEffect(() => {
    setFilters(sessionListFiltersFromSearchParams(searchParams))
  }, [searchParams])

  const athleteSessions = useMemo(
    () => (athleteId ? trainingSessionsForAthlete(trainingSessions, athleteId) : []),
    [trainingSessions, athleteId],
  )

  const filteredSorted = useMemo(() => {
    const sessionsMatchingFilters = filterTrainingSessions(athleteSessions, filters)
    return sortTrainingSessionsByDateDesc(sessionsMatchingFilters)
  }, [athleteSessions, filters])

  const swimRows = useMemo(() => filterSwimmingTrainingSessions(filteredSorted), [filteredSorted])
  const gymRows = useMemo(() => filterGymTrainingSessions(filteredSorted), [filteredSorted])

  const swimForCharts = useMemo(
    () => filterSwimmingTrainingSessions(athleteSessions),
    [athleteSessions],
  )
  const gymForCharts = useMemo(() => filterGymTrainingSessions(athleteSessions), [athleteSessions])

  const swimSummary = useMemo(() => buildDashboardSummary(swimForCharts), [swimForCharts])
  const gymSummary = useMemo(() => buildGymDashboardSummary(gymForCharts), [gymForCharts])

  const weeklyDistance = useMemo(
    () => buildWeeklyDistanceSeries(swimForCharts),
    [swimForCharts],
  )
  const monthlyVolume = useMemo(
    () => buildMonthlyVolumeSeries(swimForCharts),
    [swimForCharts],
  )
  const strokeSlices = useMemo(() => buildStrokeDistribution(swimForCharts), [swimForCharts])
  const paceTrend = useMemo(() => buildPaceTrendSeries(swimForCharts), [swimForCharts])

  const weeklyGymDur = useMemo(
    () => buildWeeklyGymDurationSeries(gymForCharts),
    [gymForCharts],
  )
  const monthlyGymDur = useMemo(
    () => buildMonthlyGymDurationSeries(gymForCharts),
    [gymForCharts],
  )

  const filtersActive =
    filters.search.trim() !== '' ||
    filters.dateFrom != null ||
    filters.dateTo != null ||
    filters.stroke !== WORKOUT_FILTER_ALL ||
    filters.effortLevel !== WORKOUT_FILTER_ALL

  function clearFilters() {
    setFilters({ ...DEFAULT_FILTERS })
  }

  function handleRemoveAthlete() {
    if (!athleteId) {
      return
    }
    athleteSessions.forEach((session) => deleteTrainingSession(session.id))
    personalBests
      .filter((personalBest) => personalBest.athleteId === athleteId)
      .forEach((personalBest) => deletePersonalBest(personalBest.id))
    deleteAthlete(athleteId)
    toast.success('Athlete removed')
    setRemoveOpen(false)
    navigate(APP_ROUTE.athletes)
  }

  if (!athleteId || !athlete) {
    return (
      <div className="page-stack">
        <PageHeader
          title="Athlete not found"
          description="This profile may have been deleted."
          actions={
            <Button asChild variant="outline">
              <Link to={APP_ROUTE.athletes}>All athletes</Link>
            </Button>
          }
        />
      </div>
    )
  }

  const drillDown = { kind: 'athlete' as const, athleteId }

  const recent = [...athleteSessions]
    .sort(
      (leftSession, rightSession) =>
        parseISO(rightSession.date).getTime() - parseISO(leftSession.date).getTime(),
    )
    .slice(0, DASHBOARD_CHART.RECENT_SESSIONS)

  return (
    <div className="page-stack">
      <div className="page-toolbar sm:items-start">
        <div>
          <p className="section-label">Athlete</p>
          <h1 className="mt-tight text-heading-xl sm:text-display-lg">{athlete.fullName}</h1>
          <p className="mt-tight text-body text-muted-foreground">
            {ATHLETE_TRAINING_TYPE_LABELS[athlete.trainingType]} · Added{' '}
            {format(parseISO(athlete.createdAt), 'MMM d, yyyy')}
          </p>
        </div>
        <div className="flex w-full min-w-0 flex-col gap-tight sm:w-auto sm:flex-row sm:flex-wrap">
          <Button variant="outline" size="sm" asChild className={RESPONSIVE_SM_BUTTON_STRETCH_CLASS}>
            <Link to={athleteEditPath(athlete.id)}>
              <Pencil className="h-4 w-4" aria-hidden />
              Edit
            </Link>
          </Button>
          {athlete.trainingType === AthleteTrainingType.Swimming ? (
            <Button variant="secondary" size="sm" asChild className={RESPONSIVE_SM_BUTTON_STRETCH_CLASS}>
              <Link to={athletePersonalBestsPath(athlete.id)}>Personal bests</Link>
            </Button>
          ) : null}
          <Button size="sm" asChild className={RESPONSIVE_SM_BUTTON_STRETCH_CLASS}>
            <Link to={athleteSessionNewPath(athlete.id)}>
              <Plus className="h-4 w-4" aria-hidden />
              Log session
            </Link>
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className={RESPONSIVE_SM_BUTTON_STRETCH_CLASS}
            onClick={() => setRemoveOpen(true)}
          >
            <Trash2 className="h-4 w-4" aria-hidden />
            Remove
          </Button>
        </div>
      </div>

      {athlete.notes.trim() ? (
        <p className="insight-banner whitespace-pre-wrap">{athlete.notes}</p>
      ) : null}

      {athlete.trainingType === AthleteTrainingType.Swimming && swimForCharts.length > 0 ? (
        <div>
          <p className="section-label mb-stack">Pool overview</p>
          <div className="analytics-kpi-grid mb-stack">
            <div className="kpi-tile">
              <p className="text-caption font-medium text-muted-foreground">Sessions</p>
              <p className="mt-tight font-display text-heading-lg font-semibold tabular-nums text-foreground">
                {swimSummary.totalSessions}
              </p>
            </div>
            <div className="kpi-tile">
              <p className="text-caption font-medium text-muted-foreground">Total distance</p>
              <p className="mt-tight font-display text-heading-lg font-semibold tabular-nums text-foreground">
                {Math.round(swimSummary.totalDistanceMeters).toLocaleString()} m
              </p>
            </div>
            <div className="kpi-tile">
              <p className="text-caption font-medium text-muted-foreground">This week (Mon–Sun)</p>
              <p className="mt-tight font-display text-heading-lg font-semibold tabular-nums text-foreground">
                {Math.round(swimSummary.currentWeekDistanceMeters).toLocaleString()} m
              </p>
            </div>
          </div>
          <DashboardCharts
            weeklyDistance={weeklyDistance}
            monthlyVolume={monthlyVolume}
            strokeSlices={strokeSlices}
            paceTrend={paceTrend}
            drillDown={drillDown}
          />
        </div>
      ) : null}

      {athlete.trainingType === AthleteTrainingType.Gym && gymForCharts.length > 0 ? (
        <div>
          <p className="section-label mb-stack">Gym overview</p>
          <div className="analytics-kpi-grid mb-stack">
            <div className="kpi-tile">
              <p className="text-caption font-medium text-muted-foreground">Sessions</p>
              <p className="mt-tight font-display text-heading-lg font-semibold tabular-nums text-foreground">
                {gymSummary.sessionCount}
              </p>
            </div>
            <div className="kpi-tile">
              <p className="text-caption font-medium text-muted-foreground">Total time</p>
              <p className="mt-tight font-display text-heading-lg font-semibold tabular-nums text-foreground">
                {Math.floor(gymSummary.totalDurationSeconds / 60)} min
              </p>
            </div>
            <div className="kpi-tile">
              <p className="text-caption font-medium text-muted-foreground">This week</p>
              <p className="mt-tight font-display text-heading-lg font-semibold tabular-nums text-foreground">
                {Math.floor(gymSummary.currentWeekDurationSeconds / 60)} min
              </p>
            </div>
          </div>
          <GymDashboardCharts
            weeklyDuration={weeklyGymDur}
            monthlyDuration={monthlyGymDur}
            drillDown={drillDown}
          />
        </div>
      ) : null}

      {swimForCharts.length === 0 &&
      gymForCharts.length === 0 &&
      athlete.trainingType === AthleteTrainingType.Swimming ? (
        <EmptyState
          icon={Plus}
          title="No pool sessions yet"
          description="Log the first workout to populate charts and trends."
          action={
            <Button asChild>
              <Link to={athleteSessionNewPath(athlete.id)}>Log workout</Link>
            </Button>
          }
        />
      ) : null}

      {swimForCharts.length === 0 &&
      gymForCharts.length === 0 &&
      athlete.trainingType === AthleteTrainingType.Gym ? (
        <EmptyState
          icon={Plus}
          title="No gym sessions yet"
          description="Record duration, focus, and effort to build a training timeline."
          action={
            <Button asChild>
              <Link to={athleteSessionNewPath(athlete.id)}>Log session</Link>
            </Button>
          }
        />
      ) : null}

      {recent.length > 0 ? (
        <div>
          <p className="section-label mb-stack">Recent activity</p>
          <div className="data-list-shell">
            {recent.map((recentSession) => (
              <div
                key={recentSession.id}
                className="flex flex-col gap-tight px-3 py-tight sm:flex-row sm:items-center sm:justify-between sm:px-card"
              >
                <div className="min-w-0 text-body-sm">
                  <p className="font-medium text-foreground">
                    {format(parseISO(recentSession.date), 'MMM d, yyyy')}
                  </p>
                  <p className="truncate text-muted-foreground">
                    {isSwimmingTrainingSession(recentSession)
                      ? (() => {
                          const summary = buildSwimmingSessionSummary(recentSession, 2)
                          return `${summary.primaryStrokeLabel ?? 'Pool'} · ${formatDistanceMeters(summary.totalDistanceMeters)} · ${formatDurationSeconds(summary.totalDurationSeconds)}`
                        })()
                      : isGymTrainingSession(recentSession)
                        ? `${recentSession.sessionTitle || recentSession.blocks.map((block) => block.title).join(' · ')} · ${formatDurationSeconds(getGymSessionTotalDurationSeconds(recentSession))}`
                        : '—'}
                  </p>
                </div>
                <Button variant="ghost" asChild className={RESPONSIVE_SM_BUTTON_STRETCH_CLASS}>
                  <Link to={sessionDetailPath(athlete.id, recentSession.id)}>View</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="space-y-stack">
        <div className="flex flex-col gap-tight sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="section-label">Session log</p>
            <p className="text-body-sm text-muted-foreground">
              Filter history by date, stroke, or effort.
            </p>
          </div>
          <Button asChild size="sm" className={RESPONSIVE_SM_BUTTON_STRETCH_CLASS}>
            <Link to={athleteSessionNewPath(athlete.id)}>
              <Plus className="h-4 w-4" aria-hidden />
              New session
            </Link>
          </Button>
        </div>

        <div className="form-filter-panel sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative sm:col-span-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search notes, stroke, focus…"
              className="pl-9"
              value={filters.search}
              onChange={(changeEvent) =>
                setFilters((previousFilters) => ({
                  ...previousFilters,
                  search: changeEvent.target.value,
                }))
              }
              aria-label="Search sessions"
            />
          </div>
          <div className="grid grid-cols-1 gap-stack sm:contents">
            <Input
              type="date"
              aria-label="From date"
              value={filters.dateFrom ?? ''}
              onChange={(changeEvent) =>
                setFilters((previousFilters) => ({
                  ...previousFilters,
                  dateFrom: changeEvent.target.value || null,
                }))
              }
            />
            <Input
              type="date"
              aria-label="To date"
              value={filters.dateTo ?? ''}
              onChange={(changeEvent) =>
                setFilters((previousFilters) => ({
                  ...previousFilters,
                  dateTo: changeEvent.target.value || null,
                }))
              }
            />
          </div>
          {athlete.trainingType === AthleteTrainingType.Swimming ? (
            <Select
              value={filters.stroke}
              onValueChange={(nextStrokeValue) =>
                setFilters((previousFilters) => ({
                  ...previousFilters,
                  stroke: nextStrokeValue as SessionListFilters['stroke'],
                }))
              }
            >
              <SelectTrigger aria-label="Stroke filter">
                <SelectValue placeholder="Stroke" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={WORKOUT_FILTER_ALL}>All strokes</SelectItem>
                {STROKE_FILTER_OPTIONS.filter(
                  (strokeOption) => strokeOption !== WORKOUT_FILTER_ALL,
                ).map((strokeOption) => (
                  <SelectItem key={strokeOption} value={strokeOption}>
                    {STROKE_LABELS[strokeOption]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div />
          )}
          <Select
            value={filters.effortLevel}
            onValueChange={(nextEffortValue) =>
              setFilters((previousFilters) => ({
                ...previousFilters,
                effortLevel: nextEffortValue as SessionListFilters['effortLevel'],
              }))
            }
          >
            <SelectTrigger aria-label="Effort filter">
              <SelectValue placeholder="Effort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={WORKOUT_FILTER_ALL}>All effort</SelectItem>
              {EFFORT_OPTIONS.filter(
                (effortOption) => effortOption !== WORKOUT_FILTER_ALL,
              ).map((effortOption) => (
                <SelectItem key={effortOption} value={effortOption}>
                  {EFFORT_LABELS[effortOption]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {athleteSessions.length === 0 ? (
          <EmptyState
            icon={Plus}
            title="No sessions"
            description="Start logging to build this athlete's history."
            action={
              <Button asChild>
                <Link to={athleteSessionNewPath(athlete.id)}>Log session</Link>
              </Button>
            }
          />
        ) : filteredSorted.length === 0 ? (
          <EmptyState
            icon={FilterX}
            title="No matches"
            description="Nothing fits these filters. Try clearing or widening the date range."
            action={
              filtersActive ? (
                <Button type="button" onClick={clearFilters}>
                  Clear filters
                </Button>
              ) : undefined
            }
          />
        ) : (
          <div className="space-y-stack">
            {swimRows.length > 0 ? (
              <div className="surface-panel motion-mount-surface overflow-hidden">
                <p className="table-rail-caption">Pool</p>
                <Table className="table-density">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Primary stroke</TableHead>
                      <TableHead>Distance</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Blocks</TableHead>
                      <TableHead>Effort</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {swimRows.map((poolSession) => (
                      <SessionTableRow key={poolSession.id} session={poolSession} />
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : null}
            {gymRows.length > 0 ? (
              <div className="surface-panel motion-mount-surface overflow-hidden">
                <p className="table-rail-caption">Gym</p>
                <Table className="table-density">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Session</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Effort</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {gymRows.map((gymSession) => (
                      <SessionTableRow key={gymSession.id} session={gymSession} />
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : null}
          </div>
        )}
      </div>

      <Dialog open={removeOpen} onOpenChange={setRemoveOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove {athlete.fullName}?</DialogTitle>
            <DialogDescription>
              Deletes this athlete profile and all of their sessions and personal bests stored
              locally.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRemoveOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRemoveAthlete}>
              Remove athlete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
