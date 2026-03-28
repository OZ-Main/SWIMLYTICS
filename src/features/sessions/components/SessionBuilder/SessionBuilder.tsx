import {
  ArrowDown,
  ArrowUp,
  Copy,
  Layers,
  Plus,
  Timer,
  Trash2,
  Waves,
} from 'lucide-react'

import {
  SessionBuilderGymBlockFields,
  SessionBuilderSwimmingBlockFields,
} from '@/features/sessions/components/SessionBuilder/SessionBuilderBlockPanels'
import {
  createEmptyGymSessionBlock,
  createEmptySwimmingSessionBlock,
  createSwimmingSessionBlockId,
  reindexTrainingSessionBlocks,
} from '@/features/sessions/helpers/sessionFactories.helpers'
import {
  getGymSessionTotalDurationSeconds,
  getSwimmingSessionTotalDistanceMeters,
  getSwimmingSessionTotalDurationSeconds,
} from '@/features/sessions/helpers/sessionTotals.helpers'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { GYM_BLOCK_CATEGORY_LABEL } from '@/shared/constants/gymBlockCategoryLabels'
import { SWIMMING_BLOCK_CATEGORY_LABEL } from '@/shared/constants/swimmingBlockCategoryLabels'
import { AthleteTrainingType, PoolLength, SwimEquipment } from '@/shared/domain'
import { formatDistanceMeters, formatDurationSeconds } from '@/shared/helpers/formatters'
import { cn } from '@/shared/utils/cn'
import {
  SESSION_BLOCK_KIND,
  type GymSessionBlock,
  type GymTrainingSession,
  type SwimmingSessionBlock,
  type SwimmingTrainingSession,
  type TrainingSession,
} from '@/shared/types/domain.types'

type SessionBuilderProps = {
  session: TrainingSession
  onChange: (nextSession: TrainingSession) => void
}

