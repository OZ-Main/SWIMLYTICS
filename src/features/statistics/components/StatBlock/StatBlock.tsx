import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type StatBlockProps = {
  label: string
  value: string
  hint?: string
}

export default function StatBlock({ label, value, hint }: StatBlockProps) {
  return (
    <Card className="border-border/60 shadow-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-label font-medium text-muted-foreground">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="font-display text-heading-lg font-semibold text-foreground">{value}</p>
        {hint ? <p className="mt-1 text-caption text-muted-foreground">{hint}</p> : null}
      </CardContent>
    </Card>
  )
}
