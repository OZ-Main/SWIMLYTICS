import * as React from 'react'
import { BrowserRouter } from 'react-router-dom'

import { ThemeProvider } from '@/app/theme/ThemeProvider'
import { Toaster } from '@/components/ui/sonner'

import { DocumentTitleSync } from './DocumentTitleSync'
import { HydrationGate } from './HydrationGate'

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <BrowserRouter>
      <DocumentTitleSync />
      <ThemeProvider>
        <HydrationGate>
          {children}
          <Toaster position="top-right" richColors closeButton />
        </HydrationGate>
      </ThemeProvider>
    </BrowserRouter>
  )
}
