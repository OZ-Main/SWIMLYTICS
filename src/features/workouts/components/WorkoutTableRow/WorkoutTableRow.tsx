import { Link } from 'react-router-dom'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TableCell, TableRow } from '@/components/ui/table'
import { DATE_FORMAT } from '@/shared/constants/dateDisplay.constants'
import { workoutDetailPath } from '@/shared/constants/routes.constants'
import { EFFORT_LABELS } from '@/shared/constants/effortLabels'
import { STROKE_LABELS } from '@/shared/constants/strokeLabels'
import {
  formatDistanceMeters,
  formatDurationSeconds,
  formatPacePer100,
} from '@/shared/helpers/formatters'
import type { Workout } from '@/shared/types/domain.types'
import { format, parseISO } from 'date-fns'

type WorkoutTableRowProps = {
  workout: Workout
}

export default function WorkoutTableRow({ workout: w }: WorkoutTableRowProps) {
  return (
    <TableRow>
      <TableCell className="font-medium">
        {format(parseISO(w.date), DATE_FORMAT.LIST_ROW)}
      </TableCell>
      <TableCell>{STROKE_LABELS[w.stroke]}</TableCell>
      <TableCell>{formatDistanceMeters(w.distance)}</TableCell>
      <TableCell>{formatDurationSeconds(w.duration)}</TableCell>
      <TableCell className="tabular-nums">{formatPacePer100(w.averagePacePer100)}</TableCell>
      <TableCell>
        <Badge variant="secondary">{EFFORT_LABELS[w.effortLevel]}</Badge>
      </TableCell>
      <TableCell className="text-right">
        <Button variant="ghost" size="sm" asChild>
          <Link to={workoutDetailPath(w.id)}>Open</Link>
        </Button>
      </TableCell>
    </TableRow>
  )
}
