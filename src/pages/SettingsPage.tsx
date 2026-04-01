import { type ChangeEvent, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { useLanguage } from '@/app/i18n/useLanguage'
import { useAthleteStore } from '@/app/store/athleteStore'
import { useAuthStore } from '@/app/store/authStore'
import { useCoachStore } from '@/app/store/coachStore'
import { usePersonalBestsStore } from '@/app/store/personalBestsStore'
import { useSettingsStore } from '@/app/store/settingsStore'
import { useTrainingSessionStore } from '@/app/store/trainingSessionStore'
import { useWorkoutTemplateStore } from '@/app/store/workoutTemplateStore'
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
import { APP_LANGUAGE_NATIVE_LABEL, APP_LANGUAGE_OPTIONS } from '@/shared/constants/languageUi.constants'
import {
  buildExportDownloadFilename,
  exportFilenameDateSlice,
} from '@/shared/constants/settings.constants'
import { DataExportVersion, ThemeMode } from '@/shared/domain'
import { isAppLanguage } from '@/shared/helpers/appLanguage.helpers'

const THEME_SELECT_OPTIONS = [ThemeMode.Light, ThemeMode.Dark, ThemeMode.System] as const

function isThemeMode(value: string): value is ThemeMode {
  return (Object.values(ThemeMode) as string[]).includes(value)
}

export default function SettingsPage() {
  const { t } = useTranslation()
  const { language, setLanguage } = useLanguage()
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
  const workoutTemplates = useWorkoutTemplateStore(
    (workoutTemplateStore) => workoutTemplateStore.workoutTemplates,
  )

  const fileRef = useRef<HTMLInputElement>(null)
  const [clearOpen, setClearOpen] = useState(false)

  function handleThemeChange(value: string) {
    if (isThemeMode(value)) {
      setTheme(value)
    }
  }

  function handleLanguageChange(value: string) {
    if (isAppLanguage(value)) {
      setLanguage(value)
    }
  }

  function handleExport() {
    if (!coach) {
      toast.error(t('settings.profileNotReady'))
      return
    }

    const payload = buildExportPayloadV3(
      coach,
      athletes,
      trainingSessions,
      personalBests,
      workoutTemplates,
    )
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
    toast.success(t('settings.exportSuccess'))
  }

  async function handleImportFile(changeEvent: ChangeEvent<HTMLInputElement>) {
    const uid = user?.uid
    if (!uid) {
      toast.error(t('settings.mustBeSignedInImport'))
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
              workoutTemplates: result.data.workoutTemplates,
            })
          } else if (result.version === DataExportVersion.V2) {
            const nextCoach = { ...result.data.coach, id: uid }
            await replaceAllCoachDataDocuments(uid, {
              coach: nextCoach,
              athletes: result.data.athletes,
              trainingSessions: result.data.workouts.map(migrateLegacyWorkoutToTrainingSession),
              personalBests: result.data.personalBests,
              workoutTemplates: [],
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
              workoutTemplates: [],
            })
          }

          await updateUserProfileFields(uid, { initialSampleApplied: true })
          setInitialSampleApplied(true)
          toast.success(t('settings.importSuccess'))
        } catch {
          toast.error(t('settings.importReadError'))
        }
      })()
    }

    reader.readAsText(file)
  }

  async function handleClearAll() {
    const uid = user?.uid
    if (!uid || !user) {
      toast.error(t('settings.mustBeSignedIn'))
      return
    }

    try {
      await clearAllSubcollections(uid)
      await resetUserProfileAfterClearingData(uid, user)
      setInitialSampleApplied(true)
      setClearOpen(false)
      toast.success(t('settings.clearSuccess'))
    } catch {
      toast.error(t('settings.clearError'))
    }
  }

  return (
    <div className="page-stack max-w-2xl">
      <PageHeader title={t('settings.title')} description={t('settings.description')} />

      <Card className="overflow-hidden">
        <CardHeader className="page-section-header">
          <CardTitle className="page-section-title">{t('settings.language')}</CardTitle>
          <CardDescription className="text-caption">{t('settings.languageDescription')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-tight pt-card">
          <Label htmlFor="language-select">{t('settings.language')}</Label>
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger id="language-select" className="max-w-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {APP_LANGUAGE_OPTIONS.map((code) => (
                <SelectItem key={code} value={code}>
                  {APP_LANGUAGE_NATIVE_LABEL[code]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader className="page-section-header">
          <CardTitle className="page-section-title">{t('settings.appearance')}</CardTitle>
          <CardDescription className="text-caption">{t('settings.appearanceDescription')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-tight pt-card">
          <Label htmlFor="theme-select">{t('settings.theme')}</Label>
          <Select value={theme} onValueChange={handleThemeChange}>
            <SelectTrigger id="theme-select" className="max-w-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {THEME_SELECT_OPTIONS.map((mode) => (
                <SelectItem key={mode} value={mode}>
                  {t(`theme.${mode}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader className="page-section-header">
          <CardTitle className="page-section-title">{t('settings.backup')}</CardTitle>
          <CardDescription className="text-caption">{t('settings.backupDescription')}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-stack pt-card">
          <Button type="button" variant="secondary" onClick={handleExport}>
            {t('settings.exportJson')}
          </Button>
          <Button type="button" variant="outline" onClick={() => fileRef.current?.click()}>
            {t('settings.importJson')}
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
          <CardTitle className="page-section-title text-destructive">{t('settings.dangerZone')}</CardTitle>
          <CardDescription className="text-caption">{t('settings.dangerDescription')}</CardDescription>
        </CardHeader>
        <CardContent className="pt-card">
          <Button variant="destructive" onClick={() => setClearOpen(true)}>
            {t('settings.clearCloudData')}
          </Button>
        </CardContent>
      </Card>

      <Separator />

      <p className="text-caption text-muted-foreground">{t('settings.footerNote')}</p>

      <Dialog open={clearOpen} onOpenChange={setClearOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('settings.clearDialogTitle')}</DialogTitle>
            <DialogDescription>{t('settings.clearDialogDescription')}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setClearOpen(false)}>
              {t('settings.cancel')}
            </Button>
            <Button variant="destructive" onClick={() => void handleClearAll()}>
              {t('settings.clearEverything')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
