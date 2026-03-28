import { Navigate, Route, Routes } from 'react-router-dom'

import AppShell from '@/components/layout/AppShell'
import DashboardPage from '@/pages/DashboardPage'
import PersonalBestsPage from '@/pages/PersonalBestsPage'
import SettingsPage from '@/pages/SettingsPage'
import StatisticsPage from '@/pages/StatisticsPage'
import WorkoutDetailPage from '@/pages/WorkoutDetailPage'
import WorkoutEditPage from '@/pages/WorkoutEditPage'
import WorkoutNewPage from '@/pages/WorkoutNewPage'
import WorkoutsPage from '@/pages/WorkoutsPage'
import { APP_ROUTE, ROUTE_SEGMENT } from '@/shared/constants/routes.constants'

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<DashboardPage />} />
        <Route path={ROUTE_SEGMENT.workouts} element={<WorkoutsPage />} />
        <Route
          path={`${ROUTE_SEGMENT.workouts}/${ROUTE_SEGMENT.new}`}
          element={<WorkoutNewPage />}
        />
        <Route
          path={`${ROUTE_SEGMENT.workouts}/${ROUTE_SEGMENT.workoutIdParam}`}
          element={<WorkoutDetailPage />}
        />
        <Route
          path={`${ROUTE_SEGMENT.workouts}/${ROUTE_SEGMENT.workoutIdParam}/edit`}
          element={<WorkoutEditPage />}
        />
        <Route path={ROUTE_SEGMENT.statistics} element={<StatisticsPage />} />
        <Route path={ROUTE_SEGMENT.personalBests} element={<PersonalBestsPage />} />
        <Route path={ROUTE_SEGMENT.settings} element={<SettingsPage />} />
        <Route path={ROUTE_SEGMENT.wildcard} element={<Navigate to={APP_ROUTE.home} replace />} />
      </Route>
    </Routes>
  )
}
