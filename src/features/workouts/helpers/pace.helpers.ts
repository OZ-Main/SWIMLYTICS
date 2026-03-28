export function computeAveragePacePer100(distanceMeters: number, durationSeconds: number): number {
  if (distanceMeters <= 0 || durationSeconds <= 0) {
    return 0
  }
  return (durationSeconds / distanceMeters) * 100
}
