import type { User } from 'firebase/auth'
import type { DocumentData } from 'firebase/firestore'
import { getDoc, setDoc } from 'firebase/firestore'

import { getFirestoreDb } from '@/lib/firebase/firestoreDb'
import {
  coachDisplayNameFromFirebaseUser,
  defaultUserProfileFields,
  userProfileDocumentRef,
} from '@/lib/firebase/userProfileRepository'
import { stripUndefinedDeep } from '@/lib/firebase/stripUndefinedDeep'

export async function ensureCoachUserDocumentIfMissing(firebaseUser: User): Promise<boolean> {
  const database = getFirestoreDb()
  const profileReference = userProfileDocumentRef(database, firebaseUser.uid)
  const existingSnapshot = await getDoc(profileReference)
  if (existingSnapshot.exists()) {
    return false
  }
  const displayName = coachDisplayNameFromFirebaseUser(firebaseUser)
  const profilePayload = stripUndefinedDeep(
    defaultUserProfileFields(displayName, firebaseUser.email),
  ) as DocumentData
  await setDoc(profileReference, profilePayload)
  return true
}
