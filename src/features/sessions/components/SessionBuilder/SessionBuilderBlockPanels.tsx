import { Button } from '@/components/ui/button'
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
import { GYM_BLOCK_CATEGORY_LABEL, GYM_BLOCK_CATEGORY_ORDER } from '@/shared/constants/gymBlockCategoryLabels'
import { DRILL_TYPE_LABEL } from '@/shared/constants/drillTypeLabels'
import { EFFORT_LABELS, EFFORT_LEVEL_ORDER } from '@/shared/constants/effortLabels'
import { SWIM_EQUIPMENT_LABEL, SWIM_EQUIPMENT_ORDER } from '@/shared/constants/swimEquipmentLabels'
import { SWIMMING_BLOCK_CATEGORY_LABEL, SWIMMING_BLOCK_CATEGORY_ORDER } from '@/shared/constants/swimmingBlockCategoryLabels'
import { STROKE_LABELS, STROKE_ORDER } from '@/shared/constants/strokeLabels'
import { DrillType, PoolLength, SwimEquipment } from '@/shared/domain'
import { calculateSwimmingBlockDistanceMeters } from '@/features/sessions/helpers/sessionBlockDistance.helpers'
import { formatDistanceMeters } from '@/shared/helpers/formatters'
import type { GymSessionBlock, SwimmingSessionBlock } from '@/shared/types/domain.types'

export type SwimmingBlockFieldsProps = {
  block: SwimmingSessionBlock
  onUpdate: (partial: Partial<SwimmingSessionBlock>) => void
  onToggleEquipment: (equipment: SwimEquipment) => void
}

