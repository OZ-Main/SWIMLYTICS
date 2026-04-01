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
  chart1: 'hsl(199 78% 42%)',
  chart2: 'hsl(168 58% 38%)',
  chart3: 'hsl(227 58% 52%)',
  chart4: 'hsl(154 54% 36%)',
  chart5: 'hsl(270 54% 54%)',
  grid: 'hsl(210 22% 82%)',
  axis: 'hsl(215 18% 36%)',
  stroke: {
    [Stroke.Freestyle]: 'hsl(199 76% 44%)',
    [Stroke.Backstroke]: 'hsl(217 42% 48%)',
    [Stroke.Breaststroke]: 'hsl(156 56% 38%)',
    [Stroke.Butterfly]: 'hsl(276 56% 52%)',
    [Stroke.Im]: 'hsl(176 68% 40%)',
    [Stroke.Drill]: 'hsl(44 90% 48%)',
    [Stroke.Kick]: 'hsl(16 74% 50%)',
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
