import { cva } from 'class-variance-authority'

export const dropdownMenuSubTriggerVariants = cva(
  'flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-body outline-none transition-colors duration-motion-fast ease-motion-out focus:bg-muted data-[state=open]:bg-muted [&_svg]:size-4 [&_svg]:shrink-0',
)

export const dropdownMenuSubContentVariants = cva(
  'z-50 min-w-[8rem] overflow-hidden rounded-card border border-border bg-popover p-1 text-popover-foreground shadow-overlay data-[state=closed]:duration-motion-normal data-[state=open]:duration-motion-normal data-[state=closed]:ease-motion-out data-[state=open]:ease-motion-emphasized data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
)

export const dropdownMenuContentVariants = cva(
  'z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-card border border-border bg-popover p-1 text-popover-foreground shadow-overlay data-[state=closed]:duration-motion-normal data-[state=open]:duration-motion-normal data-[state=closed]:ease-motion-out data-[state=open]:ease-motion-emphasized data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
)

export const dropdownMenuItemVariants = cva(
  'relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-body outline-none transition-colors duration-motion-fast ease-motion-out focus:bg-muted focus:text-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0',
)

export const dropdownMenuCheckboxItemVariants = cva(
  'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-body outline-none transition-colors duration-motion-fast ease-motion-out focus:bg-muted focus:text-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
)

export const dropdownMenuRadioItemVariants = cva(
  'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-body outline-none transition-colors duration-motion-fast ease-motion-out focus:bg-muted focus:text-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
)

export const dropdownMenuLabelVariants = cva('px-2 py-1.5 text-label font-semibold')

export const dropdownMenuSeparatorVariants = cva('-mx-1 my-1 h-px bg-border')

export const dropdownMenuShortcutVariants = cva('ml-auto text-caption tracking-widest opacity-60')
