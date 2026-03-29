import { onAuthStateChanged, type User } from 'firebase/auth'
import { create } from 'zustand'

import { getFirebaseAuth } from '@/lib/firebase/auth'
import { signOutCoach } from '@/lib/firebase/authService'

type AuthStoreState = {
  user: User | null
  authReady: boolean
  signOutUser: () => Promise<void>
}

export const useAuthStore = create<AuthStoreState>(() => ({
  user: null,
  authReady: false,
  signOutUser: async () => {
    await signOutCoach()
  },
}))

export function subscribeFirebaseAuthState(): () => void {
  const auth = getFirebaseAuth()
  return onAuthStateChanged(auth, (nextUser) => {
    useAuthStore.setState({ user: nextUser, authReady: true })
  })
}
