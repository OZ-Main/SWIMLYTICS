import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import {
  DOCUMENT_TITLE_SUFFIX,
  documentTitleForPathname,
} from '@/shared/constants/documentTitle.constants'

export function DocumentTitleSync() {
  const { pathname } = useLocation()

  useEffect(() => {
    const title = documentTitleForPathname(pathname)
    document.title = `${title}${DOCUMENT_TITLE_SUFFIX}`
  }, [pathname])

  return null
}
