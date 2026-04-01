import { format, parseISO } from 'date-fns'
import { BarChart3 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
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
import { CHART_DATA_KEY } from '@/shared/constants/chartData.constants'
import { DATE_FORMAT } from '@/shared/constants/dateDisplay.constants'
import { APP_ROUTE, athleteDetailPath } from '@/shared/constants/routes.constants'
import { STROKE_FILTER_OPTIONS } from '@/shared/constants/strokeLabels'
import { WORKOUT_FILTER_ALL } from '@/shared/constants/workoutFilter.constants'
import { AthleteTrainingType } from '@/shared/domain'
import {
  formatDistanceMeters,
  formatDurationSeconds,
  formatPacePer100,
} from '@/shared/helpers/formatters'
import { translateStroke, translateTrainingType } from '@/shared/helpers/i18nLabels.helpers'

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
  const { t } = useTranslation()
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
        title={t('statistics.title')}
        description={t('statistics.description')}
      />

      <div className="form-filter-panel sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-tight">
          <Label htmlFor="stats-athlete">{t('statistics.athlete')}</Label>
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
              <SelectValue placeholder={t('statistics.allAthletes')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('statistics.allAthletes')}</SelectItem>
              {sortedAthletes.map((athleteOption) => (
                <SelectItem key={athleteOption.id} value={athleteOption.id}>
                  {athleteOption.fullName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-tight">
          <Label htmlFor="stats-training">{t('filters.trainingType')}</Label>
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
              <SelectItem value="all">{t('filters.allTypes')}</SelectItem>
              <SelectItem value={AthleteTrainingType.Swimming}>
                {translateTrainingType(t, AthleteTrainingType.Swimming)}
              </SelectItem>
              <SelectItem value={AthleteTrainingType.Gym}>
                {translateTrainingType(t, AthleteTrainingType.Gym)}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-tight">
          <Label htmlFor="stats-stroke">{t('filters.strokePool')}</Label>
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
              <SelectItem value={WORKOUT_FILTER_ALL}>{t('filters.allStrokes')}</SelectItem>
              {STROKE_FILTER_OPTIONS.filter(
                (strokeOption) => strokeOption !== WORKOUT_FILTER_ALL,
              ).map((strokeOption) => (
                <SelectItem key={strokeOption} value={strokeOption}>
                  {translateStroke(t, strokeOption)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-1 gap-stack sm:col-span-2 sm:grid-cols-2 lg:col-span-1">
          <div className="space-y-tight">
            <Label htmlFor="stats-from">{t('statistics.from')}</Label>
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
            <Label htmlFor="stats-to">{t('statistics.to')}</Label>
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
            trainingSessions.length === 0
              ? t('statistics.emptyNoSessionsTitle')
              : t('statistics.emptyNoSliceTitle')
          }
          description={
            trainingSessions.length === 0
              ? t('statistics.emptyNoSessionsDescription')
              : t('statistics.emptyWidenDescription')
          }
          action={
            trainingSessions.length === 0 ? (
              <Button asChild>
                <Link to={APP_ROUTE.athletes}>{t('statistics.openAthletes')}</Link>
              </Button>
            ) : filtersActive ? (
              <Button type="button" variant="default" onClick={() => setFilters(emptyFilters())}>
                {t('statistics.clearFilters')}
              </Button>
            ) : undefined
          }
        />
      ) : (
        <>
          {hasSwim ? (
            <div className="space-y-6 sm:space-y-section">
              <p className="section-label">{t('statistics.poolSection')}</p>
              <div className="stats-metric-grid">
                <StatBlock label={t('statistics.metricSessions')} value={String(swimStats.sessionCount)} />
                <StatBlock
                  label={t('statistics.metricTotalDistance')}
                  value={formatDistanceMeters(swimStats.totalDistanceMeters)}
                />
                <StatBlock
                  label={t('statistics.metricTotalDuration')}
                  value={formatDurationSeconds(swimStats.totalDurationSeconds)}
                />
                <StatBlock
                  label={t('statistics.metricAvgDistance')}
                  value={formatDistanceMeters(swimStats.averageDistanceMeters)}
                />
                <StatBlock
                  label={t('statistics.metricAvgDuration')}
                  value={formatDurationSeconds(swimStats.averageDurationSeconds)}
                />
                <StatBlock
                  label={t('statistics.metricBestPace')}
                  value={
                    swimStats.bestPacePer100 !== null
                      ? formatPacePer100(swimStats.bestPacePer100)
                      : t('statistics.dash')
                  }
                />
                <StatBlock
                  label={t('statistics.metricLongestSessionDistance')}
                  value={
                    swimStats.longestSwimmingSession
                      ? formatDistanceMeters(
                          getSwimmingSessionTotalDistanceMeters(swimStats.longestSwimmingSession),
                        )
                      : t('statistics.dash')
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
                  label={t('statistics.metricMostFrequentStroke')}
                  value={
                    swimStats.mostFrequentStroke
                      ? translateStroke(t, swimStats.mostFrequentStroke)
                      : t('statistics.dash')
                  }
                />
              </div>
              <div className="analytics-chart-grid">
                <ChartCard
                  title={t('statistics.weeklyPoolVolume')}
                  description={t('statistics.weeklyPoolVolumeDesc')}
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
                          name={t('charts.series.meters')}
                          cursor="pointer"
                          onClick={() => navigate(APP_ROUTE.athletes)}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </ChartCard>
                <ChartCard
                  title={t('statistics.monthlyPoolVolume')}
                  description={t('statistics.monthlyPoolVolumeDesc')}
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
                          name={t('charts.series.meters')}
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
              <p className="section-label">{t('statistics.gymSection')}</p>
              <div className="stats-metric-grid">
                <StatBlock label={t('statistics.metricSessions')} value={String(gymStats.sessionCount)} />
                <StatBlock
                  label={t('statistics.metricTotalDuration')}
                  value={formatDurationSeconds(gymStats.totalDurationSeconds)}
                />
                <StatBlock
                  label={t('statistics.metricAvgDuration')}
                  value={formatDurationSeconds(gymStats.averageDurationSeconds)}
                />
                <StatBlock
                  label={t('statistics.metricLongestSession')}
                  value={
                    gymStats.longestGymSession
                      ? formatDurationSeconds(
                          getGymSessionTotalDurationSeconds(gymStats.longestGymSession),
                        )
                      : t('statistics.dash')
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
                <ChartCard title={t('statistics.weeklyGymTime')} description={t('statistics.weeklyGymTimeDesc')}>
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
                          name={t('charts.series.duration')}
                          cursor="pointer"
                          onClick={() => navigate(APP_ROUTE.athletes)}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </ChartCard>
                <ChartCard title={t('statistics.monthlyGymTime')} description={t('statistics.monthlyGymTimeDesc')}>
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
                          name={t('charts.series.duration')}
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
              <CardTitle className="page-section-title">{t('statistics.summaryHeading')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-tight pt-card text-body-sm leading-relaxed text-muted-foreground">
              {hasSwim ? (
                <p>
                  {t('statistics.summarySwim', {
                    distance: formatDistanceMeters(swimStats.averageDistanceMeters),
                    duration: formatDurationSeconds(swimStats.averageDurationSeconds),
                  })}
                </p>
              ) : null}
              {hasGym ? (
                <p>
                  {t('statistics.summaryGym', {
                    duration: formatDurationSeconds(gymStats.averageDurationSeconds),
                  })}
                </p>
              ) : null}
              {filters.athleteId ? (
                <p>
                  <Button variant="link" className="h-auto p-0" asChild>
                    <Link to={athleteDetailPath(filters.athleteId)}>
                      {t('statistics.openThisAthlete')}
                    </Link>
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