export default function SessionBuilder({ session, onChange }: SessionBuilderProps) {
  const isSwim = session.trainingType === AthleteTrainingType.Swimming
  const swimmingSession = isSwim ? (session as SwimmingTrainingSession) : null

  function updateSession(partial: Partial<TrainingSession>) {
    onChange({ ...session, ...partial, updatedAt: new Date().toISOString() } as TrainingSession)
  }

  function updateSwimmingBlock(blockId: string, partial: Partial<SwimmingSessionBlock>) {
    if (!swimmingSession) {
      return
    }
    const nextBlocks = swimmingSession.blocks.map((block) =>
      block.id === blockId ? { ...block, ...partial } : block,
    )
    updateSession({ blocks: nextBlocks } as Partial<SwimmingTrainingSession>)
  }

  function updateGymBlock(blockId: string, partial: Partial<GymSessionBlock>) {
    if (session.trainingType !== AthleteTrainingType.Gym) {
      return
    }
    const gymSession = session as GymTrainingSession
    const nextBlocks = gymSession.blocks.map((block) =>
      block.id === blockId ? { ...block, ...partial } : block,
    )
    updateSession({ blocks: nextBlocks } as Partial<GymTrainingSession>)
  }

  function addSwimmingBlock() {
    if (!swimmingSession) {
      return
    }
    const nextIndex = swimmingSession.blocks.length
    const newBlock = createEmptySwimmingSessionBlock(nextIndex, swimmingSession.defaultPoolLength)
    updateSession({
      blocks: reindexTrainingSessionBlocks([...swimmingSession.blocks, newBlock]),
    } as Partial<SwimmingTrainingSession>)
  }

  function addGymBlock() {
    if (session.trainingType !== AthleteTrainingType.Gym) {
      return
    }
    const gymSession = session as GymTrainingSession
    const nextIndex = gymSession.blocks.length
    const newBlock = createEmptyGymSessionBlock(nextIndex)
    updateSession({
      blocks: reindexTrainingSessionBlocks([...gymSession.blocks, newBlock]),
    } as Partial<GymTrainingSession>)
  }

  function removeBlock(blockId: string) {
    const nextBlocks = session.blocks.filter((block) => block.id !== blockId)
    onChange({
      ...session,
      blocks: reindexTrainingSessionBlocks(nextBlocks),
      updatedAt: new Date().toISOString(),
    } as TrainingSession)
  }

  function duplicateBlock(blockId: string) {
    const index = session.blocks.findIndex((block) => block.id === blockId)
    if (index < 0) {
      return
    }
    const original = session.blocks[index]
    const copy = {
      ...original,
      id: createSwimmingSessionBlockId(),
      title: `${original.title} (copy)`,
    }
    const nextBlocks = [...session.blocks.slice(0, index + 1), copy, ...session.blocks.slice(index + 1)]
    onChange({
      ...session,
      blocks: reindexTrainingSessionBlocks(nextBlocks),
      updatedAt: new Date().toISOString(),
    } as TrainingSession)
  }

  function moveBlock(blockId: string, direction: 'up' | 'down') {
    const ordered = [...session.blocks].sort((left, right) => left.orderIndex - right.orderIndex)
    const index = ordered.findIndex((block) => block.id === blockId)
    if (index < 0) {
      return
    }
    const swapWith = direction === 'up' ? index - 1 : index + 1
    if (swapWith < 0 || swapWith >= ordered.length) {
      return
    }
    ;[ordered[index], ordered[swapWith]] = [ordered[swapWith], ordered[index]]
    onChange({
      ...session,
      blocks: reindexTrainingSessionBlocks(ordered),
      updatedAt: new Date().toISOString(),
    } as TrainingSession)
  }

  function toggleSwimEquipment(blockId: string, equipment: SwimEquipment) {
    if (!swimmingSession) {
      return
    }
    const block = swimmingSession.blocks.find((candidate) => candidate.id === blockId)
    if (!block) {
      return
    }
    const has = block.equipment.includes(equipment)
    const nextEquipment = has
      ? block.equipment.filter((item) => item !== equipment)
      : [...block.equipment, equipment]
    updateSwimmingBlock(blockId, { equipment: nextEquipment })
  }

  const sortedBlocks = [...session.blocks].sort((left, right) => left.orderIndex - right.orderIndex)

  return (
    <div className="grid gap-form lg:grid-cols-[1fr_minmax(16rem,20rem)] lg:items-start">
      <div className="space-y-form">
        <Card>
          <CardHeader className="page-section-header pb-card">
            <div className="flex items-center gap-tight">
              <Waves className="h-5 w-5 text-primary" aria-hidden />
              <h2 className="page-section-title">Session details</h2>
            </div>
          </CardHeader>
          <CardContent className="space-y-form-field pt-card">
            <div className="grid gap-form-field sm:grid-cols-2">
              <div className="space-y-tight sm:col-span-2">
                <Label htmlFor="session-title">Session name</Label>
                <Input
                  id="session-title"
                  value={session.sessionTitle}
                  onChange={(changeEvent) => updateSession({ sessionTitle: changeEvent.target.value })}
                  placeholder="e.g. Tuesday aerobic / Leg day"
                />
              </div>
              <div className="space-y-tight">
                <Label htmlFor="session-date">Date</Label>
                <Input
                  id="session-date"
                  type="date"
                  value={session.date}
                  onChange={(changeEvent) => updateSession({ date: changeEvent.target.value })}
                />
              </div>
              {swimmingSession ? (
                <div className="space-y-tight">
                  <Label htmlFor="default-pool">Default pool length</Label>
                  <Select
                    value={String(swimmingSession.defaultPoolLength)}
                    onValueChange={(poolValue) =>
                      updateSession({
                        defaultPoolLength: Number(poolValue) as PoolLength,
                      } as Partial<SwimmingTrainingSession>)
                    }
                  >
                    <SelectTrigger id="default-pool">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={String(PoolLength.Meters25)}>25 m</SelectItem>
                      <SelectItem value={String(PoolLength.Meters50)}>50 m</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ) : null}
            </div>
            <div className="space-y-tight">
              <Label htmlFor="session-notes">Session notes</Label>
              <Textarea
                id="session-notes"
                className="min-h-form-textarea resize-y"
                value={session.notes}
                onChange={(changeEvent) => updateSession({ notes: changeEvent.target.value })}
                placeholder="Goals, fatigue, environment, anything that helps next week."
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-wrap items-center justify-between gap-stack">
          <div className="flex items-center gap-tight">
            <Layers className="h-5 w-5 text-accent" aria-hidden />
            <h2 className="page-section-title">Training parts</h2>
            <Badge variant="secondary">{sortedBlocks.length} blocks</Badge>
          </div>
          <Button
            type="button"
            size="sm"
            onClick={isSwim ? addSwimmingBlock : addGymBlock}
            className="gap-tight"
          >
            <Plus className="h-4 w-4" aria-hidden />
            Add block
          </Button>
        </div>

        <div className="space-y-stack">
          {sortedBlocks.map((block, blockIndex) => (
            <Card
              key={block.id}
              className={cn(
                'transition-shadow duration-motion-fast motion-safe:hover:shadow-card-hover',
              )}
            >
              <CardHeader className="nested-card-header flex flex-row flex-wrap items-start justify-between gap-stack">
                <div className="flex flex-wrap items-center gap-tight">
                  <span className="text-label font-semibold text-muted-foreground">
                    Block {blockIndex + 1}
                  </span>
                  {block.kind === SESSION_BLOCK_KIND.Swimming ? (
                    <Badge variant="outline" className="border-primary/30 bg-primary/5 text-primary">
                      {SWIMMING_BLOCK_CATEGORY_LABEL[block.category]}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="border-accent/40 bg-accent/10 text-accent-foreground">
                      {GYM_BLOCK_CATEGORY_LABEL[block.category]}
                    </Badge>
                  )}
                </div>
                <div className="flex flex-wrap gap-tight">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Move block up"
                    disabled={blockIndex === 0}
                    onClick={() => moveBlock(block.id, 'up')}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Move block down"
                    disabled={blockIndex === sortedBlocks.length - 1}
                    onClick={() => moveBlock(block.id, 'down')}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Duplicate block"
                    onClick={() => duplicateBlock(block.id)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Remove block"
                    disabled={sortedBlocks.length <= 1}
                    onClick={() => removeBlock(block.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-form-field pt-card">
                {block.kind === SESSION_BLOCK_KIND.Swimming ? (
                  <SessionBuilderSwimmingBlockFields
                    block={block}
                    onUpdate={(partial) => updateSwimmingBlock(block.id, partial)}
                    onToggleEquipment={(equipment) => toggleSwimEquipment(block.id, equipment)}
                  />
                ) : (
                  <SessionBuilderGymBlockFields
                    block={block}
                    onUpdate={(partial) => updateGymBlock(block.id, partial)}
                  />
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card className="sticky top-4 border-primary/25 bg-gradient-to-b from-card via-card to-primary/5 shadow-card lg:top-24">
        <CardHeader className="nested-card-header pb-tight">
          <div className="flex items-center gap-tight">
            <Timer className="h-5 w-5 text-primary" aria-hidden />
            <h3 className="page-section-title">Live summary</h3>
          </div>
        </CardHeader>
        <CardContent className="space-y-tight pt-card text-body-sm">
          {swimmingSession ? (
            <>
              <div className="flex justify-between gap-stack">
                <span className="text-muted-foreground">Total distance</span>
                <span className="font-display text-heading-md font-semibold tabular-nums text-foreground">
                  {formatDistanceMeters(getSwimmingSessionTotalDistanceMeters(swimmingSession))}
                </span>
              </div>
              <div className="flex justify-between gap-stack">
                <span className="text-muted-foreground">Total swim time</span>
                <span className="font-medium tabular-nums text-foreground">
                  {formatDurationSeconds(getSwimmingSessionTotalDurationSeconds(swimmingSession))}
                </span>
              </div>
            </>
          ) : (
            <div className="flex justify-between gap-stack">
              <span className="text-muted-foreground">Total duration</span>
              <span className="font-display text-heading-md font-semibold tabular-nums text-foreground">
                {formatDurationSeconds(getGymSessionTotalDurationSeconds(session as GymTrainingSession))}
              </span>
            </div>
          )}
          <p className="text-caption text-muted-foreground">
            Totals update as you edit blocks. Reps × distance per rep rolls up automatically.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
