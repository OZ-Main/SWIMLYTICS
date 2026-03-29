import {
  AthleteTrainingType,
  DrillType,
  EffortLevel,
  GymBlockCategory,
  PersonalBestDistance,
  PoolLength,
  Stroke,
  SwimEquipment,
  SwimmingBlockCategory,
} from '@/shared/domain'
import { ISO_DATE_STRING_LENGTH } from '@/shared/constants/calendar.constants'
import { totalSecondsFromMinutesAndSeconds } from '@/shared/helpers/duration.helpers'
import {
  SESSION_BLOCK_KIND,
  type Athlete,
  type GymSessionBlock,
  type GymTrainingSession,
  type PersonalBest,
  type SwimmingSessionBlock,
  type SwimmingTrainingSession,
  type TrainingSession,
  type WorkoutTemplate,
} from '@/shared/types/domain.types'

const SEED_SESSION_ID_PREFIX = 'seed-s'
const SEED_PB_ID_PREFIX = 'seed-pb-'
const SEED_ATHLETE_PREFIX = 'seed-athlete-'

export const SEED_ATHLETE_SWIM_ID = `${SEED_ATHLETE_PREFIX}swim` as const
export const SEED_ATHLETE_GYM_ID = `${SEED_ATHLETE_PREFIX}gym` as const

function daysAgoISO(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d.toISOString().slice(0, ISO_DATE_STRING_LENGTH)
}

export const SEED_ATHLETES: Athlete[] = [
  {
    id: SEED_ATHLETE_SWIM_ID,
    fullName: 'Alex Rivera',
    trainingType: AthleteTrainingType.Swimming,
    group: 'Senior Performance',
    notes: 'Distance free / IM focus.',
    createdAt: daysAgoISO(120),
  },
  {
    id: SEED_ATHLETE_GYM_ID,
    fullName: 'Jordan Lee',
    trainingType: AthleteTrainingType.Gym,
    group: 'Gym Group 1',
    notes: 'Hypertrophy block — log RPE in notes.',
    createdAt: daysAgoISO(90),
  },
]

function timestampsForCalendarDate(calendarDate: string): { createdAt: string; updatedAt: string } {
  const createdAt = `${calendarDate}T12:00:00.000Z`
  return { createdAt, updatedAt: createdAt }
}

function swimBlock(
  id: string,
  orderIndex: number,
  partial: Omit<SwimmingSessionBlock, 'id' | 'orderIndex' | 'kind'>,
): SwimmingSessionBlock {
  return {
    id,
    orderIndex,
    kind: SESSION_BLOCK_KIND.Swimming,
    ...partial,
  }
}

function gymBlock(
  id: string,
  orderIndex: number,
  partial: Omit<GymSessionBlock, 'id' | 'orderIndex' | 'kind'>,
): GymSessionBlock {
  return {
    id,
    orderIndex,
    kind: SESSION_BLOCK_KIND.Gym,
    ...partial,
  }
}

function swimmingTrainingSession(
  sessionId: string,
  daysAgo: number,
  sessionTitle: string,
  notes: string,
  defaultPoolLength: PoolLength,
  blocks: SwimmingSessionBlock[],
): SwimmingTrainingSession {
  const date = daysAgoISO(daysAgo)
  const timestamps = timestampsForCalendarDate(date)
  return {
    id: sessionId,
    athleteId: SEED_ATHLETE_SWIM_ID,
    date,
    sessionTitle,
    notes,
    trainingType: AthleteTrainingType.Swimming,
    defaultPoolLength,
    blocks: blocks.map((block, index) => ({ ...block, orderIndex: index })),
    ...timestamps,
  }
}

function gymTrainingSession(
  sessionId: string,
  daysAgo: number,
  sessionTitle: string,
  notes: string,
  blocks: GymSessionBlock[],
): GymTrainingSession {
  const date = daysAgoISO(daysAgo)
  const timestamps = timestampsForCalendarDate(date)
  return {
    id: sessionId,
    athleteId: SEED_ATHLETE_GYM_ID,
    date,
    sessionTitle,
    notes,
    trainingType: AthleteTrainingType.Gym,
    blocks: blocks.map((block, index) => ({ ...block, orderIndex: index })),
    ...timestamps,
  }
}

