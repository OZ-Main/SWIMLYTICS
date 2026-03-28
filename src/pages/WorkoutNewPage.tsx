import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { useWorkoutStore } from '@/app/store/workoutStore'
import PageHeader from '@/components/layout/PageHeader'
import WorkoutForm from '@/features/workouts/components/WorkoutForm'
import { workoutDetailPath } from '@/shared/constants/routes.constants'
import type { Workout } from '@/shared/types/domain.types'

export default function WorkoutNewPage() {
  const navigate = useNavigate()
  const addWorkout = useWorkoutStore((s) => s.addWorkout)

  function handleSubmit(workout: Workout) {
    addWorkout(workout)
    toast.success('Workout saved')
    navigate(workoutDetailPath(workout.id))
  }

  return (
    <div className="page-stack">
      <PageHeader
        title="New workout"
        description="Distance, duration, and stroke — pace per 100 m is calculated for you."
      />
      <WorkoutForm mode="create" onSubmit={handleSubmit} onCancel={() => navigate(-1)} />
    </div>
  )
}
