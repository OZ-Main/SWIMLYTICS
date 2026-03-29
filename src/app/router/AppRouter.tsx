import { Navigate, Route, Routes } from 'react-router-dom'

import { GuestOnly } from '@/components/auth/GuestOnly'
import { RequireAuth } from '@/components/auth/RequireAuth'
import AppShell from '@/components/layout/AppShell'
import AthleteDetailPage from '@/pages/AthleteDetailPage'
import AthleteEditPage from '@/pages/AthleteEditPage'
import AthleteNewPage from '@/pages/AthleteNewPage'
import AthletesListPage from '@/pages/AthletesListPage'
import DashboardPage from '@/pages/DashboardPage'
import PersonalBestsPage from '@/pages/PersonalBestsPage'
import SessionDetailPage from '@/pages/SessionDetailPage'
import SessionEditPage from '@/pages/SessionEditPage'
import SessionNewPage from '@/pages/SessionNewPage'
import SettingsPage from '@/pages/SettingsPage'
import SignInPage from '@/pages/SignInPage'
import SignUpPage from '@/pages/SignUpPage'
import StatisticsPage from '@/pages/StatisticsPage'
import { APP_ROUTE, ROUTE_SEGMENT } from '@/shared/constants/routes.constants'

export default function AppRouter() {
  return (
    <Routes>
      <Route
        path={APP_ROUTE.login}
        element={
          <GuestOnly>
            <SignInPage />
          </GuestOnly>
        }
      />
      <Route
        path={APP_ROUTE.signUp}
        element={
          <GuestOnly>
            <SignUpPage />
          </GuestOnly>
        }
      />
      <Route element={<RequireAuth />}>
        <Route element={<AppShell />}>
          <Route index element={<DashboardPage />} />
          <Route path={ROUTE_SEGMENT.athletes} element={<AthletesListPage />} />
          <Route path={`${ROUTE_SEGMENT.athletes}/${ROUTE_SEGMENT.new}`} element={<AthleteNewPage />} />
          <Route
            path={`${ROUTE_SEGMENT.athletes}/${ROUTE_SEGMENT.athleteIdParam}`}
            element={<AthleteDetailPage />}
          />
          <Route
            path={`${ROUTE_SEGMENT.athletes}/${ROUTE_SEGMENT.athleteIdParam}/${ROUTE_SEGMENT.edit}`}
            element={<AthleteEditPage />}
          />
          <Route
            path={`${ROUTE_SEGMENT.athletes}/${ROUTE_SEGMENT.athleteIdParam}/${ROUTE_SEGMENT.sessions}/${ROUTE_SEGMENT.new}`}
            element={<SessionNewPage />}
          />
          <Route
            path={`${ROUTE_SEGMENT.athletes}/${ROUTE_SEGMENT.athleteIdParam}/${ROUTE_SEGMENT.sessions}/${ROUTE_SEGMENT.sessionIdParam}`}
            element={<SessionDetailPage />}
          />
          <Route
            path={`${ROUTE_SEGMENT.athletes}/${ROUTE_SEGMENT.athleteIdParam}/${ROUTE_SEGMENT.sessions}/${ROUTE_SEGMENT.sessionIdParam}/${ROUTE_SEGMENT.edit}`}
            element={<SessionEditPage />}
          />
          <Route
            path={`${ROUTE_SEGMENT.athletes}/${ROUTE_SEGMENT.athleteIdParam}/${ROUTE_SEGMENT.personalBests}`}
            element={<PersonalBestsPage />}
          />
          <Route path={ROUTE_SEGMENT.statistics} element={<StatisticsPage />} />
          <Route path={ROUTE_SEGMENT.settings} element={<SettingsPage />} />
          <Route path={ROUTE_SEGMENT.wildcard} element={<Navigate to={APP_ROUTE.home} replace />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to={APP_ROUTE.home} replace />} />
    </Routes>
  )
}