const SEED_SWIM_SESSIONS: SwimmingTrainingSession[] = [
  swimmingTrainingSession(`${SEED_SESSION_ID_PREFIX}1`, 1, 'Aerobic threshold', 'Steady aerobic set; focus on long exhale.', PoolLength.Meters25, [
    swimBlock(`${SEED_SESSION_ID_PREFIX}1-b0`, 0, {
      title: 'Continuous free',
      notes: '',
      category: SwimmingBlockCategory.MainSet,
      stroke: Stroke.Freestyle,
      effortLevel: EffortLevel.Moderate,
      poolLength: PoolLength.Meters25,
      repetitions: 1,
      distancePerRepMeters: 2000,
      explicitTotalDistanceMeters: 0,
      durationSeconds: totalSecondsFromMinutesAndSeconds(38, 20),
      drillType: DrillType.None,
      intervalSendoffSeconds: null,
      equipment: [],
    }),
  ]),
  swimmingTrainingSession(`${SEED_SESSION_ID_PREFIX}2`, 2, 'Recovery volume', 'Recovery swim after hard weekend.', PoolLength.Meters50, [
    swimBlock(`${SEED_SESSION_ID_PREFIX}2-b0`, 0, {
      title: 'Easy free',
      notes: '',
      category: SwimmingBlockCategory.Recovery,
      stroke: Stroke.Freestyle,
      effortLevel: EffortLevel.Easy,
      poolLength: PoolLength.Meters50,
      repetitions: 1,
      distancePerRepMeters: 3200,
      explicitTotalDistanceMeters: 0,
      durationSeconds: totalSecondsFromMinutesAndSeconds(58, 10),
      drillType: DrillType.None,
      intervalSendoffSeconds: null,
      equipment: [],
    }),
  ]),
  swimmingTrainingSession(`${SEED_SESSION_ID_PREFIX}3`, 3, 'IM transitions', 'IM transitions — smooth turns.', PoolLength.Meters25, [
    swimBlock(`${SEED_SESSION_ID_PREFIX}3-b0`, 0, {
      title: 'IM set',
      notes: '',
      category: SwimmingBlockCategory.MainSet,
      stroke: Stroke.Im,
      effortLevel: EffortLevel.Hard,
      poolLength: PoolLength.Meters25,
      repetitions: 1,
      distancePerRepMeters: 1600,
      explicitTotalDistanceMeters: 0,
      durationSeconds: totalSecondsFromMinutesAndSeconds(35, 40),
      drillType: DrillType.None,
      intervalSendoffSeconds: null,
      equipment: [],
    }),
  ]),
  swimmingTrainingSession(`${SEED_SESSION_ID_PREFIX}4`, 5, 'Backstroke tempo', '', PoolLength.Meters25, [
    swimBlock(`${SEED_SESSION_ID_PREFIX}4-b0`, 0, {
      title: 'Back steady',
      notes: '',
      category: SwimmingBlockCategory.MainSet,
      stroke: Stroke.Backstroke,
      effortLevel: EffortLevel.Moderate,
      poolLength: PoolLength.Meters25,
      repetitions: 1,
      distancePerRepMeters: 1200,
      explicitTotalDistanceMeters: 0,
      durationSeconds: totalSecondsFromMinutesAndSeconds(24, 15),
      drillType: DrillType.None,
      intervalSendoffSeconds: null,
      equipment: [],
    }),
  ]),
  swimmingTrainingSession(`${SEED_SESSION_ID_PREFIX}5`, 7, 'Breaststroke technique', 'Technique emphasis — narrow kick.', PoolLength.Meters50, [
    swimBlock(`${SEED_SESSION_ID_PREFIX}5-b0`, 0, {
      title: 'BR tech',
      notes: '',
      category: SwimmingBlockCategory.Technique,
      stroke: Stroke.Breaststroke,
      effortLevel: EffortLevel.Easy,
      poolLength: PoolLength.Meters50,
      repetitions: 1,
      distancePerRepMeters: 800,
      explicitTotalDistanceMeters: 0,
      durationSeconds: totalSecondsFromMinutesAndSeconds(22, 0),
      drillType: DrillType.None,
      intervalSendoffSeconds: null,
      equipment: [],
    }),
  ]),
  swimmingTrainingSession(`${SEED_SESSION_ID_PREFIX}multi`, 4, 'Mixed aerobic pyramid', 'Coach-structured session with clear parts.', PoolLength.Meters25, [
    swimBlock(`${SEED_SESSION_ID_PREFIX}multi-b0`, 0, {
      title: 'Warm-up',
      notes: 'Easy legs, long strokes.',
      category: SwimmingBlockCategory.WarmUp,
      stroke: Stroke.Freestyle,
      effortLevel: EffortLevel.Easy,
      poolLength: PoolLength.Meters25,
      repetitions: 0,
      distancePerRepMeters: 0,
      explicitTotalDistanceMeters: 400,
      durationSeconds: 420,
      drillType: DrillType.None,
      intervalSendoffSeconds: null,
      equipment: [],
    }),
    swimBlock(`${SEED_SESSION_ID_PREFIX}multi-b1`, 1, {
      title: 'Drill 50s',
      notes: 'Catch-up focus.',
      category: SwimmingBlockCategory.Drill,
      stroke: Stroke.Freestyle,
      effortLevel: EffortLevel.Moderate,
      poolLength: PoolLength.Meters25,
      repetitions: 8,
      distancePerRepMeters: 50,
      explicitTotalDistanceMeters: 0,
      durationSeconds: 600,
      drillType: DrillType.CatchUp,
      intervalSendoffSeconds: 60,
      equipment: [SwimEquipment.Paddles],
    }),
    swimBlock(`${SEED_SESSION_ID_PREFIX}multi-b2`, 2, {
      title: 'Main free',
      notes: 'Hold pace.',
      category: SwimmingBlockCategory.MainSet,
      stroke: Stroke.Freestyle,
      effortLevel: EffortLevel.Hard,
      poolLength: PoolLength.Meters25,
      repetitions: 0,
      distancePerRepMeters: 0,
      explicitTotalDistanceMeters: 1000,
      durationSeconds: 900,
      drillType: DrillType.None,
      intervalSendoffSeconds: null,
      equipment: [],
    }),
    swimBlock(`${SEED_SESSION_ID_PREFIX}multi-b3`, 3, {
      title: 'Kick set',
      notes: 'Board optional.',
      category: SwimmingBlockCategory.Kick,
      stroke: Stroke.Freestyle,
      effortLevel: EffortLevel.Moderate,
      poolLength: PoolLength.Meters25,
      repetitions: 0,
      distancePerRepMeters: 0,
      explicitTotalDistanceMeters: 200,
      durationSeconds: 300,
      drillType: DrillType.None,
      intervalSendoffSeconds: null,
      equipment: [SwimEquipment.Kickboard],
    }),
    swimBlock(`${SEED_SESSION_ID_PREFIX}multi-b4`, 4, {
      title: 'Cool-down',
      notes: '',
      category: SwimmingBlockCategory.CoolDown,
      stroke: Stroke.Freestyle,
      effortLevel: EffortLevel.Easy,
      poolLength: PoolLength.Meters25,
      repetitions: 0,
      distancePerRepMeters: 0,
      explicitTotalDistanceMeters: 300,
      durationSeconds: 360,
      drillType: DrillType.None,
      intervalSendoffSeconds: null,
      equipment: [],
    }),
  ]),
]

