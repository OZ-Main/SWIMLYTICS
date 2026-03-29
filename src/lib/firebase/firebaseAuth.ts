import { getAuth, type Auth } from 'firebase/auth'

import { getFirebaseApp } from '@/lib/firebase/firebaseApp'

let auth: Auth | null = null

export function getFirebaseAuth(): Auth {
  if (!auth) {
    auth = getAuth(getFirebaseApp())
  }

  return auth
}
