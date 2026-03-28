import { PersonalBestDistance, Stroke } from '@/shared/domain'

/** Canonical race distances, ascending (UI & validation order) — all strokes except IM. */
export const PERSONAL_BEST_DISTANCES_ORDERED: readonly PersonalBestDistance[] = [
  PersonalBestDistance.M50,
  PersonalBestDistance.M100,
  PersonalBestDistance.M200,
  PersonalBestDistance.M400,
  PersonalBestDistance.M800,
  PersonalBestDistance.M1500,
] as const

/** Official IM distances only (100 / 200 / 400 IM). */
export const PERSONAL_BEST_IM_DISTANCES_ORDERED: readonly PersonalBestDistance[] = [
  PersonalBestDistance.M100,
  PersonalBestDistance.M200,
  PersonalBestDistance.M400,
] as const

/** Form / export string literals for Zod — non-IM distances. */
export const PERSONAL_BEST_DISTANCE_FORM_VALUES = [
  String(PersonalBestDistance.M50),
  String(PersonalBestDistance.M100),
  String(PersonalBestDistance.M200),
  String(PersonalBestDistance.M400),
  String(PersonalBestDistance.M800),
  String(PersonalBestDistance.M1500),
] as const

export type PersonalBestDistanceFormValue = (typeof PERSONAL_BEST_DISTANCE_FORM_VALUES)[number]

export function personalBestDistancesForStroke(
  stroke: Stroke,
): readonly PersonalBestDistance[] {
  return stroke === Stroke.Im ? PERSONAL_BEST_IM_DISTANCES_ORDERED : PERSONAL_BEST_DISTANCES_ORDERED
}

export function personalBestDistanceFormValuesForStroke(stroke: Stroke): string[] {
  return personalBestDistancesForStroke(stroke).map(String)
}