const SEED_GYM_SESSIONS: GymTrainingSession[] = [
  gymTrainingSession(`${SEED_SESSION_ID_PREFIX}g-a`, 2, 'Upper push + core', 'Bench progression — top set RPE 8.', [
    gymBlock(`${SEED_SESSION_ID_PREFIX}g-a-b0`, 0, {
      title: 'Upper + core',
      notes: '',
      category: GymBlockCategory.MainLift,
      focus: 'Upper push + core',
      durationSeconds: totalSecondsFromMinutesAndSeconds(52, 0),
      effortLevel: EffortLevel.Hard,
    }),
  ]),
  gymTrainingSession(`${SEED_SESSION_ID_PREFIX}g-b`, 5, 'Lower strength', 'Squat volume wave.', [
    gymBlock(`${SEED_SESSION_ID_PREFIX}g-b-b0`, 0, {
      title: 'Lower strength',
      notes: '',
      category: GymBlockCategory.MainLift,
      focus: 'Lower strength',
      durationSeconds: totalSecondsFromMinutesAndSeconds(48, 30),
      effortLevel: EffortLevel.Moderate,
    }),
  ]),
  gymTrainingSession(`${SEED_SESSION_ID_PREFIX}g-c`, 8, 'Conditioning', 'Bike intervals + mobility finisher.', [
    gymBlock(`${SEED_SESSION_ID_PREFIX}g-c-b0`, 0, {
      title: 'Conditioning',
      notes: '',
      category: GymBlockCategory.Conditioning,
      focus: 'Conditioning',
      durationSeconds: totalSecondsFromMinutesAndSeconds(35, 0),
      effortLevel: EffortLevel.Easy,
    }),
  ]),
]

