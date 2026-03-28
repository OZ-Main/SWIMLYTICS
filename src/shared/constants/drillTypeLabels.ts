import { DrillType } from '@/shared/domain'

export const DRILL_TYPE_LABEL: Record<DrillType, string> = {
  [DrillType.None]: '—',
  [DrillType.SingleArm]: 'Single arm',
  [DrillType.Fist]: 'Fist',
  [DrillType.CatchUp]: 'Catch-up',
  [DrillType.Sculling]: 'Sculling',
  [DrillType.Other]: 'Other drill',
}
