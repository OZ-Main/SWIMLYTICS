import { type ReactNode } from 'react'
import { BrowserRouter } from 'react-router-dom'

import { ThemeProvider } from '@/app/theme/ThemeProvider'
import { Toaster } from '@/components/ui/sonner'

import { AuthBootstrap } from './AuthBootstrap'
import { DocumentTitleSync } from './DocumentTitleSync'

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <BrowserRouter>
      <DocumentTitleSync />
      <ThemeProvider>
        <AuthBootstrap>
          {children}
          <Toaster position="top-right" richColors closeButton />
        </AuthBootstrap>
      </ThemeProvider>
    </BrowserRouter>
  )
}
