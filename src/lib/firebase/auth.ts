import { GoogleAuthProvider, signInWithPopup, type UserCredential } from 'firebase/auth'

import { getFirebaseAuth } from '@/lib/firebase/firebaseAuth'

const googleAuthProvider = new GoogleAuthProvider()

export { getFirebaseAuth } from '@/lib/firebase/firebaseAuth'

export async function signInWithGoogleAccount(): Promise<UserCredential> {
  return signInWithPopup(getFirebaseAuth(), googleAuthProvider)
}
