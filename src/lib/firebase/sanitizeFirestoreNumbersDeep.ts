export function sanitizeFirestoreNumbersDeep<T>(value: T): T {
  if (value === null || value === undefined) {
    return value
  }

  if (typeof value === 'number') {
    if (Number.isFinite(value)) {
      return value
    }

    return 0 as T
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeFirestoreNumbersDeep(item)) as T
  }

  if (typeof value === 'object') {
    const record = value as Record<string, unknown>
    const next: Record<string, unknown> = {}

    for (const [key, nested] of Object.entries(record)) {
      next[key] = sanitizeFirestoreNumbersDeep(nested)
    }

    return next as T
  }

  return value
}
