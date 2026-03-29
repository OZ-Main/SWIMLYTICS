import { useId } from 'react'
import { createSearchParams, useNavigate } from 'react-router-dom'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import ChartCard from '@/components/charts/ChartCard'
import ChartTooltipContent from '@/components/charts/ChartTooltipContent'
import { useChartTheme } from '@/lib/charts/useChartTheme'
import { useResponsiveChartLayout } from '@/lib/charts/useResponsiveChartLayout'
import { CHART_DATA_KEY, CHART_SERIES_NAME } from '@/shared/constants/chartData.constants'
import { APP_ROUTE, athleteDetailPath } from '@/shared/constants/routes.constants'
import { STATISTICS_SEARCH_PARAMS } from '@/shared/constants/statisticsUrlSearch.constants'
import { AthleteTrainingType } from '@/shared/domain'
import type { NamedChartPoint } from '@/shared/types/domain.types'
import { cn } from '@/shared/utils/cn'

export type GymChartsDrillDown =
  | { kind: 'coach' }
  | { kind: 'athlete'; athleteId: string }

type GymDashboardChartsProps = {
  weeklyDuration: NamedChartPoint[]
  monthlyDuration: NamedChartPoint[]
  drillDown: GymChartsDrillDown
}

function chartEmptyMessage(msg: string, className?: string) {
  return (
    <div role="status" className={cn('chart-empty-state', className)}>
      {msg}
    </div>
  )
}

export default function GymDashboardCharts({
  weeklyDuration,
  monthlyDuration,
  drillDown,
}: GymDashboardChartsProps) {
  const chart = useChartTheme()
  const navigate = useNavigate()
  const volumeGradientId = useId().replace(/:/g, '')
  const { marginTight, yAxisWidthBar } = useResponsiveChartLayout()

  const weekHas = weeklyDuration.some((durationPoint) => durationPoint.value > 0)
  const monthHas = monthlyDuration.some((durationPoint) => durationPoint.value > 0)

  function goStatistics() {
    if (drillDown.kind === 'coach') {
      navigate(APP_ROUTE.statistics)
      return
    }

    navigate(
      `${APP_ROUTE.statistics}?${createSearchParams({
        [STATISTICS_SEARCH_PARAMS.athleteId]: drillDown.athleteId,
        [STATISTICS_SEARCH_PARAMS.trainingType]: AthleteTrainingType.Gym,
      }).toString()}`,
    )
  }

  function goAthleteHome() {
    if (drillDown.kind === 'athlete') {
      navigate(athleteDetailPath(drillDown.athleteId))
    }
  }

  return (
    <div className="analytics-chart-grid">
      <ChartCard
        title="Weekly training time"
        description="Total session duration per ISO week (Mon–Sun). Click a bar for Statistics."
      >
        <div className="chart-surface-flush-left">
          {!weekHas ? (
            chartEmptyMessage('No gym time logged in this window.')
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyDuration} margin={{ ...marginTight }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={chart.grid}
                  vertical={false}
                />
                <XAxis
                  dataKey={CHART_DATA_KEY.NAME}
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
                  dataKey={CHART_DATA_KEY.VALUE}
                  name={CHART_SERIES_NAME.DURATION}
                  fill={chart.chart3}
                  radius={[4, 4, 0, 0]}
                  cursor="pointer"
                  onClick={goStatistics}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </ChartCard>

      <ChartCard
        title="Monthly training time"
        description="Total duration by calendar month. Click the area for Statistics."
      >
        <div className="chart-surface-flush-left">
          {!monthHas ? (
            chartEmptyMessage('No gym time in this window.')
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyDuration} margin={{ ...marginTight }}>
                <defs>
                  <linearGradient id={volumeGradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={chart.chart4} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={chart.chart4} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={chart.grid}
                  vertical={false}
                />
                <XAxis
                  dataKey={CHART_DATA_KEY.NAME}
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
                <Tooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey={CHART_DATA_KEY.VALUE}
                  name={CHART_SERIES_NAME.DURATION}
                  stroke={chart.chart4}
                  fill={`url(#${volumeGradientId})`}
                  strokeWidth={2}
                  cursor="pointer"
                  onClick={drillDown.kind === 'athlete' ? goAthleteHome : goStatistics}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </ChartCard>
    </div>
  )
}
