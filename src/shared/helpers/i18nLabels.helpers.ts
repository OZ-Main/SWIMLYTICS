import type { TFunction } from 'i18next'

import { AthleteTrainingType, Stroke } from '@/shared/domain'

export function translateTrainingType(t: TFunction, type: AthleteTrainingType): string {
  return t(`trainingType.${type}`)
}

export function translateStroke(t: TFunction, stroke: Stroke): string {
  return t(`stroke.${stroke}`)
}
