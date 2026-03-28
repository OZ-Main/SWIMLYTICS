import { SwimmingBlockCategory } from '@/shared/domain'

export const SWIMMING_BLOCK_CATEGORY_LABEL: Record<SwimmingBlockCategory, string> = {
  [SwimmingBlockCategory.WarmUp]: 'Warm-up',
  [SwimmingBlockCategory.Drill]: 'Drill',
  [SwimmingBlockCategory.PreMain]: 'Pre-main',
  [SwimmingBlockCategory.MainSet]: 'Main set',
  [SwimmingBlockCategory.Kick]: 'Kick',
  [SwimmingBlockCategory.Pull]: 'Pull',
  [SwimmingBlockCategory.Sprint]: 'Sprint',
  [SwimmingBlockCategory.Recovery]: 'Recovery',
  [SwimmingBlockCategory.CoolDown]: 'Cool-down',
  [SwimmingBlockCategory.Technique]: 'Technique',
  [SwimmingBlockCategory.Other]: 'Other',
}

export const SWIMMING_BLOCK_CATEGORY_ORDER: SwimmingBlockCategory[] = [
  SwimmingBlockCategory.WarmUp,
  SwimmingBlockCategory.Technique,
  SwimmingBlockCategory.Drill,
  SwimmingBlockCategory.PreMain,
  SwimmingBlockCategory.MainSet,
  SwimmingBlockCategory.Kick,
  SwimmingBlockCategory.Pull,
  SwimmingBlockCategory.Sprint,
  SwimmingBlockCategory.Recovery,
  SwimmingBlockCategory.CoolDown,
  SwimmingBlockCategory.Other,
]
