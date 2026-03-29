import { getFirestore, type Firestore } from 'firebase/firestore'

import { getFirebaseApp } from '@/lib/firebase/firebaseApp'

let firestore: Firestore | null = null

export function getFirestoreDb(): Firestore {
  if (!firestore) {
    firestore = getFirestore(getFirebaseApp())
  }

  return firestore
}
