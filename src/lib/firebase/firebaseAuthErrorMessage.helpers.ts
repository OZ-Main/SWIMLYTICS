import { FirebaseError } from 'firebase/app'

export function coachAuthErrorMessage(error: unknown): string {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case 'auth/popup-closed-by-user':
      case 'auth/cancelled-popup-request':
        return 'Sign-in was cancelled.'
      case 'auth/popup-blocked':
        return 'Your browser blocked the sign-in window. Allow popups for this site.'
      case 'auth/account-exists-with-different-credential':
        return 'An account already exists with this email using a different sign-in method.'
      case 'auth/network-request-failed':
        return 'Network error. Check your connection and try again.'
      case 'auth/invalid-email':
        return 'That email address is not valid.'
      case 'auth/user-disabled':
        return 'This account has been disabled.'
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Email or password is incorrect.'
      case 'auth/email-already-in-use':
        return 'An account with this email already exists.'
      case 'auth/weak-password':
        return 'Password is too weak. Use at least 8 characters.'
      case 'auth/too-many-requests':
        return 'Too many attempts. Wait a moment and try again.'
      default:
        return 'Something went wrong. Please try again.'
    }
  }
  return 'Something went wrong. Please try again.'
}
