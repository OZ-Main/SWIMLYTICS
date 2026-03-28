import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type StatBlockProps = {
  label: string
  value: string
  hint?: string
}

export default function StatBlock({ label, value, hint }: StatBlockProps) {
  return (
    <Card>
      <CardHeader className="border-b border-border/50 bg-gradient-to-r from-muted/30 to-accent/[0.04] py-3">
        <CardTitle className="text-label font-semibold text-muted-foreground">{label}</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <p className="font-display text-kpi tabular-nums text-foreground">{value}</p>
        {hint ? <p className="mt-1 text-caption text-muted-foreground">{hint}</p> : null}
      </CardContent>
    </Card>
  )
}
