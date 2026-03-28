import { Activity, Clock, Gauge, Route, Timer, Users, Waves } from 'lucide-react'
import { createSearchParams, Link } from 'react-router-dom'

import { useAthleteStore } from '@/app/store/athleteStore'
import { useCoachStore } from '@/app/store/coachStore'
import { useTrainingSessionStore } from '@/app/store/trainingSessionStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import EmptyState from '@/components/feedback/EmptyState'
import PageHeader from '@/components/layout/PageHeader'
import { StaggerItem, StaggerList } from '@/components/motion'
import DashboardCharts from '@/features/dashboard/components/DashboardCharts'
import GymDashboardCharts from '@/features/dashboard/components/GymDashboardCharts'
import StatCard from '@/features/dashboard/components/StatCard'
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
import { buildSwimmingSessionSummary } from '@/features/sessions/helpers/sessionSummary.helpers'
import { getGymSessionTotalDurationSeconds } from '@/features/sessions/helpers/sessionTotals.helpers'
import { DASHBOARD_CHART } from '@/shared/constants/chartRanges.constants'
import { DATE_FORMAT } from '@/shared/constants/dateDisplay.constants'
import { APP_ROUTE, sessionDetailPath } from '@/shared/constants/routes.constants'
import { STATISTICS_SEARCH_PARAMS } from '@/shared/constants/statisticsUrlSearch.constants'
import { AthleteTrainingType, MetricType } from '@/shared/domain'
import { isoWeekRangeStrings } from '@/shared/helpers/isoWeekRange.helpers'
import {
  formatDistanceMeters,
  formatDurationSeconds,
  formatPacePer100,
} from '@/shared/helpers/formatters'
import {
  filterGymTrainingSessions,
  filterSwimmingTrainingSessions,
} from '@/shared/helpers/sessionType.helpers'
import { format, parseISO } from 'date-fns'

