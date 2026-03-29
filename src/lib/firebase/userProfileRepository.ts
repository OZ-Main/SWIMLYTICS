import type { User } from 'firebase/auth'
import { doc, setDoc, updateDoc, type DocumentData, type Firestore } from 'firebase/firestore'

import { getFirestoreDb } from '@/lib/firebase/firestoreDb'
import { FIRESTORE_USERS_COLLECTION } from '@/lib/firebase/firestorePaths'
import type { FirestoreUserProfileFields } from '@/lib/firebase/userProfile.types'
import { stripUndefinedDeep } from '@/lib/firebase/stripUndefinedDeep'
import { ThemeMode } from '@/shared/domain'
import type { Coach } from '@/shared/types/domain.types'

export function userProfileDocumentRef(db: Firestore, uid: string) {
  return doc(db, FIRESTORE_USERS_COLLECTION, uid)
}

export function coachFromUserProfile(uid: string, profile: FirestoreUserProfileFields): Coach {
  return {
    id: uid,
    displayName: profile.displayName,
    createdAt: profile.createdAt,
  }
}

export function defaultUserProfileFields(
  displayName: string,
  email?: string | null,
): FirestoreUserProfileFields {
  const base: FirestoreUserProfileFields = {
    displayName,
    createdAt: new Date().toISOString(),
    theme: ThemeMode.System,
    initialSampleApplied: false,
  }
  if (email != null && email.trim() !== '') {
    return { ...base, email: email.trim() }
  }
  return base
}

export function coachDisplayNameFromFirebaseUser(firebaseUser: User): string {
  const trimmed = firebaseUser.displayName?.trim()
  if (trimmed) {
    return trimmed
  }
  const emailLocal = firebaseUser.email?.split('@')[0]?.trim()
  if (emailLocal) {
    return emailLocal
  }
  return 'Coach'
}

export async function resetUserProfileAfterClearingData(
  uid: string,
  firebaseUser: User,
): Promise<void> {
  const db = getFirestoreDb()
  await setDoc(
    userProfileDocumentRef(db, uid),
    stripUndefinedDeep({
      ...defaultUserProfileFields(
        coachDisplayNameFromFirebaseUser(firebaseUser),
        firebaseUser.email,
      ),
      initialSampleApplied: true,
    }),
    { merge: true },
  )
}

export async function updateUserProfileFields(
  uid: string,
  partial: Partial<FirestoreUserProfileFields>,
): Promise<void> {
  const db = getFirestoreDb()
  await updateDoc(
    userProfileDocumentRef(db, uid),
    stripUndefinedDeep(partial) as DocumentData,
  )
}

export function parseUserProfileSnapshot(
  uid: string,
  raw: Record<string, unknown>,
): { coach: Coach; theme: ThemeMode; initialSampleApplied: boolean } {
  const displayName =
    typeof raw.displayName === 'string' && raw.displayName.length > 0 ? raw.displayName : 'Coach'
  const createdAt =
    typeof raw.createdAt === 'string' && raw.createdAt.length > 0
      ? raw.createdAt
      : new Date().toISOString()
  const themeRaw = raw.theme
  const theme =
    themeRaw === ThemeMode.Light || themeRaw === ThemeMode.Dark || themeRaw === ThemeMode.System
      ? themeRaw
      : ThemeMode.System
  const initialSampleApplied = raw.initialSampleApplied === true
  const email =
    typeof raw.email === 'string' && raw.email.trim().length > 0 ? raw.email.trim() : undefined
  const profile: FirestoreUserProfileFields = {
    displayName,
    createdAt,
    theme,
    initialSampleApplied,
    ...(email != null ? { email } : {}),
  }
  return {
    coach: coachFromUserProfile(uid, profile),
    theme,
    initialSampleApplied,
  }
}