export function SessionBuilderSwimmingBlockFields({
  block,
  onUpdate,
  onToggleEquipment,
}: SwimmingBlockFieldsProps) {
  return (
    <div className="grid gap-form-field sm:grid-cols-2">
      <div className="space-y-tight sm:col-span-2">
        <Label>Title</Label>
        <Input
          value={block.title}
          onChange={(changeEvent) => onUpdate({ title: changeEvent.target.value })}
        />
      </div>
      <div className="space-y-tight">
        <Label>Category</Label>
        <Select
          value={block.category}
          onValueChange={(categoryValue) =>
            onUpdate({ category: categoryValue as SwimmingSessionBlock['category'] })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SWIMMING_BLOCK_CATEGORY_ORDER.map((categoryOption) => (
              <SelectItem key={categoryOption} value={categoryOption}>
                {SWIMMING_BLOCK_CATEGORY_LABEL[categoryOption]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-tight">
        <Label>Stroke</Label>
        <Select
          value={block.stroke}
          onValueChange={(strokeValue) =>
            onUpdate({ stroke: strokeValue as SwimmingSessionBlock['stroke'] })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STROKE_ORDER.map((strokeOption) => (
              <SelectItem key={strokeOption} value={strokeOption}>
                {STROKE_LABELS[strokeOption]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-tight">
        <Label>Pool length</Label>
        <Select
          value={String(block.poolLength)}
          onValueChange={(poolValue) => onUpdate({ poolLength: Number(poolValue) as PoolLength })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={String(PoolLength.Meters25)}>25 m</SelectItem>
            <SelectItem value={String(PoolLength.Meters50)}>50 m</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-tight">
        <Label>Effort</Label>
        <Select
          value={block.effortLevel}
          onValueChange={(effortValue) =>
            onUpdate({ effortLevel: effortValue as SwimmingSessionBlock['effortLevel'] })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {EFFORT_LEVEL_ORDER.map((effortOption) => (
              <SelectItem key={effortOption} value={effortOption}>
                {EFFORT_LABELS[effortOption]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-tight">
        <Label>Repetitions</Label>
        <Input
          type="number"
          min={0}
          value={block.repetitions || ''}
          onChange={(changeEvent) =>
            onUpdate({ repetitions: Math.max(0, Number(changeEvent.target.value) || 0) })
          }
          placeholder="0 = use single distance below"
        />
      </div>
      <div className="space-y-tight">
        <Label>Distance per rep (m)</Label>
        <Input
          type="number"
          min={0}
          value={block.distancePerRepMeters || ''}
          onChange={(changeEvent) =>
            onUpdate({ distancePerRepMeters: Math.max(0, Number(changeEvent.target.value) || 0) })
          }
        />
      </div>
      <div className="space-y-tight sm:col-span-2">
        <Label>Or total distance (m) when reps not used</Label>
        <Input
          type="number"
          min={0}
          value={block.explicitTotalDistanceMeters || ''}
          onChange={(changeEvent) =>
            onUpdate({
              explicitTotalDistanceMeters: Math.max(0, Number(changeEvent.target.value) || 0),
            })
          }
        />
        <p className="text-caption text-muted-foreground">
          Block distance:{' '}
          <span className="font-medium text-foreground">
            {formatDistanceMeters(calculateSwimmingBlockDistanceMeters(block))}
          </span>
        </p>
      </div>
      <div className="space-y-tight">
        <Label>Duration (seconds)</Label>
        <Input
          type="number"
          min={0}
          value={block.durationSeconds || ''}
          onChange={(changeEvent) =>
            onUpdate({ durationSeconds: Math.max(0, Number(changeEvent.target.value) || 0) })
          }
        />
      </div>
      <div className="space-y-tight">
        <Label>Drill type</Label>
        <Select
          value={block.drillType}
          onValueChange={(drillValue) => onUpdate({ drillType: drillValue as DrillType })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.values(DrillType).map((drillOption) => (
              <SelectItem key={drillOption} value={drillOption}>
                {DRILL_TYPE_LABEL[drillOption]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-tight">
        <Label>Send-off / interval (sec)</Label>
        <Input
          type="number"
          min={0}
          value={block.intervalSendoffSeconds ?? ''}
          onChange={(changeEvent) => {
            const raw = changeEvent.target.value
            onUpdate({
              intervalSendoffSeconds: raw === '' ? null : Math.max(0, Number(raw)),
            })
          }}
          placeholder="Optional"
        />
      </div>
      <div className="space-y-tight sm:col-span-2">
        <Label>Equipment</Label>
        <div className="flex flex-wrap gap-tight">
          {SWIM_EQUIPMENT_ORDER.map((equipmentOption) => {
            const selected = block.equipment.includes(equipmentOption)
            return (
              <Button
                key={equipmentOption}
                type="button"
                size="sm"
                variant={selected ? 'default' : 'outline'}
                className="rounded-full"
                onClick={() => onToggleEquipment(equipmentOption)}
              >
                {SWIM_EQUIPMENT_LABEL[equipmentOption]}
              </Button>
            )
          })}
        </div>
      </div>
      <div className="space-y-tight sm:col-span-2">
        <Label>Block notes</Label>
        <Textarea
          className="min-h-[4rem] resize-y"
          value={block.notes}
          onChange={(changeEvent) => onUpdate({ notes: changeEvent.target.value })}
        />
      </div>
    </div>
  )
}

export type GymBlockFieldsProps = {
  block: GymSessionBlock
  onUpdate: (partial: Partial<GymSessionBlock>) => void
}

export function SessionBuilderGymBlockFields({ block, onUpdate }: GymBlockFieldsProps) {
  return (
    <div className="grid gap-form-field sm:grid-cols-2">
      <div className="space-y-tight sm:col-span-2">
        <Label>Title</Label>
        <Input
          value={block.title}
          onChange={(changeEvent) => onUpdate({ title: changeEvent.target.value })}
        />
      </div>
      <div className="space-y-tight">
        <Label>Category</Label>
        <Select
          value={block.category}
          onValueChange={(categoryValue) =>
            onUpdate({ category: categoryValue as GymSessionBlock['category'] })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {GYM_BLOCK_CATEGORY_ORDER.map((categoryOption) => (
              <SelectItem key={categoryOption} value={categoryOption}>
                {GYM_BLOCK_CATEGORY_LABEL[categoryOption]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-tight">
        <Label>Effort</Label>
        <Select
          value={block.effortLevel}
          onValueChange={(effortValue) =>
            onUpdate({ effortLevel: effortValue as GymSessionBlock['effortLevel'] })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {EFFORT_LEVEL_ORDER.map((effortOption) => (
              <SelectItem key={effortOption} value={effortOption}>
                {EFFORT_LABELS[effortOption]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-tight sm:col-span-2">
        <Label>Focus</Label>
        <Input
          value={block.focus}
          onChange={(changeEvent) => onUpdate({ focus: changeEvent.target.value })}
          placeholder="e.g. Squat / Bench / Conditioning circuit"
        />
      </div>
      <div className="space-y-tight sm:col-span-2">
        <Label>Duration (seconds)</Label>
        <Input
          type="number"
          min={0}
          value={block.durationSeconds || ''}
          onChange={(changeEvent) =>
            onUpdate({ durationSeconds: Math.max(0, Number(changeEvent.target.value) || 0) })
          }
        />
      </div>
      <div className="space-y-tight sm:col-span-2">
        <Label>Block notes</Label>
        <Textarea
          className="min-h-[4rem] resize-y"
          value={block.notes}
          onChange={(changeEvent) => onUpdate({ notes: changeEvent.target.value })}
        />
      </div>
    </div>
  )
}
