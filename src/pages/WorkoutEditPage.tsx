import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'

import { useWorkoutStore } from '@/app/store/workoutStore'
import PageHeader from '@/components/layout/PageHeader'
import WorkoutForm from '@/features/workouts/components/WorkoutForm'
import { ROUTE_PARAM, workoutDetailPath } from '@/shared/constants/routes.constants'
import type { Workout } from '@/shared/types/domain.types'

export default function WorkoutEditPage() {
  const params = useParams()
  const workoutId = params[ROUTE_PARAM.workoutId]
  const navigate = useNavigate()
  const workouts = useWorkoutStore((s) => s.workouts)
  const updateWorkout = useWorkoutStore((s) => s.updateWorkout)

  const workout = workoutId ? workouts.find((w) => w.id === workoutId) : undefined

  if (!workoutId || !workout) {
    return (
      <div className="page-stack">
        <PageHeader title="Workout not found" description="This session may have been removed." />
      </div>
    )
  }

  function handleSubmit(next: Workout) {
    updateWorkout(next)
    toast.success('Workout updated')
    navigate(workoutDetailPath(next.id))
  }

  return (
    <div className="page-stack">
      <PageHeader
        title="Edit workout"
        description="Adjust fields — validation keeps ranges realistic."
      />
      <WorkoutForm
        mode="edit"
        initialWorkout={workout}
        onSubmit={handleSubmit}
        onCancel={() => navigate(workoutDetailPath(workout.id))}
      />
    </div>
  )
}
