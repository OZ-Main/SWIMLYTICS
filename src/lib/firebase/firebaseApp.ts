import { initializeApp, type FirebaseApp } from 'firebase/app'

import { readFirebaseWebConfig } from '@/lib/env/firebaseEnv'

let firebaseApp: FirebaseApp | null = null

export function getFirebaseApp(): FirebaseApp {
  if (!firebaseApp) {
    firebaseApp = initializeApp(readFirebaseWebConfig())
  }

  return firebaseApp
}
