/** Domain enums — persisted values match JSON storage (string / numeric literals). */

/** Training modality for an athlete (drives workout shape and analytics). */
export enum AthleteTrainingType {
  Swimming = 'swimming',
  Gym = 'gym',
}

export enum Stroke {
  Freestyle = 'freestyle',
  Backstroke = 'backstroke',
  Breaststroke = 'breaststroke',
  Butterfly = 'butterfly',
  Im = 'im',
  Drill = 'drill',
  Kick = 'kick',
}

export enum EffortLevel {
  Easy = 'easy',
  Moderate = 'moderate',
  Hard = 'hard',
  Race = 'race',
}

export enum PoolLength {
  Meters25 = 25,
  Meters50 = 50,
}

export enum PersonalBestDistance {
  M50 = 50,
  M100 = 100,
  M200 = 200,
  M400 = 400,
  M800 = 800,
  M1500 = 1500,
}

/** User preference; persisted in settings. */
export enum ThemeMode {
  Light = 'light',
  Dark = 'dark',
  System = 'system',
}

/** Resolved after applying system preference. */
export enum ResolvedTheme {
  Light = 'light',
  Dark = 'dark',
}

/** KPI / analytics identifiers (dashboard & summaries). */
export enum MetricType {
  WorkoutCount = 'workout_count',
  TotalDistance = 'total_distance',
  TotalDuration = 'total_duration',
  AveragePace = 'average_pace',
  WeekDistance = 'week_distance',
}

/** Export bundle schema version. */
export enum DataExportVersion {
  V1 = 1,
  /** Coach + athletes + discriminated workouts + PBs with athleteId. */
  V2 = 2,
  /** Coach + athletes + training sessions (multi-block) + PBs. */
  V3 = 3,
}

/** Part of a pool session — warm-up, main set, etc. */
export enum SwimmingBlockCategory {
  WarmUp = 'warm_up',
  Drill = 'drill',
  PreMain = 'pre_main',
  MainSet = 'main_set',
  Kick = 'kick',
  Pull = 'pull',
  Sprint = 'sprint',
  Recovery = 'recovery',
  CoolDown = 'cool_down',
  Technique = 'technique',
  Other = 'other',
}

/** Gym / strength block intent. */
export enum GymBlockCategory {
  WarmUp = 'warm_up',
  MainLift = 'main_lift',
  Accessory = 'accessory',
  Conditioning = 'conditioning',
  Mobility = 'mobility',
  CoolDown = 'cool_down',
  Other = 'other',
}

export enum DrillType {
  None = 'none',
  SingleArm = 'single_arm',
  Fist = 'fist',
  CatchUp = 'catch_up',
  Sculling = 'sculling',
  Other = 'other_drill',
}

export enum SwimEquipment {
  PullBuoy = 'pull_buoy',
  Paddles = 'paddles',
  Fins = 'fins',
  Snorkel = 'snorkel',
  Kickboard = 'kickboard',
}
