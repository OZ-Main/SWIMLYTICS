import { cva } from 'class-variance-authority'

export const formItemVariants = cva('space-y-2')

export const formDescriptionVariants = cva('text-caption text-muted-foreground')

export const formMessageVariants = cva('text-caption font-medium text-destructive')
