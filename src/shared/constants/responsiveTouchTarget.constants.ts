/**
 * Shared responsive action layouts: full-width, ≥44px touch height on narrow
 * viewports; inline sizing from `sm` (Tailwind) upward.
 */

/** For `Button` with `size="sm"` (or `asChild` links using sm height). */
export const RESPONSIVE_SM_BUTTON_STRETCH_CLASS =
  'min-h-10 w-full touch-manipulation sm:h-9 sm:min-h-0 sm:w-auto' as const

/** For default-sized `Button` (h-10 at `sm+`). */
export const RESPONSIVE_DEFAULT_BUTTON_STRETCH_CLASS =
  'min-h-10 w-full touch-manipulation sm:min-h-10 sm:min-h-0 sm:w-auto' as const
