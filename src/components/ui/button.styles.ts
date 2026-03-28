import { cva } from 'class-variance-authority'

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-button text-label font-semibold ring-offset-background transition-[transform,background-color,color,box-shadow,border-color,opacity] duration-motion-fast ease-motion-out will-change-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 motion-safe:hover:scale-[1.02] motion-safe:active:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground hover:bg-primary/92 hover:shadow-interactive motion-safe:hover:scale-[1.01]',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/92 motion-safe:hover:scale-[1.01]',
        outline:
          'border border-input bg-background/80 hover:border-primary/25 hover:bg-muted/80 hover:text-foreground',
        secondary:
          'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/70 motion-safe:hover:scale-[1.01]',
        ghost: 'hover:bg-accent/10 hover:text-foreground',
        link: 'text-primary underline-offset-4 hover:text-primary/90 hover:underline motion-safe:hover:scale-100 motion-safe:active:scale-100',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-button px-3',
        lg: 'h-11 rounded-button px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)
