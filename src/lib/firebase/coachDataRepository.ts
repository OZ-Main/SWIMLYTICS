import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
  writeBatch,
  type CollectionReference,
  type DocumentData,
  type Firestore,
} from 'firebase/firestore'

import { getFirestoreDb } from '@/lib/firebase/firestoreDb'
import {
  FIRESTORE_ATHLETES_SUBCOLLECTION,
  FIRESTORE_PERSONAL_BESTS_SUBCOLLECTION,
  FIRESTORE_SESSIONS_SUBCOLLECTION,
  FIRESTORE_USERS_COLLECTION,
} from '@/lib/firebase/firestorePaths'
import { stripUndefinedDeep } from '@/lib/firebase/stripUndefinedDeep'
import { userProfileDocumentRef } from '@/lib/firebase/userProfileRepository'
import type { Athlete, PersonalBest, TrainingSession } from '@/shared/types/domain.types'
import type { Coach } from '@/shared/types/domain.types'

const FIRESTORE_BATCH_LIMIT = 450

function athletesCollection(db: Firestore, uid: string) {
  return collection(db, FIRESTORE_USERS_COLLECTION, uid, FIRESTORE_ATHLETES_SUBCOLLECTION)
}

function sessionsCollection(db: Firestore, uid: string) {
  return collection(db, FIRESTORE_USERS_COLLECTION, uid, FIRESTORE_SESSIONS_SUBCOLLECTION)
}

function personalBestsCollection(db: Firestore, uid: string) {
  return collection(db, FIRESTORE_USERS_COLLECTION, uid, FIRESTORE_PERSONAL_BESTS_SUBCOLLECTION)
}

export async function writeAthleteDocument(uid: string, athlete: Athlete): Promise<void> {
  const db = getFirestoreDb()
  await setDoc(
    doc(athletesCollection(db, uid), athlete.id),
    stripUndefinedDeep(athlete) as DocumentData,
  )
}

export async function deleteAthleteDocument(uid: string, athleteId: string): Promise<void> {
  const db = getFirestoreDb()
  await deleteDoc(doc(athletesCollection(db, uid), athleteId))
}

export async function writeTrainingSessionDocument(
  uid: string,
  session: TrainingSession,
): Promise<void> {
  const db = getFirestoreDb()
  await setDoc(
    doc(sessionsCollection(db, uid), session.id),
    stripUndefinedDeep(session) as DocumentData,
  )
}

export async function deleteTrainingSessionDocument(uid: string, sessionId: string): Promise<void> {
  const db = getFirestoreDb()
  await deleteDoc(doc(sessionsCollection(db, uid), sessionId))
}

export async function writePersonalBestDocument(
  uid: string,
  personalBest: PersonalBest,
): Promise<void> {
  const db = getFirestoreDb()
  await setDoc(
    doc(personalBestsCollection(db, uid), personalBest.id),
    stripUndefinedDeep(personalBest) as DocumentData,
  )
}

export async function deletePersonalBestDocument(uid: string, personalBestId: string): Promise<void> {
  const db = getFirestoreDb()
  await deleteDoc(doc(personalBestsCollection(db, uid), personalBestId))
}

async function deleteEntireCollection(
  db: Firestore,
  collectionRef: CollectionReference,
): Promise<void> {
  const snapshot = await getDocs(collectionRef)
  let batch = writeBatch(db)
  let count = 0
  for (const docSnap of snapshot.docs) {
    batch.delete(docSnap.ref)
    count++
    if (count >= FIRESTORE_BATCH_LIMIT) {
      await batch.commit()
      batch = writeBatch(db)
      count = 0
    }
  }
  if (count > 0) {
    await batch.commit()
  }
}

export async function clearAllSubcollections(uid: string): Promise<void> {
  const db = getFirestoreDb()
  await deleteEntireCollection(db, athletesCollection(db, uid))
  await deleteEntireCollection(db, sessionsCollection(db, uid))
  await deleteEntireCollection(db, personalBestsCollection(db, uid))
}

export async function replaceCoachProfileCoachFields(uid: string, coach: Coach): Promise<void> {
  const db = getFirestoreDb()
  await setDoc(
    userProfileDocumentRef(db, uid),
    stripUndefinedDeep({
      displayName: coach.displayName,
      createdAt: coach.createdAt,
    }) as DocumentData,
    { merge: true },
  )
}

export type CoachBundleForImport = {
  coach: Coach
  athletes: Athlete[]
  trainingSessions: TrainingSession[]
  personalBests: PersonalBest[]
}

export async function replaceAllCoachDataDocuments(
  uid: string,
  bundle: CoachBundleForImport,
): Promise<void> {
  const db = getFirestoreDb()
  await clearAllSubcollections(uid)
  await replaceCoachProfileCoachFields(uid, bundle.coach)

  let batch = writeBatch(db)
  let count = 0

  async function enqueueSet(
    collectionRef: ReturnType<typeof athletesCollection>,
    documentId: string,
    payload: DocumentData,
  ) {
    batch.set(doc(collectionRef, documentId), payload)
    count++
    if (count >= FIRESTORE_BATCH_LIMIT) {
      await batch.commit()
      batch = writeBatch(db)
      count = 0
    }
  }

  for (const athlete of bundle.athletes) {
    await enqueueSet(
      athletesCollection(db, uid),
      athlete.id,
      stripUndefinedDeep(athlete) as DocumentData,
    )
  }
  for (const session of bundle.trainingSessions) {
    await enqueueSet(
      sessionsCollection(db, uid),
      session.id,
      stripUndefinedDeep(session) as DocumentData,
    )
  }
  for (const personalBest of bundle.personalBests) {
    await enqueueSet(
      personalBestsCollection(db, uid),
      personalBest.id,
      stripUndefinedDeep(personalBest) as DocumentData,
    )
  }
  if (count > 0) {
    await batch.commit()
  }
}
