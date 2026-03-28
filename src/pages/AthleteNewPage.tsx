import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { useAthleteStore } from '@/app/store/athleteStore'
import PageHeader from '@/components/layout/PageHeader'
import AthleteForm from '@/features/athletes/components/AthleteForm'
import { athleteDetailPath } from '@/shared/constants/routes.constants'
import type { Athlete } from '@/shared/types/domain.types'

export default function AthleteNewPage() {
  const navigate = useNavigate()
  const addAthlete = useAthleteStore((athleteStore) => athleteStore.addAthlete)

  function handleSubmit(athlete: Athlete) {
    addAthlete(athlete)
    toast.success('Athlete created')
    navigate(athleteDetailPath(athlete.id))
  }

  return (
    <div className="page-stack">
      <PageHeader
        title="New athlete"
        description="Set their name, training type (pool or gym), and any coaching notes."
      />
      <AthleteForm mode="create" onSubmit={handleSubmit} onCancel={() => navigate(-1)} />
    </div>
  )
}
