import type { User } from 'firebase/auth'
import { collection, onSnapshot, setDoc, type Unsubscribe } from 'firebase/firestore'

import { useAthleteStore } from '@/app/store/athleteStore'
import { useCoachStore } from '@/app/store/coachStore'
import { usePersonalBestsStore } from '@/app/store/personalBestsStore'
import { useSettingsStore } from '@/app/store/settingsStore'
import { useTrainingSessionStore } from '@/app/store/trainingSessionStore'
import { useWorkoutTemplateStore } from '@/app/store/workoutTemplateStore'
import { getFirestoreDb } from '@/lib/firebase/firestoreDb'
import {
  FIRESTORE_ATHLETES_SUBCOLLECTION,
  FIRESTORE_PERSONAL_BESTS_SUBCOLLECTION,
  FIRESTORE_SESSIONS_SUBCOLLECTION,
  FIRESTORE_USERS_COLLECTION,
  FIRESTORE_WORKOUT_TEMPLATES_SUBCOLLECTION,
} from '@/lib/firebase/firestorePaths'
import { stripUndefinedDeep } from '@/lib/firebase/stripUndefinedDeep'
import {
  coachDisplayNameFromFirebaseUser,
  defaultUserProfileFields,
  parseUserProfileSnapshot,
  userProfileDocumentRef,
} from '@/lib/firebase/userProfileRepository'
import type { Athlete, PersonalBest, TrainingSession, WorkoutTemplate } from '@/shared/types/domain.types'

function mapAthleteDocument(documentId: string, raw: Record<string, unknown>): Athlete {
  const parsed = { ...raw, id: documentId } as Athlete
  const groupRaw = raw.group
  if (typeof groupRaw === 'string') {
    return { ...parsed, group: groupRaw }
  }

  return { ...parsed, group: '' }
}

function mapWorkoutTemplateDocument(
  documentId: string,
  raw: Record<string, unknown>,
): WorkoutTemplate {
  return { ...raw, id: documentId } as WorkoutTemplate
}

function mapSessionDocument(documentId: string, raw: Record<string, unknown>): TrainingSession {
  return { ...raw, id: documentId } as TrainingSession
}

function mapPersonalBestDocument(documentId: string, raw: Record<string, unknown>): PersonalBest {
  return { ...raw, id: documentId } as PersonalBest
}

export function subscribeCoachFirestore(firebaseUser: User): Unsubscribe {
  const db = getFirestoreDb()
  const uid = firebaseUser.uid
  const unsubs: Unsubscribe[] = []

  const profileRef = userProfileDocumentRef(db, uid)
  unsubs.push(
    onSnapshot(profileRef, async (snapshot) => {
      if (!snapshot.exists()) {
        await setDoc(
          profileRef,
          stripUndefinedDeep(
            defaultUserProfileFields(
              coachDisplayNameFromFirebaseUser(firebaseUser),
              firebaseUser.email,
            ),
          ),
        )
        return
      }

      const parsed = parseUserProfileSnapshot(uid, snapshot.data() as Record<string, unknown>)
      useCoachStore.getState().replaceCoach(parsed.coach)
      const settingsState = useSettingsStore.getState()
      if (settingsState.theme !== parsed.theme) {
        settingsState.setTheme(parsed.theme)
      }

      if (settingsState.initialSampleApplied !== parsed.initialSampleApplied) {
        settingsState.setInitialSampleApplied(parsed.initialSampleApplied)
      }

      if (settingsState.language !== parsed.language) {
        settingsState.setLanguage(parsed.language)
      }

      useCoachStore.getState().setProfileReady(true)
    }),
  )

  unsubs.push(
    onSnapshot(collection(db, FIRESTORE_USERS_COLLECTION, uid, FIRESTORE_ATHLETES_SUBCOLLECTION), (snap) => {
      const athletes = snap.docs.map((documentSnapshot) =>
        mapAthleteDocument(documentSnapshot.id, documentSnapshot.data() as Record<string, unknown>),
      )
      useAthleteStore.getState().replaceAllAthletes(athletes)
    }),
  )

  unsubs.push(
    onSnapshot(collection(db, FIRESTORE_USERS_COLLECTION, uid, FIRESTORE_SESSIONS_SUBCOLLECTION), (snap) => {
      const trainingSessions = snap.docs.map((documentSnapshot) =>
        mapSessionDocument(documentSnapshot.id, documentSnapshot.data() as Record<string, unknown>),
      )
      useTrainingSessionStore.getState().replaceAllTrainingSessions(trainingSessions)
    }),
  )

  unsubs.push(
    onSnapshot(
      collection(db, FIRESTORE_USERS_COLLECTION, uid, FIRESTORE_PERSONAL_BESTS_SUBCOLLECTION),
      (snap) => {
        const personalBests = snap.docs.map((documentSnapshot) =>
          mapPersonalBestDocument(documentSnapshot.id, documentSnapshot.data() as Record<string, unknown>),
        )
        usePersonalBestsStore.getState().replaceAllPersonalBests(personalBests)
      },
    ),
  )

  unsubs.push(
    onSnapshot(
      collection(db, FIRESTORE_USERS_COLLECTION, uid, FIRESTORE_WORKOUT_TEMPLATES_SUBCOLLECTION),
      (snap) => {
        const workoutTemplates = snap.docs.map((documentSnapshot) =>
          mapWorkoutTemplateDocument(documentSnapshot.id, documentSnapshot.data() as Record<string, unknown>),
        )
        useWorkoutTemplateStore.getState().replaceAllWorkoutTemplates(workoutTemplates)
      },
    ),
  )

  return () => {
    for (const unsub of unsubs) {
      unsub()
    }
  }
}
