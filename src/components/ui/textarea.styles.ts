import { cva } from 'class-variance-authority'

export const textareaVariants = cva(
  'flex min-h-form-textarea w-full rounded-input border border-input bg-background px-3 py-2 text-body ring-offset-background transition-[border-color,box-shadow] duration-motion-normal ease-motion-out placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
)
