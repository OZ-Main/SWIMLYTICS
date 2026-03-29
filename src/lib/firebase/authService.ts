import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type UserCredential,
} from 'firebase/auth'
import { setDoc } from 'firebase/firestore'

import { getFirebaseAuth, signInWithGoogleAccount } from '@/lib/firebase/auth'
import { ensureCoachUserDocumentIfMissing } from '@/lib/firebase/coachUserDocument.helpers'
import { getFirestoreDb } from '@/lib/firebase/firestoreDb'
import { stripUndefinedDeep } from '@/lib/firebase/stripUndefinedDeep'
import { writeSampleDatasetForNewCoach } from '@/lib/firebase/seedCoachSampleData'
import {
  defaultUserProfileFields,
  userProfileDocumentRef,
} from '@/lib/firebase/userProfileRepository'

export async function signUpCoachWithEmailPassword(params: {
  email: string
  password: string
  displayName: string
}): Promise<UserCredential> {
  const auth = getFirebaseAuth()
  const credential = await createUserWithEmailAndPassword(auth, params.email, params.password)
  await updateProfile(credential.user, { displayName: params.displayName })
  const db = getFirestoreDb()
  await setDoc(
    userProfileDocumentRef(db, credential.user.uid),
    stripUndefinedDeep(defaultUserProfileFields(params.displayName)),
  )
  await writeSampleDatasetForNewCoach(credential.user.uid, credential.user)
  return credential
}

export async function signInCoachWithEmailPassword(
  email: string,
  password: string,
): Promise<UserCredential> {
  const auth = getFirebaseAuth()
  return signInWithEmailAndPassword(auth, email, password)
}

export async function signInCoachWithGoogle(): Promise<UserCredential> {
  const credential = await signInWithGoogleAccount()
  await ensureCoachUserDocumentIfMissing(credential.user)
  return credential
}

export async function signOutCoach(): Promise<void> {
  await signOut(getFirebaseAuth())
}
