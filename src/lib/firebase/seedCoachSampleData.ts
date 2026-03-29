import { doc, updateDoc, writeBatch, type DocumentData } from 'firebase/firestore'
import type { User } from 'firebase/auth'

import { getFirestoreDb } from '@/lib/firebase/firestoreDb'
import {
  FIRESTORE_ATHLETES_SUBCOLLECTION,
  FIRESTORE_PERSONAL_BESTS_SUBCOLLECTION,
  FIRESTORE_SESSIONS_SUBCOLLECTION,
  FIRESTORE_USERS_COLLECTION,
  FIRESTORE_WORKOUT_TEMPLATES_SUBCOLLECTION,
} from '@/lib/firebase/firestorePaths'
import { stripUndefinedDeep } from '@/lib/firebase/stripUndefinedDeep'
import { userProfileDocumentRef } from '@/lib/firebase/userProfileRepository'
import {
  SEED_ATHLETES,
  SEED_PERSONAL_BESTS,
  SEED_TRAINING_SESSIONS,
  SEED_WORKOUT_TEMPLATES,
} from '@/shared/constants/seedData'

const FIRESTORE_BATCH_LIMIT = 450

export async function writeSampleDatasetForNewCoach(uid: string, _firebaseUser: User): Promise<void> {
  const db = getFirestoreDb()

  let batch = writeBatch(db)
  let count = 0

  async function enqueueSet(collectionId: string, documentId: string, data: DocumentData) {
    const ref = doc(db, FIRESTORE_USERS_COLLECTION, uid, collectionId, documentId)
    batch.set(ref, data)
    count++
    if (count >= FIRESTORE_BATCH_LIMIT) {
      await batch.commit()
      batch = writeBatch(db)
      count = 0
    }
  }

  for (const athlete of SEED_ATHLETES) {
    await enqueueSet(
      FIRESTORE_ATHLETES_SUBCOLLECTION,
      athlete.id,
      stripUndefinedDeep(athlete) as DocumentData,
    )
  }

  for (const session of SEED_TRAINING_SESSIONS) {
    await enqueueSet(
      FIRESTORE_SESSIONS_SUBCOLLECTION,
      session.id,
      stripUndefinedDeep(session) as DocumentData,
    )
  }

  for (const personalBest of SEED_PERSONAL_BESTS) {
    await enqueueSet(
      FIRESTORE_PERSONAL_BESTS_SUBCOLLECTION,
      personalBest.id,
      stripUndefinedDeep(personalBest) as DocumentData,
    )
  }

  for (const workoutTemplate of SEED_WORKOUT_TEMPLATES) {
    await enqueueSet(
      FIRESTORE_WORKOUT_TEMPLATES_SUBCOLLECTION,
      workoutTemplate.id,
      stripUndefinedDeep(workoutTemplate) as DocumentData,
    )
  }

  if (count > 0) {
    await batch.commit()
  }

  await updateDoc(userProfileDocumentRef(db, uid), { initialSampleApplied: true })
}
