export function areAllAthleteIdsSelected(
  athleteIds: string[],
  selectedAthleteIds: ReadonlySet<string>,
): boolean {
  if (athleteIds.length === 0) {
    return false
  }

  return athleteIds.every((athleteId) => selectedAthleteIds.has(athleteId))
}

export function nextAthleteSelectionAfterSelectAllFilteredToggle(params: {
  filteredAthleteIds: string[]
  selectedAthleteIds: ReadonlySet<string>
}): Set<string> {
  const { filteredAthleteIds, selectedAthleteIds } = params
  const next = new Set(selectedAthleteIds)
  const allFilteredSelected = areAllAthleteIdsSelected(filteredAthleteIds, selectedAthleteIds)
  if (allFilteredSelected) {
    for (const athleteId of filteredAthleteIds) {
      next.delete(athleteId)
    }

    return next
  }

  for (const athleteId of filteredAthleteIds) {
    next.add(athleteId)
  }

  return next
}
