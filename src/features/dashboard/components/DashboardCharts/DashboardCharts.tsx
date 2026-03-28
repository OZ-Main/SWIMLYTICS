import { useId } from 'react'
import { createSearchParams, useNavigate } from 'react-router-dom'

import { AthleteTrainingType } from '@/shared/domain'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import ChartCard from '@/components/charts/ChartCard'
import ChartTooltipContent from '@/components/charts/ChartTooltipContent'
import { useChartTheme } from '@/lib/charts/useChartTheme'
import {
  CHART_BAR_RADIUS,
  CHART_TICK_PX,
  RECHARTS_MARGIN_DEFAULT,
  RECHARTS_MARGIN_TIGHT_LEFT,
} from '@/shared/constants/chartUi.constants'
import { CHART_DATA_KEY, CHART_SERIES_NAME } from '@/shared/constants/chartData.constants'
import { CHART_GRID_DASH } from '@/shared/constants/recharts.constants'
import { LINE_POINT_STYLE, PIE_CHART_LAYOUT } from '@/shared/constants/chartLayout.constants'
import { DATE_FORMAT, PACE_AXIS_LABEL } from '@/shared/constants/dateDisplay.constants'
import { APP_ROUTE, athleteDetailPath } from '@/shared/constants/routes.constants'
import { STATISTICS_SEARCH_PARAMS } from '@/shared/constants/statisticsUrlSearch.constants'
import { STROKE_LABELS } from '@/shared/constants/strokeLabels'
import { WORKOUTS_SEARCH_PARAMS } from '@/shared/constants/workoutsUrlSearch.constants'
import type { NamedChartPoint, StrokeSlice, TimeSeriesPoint } from '@/shared/types/domain.types'
import { cn } from '@/shared/utils/cn'
import { format, parseISO } from 'date-fns'

type PaceSessionDotProps = {
  cx?: number
  cy?: number
  payload?: { date: string; pace: number }
  fill: string
  onActivate: (isoDate: string) => void
  r?: number
}

/** Recharts `Line` dot renderer props (payload shape matches `paceChartData`). */
type PaceLineDotRenderProps = {
  cx?: number
  cy?: number
  payload?: { date: string; pace: number }
}

function PaceSessionDot({ cx, cy, payload, fill, onActivate, r }: PaceSessionDotProps) {
  const radius = r ?? LINE_POINT_STYLE.DOT_RADIUS
  if (cx == null || cy == null || !payload?.date) {
    return null
  }

  const date = payload.date

  return (
    <circle
      cx={cx}
      cy={cy}
      r={radius}
      fill={fill}
      className="cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
      tabIndex={0}
      aria-label={`Open sessions on ${date}`}
      onClick={(pointerEvent) => {
        pointerEvent.stopPropagation()
        onActivate(date)
      }}
      onKeyDown={(keyboardEvent) => {
        if (keyboardEvent.key === 'Enter' || keyboardEvent.key === ' ') {
          keyboardEvent.preventDefault()
          onActivate(date)
        }
      }}
    />
  )
}

export type SwimChartsDrillDown =
  | { kind: 'coach' }
  | { kind: 'athlete'; athleteId: string }

type DashboardChartsProps = {
  weeklyDistance: NamedChartPoint[]
  monthlyVolume: NamedChartPoint[]
  strokeSlices: StrokeSlice[]
  paceTrend: TimeSeriesPoint[]
  drillDown: SwimChartsDrillDown
}

function chartEmptyMessage(className?: string) {
  return (
    <div role="status" className={cn('chart-empty-state', className)}>
      No distance logged in this window.
    </div>
  )
}

