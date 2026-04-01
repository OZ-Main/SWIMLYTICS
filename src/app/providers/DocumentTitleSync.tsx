import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'

import { documentTitleForPathname, documentTitleSuffix } from '@/shared/helpers/documentTitle.helpers'

export function DocumentTitleSync() {
  const { pathname } = useLocation()
  const { i18n } = useTranslation()

  useEffect(() => {
    const title = documentTitleForPathname(pathname)
    document.title = `${title}${documentTitleSuffix()}`
  }, [pathname, i18n.language])

  return null
}
