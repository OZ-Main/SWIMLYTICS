import { cva } from 'class-variance-authority'

export const selectTriggerVariants = cva(
  'flex h-10 w-full items-center justify-between rounded-input border border-border/80 bg-gradient-to-b from-card to-card-subtle px-3 py-2 text-body shadow-sm ring-offset-background transition-[border-color,box-shadow] duration-motion-normal ease-motion-out placeholder:text-muted-foreground focus:border-primary/35 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
)

export const selectScrollBtnVariants = cva('flex cursor-default items-center justify-center py-1')

const selectContentBase =
  'relative z-50 max-h-[--radix-select-content-available-height] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-card border border-border bg-popover text-popover-foreground shadow-overlay data-[state=closed]:duration-motion-normal data-[state=open]:duration-motion-normal data-[state=closed]:ease-motion-out data-[state=open]:ease-motion-emphasized data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2'

export const selectContentVariants = cva(selectContentBase, {
  variants: {
    position: {
      popper:
        'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
      'item-aligned': '',
    },
  },
  defaultVariants: {
    position: 'popper',
  },
})

export const selectViewportVariants = cva('p-1', {
  variants: {
    position: {
      popper:
        'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]',
      'item-aligned': '',
    },
  },
  defaultVariants: {
    position: 'popper',
  },
})

export const selectLabelVariants = cva('py-1.5 pl-8 pr-2 text-label font-semibold')

export const selectItemVariants = cva(
  'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-body outline-none transition-colors duration-motion-fast ease-motion-out focus:bg-accent/12 focus:text-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
)

export const selectSeparatorVariants = cva('-mx-1 my-1 h-px bg-border')
