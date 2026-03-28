import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import {
  DOCUMENT_TITLE,
  DOCUMENT_TITLE_BY_STATIC_ROUTE,
  DOCUMENT_TITLE_SUFFIX,
} from '@/shared/constants/documentTitle.constants'
import { APP_ROUTE, ROUTE_SEGMENT } from '@/shared/constants/routes.constants'

export function DocumentTitleSync() {
  const { pathname } = useLocation()

  useEffect(() => {
    if (pathname in DOCUMENT_TITLE_BY_STATIC_ROUTE) {
      const title =
        DOCUMENT_TITLE_BY_STATIC_ROUTE[pathname as keyof typeof DOCUMENT_TITLE_BY_STATIC_ROUTE]
      document.title = `${title}${DOCUMENT_TITLE_SUFFIX}`
      return
    }
    if (pathname.endsWith(`/${ROUTE_SEGMENT.edit}`)) {
      document.title = `${DOCUMENT_TITLE.EDIT_WORKOUT}${DOCUMENT_TITLE_SUFFIX}`
      return
    }
    const workoutsBase = `${APP_ROUTE.workouts}/`
    if (
      pathname.startsWith(workoutsBase) &&
      pathname !== APP_ROUTE.workoutNew &&
      !pathname.endsWith(`/${ROUTE_SEGMENT.edit}`)
    ) {
      document.title = `${DOCUMENT_TITLE.WORKOUT_DETAIL}${DOCUMENT_TITLE_SUFFIX}`
      return
    }
    document.title = DOCUMENT_TITLE.APP
  }, [pathname])

  return null
}
