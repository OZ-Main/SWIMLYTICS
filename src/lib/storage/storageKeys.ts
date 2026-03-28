/**
 * localStorage keys — versioned for forward-compatible migrations (e.g. Firebase later).
 * Prefer reading/writing through Zustand persist, not these strings directly, except in migration helpers.
 */
export const STORAGE_KEYS = {
  COACH: 'swimlytics.coach.v1',
  ATHLETES: 'swimlytics.athletes.v1',
  /** Multi-block training sessions (current). */
  TRAINING_SESSIONS: 'swimlytics.trainingSessions.v1',
  /** Previous flat workout bucket — migrated once into {@link STORAGE_KEYS.TRAINING_SESSIONS}. */
  WORKOUTS: 'swimlytics.workouts.v2',
  /** Legacy single-user workouts bucket (read-only migration source). */
  WORKOUTS_LEGACY_V1: 'swimlytics.workouts.v1',
  PERSONAL_BESTS: 'swimlytics.personalBests.v2',
  /** Legacy PBs without athleteId. */
  PERSONAL_BESTS_LEGACY_V1: 'swimlytics.personalBests.v1',
  SETTINGS: 'swimlytics.settings.v1',
  /** Desktop sidebar expanded (full width) vs icon rail — not part of Zustand persist. */
  UI_SIDEBAR_EXPANDED: 'swimlytics.ui.sidebarExpanded.v1',
} as const
