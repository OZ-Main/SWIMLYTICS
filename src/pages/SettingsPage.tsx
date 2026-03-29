import { type ChangeEvent, useRef, useState } from 'react'
import { toast } from 'sonner'

import { useAthleteStore } from '@/app/store/athleteStore'
import { useAuthStore } from '@/app/store/authStore'
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
import {
  buildExportPayloadV3,
  legacyImportAthleteSeed,
  parseImportPayload,
} from '@/features/settings/helpers/dataBundle.helpers'
import {
  clearAllSubcollections,
  replaceAllCoachDataDocuments,
} from '@/lib/firebase/coachDataRepository'
import { migrateLegacyWorkoutToTrainingSession } from '@/lib/storage/migrateLegacyWorkoutToSession'
import {
  resetUserProfileAfterClearingData,
  updateUserProfileFields,
} from '@/lib/firebase/userProfileRepository'
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

export default function SettingsPage() {
  const user = useAuthStore((authStore) => authStore.user)
  const theme = useSettingsStore((settingsStore) => settingsStore.theme)
  const setInitialSampleApplied = useSettingsStore(
    (settingsStore) => settingsStore.setInitialSampleApplied,
  )
  const { setTheme } = useTheme()

  const coach = useCoachStore((coachStore) => coachStore.coach)
  const trainingSessions = useTrainingSessionStore(
    (trainingSessionStore) => trainingSessionStore.trainingSessions,
  )
  const personalBests = usePersonalBestsStore(
    (personalBestsStore) => personalBestsStore.personalBests,
  )
  const athletes = useAthleteStore((athleteStore) => athleteStore.athletes)

  const fileRef = useRef<HTMLInputElement>(null)
  const [clearOpen, setClearOpen] = useState(false)

  function handleThemeChange(value: string) {
    if (isThemeMode(value)) {
      setTheme(value)
    }
  }

  function handleExport() {
    if (!coach) {
      toast.error('Profile not ready yet.')
      return
    }

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

  async function handleImportFile(changeEvent: ChangeEvent<HTMLInputElement>) {
    const uid = user?.uid
    if (!uid) {
      toast.error('You must be signed in to import.')
      return
    }

    const file = changeEvent.target.files?.[0]
    changeEvent.target.value = ''

    if (!file) {
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      void (async () => {
        try {
          const json = JSON.parse(String(reader.result))
          const result = parseImportPayload(json)
          if (!result.ok) {
            toast.error(result.error)
            return
          }
          if (result.version === DataExportVersion.V3) {
            const nextCoach = { ...result.data.coach, id: uid }
            await replaceAllCoachDataDocuments(uid, {
              coach: nextCoach,
              athletes: result.data.athletes,
              trainingSessions: result.data.trainingSessions,
              personalBests: result.data.personalBests,
            })
          } else if (result.version === DataExportVersion.V2) {
            const nextCoach = { ...result.data.coach, id: uid }
            await replaceAllCoachDataDocuments(uid, {
              coach: nextCoach,
              athletes: result.data.athletes,
              trainingSessions: result.data.workouts.map(migrateLegacyWorkoutToTrainingSession),
              personalBests: result.data.personalBests,
            })
          } else {
            const legacy = legacyImportAthleteSeed()
            const nextAthletes = athletes.some((existingAthlete) => existingAthlete.id === legacy.id)
              ? athletes
              : [legacy, ...athletes]
            await replaceAllCoachDataDocuments(uid, {
              coach: { id: uid, displayName: coach?.displayName ?? 'Coach', createdAt: coach?.createdAt ?? new Date().toISOString() },
              athletes: nextAthletes,
              trainingSessions: result.data.trainingSessions,
              personalBests: result.data.personalBests,
            })
          }
          await updateUserProfileFields(uid, { initialSampleApplied: true })
          setInitialSampleApplied(true)
          toast.success('Data imported to Firestore')
        } catch {
          toast.error('Could not read JSON file.')
        }
      })()
    }
    reader.readAsText(file)
  }

  async function handleClearAll() {
    const uid = user?.uid
    if (!uid || !user) {
      toast.error('You must be signed in.')
      return
    }
    try {
      await clearAllSubcollections(uid)
      await resetUserProfileAfterClearingData(uid, user)
      setInitialSampleApplied(true)
      setClearOpen(false)
      toast.success('Cloud data cleared for this account')
    } catch {
      toast.error('Could not clear data.')
    }
  }

  return (
    <div className="page-stack max-w-2xl">
      <PageHeader
        title="Settings"
        description="Appearance, JSON backups, and your Firestore workspace."
      />

      <Card className="overflow-hidden">
        <CardHeader className="page-section-header">
          <CardTitle className="page-section-title">Appearance</CardTitle>
          <CardDescription className="text-caption">
            Light, dark, or follow the system setting. Saved to your coach profile.
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
            replaces all documents under your Firebase user. v2 and v1 exports are still accepted.
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
          <CardTitle className="page-section-title text-destructive">Danger zone</CardTitle>
          <CardDescription className="text-caption">
            Delete all athletes, sessions, and personal bests in Firestore for this signed-in coach.
            Your account and sign-in remain; you can import a backup afterward.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-card">
          <Button variant="destructive" onClick={() => setClearOpen(true)}>
            Clear cloud data
          </Button>
        </CardContent>
      </Card>

      <Separator />

      <p className="text-caption text-muted-foreground">
        Firebase Authentication and Cloud Firestore. Deploy firestore.rules so each coach can only
        read and write their own user document and subcollections.
      </p>

      <Dialog open={clearOpen} onOpenChange={setClearOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clear all cloud data?</DialogTitle>
            <DialogDescription>
              Athletes, sessions, and personal bests will be removed from Firestore. Export first if
              you need a backup.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setClearOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => void handleClearAll()}>
              Clear everything
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