export default function DashboardCharts({
  weeklyDistance,
  monthlyVolume,
  strokeSlices,
  paceTrend,
  drillDown,
}: DashboardChartsProps) {
  const chart = useChartTheme()
  const navigate = useNavigate()
  const volumeGradientId = useId().replace(/:/g, '')

  const pieData = strokeSlices.map((strokeSlice) => ({
    name: STROKE_LABELS[strokeSlice.stroke],
    value: strokeSlice.distanceMeters,
    strokeKey: strokeSlice.stroke,
  }))

  const paceChartData = paceTrend.map((pacePoint) => ({
    date: pacePoint.date,
    pace: Number(pacePoint.value.toFixed(2)),
  }))

  const weekHasVolume = weeklyDistance.some((weekPoint) => weekPoint.value > 0)
  const monthHasVolume = monthlyVolume.some((monthPoint) => monthPoint.value > 0)

  function goStatistics() {
    if (drillDown.kind === 'coach') {
      navigate(APP_ROUTE.statistics)
      return
    }
    navigate(
      `${APP_ROUTE.statistics}?${createSearchParams({
        [STATISTICS_SEARCH_PARAMS.athleteId]: drillDown.athleteId,
        [STATISTICS_SEARCH_PARAMS.trainingType]: AthleteTrainingType.Swimming,
      }).toString()}`,
    )
  }

  function goWorkoutsFilteredByStroke(stroke: (typeof pieData)[number]['strokeKey']) {
    if (drillDown.kind === 'coach') {
      navigate(
        `${APP_ROUTE.statistics}?${createSearchParams({
          [STATISTICS_SEARCH_PARAMS.stroke]: stroke,
          [STATISTICS_SEARCH_PARAMS.trainingType]: AthleteTrainingType.Swimming,
        }).toString()}`,
      )
      return
    }
    navigate(
      `${athleteDetailPath(drillDown.athleteId)}?${createSearchParams({
        [WORKOUTS_SEARCH_PARAMS.stroke]: stroke,
      }).toString()}`,
    )
  }

  function goWorkoutsForDay(isoDate: string) {
    if (drillDown.kind === 'coach') {
      navigate(
        `${APP_ROUTE.statistics}?${createSearchParams({
          [STATISTICS_SEARCH_PARAMS.dateFrom]: isoDate,
          [STATISTICS_SEARCH_PARAMS.dateTo]: isoDate,
          [STATISTICS_SEARCH_PARAMS.trainingType]: AthleteTrainingType.Swimming,
        }).toString()}`,
      )
      return
    }
    navigate(
      `${athleteDetailPath(drillDown.athleteId)}?${createSearchParams({
        [WORKOUTS_SEARCH_PARAMS.dateFrom]: isoDate,
        [WORKOUTS_SEARCH_PARAMS.dateTo]: isoDate,
      }).toString()}`,
    )
  }

  return (
    <div className="analytics-chart-grid">
      <ChartCard
        title="Weekly distance"
        description="Meters logged per ISO week (Mon–Sun). Click a bar for Statistics."
      >
        <div className="chart-surface-flush-left">
          {!weekHasVolume ? (
            chartEmptyMessage()
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyDistance} margin={{ ...RECHARTS_MARGIN_TIGHT_LEFT }}>
                <CartesianGrid
                  strokeDasharray={CHART_GRID_DASH}
                  stroke={chart.grid}
                  vertical={false}
                />
                <XAxis
                  dataKey={CHART_DATA_KEY.NAME}
                  tick={{ fill: chart.axis, fontSize: CHART_TICK_PX }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: chart.axis, fontSize: CHART_TICK_PX }}
                  axisLine={false}
                  tickLine={false}
                  width={44}
                />
                <Tooltip
                  content={<ChartTooltipContent />}
                  cursor={{ fill: chart.grid, opacity: 0.2 }}
                />
                <Bar
                  dataKey={CHART_DATA_KEY.VALUE}
                  name={CHART_SERIES_NAME.METERS}
                  fill={chart.chart1}
                  radius={CHART_BAR_RADIUS}
                  cursor="pointer"
                  onClick={goStatistics}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </ChartCard>

      <ChartCard
        title="Monthly training volume"
        description="Total meters by calendar month. Click the area for Statistics."
      >
        <div className="chart-surface-flush-left">
          {!monthHasVolume ? (
            chartEmptyMessage()
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyVolume} margin={{ ...RECHARTS_MARGIN_TIGHT_LEFT }}>
                <defs>
                  <linearGradient id={volumeGradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={chart.chart2} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={chart.chart2} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray={CHART_GRID_DASH}
                  stroke={chart.grid}
                  vertical={false}
                />
                <XAxis
                  dataKey={CHART_DATA_KEY.NAME}
                  tick={{ fill: chart.axis, fontSize: CHART_TICK_PX }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: chart.axis, fontSize: CHART_TICK_PX }}
                  axisLine={false}
                  tickLine={false}
                  width={44}
                />
                <Tooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey={CHART_DATA_KEY.VALUE}
                  name={CHART_SERIES_NAME.METERS}
                  stroke={chart.chart2}
                  fill={`url(#${volumeGradientId})`}
                  strokeWidth={LINE_POINT_STYLE.STROKE_WIDTH}
                  cursor="pointer"
                  onClick={goStatistics}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </ChartCard>

      <ChartCard
        title="Volume by stroke"
        description="Share of total meters. Click a slice to filter sessions by stroke."
      >
        <div className="chart-surface">
          {pieData.length === 0 ? (
            <div role="status" className="chart-empty-state">
              No stroke mix yet — log pool sessions with different strokes to see this chart.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ ...RECHARTS_MARGIN_DEFAULT }}>
                <Pie
                  data={pieData}
                  dataKey={CHART_DATA_KEY.VALUE}
                  nameKey={CHART_DATA_KEY.NAME}
                  cx="50%"
                  cy="50%"
                  innerRadius={PIE_CHART_LAYOUT.INNER_RADIUS}
                  outerRadius={PIE_CHART_LAYOUT.OUTER_RADIUS}
                  paddingAngle={PIE_CHART_LAYOUT.PADDING_ANGLE_DEG}
                  cursor="pointer"
                  onClick={(_rechartsEvent, sliceIndex) => {
                    const selectedStrokeSlice = pieData[sliceIndex]
                    if (selectedStrokeSlice) {
                      goWorkoutsFilteredByStroke(selectedStrokeSlice.strokeKey)
                    }
                  }}
                >
                  {pieData.map((pieSlice) => (
                    <Cell
                      key={pieSlice.strokeKey}
                      fill={chart.stroke[pieSlice.strokeKey] ?? chart.chart3}
                    />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltipContent />} />
                <Legend
                  wrapperStyle={{ fontSize: CHART_TICK_PX, color: chart.axis }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </ChartCard>

      <ChartCard
        title="Average pace trend"
        description="Seconds per 100 m by session date (lower is faster). Click a point to open that day in Statistics."
      >
        <div className="chart-surface-flush-left">
          {paceChartData.length === 0 ? (
            chartEmptyMessage()
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={paceChartData} margin={{ ...RECHARTS_MARGIN_DEFAULT }}>
                <CartesianGrid
                  strokeDasharray={CHART_GRID_DASH}
                  stroke={chart.grid}
                  vertical={false}
                />
                <XAxis
                  dataKey={CHART_DATA_KEY.DATE}
                  tickFormatter={(axisTickValue) => {
                    try {
                      return format(parseISO(String(axisTickValue)), DATE_FORMAT.CHART_WEEK_START)
                    } catch {
                      return String(axisTickValue)
                    }
                  }}
                  tick={{ fill: chart.axis, fontSize: CHART_TICK_PX }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: chart.axis, fontSize: CHART_TICK_PX }}
                  axisLine={false}
                  tickLine={false}
                  width={40}
                  label={{
                    value: PACE_AXIS_LABEL,
                    angle: -90,
                    position: 'insideLeft',
                    fill: chart.axis,
                    fontSize: CHART_TICK_PX,
                  }}
                />
                <Tooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey={CHART_DATA_KEY.PACE}
                  name={CHART_SERIES_NAME.PACE}
                  stroke={chart.chart1}
                  strokeWidth={LINE_POINT_STYLE.STROKE_WIDTH}
                  dot={(props: PaceLineDotRenderProps) => (
                    <PaceSessionDot
                      cx={props.cx}
                      cy={props.cy}
                      payload={props.payload}
                      fill={chart.chart1}
                      onActivate={goWorkoutsForDay}
                    />
                  )}
                  activeDot={(props: PaceLineDotRenderProps) => (
                    <PaceSessionDot
                      cx={props.cx}
                      cy={props.cy}
                      payload={props.payload}
                      fill={chart.chart1}
                      r={LINE_POINT_STYLE.ACTIVE_DOT_RADIUS}
                      onActivate={goWorkoutsForDay}
                    />
                  )}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </ChartCard>
    </div>
  )
}
