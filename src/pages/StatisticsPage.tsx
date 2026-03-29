import { format, parseISO } from 'date-fns'
import { BarChart3 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { useAthleteStore } from '@/app/store/athleteStore'
import { useTrainingSessionStore } from '@/app/store/trainingSessionStore'
import ChartCard from '@/components/charts/ChartCard'
import ChartTooltipContent from '@/components/charts/ChartTooltipContent'
import EmptyState from '@/components/feedback/EmptyState'
import PageHeader from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import StatBlock from '@/features/statistics/components/StatBlock'
import { filterTrainingSessionsForStatistics } from '@/features/statistics/helpers/filterByDateRange.helpers'
import { statisticsFiltersFromSearchParams } from '@/features/statistics/helpers/statisticsFiltersFromSearchParams.helpers'
import {
  buildGymStatisticsAggregate,
  buildSwimmingStatisticsAggregate,
  splitTrainingSessionsByModality,
} from '@/features/statistics/helpers/statistics.helpers'
import {
  getGymSessionTotalDurationSeconds,
  getSwimmingSessionTotalDistanceMeters,
} from '@/features/sessions/helpers/sessionTotals.helpers'
import type { StatisticsFilters } from '@/features/statistics/types/statistics-filters.types'
import { useChartTheme } from '@/lib/charts/useChartTheme'
import { useResponsiveChartLayout } from '@/lib/charts/useResponsiveChartLayout'
import { CHART_DATA_KEY, CHART_SERIES_NAME } from '@/shared/constants/chartData.constants'
import { DATE_FORMAT } from '@/shared/constants/dateDisplay.constants'
import { STROKE_FILTER_OPTIONS, STROKE_LABELS } from '@/shared/constants/strokeLabels'
import { APP_ROUTE, athleteDetailPath } from '@/shared/constants/routes.constants'
import { ATHLETE_TRAINING_TYPE_LABELS } from '@/shared/constants/athleteTrainingTypeLabels'
import { WORKOUT_FILTER_ALL } from '@/shared/constants/workoutFilter.constants'
import { AthleteTrainingType } from '@/shared/domain'
import {
  formatDistanceMeters,
  formatDurationSeconds,
  formatPacePer100,
} from '@/shared/helpers/formatters'

function emptyFilters(): StatisticsFilters {
  return {
    dateFrom: null,
    dateTo: null,
    athleteId: null,
    trainingType: 'all',
    stroke: WORKOUT_FILTER_ALL,
  }
}

export default function StatisticsPage() {
  const trainingSessions = useTrainingSessionStore(
    (trainingSessionStore) => trainingSessionStore.trainingSessions,
  )
  const athletes = useAthleteStore((athleteStore) => athleteStore.athletes)
  const chart = useChartTheme()
  const { marginTight, yAxisWidthBar } = useResponsiveChartLayout()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [filters, setFilters] = useState<StatisticsFilters>(() =>
    statisticsFiltersFromSearchParams(searchParams),
  )

  useEffect(() => {
    setFilters(statisticsFiltersFromSearchParams(searchParams))
  }, [searchParams])

  const scoped = useMemo(
    () => filterTrainingSessionsForStatistics(trainingSessions, filters),
    [trainingSessions, filters],
  )

  const { swimming: swimScoped, gym: gymScoped } = useMemo(
    () => splitTrainingSessionsByModality(scoped),
    [scoped],
  )

  const swimStats = useMemo(() => buildSwimmingStatisticsAggregate(swimScoped), [swimScoped])
  const gymStats = useMemo(() => buildGymStatisticsAggregate(gymScoped), [gymScoped])

  const filtersActive =
    filters.dateFrom != null ||
    filters.dateTo != null ||
    filters.athleteId != null ||
    filters.trainingType !== 'all' ||
    filters.stroke !== WORKOUT_FILTER_ALL

  const hasSwim = swimStats.sessionCount > 0
  const hasGym = gymStats.sessionCount > 0
  const hasAny = hasSwim || hasGym

  const sortedAthletes = useMemo(
    () =>
      [...athletes].sort((leftAthlete, rightAthlete) =>
        leftAthlete.fullName.localeCompare(rightAthlete.fullName),
      ),
    [athletes],
  )

  return (
    <div className="page-stack">
      <PageHeader
        title="Statistics"
        description="Coach-wide aggregates. Filter by athlete, training type, stroke, or date range."
      />

      <div className="form-filter-panel sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-tight">
          <Label htmlFor="stats-athlete">Athlete</Label>
          <Select
            value={filters.athleteId ?? 'all'}
            onValueChange={(nextAthleteId) =>
              setFilters((previousFilters) => ({
                ...previousFilters,
                athleteId: nextAthleteId === 'all' ? null : nextAthleteId,
              }))
            }
          >
            <SelectTrigger id="stats-athlete">
              <SelectValue placeholder="All athletes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All athletes</SelectItem>
              {sortedAthletes.map((athleteOption) => (
                <SelectItem key={athleteOption.id} value={athleteOption.id}>
                  {athleteOption.fullName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-tight">
          <Label htmlFor="stats-training">Training type</Label>
          <Select
            value={filters.trainingType}
            onValueChange={(nextTrainingType) =>
              setFilters((previousFilters) => ({
                ...previousFilters,
                trainingType: nextTrainingType as StatisticsFilters['trainingType'],
              }))
            }
          >
            <SelectTrigger id="stats-training">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value={AthleteTrainingType.Swimming}>
                {ATHLETE_TRAINING_TYPE_LABELS[AthleteTrainingType.Swimming]}
              </SelectItem>
              <SelectItem value={AthleteTrainingType.Gym}>
                {ATHLETE_TRAINING_TYPE_LABELS[AthleteTrainingType.Gym]}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-tight">
          <Label htmlFor="stats-stroke">Stroke (pool)</Label>
          <Select
            value={filters.stroke}
            onValueChange={(nextStrokeValue) =>
              setFilters((previousFilters) => ({
                ...previousFilters,
                stroke: nextStrokeValue as StatisticsFilters['stroke'],
              }))
            }
          >
            <SelectTrigger id="stats-stroke">
              <SelectValue />
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
        </div>
        <div className="grid grid-cols-1 gap-stack sm:col-span-2 sm:grid-cols-2 lg:col-span-1">
          <div className="space-y-tight">
            <Label htmlFor="stats-from">From</Label>
            <Input
              id="stats-from"
              type="date"
              value={filters.dateFrom ?? ''}
              onChange={(changeEvent) =>
                setFilters((previousFilters) => ({
                  ...previousFilters,
                  dateFrom: changeEvent.target.value || null,
                }))
              }
            />
          </div>
          <div className="space-y-tight">
            <Label htmlFor="stats-to">To</Label>
            <Input
              id="stats-to"
              type="date"
              value={filters.dateTo ?? ''}
              onChange={(changeEvent) =>
                setFilters((previousFilters) => ({
                  ...previousFilters,
                  dateTo: changeEvent.target.value || null,
                }))
              }
            />
          </div>
        </div>
      </div>

      {!hasAny ? (
        <EmptyState
          icon={BarChart3}
          title={
            trainingSessions.length === 0 ? 'No sessions to analyze' : 'No sessions in this slice'
          }
          description={
            trainingSessions.length === 0
              ? 'Log pool or gym sessions under each athlete to populate analytics.'
              : 'Widen filters or clear the date range to include more history.'
          }
          action={
            trainingSessions.length === 0 ? (
              <Button asChild>
                <Link to={APP_ROUTE.athletes}>Open athletes</Link>
              </Button>
            ) : filtersActive ? (
              <Button type="button" variant="default" onClick={() => setFilters(emptyFilters())}>
                Clear filters
              </Button>
            ) : undefined
          }
        />
      ) : (
        <>
          {hasSwim ? (
            <div className="space-y-6 sm:space-y-section">
              <p className="section-label">Pool (swimming)</p>
              <div className="stats-metric-grid">
                <StatBlock label="Sessions" value={String(swimStats.sessionCount)} />
                <StatBlock
                  label="Total distance"
                  value={formatDistanceMeters(swimStats.totalDistanceMeters)}
                />
                <StatBlock
                  label="Total duration"
                  value={formatDurationSeconds(swimStats.totalDurationSeconds)}
                />
                <StatBlock
                  label="Average distance"
                  value={formatDistanceMeters(swimStats.averageDistanceMeters)}
                />
                <StatBlock
                  label="Average duration"
                  value={formatDurationSeconds(swimStats.averageDurationSeconds)}
                />
                <StatBlock
                  label="Best pace (fastest)"
                  value={
                    swimStats.bestPacePer100 !== null
                      ? formatPacePer100(swimStats.bestPacePer100)
                      : '—'
                  }
                />
                <StatBlock
                  label="Longest session (distance)"
                  value={
                    swimStats.longestSwimmingSession
                      ? formatDistanceMeters(
                          getSwimmingSessionTotalDistanceMeters(swimStats.longestSwimmingSession),
                        )
                      : '—'
                  }
                  hint={
                    swimStats.longestSwimmingSession
                      ? format(
                          parseISO(swimStats.longestSwimmingSession.date),
                          DATE_FORMAT.LIST_ROW,
                        )
                      : undefined
                  }
                />
                <StatBlock
                  label="Most frequent stroke"
                  value={
                    swimStats.mostFrequentStroke
                      ? STROKE_LABELS[swimStats.mostFrequentStroke]
                      : '—'
                  }
                />
              </div>
              <div className="analytics-chart-grid">
                <ChartCard
                  title="Weekly pool volume"
                  description="Meters by week (Mon start). Click a bar to open the roster."
                >
                  <div className="chart-surface-flush-left">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={swimStats.weeklyTotalsMeters}
                        margin={{ ...marginTight }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke={chart.grid}
                          vertical={false}
                        />
                        <XAxis
                          dataKey={CHART_DATA_KEY.WEEK_LABEL}
                          tick={{ fill: chart.axis }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          tick={{ fill: chart.axis }}
                          axisLine={false}
                          tickLine={false}
                          width={yAxisWidthBar}
                        />
                        <Tooltip
                          content={<ChartTooltipContent />}
                          cursor={{ fill: chart.grid, opacity: 0.2 }}
                        />
                        <Bar
                          dataKey={CHART_DATA_KEY.METERS}
                          fill={chart.chart1}
                          radius={[4, 4, 0, 0]}
                          name={CHART_SERIES_NAME.METERS}
                          cursor="pointer"
                          onClick={() => navigate(APP_ROUTE.athletes)}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </ChartCard>
                <ChartCard
                  title="Monthly pool volume"
                  description="Meters per calendar month."
                >
                  <div className="chart-surface-flush-left">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={swimStats.monthlyTotalsMeters}
                        margin={{ ...marginTight }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke={chart.grid}
                          vertical={false}
                        />
                        <XAxis
                          dataKey={CHART_DATA_KEY.MONTH_LABEL}
                          tick={{ fill: chart.axis }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          tick={{ fill: chart.axis }}
                          axisLine={false}
                          tickLine={false}
                          width={yAxisWidthBar}
                        />
                        <Tooltip
                          content={<ChartTooltipContent />}
                          cursor={{ fill: chart.grid, opacity: 0.2 }}
                        />
                        <Bar
                          dataKey={CHART_DATA_KEY.METERS}
                          fill={chart.chart2}
                          radius={[4, 4, 0, 0]}
                          name={CHART_SERIES_NAME.METERS}
                          cursor="pointer"
                          onClick={() => navigate(APP_ROUTE.athletes)}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </ChartCard>
              </div>
            </div>
          ) : null}

          {hasGym ? (
            <div className="space-y-6 sm:space-y-section">
              <p className="section-label">Gym / strength</p>
              <div className="stats-metric-grid">
                <StatBlock label="Sessions" value={String(gymStats.sessionCount)} />
                <StatBlock
                  label="Total duration"
                  value={formatDurationSeconds(gymStats.totalDurationSeconds)}
                />
                <StatBlock
                  label="Average duration"
                  value={formatDurationSeconds(gymStats.averageDurationSeconds)}
                />
                <StatBlock
                  label="Longest session"
                  value={
                    gymStats.longestGymSession
                      ? formatDurationSeconds(
                          getGymSessionTotalDurationSeconds(gymStats.longestGymSession),
                        )
                      : '—'
                  }
                  hint={
                    gymStats.longestGymSession
                      ? gymStats.longestGymSession.sessionTitle ||
                        gymStats.longestGymSession.blocks[0]?.focus
                      : undefined
                  }
                />
              </div>
              <div className="analytics-chart-grid">
                <ChartCard title="Weekly gym time" description="Total duration by week (Mon start).">
                  <div className="chart-surface-flush-left">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={gymStats.weeklyTotalsSeconds}
                        margin={{ ...marginTight }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke={chart.grid}
                          vertical={false}
                        />
                        <XAxis
                          dataKey={CHART_DATA_KEY.WEEK_LABEL}
                          tick={{ fill: chart.axis }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          tick={{ fill: chart.axis }}
                          axisLine={false}
                          tickLine={false}
                          width={yAxisWidthBar}
                        />
                        <Tooltip
                          content={<ChartTooltipContent />}
                          cursor={{ fill: chart.grid, opacity: 0.2 }}
                        />
                        <Bar
                          dataKey="seconds"
                          fill={chart.chart3}
                          radius={[4, 4, 0, 0]}
                          name={CHART_SERIES_NAME.DURATION}
                          cursor="pointer"
                          onClick={() => navigate(APP_ROUTE.athletes)}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </ChartCard>
                <ChartCard title="Monthly gym time" description="Total duration per month.">
                  <div className="chart-surface-flush-left">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={gymStats.monthlyTotalsSeconds}
                        margin={{ ...marginTight }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke={chart.grid}
                          vertical={false}
                        />
                        <XAxis
                          dataKey={CHART_DATA_KEY.MONTH_LABEL}
                          tick={{ fill: chart.axis }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          tick={{ fill: chart.axis }}
                          axisLine={false}
                          tickLine={false}
                          width={yAxisWidthBar}
                        />
                        <Tooltip
                          content={<ChartTooltipContent />}
                          cursor={{ fill: chart.grid, opacity: 0.2 }}
                        />
                        <Bar
                          dataKey="seconds"
                          fill={chart.chart4}
                          radius={[4, 4, 0, 0]}
                          name={CHART_SERIES_NAME.DURATION}
                          cursor="pointer"
                          onClick={() => navigate(APP_ROUTE.athletes)}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </ChartCard>
              </div>
            </div>
          ) : null}

          <Card>
            <CardHeader className="page-section-header">
              <CardTitle className="page-section-title">Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-tight pt-card text-body-sm leading-relaxed text-muted-foreground">
              {hasSwim ? (
                <p>
                  In this slice, pool athletes averaged{' '}
                  <span className="font-medium text-foreground">
                    {formatDistanceMeters(swimStats.averageDistanceMeters)}
                  </span>{' '}
                  per session over{' '}
                  <span className="font-medium text-foreground">
                    {formatDurationSeconds(swimStats.averageDurationSeconds)}
                  </span>{' '}
                  of swimming.
                </p>
              ) : null}
              {hasGym ? (
                <p>
                  Gym blocks averaged{' '}
                  <span className="font-medium text-foreground">
                    {formatDurationSeconds(gymStats.averageDurationSeconds)}
                  </span>{' '}
                  per logged session.
                </p>
              ) : null}
              {filters.athleteId ? (
                <p>
                  <Button variant="link" className="h-auto p-0" asChild>
                    <Link to={athleteDetailPath(filters.athleteId)}>Open this athlete</Link>
                  </Button>
                </p>
              ) : null}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
