import { useRef, useState } from 'react'
import { toast } from 'sonner'

import { usePersonalBestsStore } from '@/app/store/personalBestsStore'
import { useSettingsStore } from '@/app/store/settingsStore'
import { useWorkoutStore } from '@/app/store/workoutStore'
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
  buildExportPayload,
  parseImportPayload,
} from '@/features/settings/helpers/dataBundle.helpers'
import {
  buildExportDownloadFilename,
  exportFilenameDateSlice,
} from '@/shared/constants/settings.constants'
import { THEME_MODE_LABEL } from '@/shared/constants/themeLabels.constants'
import { ThemeMode } from '@/shared/domain'

const THEME_SELECT_OPTIONS = [ThemeMode.Light, ThemeMode.Dark, ThemeMode.System] as const

function isThemeMode(value: string): value is ThemeMode {
  return (Object.values(ThemeMode) as string[]).includes(value)
}

export default function SettingsPage() {
  const theme = useSettingsStore((s) => s.theme)
  const setInitialSampleApplied = useSettingsStore((s) => s.setInitialSampleApplied)
  const { setTheme } = useTheme()

  const workouts = useWorkoutStore((s) => s.workouts)
  const replaceAllWorkouts = useWorkoutStore((s) => s.replaceAllWorkouts)
  const personalBests = usePersonalBestsStore((s) => s.personalBests)
  const replaceAllPersonalBests = usePersonalBestsStore((s) => s.replaceAllPersonalBests)

  const fileRef = useRef<HTMLInputElement>(null)
  const [clearOpen, setClearOpen] = useState(false)

  function handleThemeChange(value: string) {
    if (isThemeMode(value)) {
      setTheme(value)
    }
  }

  function handleExport() {
    const payload = buildExportPayload(workouts, personalBests)
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = buildExportDownloadFilename(exportFilenameDateSlice(new Date().toISOString()))
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Export downloaded')
  }

  function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
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
        replaceAllWorkouts(result.data.workouts)
        replaceAllPersonalBests(result.data.personalBests)
        setInitialSampleApplied(true)
        toast.success('Data imported')
      } catch {
        toast.error('Could not read JSON file.')
      }
    }
    reader.readAsText(file)
  }

  function handleClearAll() {
    replaceAllWorkouts([])
    replaceAllPersonalBests([])
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

      <Card className="overflow-hidden border-border/60 shadow-card">
        <CardHeader className="border-b border-border/40 bg-muted/15 py-section-sm">
          <CardTitle className="font-display text-heading-sm">Appearance</CardTitle>
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

      <Card className="overflow-hidden border-border/60 shadow-card">
        <CardHeader className="border-b border-border/40 bg-muted/15 py-section-sm">
          <CardTitle className="font-display text-heading-sm">Backup</CardTitle>
          <CardDescription className="text-caption">
            Export workouts and personal bests as JSON. Import replaces current data.
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

      <Card className="overflow-hidden border-destructive/25 shadow-card">
        <CardHeader className="border-b border-destructive/15 bg-destructive/5 py-section-sm">
          <CardTitle className="font-display text-heading-sm text-destructive">
            Danger zone
          </CardTitle>
          <CardDescription className="text-caption">
            Remove all SWIMLYTICS data stored in this browser.
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
        Version 0.1 · Thesis prototype · No cloud sync.
      </p>

      <Dialog open={clearOpen} onOpenChange={setClearOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clear all data?</DialogTitle>
            <DialogDescription>
              Workouts and personal bests will be removed from local storage. Export first if you
              need a backup.
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
