import { FirebaseError } from 'firebase/app'

export function coachFirestoreErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof FirebaseError) {
    if (error.code === 'permission-denied') {
      return 'Firestore permission denied. Check your security rules and sign-in.'
    }

    return error.message || fallback
  }

  if (error instanceof Error && error.message) {
    return error.message
  }

  return fallback
}