export const SEED_TRAINING_SESSIONS: TrainingSession[] = [
  ...SEED_SWIM_SESSIONS,
  ...SEED_GYM_SESSIONS,
]

const SEED_WORKOUT_TEMPLATE_TIMESTAMP = new Date().toISOString()

export const SEED_WORKOUT_TEMPLATES: WorkoutTemplate[] = [
  {
    id: 'seed-workout-template-swim-aerobic',
    title: 'Aerobic threshold (template)',
    description: 'Reusable steady aerobic main set for assignment to swim athletes.',
    targetGroup: 'Senior Performance',
    tags: ['aerobic', 'freestyle'],
    createdAt: SEED_WORKOUT_TEMPLATE_TIMESTAMP,
    updatedAt: SEED_WORKOUT_TEMPLATE_TIMESTAMP,
    trainingType: AthleteTrainingType.Swimming,
    defaultPoolLength: PoolLength.Meters25,
    blocks: [
      swimBlock('seed-wt-swim-b0', 0, {
        title: 'Continuous free',
        notes: '',
        category: SwimmingBlockCategory.MainSet,
        stroke: Stroke.Freestyle,
        effortLevel: EffortLevel.Moderate,
        poolLength: PoolLength.Meters25,
        repetitions: 1,
        distancePerRepMeters: 2000,
        explicitTotalDistanceMeters: 0,
        durationSeconds: totalSecondsFromMinutesAndSeconds(38, 20),
        drillType: DrillType.None,
        intervalSendoffSeconds: null,
        equipment: [],
      }),
    ],
  },
  {
    id: 'seed-workout-template-gym-upper',
    title: 'Upper push + core (template)',
    description: 'Gym template for upper-body focused days.',
    targetGroup: 'Gym Group 1',
    tags: ['strength', 'upper'],
    createdAt: SEED_WORKOUT_TEMPLATE_TIMESTAMP,
    updatedAt: SEED_WORKOUT_TEMPLATE_TIMESTAMP,
    trainingType: AthleteTrainingType.Gym,
    blocks: [
      gymBlock('seed-wt-gym-b0', 0, {
        title: 'Upper + core',
        notes: '',
        category: GymBlockCategory.MainLift,
        focus: 'Upper push + core',
        durationSeconds: totalSecondsFromMinutesAndSeconds(52, 0),
        effortLevel: EffortLevel.Hard,
      }),
    ],
  },
]

export const SEED_PERSONAL_BESTS: PersonalBest[] = [
  {
    id: `${SEED_PB_ID_PREFIX}50`,
    athleteId: SEED_ATHLETE_SWIM_ID,
    stroke: Stroke.Freestyle,
    distance: PersonalBestDistance.M50,
    timeSeconds: 26.8,
    date: daysAgoISO(30),
    notes: 'LC meet — slight tailwind.',
  },
  {
    id: `${SEED_PB_ID_PREFIX}100`,
    athleteId: SEED_ATHLETE_SWIM_ID,
    stroke: Stroke.Freestyle,
    distance: PersonalBestDistance.M100,
    timeSeconds: 58.4,
    date: daysAgoISO(45),
    notes: 'Converted mentally from short course.',
  },
  {
    id: `${SEED_PB_ID_PREFIX}200`,
    athleteId: SEED_ATHLETE_SWIM_ID,
    stroke: Stroke.Freestyle,
    distance: PersonalBestDistance.M200,
    timeSeconds: 132.1,
    date: daysAgoISO(60),
    notes: '',
  },
  {
    id: `${SEED_PB_ID_PREFIX}400`,
    athleteId: SEED_ATHLETE_SWIM_ID,
    stroke: Stroke.Freestyle,
    distance: PersonalBestDistance.M400,
    timeSeconds: 305,
    date: daysAgoISO(90),
    notes: 'Negative split second half.',
  },
]
