import { AthleteTrainingType } from '@/shared/domain'
import type {
  GymTrainingSession,
  SwimmingTrainingSession,
  TrainingSession,
} from '@/shared/types/domain.types'

export function isSwimmingTrainingSession(
  session: TrainingSession,
): session is SwimmingTrainingSession {
  return session.trainingType === AthleteTrainingType.Swimming
}

export function isGymTrainingSession(session: TrainingSession): session is GymTrainingSession {
  return session.trainingType === AthleteTrainingType.Gym
}

export function filterSwimmingTrainingSessions(
  sessions: TrainingSession[],
): SwimmingTrainingSession[] {
  return sessions.filter(isSwimmingTrainingSession)
}

export function filterGymTrainingSessions(sessions: TrainingSession[]): GymTrainingSession[] {
  return sessions.filter(isGymTrainingSession)
}

export function trainingSessionsForAthlete(
  sessions: TrainingSession[],
  athleteId: string,
): TrainingSession[] {
  return sessions.filter((session) => session.athleteId === athleteId)
}
