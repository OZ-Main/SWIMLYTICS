import { ChevronRight, Plus, Users } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { useAthleteStore } from '@/app/store/athleteStore'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import EmptyState from '@/components/feedback/EmptyState'
import PageHeader from '@/components/layout/PageHeader'
import { StaggerItem, StaggerList } from '@/components/motion'
import { WORKOUT_FILTER_ALL } from '@/shared/constants/workoutFilter.constants'
import {
  APP_ROUTE,
  athleteDetailPath,
  athleteEditPath,
} from '@/shared/constants/routes.constants'
import { AthleteTrainingType } from '@/shared/domain'
import { athleteGroupDisplayLabel } from '@/shared/helpers/athleteGroupDisplay.helpers'
import { translateTrainingType } from '@/shared/helpers/i18nLabels.helpers'

export default function AthletesListPage() {
  const { t } = useTranslation()
  const athletes = useAthleteStore((athleteStore) => athleteStore.athletes)
  const [trainingTypeFilter, setTrainingTypeFilter] = useState<
    typeof WORKOUT_FILTER_ALL | AthleteTrainingType
  >(WORKOUT_FILTER_ALL)
  const [groupSearch, setGroupSearch] = useState('')
  const [nameSearch, setNameSearch] = useState('')

  const sortedFiltered = useMemo(() => {
    const sorted = [...athletes].sort((leftAthlete, rightAthlete) =>
      leftAthlete.fullName.localeCompare(rightAthlete.fullName),
    )
    const groupNeedle = groupSearch.trim().toLowerCase()
    const nameNeedle = nameSearch.trim().toLowerCase()
    return sorted.filter((rosterAthlete) => {
      if (
        trainingTypeFilter !== WORKOUT_FILTER_ALL &&
        rosterAthlete.trainingType !== trainingTypeFilter
      ) {
        return false
      }

      if (groupNeedle.length > 0 && !rosterAthlete.group.toLowerCase().includes(groupNeedle)) {
        return false
      }

      if (nameNeedle.length > 0 && !rosterAthlete.fullName.toLowerCase().includes(nameNeedle)) {
        return false
      }

      return true
    })
  }, [athletes, trainingTypeFilter, groupSearch, nameSearch])

  return (
    <div className="page-stack">
      <PageHeader
        title={t('athletesList.title')}
        description={t('athletesList.description')}
        actions={
          <Button asChild>
            <Link to={APP_ROUTE.athleteNew}>
              <Plus className="h-4 w-4" aria-hidden />
              {t('athletesList.addAthlete')}
            </Link>
          </Button>
        }
      />

      {athletes.length === 0 ? (
        <EmptyState
          icon={Users}
          title={t('athletesList.emptyRosterTitle')}
          description={t('athletesList.emptyRosterDescription')}
          action={
            <Button asChild>
              <Link to={APP_ROUTE.athleteNew}>{t('athletesList.addFirstAthlete')}</Link>
            </Button>
          }
        />
      ) : (
        <>
          <div className="flex flex-col gap-tight rounded-xl border border-border/60 bg-card/30 p-card sm:flex-row sm:flex-wrap sm:items-end">
            <div className="min-w-[10rem] flex-1 space-y-tight">
              <p className="text-label text-muted-foreground">{t('filters.trainingType')}</p>
              <Select
                value={trainingTypeFilter}
                onValueChange={(value) =>
                  setTrainingTypeFilter(
                    value === WORKOUT_FILTER_ALL ? WORKOUT_FILTER_ALL : (value as AthleteTrainingType),
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('filters.allTypes')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={WORKOUT_FILTER_ALL}>{t('filters.allTypes')}</SelectItem>
                  {(Object.values(AthleteTrainingType) as AthleteTrainingType[]).map(
                    (trainingTypeOption) => (
                      <SelectItem key={trainingTypeOption} value={trainingTypeOption}>
                        {translateTrainingType(t, trainingTypeOption)}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="min-w-[10rem] flex-1 space-y-tight">
              <p className="text-label text-muted-foreground">{t('filters.groupContains')}</p>
              <Input
                value={groupSearch}
                onChange={(changeEvent) => setGroupSearch(changeEvent.target.value)}
                placeholder={t('filters.filterByGroupPlaceholder')}
              />
            </div>
            <div className="min-w-[10rem] flex-1 space-y-tight">
              <p className="text-label text-muted-foreground">{t('filters.nameContains')}</p>
              <Input
                value={nameSearch}
                onChange={(changeEvent) => setNameSearch(changeEvent.target.value)}
                placeholder={t('filters.searchNamePlaceholder')}
              />
            </div>
          </div>

          {sortedFiltered.length === 0 ? (
            <EmptyState
              icon={Users}
              title={t('athletesList.noMatchTitle')}
              description={t('athletesList.noMatchDescription')}
              action={
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setTrainingTypeFilter(WORKOUT_FILTER_ALL)
                    setGroupSearch('')
                    setNameSearch('')
                  }}
                >
                  {t('athletesList.clearFilters')}
                </Button>
              }
            />
          ) : (
            <StaggerList className="grid gap-stack sm:grid-cols-2">
              {sortedFiltered.map((rosterAthlete) => (
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
                          <div className="flex flex-wrap gap-tight">
                            <Badge variant="secondary" className="font-normal">
                              {translateTrainingType(t, rosterAthlete.trainingType)}
                            </Badge>
                            <Badge variant="outline" className="font-normal text-muted-foreground">
                              {athleteGroupDisplayLabel(rosterAthlete.group)}
                            </Badge>
                          </div>
                          {rosterAthlete.notes.trim() ? (
                            <p className="line-clamp-2 text-body-sm text-muted-foreground">
                              {rosterAthlete.notes}
                            </p>
                          ) : null}
                        </div>
                        <ChevronRight
                          className="mt-1 h-5 w-5 shrink-0 text-muted-foreground"
                          aria-hidden
                        />
                      </Link>
                      <div className="border-t border-border/40 px-card py-tight">
                        <Button variant="ghost" size="sm" className="h-8 text-caption" asChild>
                          <Link to={athleteEditPath(rosterAthlete.id)}>
                            {t('athletesList.editProfile')}
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </StaggerItem>
              ))}
            </StaggerList>
          )}
        </>
      )}
    </div>
  )
}
