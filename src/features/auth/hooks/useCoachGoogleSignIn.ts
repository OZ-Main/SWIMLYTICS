import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { signInCoachWithGoogle } from '@/lib/firebase/authService'
import { coachAuthErrorMessage } from '@/lib/firebase/firebaseAuthErrorMessage.helpers'
import { APP_ROUTE } from '@/shared/constants/routes.constants'

type UseCoachGoogleSignInOptions = {
  successMessage: string
}

export function useCoachGoogleSignIn(options: UseCoachGoogleSignInOptions) {
  const navigate = useNavigate()
  const [googleSignInPending, setGoogleSignInPending] = useState(false)

  const beginGoogleSignIn = useCallback(async () => {
    setGoogleSignInPending(true)
    try {
      await signInCoachWithGoogle()
      toast.success(options.successMessage)
      navigate(APP_ROUTE.home, { replace: true })
    } catch (error: unknown) {
      toast.error(coachAuthErrorMessage(error))
    } finally {
      setGoogleSignInPending(false)
    }
  }, [navigate, options.successMessage])

  return { googleSignInPending, beginGoogleSignIn }
}
