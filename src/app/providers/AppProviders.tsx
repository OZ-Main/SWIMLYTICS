import { type ReactNode } from 'react'
import { BrowserRouter } from 'react-router-dom'

import { LanguageProvider } from '@/app/i18n/LanguageProvider'
import { ThemeProvider } from '@/app/theme/ThemeProvider'
import { Toaster } from '@/components/ui/sonner'

import { AuthBootstrap } from './AuthBootstrap'
import { DocumentTitleSync } from './DocumentTitleSync'

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <BrowserRouter>
      <DocumentTitleSync />
      <ThemeProvider>
        <LanguageProvider>
          <AuthBootstrap>
            {children}
            <Toaster position="top-right" richColors closeButton />
          </AuthBootstrap>
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}
