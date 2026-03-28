/** Domain enums — persisted values match JSON storage (string / numeric literals). */

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
}
