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
  FIRESTORE_WORKOUT_TEMPLATES_SUBCOLLECTION,
} from '@/lib/firebase/firestorePaths'
import { prepareFirestoreDocumentData } from '@/lib/firebase/prepareFirestoreDocumentData'
import { userProfileDocumentRef } from '@/lib/firebase/userProfileRepository'
import type { Athlete, PersonalBest, TrainingSession, WorkoutTemplate } from '@/shared/types/domain.types'
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

function workoutTemplatesCollection(db: Firestore, uid: string) {
  return collection(db, FIRESTORE_USERS_COLLECTION, uid, FIRESTORE_WORKOUT_TEMPLATES_SUBCOLLECTION)
}

export async function writeAthleteDocument(uid: string, athlete: Athlete): Promise<void> {
  const db = getFirestoreDb()
  await setDoc(
    doc(athletesCollection(db, uid), athlete.id),
    prepareFirestoreDocumentData(athlete),
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
    prepareFirestoreDocumentData(session),
  )
}

export async function bulkWriteTrainingSessionDocuments(
  uid: string,
  sessions: TrainingSession[],
): Promise<void> {
  if (sessions.length === 0) {
    return
  }

  const db = getFirestoreDb()
  let batch = writeBatch(db)
  let operationCount = 0
  for (const session of sessions) {
    batch.set(
      doc(sessionsCollection(db, uid), session.id),
      prepareFirestoreDocumentData(session),
    )
    operationCount++
    if (operationCount >= FIRESTORE_BATCH_LIMIT) {
      await batch.commit()
      batch = writeBatch(db)
      operationCount = 0
    }
  }

  if (operationCount > 0) {
    await batch.commit()
  }
}

export async function writeWorkoutTemplateDocument(
  uid: string,
  template: WorkoutTemplate,
): Promise<void> {
  const db = getFirestoreDb()
  await setDoc(
    doc(workoutTemplatesCollection(db, uid), template.id),
    prepareFirestoreDocumentData(template),
  )
}

export async function deleteWorkoutTemplateDocument(uid: string, templateId: string): Promise<void> {
  const db = getFirestoreDb()
  await deleteDoc(doc(workoutTemplatesCollection(db, uid), templateId))
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
    prepareFirestoreDocumentData(personalBest),
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
  await deleteEntireCollection(db, workoutTemplatesCollection(db, uid))
}

export async function replaceCoachProfileCoachFields(uid: string, coach: Coach): Promise<void> {
  const db = getFirestoreDb()
  await setDoc(
    userProfileDocumentRef(db, uid),
    prepareFirestoreDocumentData({
      displayName: coach.displayName,
      createdAt: coach.createdAt,
    }),
    { merge: true },
  )
}

export type CoachBundleForImport = {
  coach: Coach
  athletes: Athlete[]
  trainingSessions: TrainingSession[]
  personalBests: PersonalBest[]
  workoutTemplates: WorkoutTemplate[]
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
      prepareFirestoreDocumentData(athlete),
    )
  }

  for (const session of bundle.trainingSessions) {
    await enqueueSet(
      sessionsCollection(db, uid),
      session.id,
      prepareFirestoreDocumentData(session),
    )
  }

  for (const personalBest of bundle.personalBests) {
    await enqueueSet(
      personalBestsCollection(db, uid),
      personalBest.id,
      prepareFirestoreDocumentData(personalBest),
    )
  }

  for (const workoutTemplate of bundle.workoutTemplates) {
    await enqueueSet(
      workoutTemplatesCollection(db, uid),
      workoutTemplate.id,
      prepareFirestoreDocumentData(workoutTemplate),
    )
  }

  if (count > 0) {
    await batch.commit()
  }
}
