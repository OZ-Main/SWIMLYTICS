import { forwardRef } from 'react'
import type { ComponentPropsWithoutRef, ElementRef, HTMLAttributes } from 'react'
import * as SheetPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'

import { cn } from '@/shared/utils/cn'

import {
  sheetCloseVariants,
  sheetContentVariants,
  sheetDescriptionVariants,
  sheetHeaderVariants,
  sheetOverlayVariants,
  sheetTitleVariants,
} from './sheet.styles'

const Sheet = SheetPrimitive.Root

const SheetTrigger = SheetPrimitive.Trigger

const SheetClose = SheetPrimitive.Close

const SheetPortal = SheetPrimitive.Portal

const SheetOverlay = forwardRef<
  ElementRef<typeof SheetPrimitive.Overlay>,
  ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay ref={ref} className={cn(sheetOverlayVariants(), className)} {...props} />
))
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName

const SheetContent = forwardRef<
  ElementRef<typeof SheetPrimitive.Content>,
  ComponentPropsWithoutRef<typeof SheetPrimitive.Content>
>(({ className, children, onCloseAutoFocus, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <SheetPrimitive.Content
      ref={ref}
      className={cn(sheetContentVariants(), className)}
      onCloseAutoFocus={(focusEvent) => {
        onCloseAutoFocus?.(focusEvent)
        if (!focusEvent.defaultPrevented) {
          focusEvent.preventDefault()
        }
      }}
      {...props}
    >
      {children}
    </SheetPrimitive.Content>
  </SheetPortal>
))
SheetContent.displayName = 'SheetContent'

const SheetCloseButton = forwardRef<
  ElementRef<typeof SheetPrimitive.Close>,
  ComponentPropsWithoutRef<typeof SheetPrimitive.Close> & { label?: string }
>(({ className, children, label = 'Close', ...props }, ref) => (
  <SheetPrimitive.Close
    ref={ref}
    className={cn(sheetCloseVariants(), className)}
    aria-label={label}
    {...props}
  >
    {children ?? <X className="h-5 w-5" aria-hidden />}
  </SheetPrimitive.Close>
))
SheetCloseButton.displayName = 'SheetCloseButton'

const SheetHeader = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn(sheetHeaderVariants(), className)} {...props} />
)
SheetHeader.displayName = 'SheetHeader'

const SheetTitle = forwardRef<
  ElementRef<typeof SheetPrimitive.Title>,
  ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title ref={ref} className={cn(sheetTitleVariants(), className)} {...props} />
))
SheetTitle.displayName = SheetPrimitive.Title.displayName

const SheetDescription = forwardRef<
  ElementRef<typeof SheetPrimitive.Description>,
  ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    className={cn(sheetDescriptionVariants(), className)}
    {...props}
  />
))
SheetDescription.displayName = SheetPrimitive.Description.displayName

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetCloseButton,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
}
