import type { ComponentProps } from 'react'
import { Toaster as Sonner } from 'sonner'

import { useTheme } from '@/app/theme/useTheme'
import { ResolvedTheme } from '@/shared/domain'

type ToasterProps = ComponentProps<typeof Sonner>

function Toaster({ ...props }: ToasterProps) {
  const { resolvedTheme } = useTheme()

  return (
    <Sonner
      theme={resolvedTheme === ResolvedTheme.Dark ? 'dark' : 'light'}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast transition-[transform,opacity,box-shadow] duration-motion-normal ease-motion-out group-[.toaster]:bg-card group-[.toaster]:text-card-foreground group-[.toaster]:border-border group-[.toaster]:shadow-overlay',
          description: 'group-[.toast]:text-muted-foreground',
          actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          cancelButton: 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
