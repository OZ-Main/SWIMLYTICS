import { EffortLevel, PersonalBestDistance, PoolLength, Stroke } from '@/shared/domain'
import { ISO_DATE_STRING_LENGTH } from '@/shared/constants/calendar.constants'
import { totalSecondsFromMinutesAndSeconds } from '@/shared/helpers/duration.helpers'
import type { PersonalBest, Workout } from '@/shared/types/domain.types'

const SEED_WORKOUT_ID_PREFIX = 'seed-w'
const SEED_PB_ID_PREFIX = 'seed-pb-'

function daysAgoISO(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d.toISOString().slice(0, ISO_DATE_STRING_LENGTH)
}

function paceFrom(distance: number, durationSec: number): number {
  return distance > 0 ? (durationSec / distance) * 100 : 0
}

export const SEED_WORKOUTS: Workout[] = [
  {
    id: `${SEED_WORKOUT_ID_PREFIX}1`,
    date: daysAgoISO(1),
    poolLength: PoolLength.Meters25,
    stroke: Stroke.Freestyle,
    distance: 2000,
    duration: totalSecondsFromMinutesAndSeconds(38, 20),
    averagePacePer100: paceFrom(2000, totalSecondsFromMinutesAndSeconds(38, 20)),
    effortLevel: EffortLevel.Moderate,
    notes: 'Steady aerobic set; focus on long exhale.',
  },
  {
    id: `${SEED_WORKOUT_ID_PREFIX}2`,
    date: daysAgoISO(2),
    poolLength: PoolLength.Meters50,
    stroke: Stroke.Freestyle,
    distance: 3200,
    duration: totalSecondsFromMinutesAndSeconds(58, 10),
    averagePacePer100: paceFrom(3200, totalSecondsFromMinutesAndSeconds(58, 10)),
    effortLevel: EffortLevel.Easy,
    notes: 'Recovery swim after hard weekend.',
  },
  {
    id: `${SEED_WORKOUT_ID_PREFIX}3`,
    date: daysAgoISO(3),
    poolLength: PoolLength.Meters25,
    stroke: Stroke.Im,
    distance: 1600,
    duration: totalSecondsFromMinutesAndSeconds(35, 40),
    averagePacePer100: paceFrom(1600, totalSecondsFromMinutesAndSeconds(35, 40)),
    effortLevel: EffortLevel.Hard,
    notes: 'IM transitions — smooth turns.',
  },
  {
    id: `${SEED_WORKOUT_ID_PREFIX}4`,
    date: daysAgoISO(5),
    poolLength: PoolLength.Meters25,
    stroke: Stroke.Backstroke,
    distance: 1200,
    duration: totalSecondsFromMinutesAndSeconds(24, 15),
    averagePacePer100: paceFrom(1200, totalSecondsFromMinutesAndSeconds(24, 15)),
    effortLevel: EffortLevel.Moderate,
    notes: '',
  },
  {
    id: `${SEED_WORKOUT_ID_PREFIX}5`,
    date: daysAgoISO(7),
    poolLength: PoolLength.Meters50,
    stroke: Stroke.Breaststroke,
    distance: 800,
    duration: totalSecondsFromMinutesAndSeconds(22, 0),
    averagePacePer100: paceFrom(800, totalSecondsFromMinutesAndSeconds(22, 0)),
    effortLevel: EffortLevel.Easy,
    notes: 'Technique emphasis — narrow kick.',
  },
  {
    id: `${SEED_WORKOUT_ID_PREFIX}6`,
    date: daysAgoISO(9),
    poolLength: PoolLength.Meters25,
    stroke: Stroke.Butterfly,
    distance: 600,
    duration: totalSecondsFromMinutesAndSeconds(18, 30),
    averagePacePer100: paceFrom(600, totalSecondsFromMinutesAndSeconds(18, 30)),
    effortLevel: EffortLevel.Hard,
    notes: '50s on generous rest.',
  },
  {
    id: `${SEED_WORKOUT_ID_PREFIX}7`,
    date: daysAgoISO(12),
    poolLength: PoolLength.Meters25,
    stroke: Stroke.Freestyle,
    distance: 2800,
    duration: totalSecondsFromMinutesAndSeconds(52, 0),
    averagePacePer100: paceFrom(2800, totalSecondsFromMinutesAndSeconds(52, 0)),
    effortLevel: EffortLevel.Moderate,
    notes: 'Pull buoy middle block.',
  },
  {
    id: `${SEED_WORKOUT_ID_PREFIX}8`,
    date: daysAgoISO(14),
    poolLength: PoolLength.Meters50,
    stroke: Stroke.Freestyle,
    distance: 4000,
    duration: totalSecondsFromMinutesAndSeconds(72, 45),
    averagePacePer100: paceFrom(4000, totalSecondsFromMinutesAndSeconds(72, 45)),
    effortLevel: EffortLevel.Race,
    notes: 'Threshold main set — held splits.',
  },
]

export const SEED_PERSONAL_BESTS: PersonalBest[] = [
  {
    id: `${SEED_PB_ID_PREFIX}50`,
    stroke: Stroke.Freestyle,
    distance: PersonalBestDistance.M50,
    timeSeconds: 26.8,
    date: daysAgoISO(30),
    notes: 'LC meet — slight tailwind.',
  },
  {
    id: `${SEED_PB_ID_PREFIX}100`,
    stroke: Stroke.Freestyle,
    distance: PersonalBestDistance.M100,
    timeSeconds: 58.4,
    date: daysAgoISO(45),
    notes: 'SCY converted mentally to LC.',
  },
  {
    id: `${SEED_PB_ID_PREFIX}200`,
    stroke: Stroke.Freestyle,
    distance: PersonalBestDistance.M200,
    timeSeconds: 132.1,
    date: daysAgoISO(60),
    notes: '',
  },
  {
    id: `${SEED_PB_ID_PREFIX}400`,
    stroke: Stroke.Freestyle,
    distance: PersonalBestDistance.M400,
    timeSeconds: 305,
    date: daysAgoISO(90),
    notes: 'Negative split second half.',
  },
]
