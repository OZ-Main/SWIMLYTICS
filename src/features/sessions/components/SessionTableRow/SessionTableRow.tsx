import { Link } from 'react-router-dom'

import { buildSwimmingSessionSummary } from '@/features/sessions/helpers/sessionSummary.helpers'
import { getGymSessionTotalDurationSeconds } from '@/features/sessions/helpers/sessionTotals.helpers'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TableCell, TableRow } from '@/components/ui/table'
import { DATE_FORMAT } from '@/shared/constants/dateDisplay.constants'
import { sessionDetailPath } from '@/shared/constants/routes.constants'
import { EFFORT_LABELS } from '@/shared/constants/effortLabels'
import { formatDistanceMeters, formatDurationSeconds } from '@/shared/helpers/formatters'
import { isGymTrainingSession, isSwimmingTrainingSession } from '@/shared/helpers/sessionType.helpers'
import type { TrainingSession } from '@/shared/types/domain.types'
import { format, parseISO } from 'date-fns'

type SessionTableRowProps = {
  session: TrainingSession
}

export default function SessionTableRow({ session }: SessionTableRowProps) {
  const detailHref = sessionDetailPath(session.athleteId, session.id)

  if (isGymTrainingSession(session)) {
    const totalSeconds = getGymSessionTotalDurationSeconds(session)
    const primaryEffort = session.blocks[0]?.effortLevel
    return (
      <TableRow>
        <TableCell className="font-medium">
          {format(parseISO(session.date), DATE_FORMAT.LIST_ROW)}
        </TableCell>
        <TableCell className="max-w-[220px] truncate">
          {session.sessionTitle || session.blocks.map((block) => block.title).join(' · ')}
        </TableCell>
        <TableCell>{formatDurationSeconds(totalSeconds)}</TableCell>
        <TableCell>
          {primaryEffort ? (
            <Badge variant="secondary">{EFFORT_LABELS[primaryEffort]}</Badge>
          ) : (
            '—'
          )}
        </TableCell>
        <TableCell className="text-right">
          <Button variant="ghost" size="sm" asChild>
            <Link to={detailHref}>Open</Link>
          </Button>
        </TableCell>
      </TableRow>
    )
  }

  if (isSwimmingTrainingSession(session)) {
    const summary = buildSwimmingSessionSummary(session, 2)
    return (
      <TableRow>
        <TableCell className="font-medium">
          {format(parseISO(session.date), DATE_FORMAT.LIST_ROW)}
        </TableCell>
        <TableCell>{summary.primaryStrokeLabel ?? '—'}</TableCell>
        <TableCell>{formatDistanceMeters(summary.totalDistanceMeters)}</TableCell>
        <TableCell>{formatDurationSeconds(summary.totalDurationSeconds)}</TableCell>
        <TableCell className="max-w-[200px] truncate text-body-sm text-muted-foreground">
          {summary.blockCount} parts · {summary.shortBlockSummary}
        </TableCell>
        <TableCell>
          <Badge variant="secondary">
            {session.blocks[0] ? EFFORT_LABELS[session.blocks[0].effortLevel] : '—'}
          </Badge>
        </TableCell>
        <TableCell className="text-right">
          <Button variant="ghost" size="sm" asChild>
            <Link to={detailHref}>Open</Link>
          </Button>
        </TableCell>
      </TableRow>
    )
  }

  return null
}
