import { useRef, useState } from 'react'
import { toast } from 'sonner'

import { useAthleteStore } from '@/app/store/athleteStore'
import { useCoachStore } from '@/app/store/coachStore'
import { usePersonalBestsStore } from '@/app/store/personalBestsStore'
import { useSettingsStore } from '@/app/store/settingsStore'
import { useTrainingSessionStore } from '@/app/store/trainingSessionStore'
import { useTheme } from '@/app/theme/useTheme'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import PageHeader from '@/components/layout/PageHeader'
import { migrateLegacyWorkoutToTrainingSession } from '@/lib/storage/migrateLegacyWorkoutToSession'
import {
  buildExportPayloadV3,
  legacyImportAthleteSeed,
  parseImportPayload,
} from '@/features/settings/helpers/dataBundle.helpers'
import { DEFAULT_LOCAL_COACH_ID } from '@/shared/constants/migration.constants'
import {
  buildExportDownloadFilename,
  exportFilenameDateSlice,
} from '@/shared/constants/settings.constants'
import { THEME_MODE_LABEL } from '@/shared/constants/themeLabels.constants'
import { DataExportVersion, ThemeMode } from '@/shared/domain'

const THEME_SELECT_OPTIONS = [ThemeMode.Light, ThemeMode.Dark, ThemeMode.System] as const

function isThemeMode(value: string): value is ThemeMode {
  return (Object.values(ThemeMode) as string[]).includes(value)
}

function defaultCoachRecord() {
  return {
    id: DEFAULT_LOCAL_COACH_ID,
    displayName: 'Coach',
    createdAt: new Date().toISOString(),
  }
}

export default function SettingsPage() {
  const theme = useSettingsStore((settingsStore) => settingsStore.theme)
  const setInitialSampleApplied = useSettingsStore(
    (settingsStore) => settingsStore.setInitialSampleApplied,
  )
  const { setTheme } = useTheme()

  const coach = useCoachStore((coachStore) => coachStore.coach)
  const replaceCoach = useCoachStore((coachStore) => coachStore.replaceCoach)
  const trainingSessions = useTrainingSessionStore(
    (trainingSessionStore) => trainingSessionStore.trainingSessions,
  )
  const replaceAllTrainingSessions = useTrainingSessionStore(
    (trainingSessionStore) => trainingSessionStore.replaceAllTrainingSessions,
  )
  const personalBests = usePersonalBestsStore(
    (personalBestsStore) => personalBestsStore.personalBests,
  )
  const replaceAllPersonalBests = usePersonalBestsStore(
    (personalBestsStore) => personalBestsStore.replaceAllPersonalBests,
  )
  const athletes = useAthleteStore((athleteStore) => athleteStore.athletes)
  const replaceAllAthletes = useAthleteStore((athleteStore) => athleteStore.replaceAllAthletes)

  const fileRef = useRef<HTMLInputElement>(null)
  const [clearOpen, setClearOpen] = useState(false)

  function handleThemeChange(value: string) {
    if (isThemeMode(value)) {
      setTheme(value)
    }
  }

  function handleExport() {
    const payload = buildExportPayloadV3(coach, athletes, trainingSessions, personalBests)
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const downloadAnchor = document.createElement('a')
    downloadAnchor.href = url
    downloadAnchor.download = buildExportDownloadFilename(
      exportFilenameDateSlice(new Date().toISOString()),
    )
    downloadAnchor.click()
    URL.revokeObjectURL(url)
    toast.success('Export downloaded')
  }

  function handleImportFile(changeEvent: React.ChangeEvent<HTMLInputElement>) {
    const file = changeEvent.target.files?.[0]
    changeEvent.target.value = ''
    if (!file) {
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const json = JSON.parse(String(reader.result))
        const result = parseImportPayload(json)
        if (!result.ok) {
          toast.error(result.error)
          return
        }
        if (result.version === DataExportVersion.V3) {
          replaceCoach(result.data.coach)
          replaceAllAthletes(result.data.athletes)
          replaceAllTrainingSessions(result.data.trainingSessions)
          replaceAllPersonalBests(result.data.personalBests)
        } else if (result.version === DataExportVersion.V2) {
          replaceCoach(result.data.coach)
          replaceAllAthletes(result.data.athletes)
          replaceAllTrainingSessions(
            result.data.workouts.map(migrateLegacyWorkoutToTrainingSession),
          )
          replaceAllPersonalBests(result.data.personalBests)
        } else {
          const legacy = legacyImportAthleteSeed()
          const nextAthletes = athletes.some((existingAthlete) => existingAthlete.id === legacy.id)
            ? athletes
            : [legacy, ...athletes]
          replaceAllAthletes(nextAthletes)
          replaceAllTrainingSessions(result.data.trainingSessions)
          replaceAllPersonalBests(result.data.personalBests)
        }
        setInitialSampleApplied(true)
        toast.success('Data imported')
      } catch {
        toast.error('Could not read JSON file.')
      }
    }
    reader.readAsText(file)
  }

  function handleClearAll() {
    replaceAllTrainingSessions([])
    replaceAllPersonalBests([])
    replaceAllAthletes([])
    replaceCoach(defaultCoachRecord())
    setInitialSampleApplied(true)
    setClearOpen(false)
    toast.success('Local data cleared')
  }

  return (
    <div className="page-stack max-w-2xl">
      <PageHeader
        title="Settings"
        description="Appearance, backups, and local data for this browser."
      />

      <Card className="overflow-hidden">
        <CardHeader className="page-section-header">
          <CardTitle className="page-section-title">Appearance</CardTitle>
          <CardDescription className="text-caption">
            Light, dark, or follow the system setting.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-tight pt-card">
          <Label htmlFor="theme-select">Theme</Label>
          <Select value={theme} onValueChange={handleThemeChange}>
            <SelectTrigger id="theme-select" className="max-w-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {THEME_SELECT_OPTIONS.map((mode) => (
                <SelectItem key={mode} value={mode}>
                  {THEME_MODE_LABEL[mode]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader className="page-section-header">
          <CardTitle className="page-section-title">Backup</CardTitle>
          <CardDescription className="text-caption">
            Export coach profile, athletes, training sessions, and best times as JSON (v3). Import
            replaces current local data. v2 and v1 exports are still accepted.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-stack pt-card">
          <Button type="button" variant="secondary" onClick={handleExport}>
            Export JSON
          </Button>
          <Button type="button" variant="outline" onClick={() => fileRef.current?.click()}>
            Import JSON
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={handleImportFile}
          />
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-destructive/30 shadow-card">
        <CardHeader className="border-b border-destructive/20 bg-destructive/5 px-card py-section-sm">
          <CardTitle className="page-section-title text-destructive">
            Danger zone
          </CardTitle>
          <CardDescription className="text-caption">
            Remove all SWIMLYTICS data stored in this browser (coach, athletes, sessions, best
            times).
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-card">
          <Button variant="destructive" onClick={() => setClearOpen(true)}>
            Clear local data
          </Button>
        </CardContent>
      </Card>

      <Separator />

      <p className="text-caption text-muted-foreground">
        Local-first coach workspace · No cloud sync · Export regularly for backups.
      </p>

      <Dialog open={clearOpen} onOpenChange={setClearOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clear all data?</DialogTitle>
            <DialogDescription>
              Athletes, sessions, and personal bests will be removed from local storage. Export first
              if you need a backup.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setClearOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleClearAll}>
              Clear everything
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
