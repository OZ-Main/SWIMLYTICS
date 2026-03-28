import { ChevronRight, Plus, Users } from 'lucide-react'
import { Link } from 'react-router-dom'

import { useAthleteStore } from '@/app/store/athleteStore'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import EmptyState from '@/components/feedback/EmptyState'
import PageHeader from '@/components/layout/PageHeader'
import { StaggerItem, StaggerList } from '@/components/motion'
import { ATHLETE_TRAINING_TYPE_LABELS } from '@/shared/constants/athleteTrainingTypeLabels'
import {
  APP_ROUTE,
  athleteDetailPath,
  athleteEditPath,
} from '@/shared/constants/routes.constants'

export default function AthletesListPage() {
  const athletes = useAthleteStore((athleteStore) => athleteStore.athletes)
  const sorted = [...athletes].sort((leftAthlete, rightAthlete) =>
    leftAthlete.fullName.localeCompare(rightAthlete.fullName),
  )

  return (
    <div className="page-stack">
      <PageHeader
        title="Athletes"
        description="Manage clients, training type, and session history in one place."
        actions={
          <Button asChild>
            <Link to={APP_ROUTE.athleteNew}>
              <Plus className="h-4 w-4" aria-hidden />
              Add athlete
            </Link>
          </Button>
        }
      />

      {sorted.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No athletes yet"
          description="Create a profile for each client to log pool or gym sessions and track analytics."
          action={
            <Button asChild>
              <Link to={APP_ROUTE.athleteNew}>Add your first athlete</Link>
            </Button>
          }
        />
      ) : (
        <StaggerList className="grid gap-stack sm:grid-cols-2">
          {sorted.map((rosterAthlete) => (
            <StaggerItem key={rosterAthlete.id}>
              <Card className="overflow-hidden transition-shadow hover:shadow-card-hover">
                <CardContent className="p-0">
                  <Link
                    to={athleteDetailPath(rosterAthlete.id)}
                    className="flex items-start justify-between gap-stack px-card py-section-sm text-left"
                  >
                    <div className="min-w-0 space-y-tight">
                      <p className="font-display text-heading-sm font-semibold text-foreground">
                        {rosterAthlete.fullName}
                      </p>
                      <Badge variant="secondary" className="font-normal">
                        {ATHLETE_TRAINING_TYPE_LABELS[rosterAthlete.trainingType]}
                      </Badge>
                      {rosterAthlete.notes.trim() ? (
                        <p className="line-clamp-2 text-body-sm text-muted-foreground">
                          {rosterAthlete.notes}
                        </p>
                      ) : null}
                    </div>
                    <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-muted-foreground" aria-hidden />
                  </Link>
                  <div className="border-t border-border/40 px-card py-tight">
                    <Button variant="ghost" size="sm" className="h-8 text-caption" asChild>
                      <Link to={athleteEditPath(rosterAthlete.id)}>Edit profile</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerList>
      )}
    </div>
  )
}
