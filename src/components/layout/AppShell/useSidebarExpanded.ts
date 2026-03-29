import { useCallback, useEffect, useState } from 'react'

import { STORAGE_KEYS } from '@/lib/storage/storageKeys'

function readExpanded(): boolean {
  if (typeof window === 'undefined') {
    return true
  }
  return window.localStorage.getItem(STORAGE_KEYS.UI_SIDEBAR_EXPANDED) !== 'false'
}

export function useSidebarExpanded() {
  const [expanded, setExpandedState] = useState(() => readExpanded())

  useEffect(() => {
    function onStorage(event: StorageEvent) {
      if (event.key === STORAGE_KEYS.UI_SIDEBAR_EXPANDED && event.newValue != null) {
        setExpandedState(event.newValue !== 'false')
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const setExpanded = useCallback((next: boolean) => {
    try {
      window.localStorage.setItem(
        STORAGE_KEYS.UI_SIDEBAR_EXPANDED,
        next ? 'true' : 'false',
      )
    } catch {
      /* ignore quota */
    }
    setExpandedState(next)
  }, [])

  const toggle = useCallback(() => {
    setExpandedState((previous) => {
      const next = !previous
      try {
        window.localStorage.setItem(
          STORAGE_KEYS.UI_SIDEBAR_EXPANDED,
          next ? 'true' : 'false',
        )
      } catch {
        /* ignore */
      }
      return next
    })
  }, [])

  return { expanded, setExpanded, toggle }
}
