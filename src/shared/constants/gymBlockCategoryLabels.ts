import { GymBlockCategory } from '@/shared/domain'

export const GYM_BLOCK_CATEGORY_LABEL: Record<GymBlockCategory, string> = {
  [GymBlockCategory.WarmUp]: 'Warm-up',
  [GymBlockCategory.MainLift]: 'Main lift',
  [GymBlockCategory.Accessory]: 'Accessory',
  [GymBlockCategory.Conditioning]: 'Conditioning',
  [GymBlockCategory.Mobility]: 'Mobility',
  [GymBlockCategory.CoolDown]: 'Cool-down',
  [GymBlockCategory.Other]: 'Other',
}

export const GYM_BLOCK_CATEGORY_ORDER: GymBlockCategory[] = [
  GymBlockCategory.WarmUp,
  GymBlockCategory.MainLift,
  GymBlockCategory.Accessory,
  GymBlockCategory.Conditioning,
  GymBlockCategory.Mobility,
  GymBlockCategory.CoolDown,
  GymBlockCategory.Other,
]
