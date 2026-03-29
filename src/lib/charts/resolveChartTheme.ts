import { STROKE_ORDER } from '@/shared/constants/strokeLabels'
import { Stroke } from '@/shared/domain'

export type ResolvedChartTheme = {
  chart1: string
  chart2: string
  chart3: string
  chart4: string
  chart5: string
  grid: string
  axis: string
  stroke: Record<Stroke, string>
}

function hslFromVar(cssVarName: string, root: HTMLElement): string {
  const raw = getComputedStyle(root).getPropertyValue(cssVarName).trim()
  if (!raw) {
    return 'hsl(200 10% 50%)'
  }

  return `hsl(${raw})`
}

const FALLBACK_THEME: ResolvedChartTheme = {
  chart1: 'hsl(198 75% 42%)',
  chart2: 'hsl(186 78% 40%)',
  chart3: 'hsl(228 58% 52%)',
  chart4: 'hsl(168 52% 38%)',
  chart5: 'hsl(268 52% 54%)',
  grid: 'hsl(210 22% 82%)',
  axis: 'hsl(215 18% 36%)',
  stroke: {
    [Stroke.Freestyle]: 'hsl(198 72% 44%)',
    [Stroke.Backstroke]: 'hsl(222 42% 48%)',
    [Stroke.Breaststroke]: 'hsl(162 55% 38%)',
    [Stroke.Butterfly]: 'hsl(278 58% 52%)',
    [Stroke.Im]: 'hsl(188 65% 42%)',
    [Stroke.Drill]: 'hsl(42 88% 48%)',
    [Stroke.Kick]: 'hsl(18 75% 50%)',
  },
}

export function resolveChartTheme(): ResolvedChartTheme {
  if (typeof document === 'undefined') {
    return FALLBACK_THEME
  }

  const root = document.documentElement
  const stroke = {} as Record<Stroke, string>
  for (const key of STROKE_ORDER) {
    stroke[key] = hslFromVar(`--stroke-${key}`, root)
  }

  return {
    chart1: hslFromVar('--chart-1', root),
    chart2: hslFromVar('--chart-2', root),
    chart3: hslFromVar('--chart-3', root),
    chart4: hslFromVar('--chart-4', root),
    chart5: hslFromVar('--chart-5', root),
    grid: hslFromVar('--chart-grid', root),
    axis: hslFromVar('--chart-axis', root),
    stroke,
  }
}
