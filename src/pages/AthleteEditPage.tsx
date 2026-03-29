import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'

import { useAthleteStore } from '@/app/store/athleteStore'
import PageHeader from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import AthleteForm from '@/features/athletes/components/AthleteForm'
import { APP_ROUTE, athleteDetailPath, ROUTE_PARAM } from '@/shared/constants/routes.constants'
import type { Athlete } from '@/shared/types/domain.types'

export default function AthleteEditPage() {
  const params = useParams()
  const athleteId = params[ROUTE_PARAM.athleteId]
  const navigate = useNavigate()
  const athlete = useAthleteStore((athleteStore) =>
    athleteId
      ? athleteStore.athletes.find((candidateAthlete) => candidateAthlete.id === athleteId)
      : undefined,
  )
  const updateAthlete = useAthleteStore((athleteStore) => athleteStore.updateAthlete)

  if (!athleteId || !athlete) {
    return (
      <div className="page-stack">
        <PageHeader
          title="Athlete not found"
          description="This profile may have been removed."
          actions={
            <Button asChild variant="outline">
              <Link to={APP_ROUTE.athletes}>All athletes</Link>
            </Button>
          }
        />
      </div>
    )
  }

  async function handleSubmit(updatedAthlete: Athlete) {
    try {
      await updateAthlete(updatedAthlete)
      toast.success('Profile updated')
      navigate(athleteDetailPath(updatedAthlete.id))
    } catch {
      toast.error('Could not update athlete.')
    }
  }

  return (
    <div className="page-stack">
      <PageHeader
        title="Edit athlete"
        description="Training type controls which session fields and charts apply."
      />
      <AthleteForm
        mode="edit"
        initial={athlete}
        onSubmit={handleSubmit}
        onCancel={() => navigate(athleteDetailPath(athlete.id))}
      />
    </div>
  )
}
