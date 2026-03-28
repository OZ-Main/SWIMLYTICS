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

export function resolveChartTheme(): ResolvedChartTheme {
  if (typeof document === 'undefined') {
    return {
      chart1: 'hsl(197 55% 38%)',
      chart2: 'hsl(189 48% 42%)',
      chart3: 'hsl(216 20% 48%)',
      chart4: 'hsl(158 38% 38%)',
      chart5: 'hsl(265 38% 52%)',
      grid: 'hsl(210 18% 88%)',
      axis: 'hsl(215 14% 42%)',
      stroke: {
        [Stroke.Freestyle]: 'hsl(197 55% 42%)',
        [Stroke.Backstroke]: 'hsl(216 28% 48%)',
        [Stroke.Breaststroke]: 'hsl(158 36% 36%)',
        [Stroke.Butterfly]: 'hsl(278 38% 50%)',
        [Stroke.Im]: 'hsl(189 44% 38%)',
        [Stroke.Drill]: 'hsl(38 76% 46%)',
        [Stroke.Kick]: 'hsl(14 68% 50%)',
      },
    }
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
