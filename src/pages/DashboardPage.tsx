import { Clock, Gauge, Route, Timer, Waves } from 'lucide-react'
import { createSearchParams, Link } from 'react-router-dom'

import { useWorkoutStore } from '@/app/store/workoutStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import EmptyState from '@/components/feedback/EmptyState'
import PageHeader from '@/components/layout/PageHeader'
import { StaggerItem, StaggerList } from '@/components/motion'
import DashboardCharts from '@/features/dashboard/components/DashboardCharts'
import StatCard from '@/features/dashboard/components/StatCard'
import {
  buildDashboardSummary,
  buildMonthlyVolumeSeries,
  buildPaceTrendSeries,
  buildStrokeDistribution,
  buildWeeklyDistanceSeries,
} from '@/features/dashboard/helpers/dashboard.helpers'
import { DASHBOARD_CHART } from '@/shared/constants/chartRanges.constants'
import { DATE_FORMAT } from '@/shared/constants/dateDisplay.constants'
import { APP_ROUTE, workoutDetailPath } from '@/shared/constants/routes.constants'
import { STROKE_LABELS } from '@/shared/constants/strokeLabels'
import { WORKOUTS_SEARCH_PARAMS } from '@/shared/constants/workoutsUrlSearch.constants'
import { isoWeekRangeStrings } from '@/shared/helpers/isoWeekRange.helpers'
import { MetricType } from '@/shared/domain'
import {
  formatDistanceMeters,
  formatDurationSeconds,
  formatPacePer100,
} from '@/shared/helpers/formatters'
import { format, parseISO } from 'date-fns'

export default function DashboardPage() {
  const workouts = useWorkoutStore((s) => s.workouts)

  const summary = buildDashboardSummary(workouts)
  const weeklyDistance = buildWeeklyDistanceSeries(workouts)
  const monthlyVolume = buildMonthlyVolumeSeries(workouts)
  const strokeSlices = buildStrokeDistribution(workouts)
  const paceTrend = buildPaceTrendSeries(workouts)

  const recent = [...workouts]
    .sort((a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime())
    .slice(0, DASHBOARD_CHART.RECENT_WORKOUTS)

  const weekRange = isoWeekRangeStrings()
  const thisWeekWorkoutsHref = `${APP_ROUTE.workouts}?${createSearchParams({
    [WORKOUTS_SEARCH_PARAMS.dateFrom]: weekRange.dateFrom,
    [WORKOUTS_SEARCH_PARAMS.dateTo]: weekRange.dateTo,
  }).toString()}`

  if (workouts.length === 0) {
    return (
      <div className="page-stack">
        <PageHeader
          title="Dashboard"
          description="Log swims to unlock trends, volume charts, and pace insights."
        />
        <EmptyState
          icon={Waves}
          title="No workouts yet"
          description="Start with a session or load sample data from Settings if you cleared the store."
          action={
            <Button asChild>
              <Link to={APP_ROUTE.workoutNew}>Log a workout</Link>
            </Button>
          }
          secondaryAction={
            <Button asChild variant="outline">
              <Link to={APP_ROUTE.settings}>Open settings</Link>
            </Button>
          }
        />
      </div>
    )
  }

  return (
    <div className="page-stack">
      <PageHeader
        title="Dashboard"
        description="Training load, pacing, and stroke mix at a glance."
        actions={
          <Button asChild variant="secondary">
            <Link to={APP_ROUTE.workoutNew}>New workout</Link>
          </Button>
        }
      />

      <div>
        <p className="section-label mb-stack">Overview</p>
        <div className="analytics-kpi-grid">
          <StatCard
            title="Total workouts"
            value={String(summary.totalWorkouts)}
            icon={Waves}
            metric={MetricType.WorkoutCount}
            to={APP_ROUTE.workouts}
          />
          <StatCard
            title="Total distance"
            value={formatDistanceMeters(summary.totalDistanceMeters)}
            icon={Route}
            metric={MetricType.TotalDistance}
            to={APP_ROUTE.statistics}
          />
          <StatCard
            title="Total duration"
            value={formatDurationSeconds(summary.totalDurationSeconds)}
            icon={Clock}
            metric={MetricType.TotalDuration}
            to={APP_ROUTE.statistics}
          />
          <StatCard
            title="Average pace"
            value={
              summary.averagePacePer100Seconds !== null
                ? formatPacePer100(summary.averagePacePer100Seconds)
                : '—'
            }
            hint="Session-weighted"
            icon={Gauge}
            metric={MetricType.AveragePace}
            to={APP_ROUTE.statistics}
          />
          <StatCard
            title="This week"
            value={formatDistanceMeters(summary.currentWeekDistanceMeters)}
            hint="Mon–Sun"
            icon={Timer}
            metric={MetricType.WeekDistance}
            to={thisWeekWorkoutsHref}
            ariaLabel={`This week Mon to Sun, ${formatDistanceMeters(summary.currentWeekDistanceMeters)}. Open workouts filtered to this week.`}
          />
        </div>
      </div>

      <div>
        <p className="section-label mb-stack">Trends</p>
        <DashboardCharts
          weeklyDistance={weeklyDistance}
          monthlyVolume={monthlyVolume}
          strokeSlices={strokeSlices}
          paceTrend={paceTrend}
        />
      </div>

      <div>
        <p className="section-label mb-stack">Recent sessions</p>
        <Card className="overflow-hidden border-border/60 shadow-card">
          <CardHeader className="border-b border-border/40 bg-muted/15 py-section-sm">
            <CardTitle className="font-display text-heading-sm">Latest activity</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <StaggerList className="divide-y divide-border px-card">
              {recent.map((w) => (
                <StaggerItem key={w.id} className="data-row">
                  <div>
                    <p className="text-body font-medium text-foreground">
                      {format(parseISO(w.date), DATE_FORMAT.LIST_ROW)} · {STROKE_LABELS[w.stroke]}
                    </p>
                    <p className="text-body-sm text-muted-foreground">
                      {formatDistanceMeters(w.distance)} · {formatDurationSeconds(w.duration)} ·{' '}
                      {formatPacePer100(w.averagePacePer100)}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to={workoutDetailPath(w.id)}>View</Link>
                  </Button>
                </StaggerItem>
              ))}
            </StaggerList>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
