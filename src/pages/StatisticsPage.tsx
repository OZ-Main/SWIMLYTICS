import { format, parseISO } from 'date-fns'
import { BarChart3 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { useWorkoutStore } from '@/app/store/workoutStore'
import ChartCard from '@/components/charts/ChartCard'
import ChartTooltipContent from '@/components/charts/ChartTooltipContent'
import EmptyState from '@/components/feedback/EmptyState'
import PageHeader from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import StatBlock from '@/features/statistics/components/StatBlock'
import { filterWorkoutsForStatistics } from '@/features/statistics/helpers/filterByDateRange.helpers'
import { buildStatisticsAggregate } from '@/features/statistics/helpers/statistics.helpers'
import type { StatisticsFilters } from '@/features/statistics/types/statistics-filters.types'
import { useChartTheme } from '@/lib/charts/useChartTheme'
import {
  CHART_BAR_RADIUS,
  CHART_TICK_PX,
  RECHARTS_MARGIN_TIGHT_LEFT,
} from '@/shared/constants/chartUi.constants'
import { CHART_DATA_KEY, CHART_SERIES_NAME } from '@/shared/constants/chartData.constants'
import { DATE_FORMAT } from '@/shared/constants/dateDisplay.constants'
import { CHART_GRID_DASH } from '@/shared/constants/recharts.constants'
import { STROKE_LABELS } from '@/shared/constants/strokeLabels'
import { APP_ROUTE } from '@/shared/constants/routes.constants'
import {
  formatDistanceMeters,
  formatDurationSeconds,
  formatPacePer100,
} from '@/shared/helpers/formatters'

function emptyFilters(): StatisticsFilters {
  return { dateFrom: null, dateTo: null }
}

export default function StatisticsPage() {
  const workouts = useWorkoutStore((s) => s.workouts)
  const chart = useChartTheme()
  const navigate = useNavigate()
  const [filters, setFilters] = useState<StatisticsFilters>(emptyFilters)

  const scoped = useMemo(() => filterWorkoutsForStatistics(workouts, filters), [workouts, filters])

  const stats = useMemo(() => buildStatisticsAggregate(scoped), [scoped])

  const filtersActive = filters.dateFrom != null || filters.dateTo != null

  return (
    <div className="page-stack">
      <PageHeader
        title="Statistics"
        description="Aggregates over the workouts in your selected date range."
      />

      <div className="form-filter-panel sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-tight">
          <Label htmlFor="stats-from">From</Label>
          <Input
            id="stats-from"
            type="date"
            value={filters.dateFrom ?? ''}
            onChange={(e) =>
              setFilters((p) => ({
                ...p,
                dateFrom: e.target.value || null,
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
            onChange={(e) =>
              setFilters((p) => ({
                ...p,
                dateTo: e.target.value || null,
              }))
            }
          />
        </div>
      </div>

      {stats.workoutCount === 0 ? (
        <EmptyState
          icon={BarChart3}
          title={workouts.length === 0 ? 'No workouts to analyze' : 'No workouts in this range'}
          description={
            workouts.length === 0
              ? 'Log sessions from Workouts and this view will fill in with weekly volume, pacing, and stroke mix.'
              : 'Try widening the date range or clear the filters to include your full history.'
          }
          action={
            workouts.length === 0 ? (
              <Button asChild>
                <Link to={APP_ROUTE.workoutNew}>Log a workout</Link>
              </Button>
            ) : filtersActive ? (
              <Button type="button" variant="default" onClick={() => setFilters(emptyFilters())}>
                Clear date range
              </Button>
            ) : undefined
          }
          secondaryAction={
            workouts.length === 0 ? (
              <Button asChild variant="outline">
                <Link to={APP_ROUTE.workouts}>Browse workouts</Link>
              </Button>
            ) : undefined
          }
        />
      ) : (
        <>
          <div>
            <p className="section-label mb-stack">Summary</p>
            <div className="stats-metric-grid">
              <StatBlock label="Workouts" value={String(stats.workoutCount)} />
              <StatBlock
                label="Total distance"
                value={formatDistanceMeters(stats.totalDistanceMeters)}
              />
              <StatBlock
                label="Total duration"
                value={formatDurationSeconds(stats.totalDurationSeconds)}
              />
              <StatBlock
                label="Average distance"
                value={formatDistanceMeters(stats.averageDistanceMeters)}
              />
              <StatBlock
                label="Average duration"
                value={formatDurationSeconds(stats.averageDurationSeconds)}
              />
              <StatBlock
                label="Best pace (fastest)"
                value={stats.bestPacePer100 !== null ? formatPacePer100(stats.bestPacePer100) : '—'}
              />
              <StatBlock
                label="Longest workout"
                value={
                  stats.longestWorkout ? formatDistanceMeters(stats.longestWorkout.distance) : '—'
                }
                hint={
                  stats.longestWorkout
                    ? format(parseISO(stats.longestWorkout.date), DATE_FORMAT.LIST_ROW)
                    : undefined
                }
              />
              <StatBlock
                label="Most frequent stroke"
                value={stats.mostFrequentStroke ? STROKE_LABELS[stats.mostFrequentStroke] : '—'}
              />
            </div>
          </div>

          <div className="analytics-chart-grid">
            <ChartCard
              title="Weekly totals"
              description="Total meters grouped by week (Monday start). Click a bar to open Workouts."
            >
              <div className="chart-surface-flush-left">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={stats.weeklyTotalsMeters}
                    margin={{ ...RECHARTS_MARGIN_TIGHT_LEFT }}
                  >
                    <CartesianGrid
                      strokeDasharray={CHART_GRID_DASH}
                      stroke={chart.grid}
                      vertical={false}
                    />
                    <XAxis
                      dataKey={CHART_DATA_KEY.WEEK_LABEL}
                      tick={{
                        fontSize: CHART_TICK_PX,
                        fill: chart.axis,
                      }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{
                        fontSize: CHART_TICK_PX,
                        fill: chart.axis,
                      }}
                      axisLine={false}
                      tickLine={false}
                      width={44}
                    />
                    <Tooltip
                      content={<ChartTooltipContent />}
                      cursor={{ fill: chart.grid, opacity: 0.2 }}
                    />
                    <Bar
                      dataKey={CHART_DATA_KEY.METERS}
                      fill={chart.chart1}
                      radius={CHART_BAR_RADIUS}
                      name={CHART_SERIES_NAME.METERS}
                      cursor="pointer"
                      onClick={() => navigate(APP_ROUTE.workouts)}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
            <ChartCard
              title="Monthly totals"
              description="Total meters per calendar month. Click a bar to open Workouts."
            >
              <div className="chart-surface-flush-left">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={stats.monthlyTotalsMeters}
                    margin={{ ...RECHARTS_MARGIN_TIGHT_LEFT }}
                  >
                    <CartesianGrid
                      strokeDasharray={CHART_GRID_DASH}
                      stroke={chart.grid}
                      vertical={false}
                    />
                    <XAxis
                      dataKey={CHART_DATA_KEY.MONTH_LABEL}
                      tick={{
                        fontSize: CHART_TICK_PX,
                        fill: chart.axis,
                      }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{
                        fontSize: CHART_TICK_PX,
                        fill: chart.axis,
                      }}
                      axisLine={false}
                      tickLine={false}
                      width={44}
                    />
                    <Tooltip
                      content={<ChartTooltipContent />}
                      cursor={{ fill: chart.grid, opacity: 0.2 }}
                    />
                    <Bar
                      dataKey={CHART_DATA_KEY.METERS}
                      fill={chart.chart2}
                      radius={CHART_BAR_RADIUS}
                      name={CHART_SERIES_NAME.METERS}
                      cursor="pointer"
                      onClick={() => navigate(APP_ROUTE.workouts)}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>

          <Card className="border-border/60 shadow-card">
            <CardHeader className="border-b border-border/40 bg-muted/15 py-section-sm">
              <CardTitle className="font-display text-heading-sm">Narrative summary</CardTitle>
            </CardHeader>
            <CardContent className="pt-card text-body-sm leading-relaxed text-muted-foreground">
              <p>
                In this window you averaged{' '}
                <span className="font-medium text-foreground">
                  {formatDistanceMeters(stats.averageDistanceMeters)}
                </span>{' '}
                per session at roughly{' '}
                <span className="font-medium text-foreground">
                  {formatDurationSeconds(stats.averageDurationSeconds)}
                </span>{' '}
                each. Compare ranges from the date pickers above to see how volume shifts week to
                week.
              </p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
