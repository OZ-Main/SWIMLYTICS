import { AthleteTrainingType } from '@/shared/domain'

export const ATHLETE_TRAINING_TYPE_LABELS: Record<AthleteTrainingType, string> = {
  [AthleteTrainingType.Swimming]: 'Swimming',
  [AthleteTrainingType.Gym]: 'Gym / strength',
}
