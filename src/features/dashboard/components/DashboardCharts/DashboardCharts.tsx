import { useId } from 'react'
import { createSearchParams, useNavigate } from 'react-router-dom'
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
import { APP_ROUTE } from '@/shared/constants/routes.constants'
import { STROKE_LABELS } from '@/shared/constants/strokeLabels'
import { WORKOUTS_SEARCH_PARAMS } from '@/shared/constants/workoutsUrlSearch.constants'
import type { NamedChartPoint, StrokeSlice, TimeSeriesPoint } from '@/shared/types/domain.types'
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
      aria-label={`Open workouts on ${date}`}
      onClick={(e) => {
        e.stopPropagation()
        onActivate(date)
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onActivate(date)
        }
      }}
    />
  )
}

type DashboardChartsProps = {
  weeklyDistance: NamedChartPoint[]
  monthlyVolume: NamedChartPoint[]
  strokeSlices: StrokeSlice[]
  paceTrend: TimeSeriesPoint[]
}

function chartEmptyMessage(className?: string) {
  return (
    <div
      role="status"
      className={
        className ??
        'flex h-full w-full flex-col items-center justify-center px-card text-center text-body-sm text-muted-foreground'
      }
    >
      No distance logged in this window.
    </div>
  )
}

export default function DashboardCharts({
  weeklyDistance,
  monthlyVolume,
  strokeSlices,
  paceTrend,
}: DashboardChartsProps) {
  const chart = useChartTheme()
  const navigate = useNavigate()
  const volumeGradientId = useId().replace(/:/g, '')

  const pieData = strokeSlices.map((s) => ({
    name: STROKE_LABELS[s.stroke],
    value: s.distanceMeters,
    strokeKey: s.stroke,
  }))

  const paceChartData = paceTrend.map((p) => ({
    date: p.date,
    pace: Number(p.value.toFixed(2)),
  }))

  const weekHasVolume = weeklyDistance.some((p) => p.value > 0)
  const monthHasVolume = monthlyVolume.some((p) => p.value > 0)

  function goStatistics() {
    navigate(APP_ROUTE.statistics)
  }

  function goWorkoutsFilteredByStroke(stroke: (typeof pieData)[number]['strokeKey']) {
    navigate(
      `${APP_ROUTE.workouts}?${createSearchParams({
        [WORKOUTS_SEARCH_PARAMS.stroke]: stroke,
      }).toString()}`,
    )
  }

  function goWorkoutsForDay(isoDate: string) {
    navigate(
      `${APP_ROUTE.workouts}?${createSearchParams({
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
        description="Share of total meters. Click a slice to filter workouts by stroke."
      >
        <div className="chart-surface">
          {pieData.length === 0 ? (
            <p className="flex h-full w-full flex-col items-center justify-center text-center text-body-sm text-muted-foreground">
              No stroke mix to display yet — log workouts with different strokes to see this chart.
            </p>
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
                  onClick={(_, index) => {
                    const row = pieData[index]
                    if (row) {
                      goWorkoutsFilteredByStroke(row.strokeKey)
                    }
                  }}
                >
                  {pieData.map((entry) => (
                    <Cell
                      key={entry.strokeKey}
                      fill={chart.stroke[entry.strokeKey] ?? chart.chart3}
                    />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltipContent />} />
                <Legend wrapperStyle={{ fontSize: CHART_TICK_PX }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </ChartCard>

      <ChartCard
        title="Average pace trend"
        description="Seconds per 100 m by workout date (lower is faster). Click a point to open that day in Workouts."
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
                  tickFormatter={(v) => {
                    try {
                      return format(parseISO(String(v)), DATE_FORMAT.CHART_WEEK_START)
                    } catch {
                      return String(v)
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
