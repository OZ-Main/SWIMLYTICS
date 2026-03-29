import { Navigate, Outlet } from 'react-router-dom'

import { useAuthStore } from '@/app/store/authStore'
import { useCoachStore } from '@/app/store/coachStore'
import { APP_ROUTE } from '@/shared/constants/routes.constants'

export function RequireAuth() {
  const user = useAuthStore((authStore) => authStore.user)
  const profileReady = useCoachStore((coachStore) => coachStore.profileReady)

  if (!user) {
    return <Navigate to={APP_ROUTE.login} replace />
  }

  if (!profileReady) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-stack bg-background px-page-padding-x">
        <div className="h-10 w-10 animate-pulse rounded-full bg-muted" aria-hidden />
        <p className="text-body text-muted-foreground" role="status">
          Syncing your workspace…
        </p>
      </div>
    )
  }

  return <Outlet />
}
