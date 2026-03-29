import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'

import { useAuthStore } from '@/app/store/authStore'
import { APP_ROUTE } from '@/shared/constants/routes.constants'

type GuestOnlyProps = {
  children: ReactNode
}

export function GuestOnly({ children }: GuestOnlyProps) {
  const user = useAuthStore((authStore) => authStore.user)

  if (user) {
    return <Navigate to={APP_ROUTE.home} replace />
  }

  return <>{children}</>
}
