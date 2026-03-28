import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type StatBlockProps = {
  label: string
  value: string
  hint?: string
}

export default function StatBlock({ label, value, hint }: StatBlockProps) {
  return (
    <Card>
      <CardHeader className="border-b border-border/40 bg-muted/10 py-3">
        <CardTitle className="text-label font-medium text-muted-foreground">{label}</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <p className="font-display text-heading-lg font-semibold tabular-nums text-foreground">{value}</p>
        {hint ? <p className="mt-1 text-caption text-muted-foreground">{hint}</p> : null}
      </CardContent>
    </Card>
  )
}