export default function DashboardPage() {
  const coach = useCoachStore((coachStore) => coachStore.coach)
  const athletes = useAthleteStore((athleteStore) => athleteStore.athletes)
  const trainingSessions = useTrainingSessionStore(
    (trainingSessionStore) => trainingSessionStore.trainingSessions,
  )

  const swimSessions = filterSwimmingTrainingSessions(trainingSessions)
  const gymSessions = filterGymTrainingSessions(trainingSessions)

  const swimSummary = buildDashboardSummary(swimSessions)
  const gymSummary = buildGymDashboardSummary(gymSessions)

  const weeklyDistance = buildWeeklyDistanceSeries(swimSessions)
  const monthlyVolume = buildMonthlyVolumeSeries(swimSessions)
  const strokeSlices = buildStrokeDistribution(swimSessions)
  const paceTrend = buildPaceTrendSeries(swimSessions)

  const weeklyGymDur = buildWeeklyGymDurationSeries(gymSessions)
  const monthlyGymDur = buildMonthlyGymDurationSeries(gymSessions)

  const athleteById = new Map(athletes.map((athlete) => [athlete.id, athlete]))

  const recent = [...trainingSessions]
    .sort(
      (firstSession, secondSession) =>
        parseISO(secondSession.date).getTime() - parseISO(firstSession.date).getTime(),
    )
    .slice(0, DASHBOARD_CHART.RECENT_SESSIONS)

  const weekRange = isoWeekRangeStrings()
  const thisWeekPoolHref = `${APP_ROUTE.statistics}?${createSearchParams({
    [STATISTICS_SEARCH_PARAMS.dateFrom]: weekRange.dateFrom,
    [STATISTICS_SEARCH_PARAMS.dateTo]: weekRange.dateTo,
    [STATISTICS_SEARCH_PARAMS.trainingType]: AthleteTrainingType.Swimming,
  }).toString()}`

  const drillDownCoach = { kind: 'coach' as const }

  const hasAnyData = trainingSessions.length > 0

  if (!hasAnyData) {
    return (
      <div className="page-stack">
        <PageHeader
          title="Coach dashboard"
          description={`Hi ${coach.displayName} — add athletes and log sessions to unlock roster-wide trends.`}
        />
        <EmptyState
          icon={Users}
          title="No data yet"
          description="Create athlete profiles, then log pool or gym sessions. Sample data loads automatically on first launch if the app is empty."
          action={
            <Button asChild>
              <Link to={APP_ROUTE.athleteNew}>Add athlete</Link>
            </Button>
          }
          secondaryAction={
            <Button asChild variant="outline">
              <Link to={APP_ROUTE.settings}>Settings</Link>
            </Button>
          }
        />
      </div>
    )
  }

  return (
    <div className="page-stack">
      <PageHeader
        title="Coach dashboard"
        description={`Overview for ${coach.displayName} — ${athletes.length} athlete${athletes.length === 1 ? '' : 's'} on file.`}
        actions={
          <Button asChild variant="secondary">
            <Link to={APP_ROUTE.athleteNew}>Add athlete</Link>
          </Button>
        }
      />

      <div>
        <p className="section-label mb-stack">Roster overview</p>
        <div className="analytics-kpi-grid">
          <StatCard
            title="Athletes"
            value={String(athletes.length)}
            icon={Users}
            to={APP_ROUTE.athletes}
            ariaLabel={`${athletes.length} athletes. Open roster.`}
          />
          <StatCard
            title="Pool sessions"
            value={String(swimSummary.totalSessions)}
            icon={Waves}
            metric={MetricType.WorkoutCount}
            to={`${APP_ROUTE.statistics}?${createSearchParams({
              [STATISTICS_SEARCH_PARAMS.trainingType]: AthleteTrainingType.Swimming,
            }).toString()}`}
          />
          <StatCard
            title="Gym sessions"
            value={String(gymSummary.sessionCount)}
            icon={Activity}
            to={`${APP_ROUTE.statistics}?${createSearchParams({
              [STATISTICS_SEARCH_PARAMS.trainingType]: AthleteTrainingType.Gym,
            }).toString()}`}
          />
          <StatCard
            title="Total pool distance"
            value={formatDistanceMeters(swimSummary.totalDistanceMeters)}
            icon={Route}
            metric={MetricType.TotalDistance}
            to={APP_ROUTE.statistics}
          />
          <StatCard
            title="Combined duration"
            value={formatDurationSeconds(
              swimSummary.totalDurationSeconds + gymSummary.totalDurationSeconds,
            )}
            icon={Clock}
            metric={MetricType.TotalDuration}
            to={APP_ROUTE.statistics}
          />
          <StatCard
            title="Avg pace (pool)"
            value={
              swimSummary.averagePacePer100Seconds !== null
                ? formatPacePer100(swimSummary.averagePacePer100Seconds)
                : '—'
            }
            hint="Session-weighted"
            icon={Gauge}
            metric={MetricType.AveragePace}
            to={APP_ROUTE.statistics}
          />
          <StatCard
            title="Pool volume this week"
            value={formatDistanceMeters(swimSummary.currentWeekDistanceMeters)}
            hint="Mon–Sun"
            icon={Timer}
            metric={MetricType.WeekDistance}
            to={thisWeekPoolHref}
            ariaLabel={`Pool distance this week Mon to Sun, ${formatDistanceMeters(swimSummary.currentWeekDistanceMeters)}.`}
          />
        </div>
      </div>

      {swimSessions.length > 0 ? (
        <div>
          <p className="section-label mb-stack">Pool trends (all athletes)</p>
          <DashboardCharts
            weeklyDistance={weeklyDistance}
            monthlyVolume={monthlyVolume}
            strokeSlices={strokeSlices}
            paceTrend={paceTrend}
            drillDown={drillDownCoach}
          />
        </div>
      ) : null}

      {gymSessions.length > 0 ? (
        <div>
          <p className="section-label mb-stack">Gym time (all athletes)</p>
          <GymDashboardCharts
            weeklyDuration={weeklyGymDur}
            monthlyDuration={monthlyGymDur}
            drillDown={drillDownCoach}
          />
        </div>
      ) : null}

      <div>
        <p className="section-label mb-stack">Recent sessions</p>
        <Card className="overflow-hidden">
          <CardHeader className="page-section-header">
            <CardTitle className="page-section-title">Latest activity</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <StaggerList className="divide-y divide-border px-card">
              {recent.map((recentSession) => {
                const rosterAthlete = athleteById.get(recentSession.athleteId)
                const athleteDisplayName = rosterAthlete?.fullName ?? 'Unknown athlete'

                let sessionSummary = ''

                if (recentSession.trainingType === AthleteTrainingType.Swimming) {
                  const summary = buildSwimmingSessionSummary(recentSession, 2)
                  sessionSummary = `${summary.primaryStrokeLabel ?? 'Pool'} · ${formatDistanceMeters(summary.totalDistanceMeters)} · ${formatDurationSeconds(summary.totalDurationSeconds)}`
                } else {
                  sessionSummary = `${recentSession.sessionTitle || recentSession.blocks[0]?.title || 'Gym'} · ${formatDurationSeconds(getGymSessionTotalDurationSeconds(recentSession))}`
                }
                return (
                  <StaggerItem key={recentSession.id} className="data-row">
                    <div>
                      <p className="text-body font-medium text-foreground">{athleteDisplayName}</p>
                      <p className="text-body-sm text-muted-foreground">
                        {format(parseISO(recentSession.date), DATE_FORMAT.LIST_ROW)} ·{' '}
                        {sessionSummary}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={sessionDetailPath(recentSession.athleteId, recentSession.id)}>
                        View
                      </Link>
                    </Button>
                  </StaggerItem>
                )
              })}
            </StaggerList>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
