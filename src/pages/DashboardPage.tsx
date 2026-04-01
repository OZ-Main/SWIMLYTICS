import { format, parseISO } from 'date-fns'
import { Activity, Clock, Gauge, Route, Timer, Users, Waves } from 'lucide-react'
import { useTranslation } from 'react-i18next'
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

export default function DashboardPage() {
  const { t } = useTranslation()
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
    .slice(0, 5)

  const weekRange = isoWeekRangeStrings()
  const thisWeekPoolHref = `${APP_ROUTE.statistics}?${createSearchParams({
    [STATISTICS_SEARCH_PARAMS.dateFrom]: weekRange.dateFrom,
    [STATISTICS_SEARCH_PARAMS.dateTo]: weekRange.dateTo,
    [STATISTICS_SEARCH_PARAMS.trainingType]: AthleteTrainingType.Swimming,
  }).toString()}`

  const drillDownCoach = { kind: 'coach' as const }

  const hasAnyData = trainingSessions.length > 0

  if (!coach) {
    return (
      <div className="page-stack">
        <PageHeader title={t('dashboard.coachDashboard')} description={t('dashboard.loading')} />
      </div>
    )
  }

  if (!hasAnyData) {
    return (
      <div className="page-stack">
        <PageHeader
          title={t('dashboard.coachDashboard')}
          description={t('dashboard.emptyDescription', { name: coach.displayName })}
        />
        <EmptyState
          icon={Users}
          title={t('dashboard.noDataTitle')}
          description={t('dashboard.noDataDescription')}
          action={
            <Button asChild>
              <Link to={APP_ROUTE.athleteNew}>{t('dashboard.addAthlete')}</Link>
            </Button>
          }
          secondaryAction={
            <Button asChild variant="outline">
              <Link to={APP_ROUTE.settings}>{t('dashboard.settings')}</Link>
            </Button>
          }
        />
      </div>
    )
  }

  const athleteLabel =
    athletes.length === 1 ? t('dashboard.athleteSingular') : t('dashboard.athletePlural')

  return (
    <div className="page-stack">
      <PageHeader
        title={t('dashboard.coachDashboard')}
        description={t('dashboard.overviewDescription', {
          name: coach.displayName,
          count: athletes.length,
          athleteLabel,
        })}
        actions={
          <Button asChild variant="secondary">
            <Link to={APP_ROUTE.athleteNew}>{t('dashboard.addAthlete')}</Link>
          </Button>
        }
      />

      <div>
        <p className="section-label mb-stack">{t('dashboard.rosterOverview')}</p>
        <div className="analytics-kpi-grid">
          <StatCard
            title={t('dashboard.statAthletes')}
            value={String(athletes.length)}
            icon={Users}
            to={APP_ROUTE.athletes}
            ariaLabel={t('dashboard.ariaAthletes', { count: athletes.length })}
          />
          <StatCard
            title={t('dashboard.statPoolSessions')}
            value={String(swimSummary.totalSessions)}
            icon={Waves}
            metric={MetricType.WorkoutCount}
            to={`${APP_ROUTE.statistics}?${createSearchParams({
              [STATISTICS_SEARCH_PARAMS.trainingType]: AthleteTrainingType.Swimming,
            }).toString()}`}
          />
          <StatCard
            title={t('dashboard.statGymSessions')}
            value={String(gymSummary.sessionCount)}
            icon={Activity}
            to={`${APP_ROUTE.statistics}?${createSearchParams({
              [STATISTICS_SEARCH_PARAMS.trainingType]: AthleteTrainingType.Gym,
            }).toString()}`}
          />
          <StatCard
            title={t('dashboard.statTotalPoolDistance')}
            value={formatDistanceMeters(swimSummary.totalDistanceMeters)}
            icon={Route}
            metric={MetricType.TotalDistance}
            to={APP_ROUTE.statistics}
          />
          <StatCard
            title={t('dashboard.statCombinedDuration')}
            value={formatDurationSeconds(
              swimSummary.totalDurationSeconds + gymSummary.totalDurationSeconds,
            )}
            icon={Clock}
            metric={MetricType.TotalDuration}
            to={APP_ROUTE.statistics}
          />
          <StatCard
            title={t('dashboard.statAvgPace')}
            value={
              swimSummary.averagePacePer100Seconds !== null
                ? formatPacePer100(swimSummary.averagePacePer100Seconds)
                : t('dashboard.dash')
            }
            hint={t('dashboard.paceHint')}
            icon={Gauge}
            metric={MetricType.AveragePace}
            to={APP_ROUTE.statistics}
          />
          <StatCard
            title={t('dashboard.statWeekVolume')}
            value={formatDistanceMeters(swimSummary.currentWeekDistanceMeters)}
            hint={t('dashboard.weekHint')}
            icon={Timer}
            metric={MetricType.WeekDistance}
            to={thisWeekPoolHref}
            ariaLabel={t('dashboard.ariaWeekPool', {
              distance: formatDistanceMeters(swimSummary.currentWeekDistanceMeters),
            })}
          />
        </div>
      </div>

      {swimSessions.length > 0 ? (
        <div>
          <p className="section-label mb-stack">{t('dashboard.poolTrends')}</p>
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
          <p className="section-label mb-stack">{t('dashboard.gymTime')}</p>
          <GymDashboardCharts
            weeklyDuration={weeklyGymDur}
            monthlyDuration={monthlyGymDur}
            drillDown={drillDownCoach}
          />
        </div>
      ) : null}

      <div>
        <p className="section-label mb-stack">{t('dashboard.recentSessions')}</p>
        <Card className="overflow-hidden">
          <CardHeader className="page-section-header">
            <CardTitle className="page-section-title">{t('dashboard.latestActivity')}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <StaggerList className="divide-y divide-border px-3 sm:px-card">
              {recent.map((recentSession) => {
                const rosterAthlete = athleteById.get(recentSession.athleteId)
                const athleteDisplayName = rosterAthlete?.fullName ?? t('dashboard.unknownAthlete')

                let sessionSummary = ''

                if (recentSession.trainingType === AthleteTrainingType.Swimming) {
                  const summary = buildSwimmingSessionSummary(recentSession, 2)
                  sessionSummary = `${summary.primaryStrokeLabel ?? t('dashboard.pool')} · ${formatDistanceMeters(summary.totalDistanceMeters)} · ${formatDurationSeconds(summary.totalDurationSeconds)}`
                } else {
                  sessionSummary = `${recentSession.sessionTitle || recentSession.blocks[0]?.title || t('dashboard.gym')} · ${formatDurationSeconds(getGymSessionTotalDurationSeconds(recentSession))}`
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
                    <Button variant="ghost" asChild className="min-h-10 w-full touch-manipulation sm:h-9 sm:min-h-0 sm:w-auto">
                      <Link to={sessionDetailPath(recentSession.athleteId, recentSession.id)}>
                        {t('dashboard.view')}
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
