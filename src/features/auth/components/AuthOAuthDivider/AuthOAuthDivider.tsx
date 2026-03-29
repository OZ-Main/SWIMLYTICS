import { Separator } from '@/components/ui/separator'

import { authOAuthDividerLabelVariants, authOAuthDividerRowVariants } from './AuthOAuthDivider.styles'

export function AuthOAuthDivider() {
  return (
    <div
      className={authOAuthDividerRowVariants()}
      role="separator"
      aria-label="Or continue with email"
    >
      <Separator className="min-w-0 flex-1" />
      <span className={authOAuthDividerLabelVariants()}>Or</span>
      <Separator className="min-w-0 flex-1" />
    </div>
  )
}
