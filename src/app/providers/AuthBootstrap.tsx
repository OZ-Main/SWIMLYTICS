import { type ReactNode, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { subscribeFirebaseAuthState, useAuthStore } from '@/app/store/authStore'
import { resetCoachStoresAfterSignOut } from '@/lib/firebase/resetCoachStores'
import { subscribeCoachFirestore } from '@/lib/firebase/subscribeCoachFirestore'

export function AuthBootstrap({ children }: { children: ReactNode }) {
  const { t } = useTranslation()
  const user = useAuthStore((authStore) => authStore.user)
  const authReady = useAuthStore((authStore) => authStore.authReady)

  useEffect(() => subscribeFirebaseAuthState(), [])

  useEffect(() => {
    if (!user) {
      resetCoachStoresAfterSignOut()
      return
    }

    const unsubscribeFirestore = subscribeCoachFirestore(user)

    return () => {
      unsubscribeFirestore()
      resetCoachStoresAfterSignOut()
    }
  }, [user])

  if (!authReady) {
    return (
      <div className="px-page-padding-x flex min-h-screen flex-col items-center justify-center gap-stack bg-background">
        <div className="h-10 w-10 animate-pulse rounded-full bg-muted" aria-hidden />
        <p className="text-body text-muted-foreground" role="status">
          {t('common.loadingApp')}
        </p>
      </div>
    )
  }

  return <>{children}</>
}
