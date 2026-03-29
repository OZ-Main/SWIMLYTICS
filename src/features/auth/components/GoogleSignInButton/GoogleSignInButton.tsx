import { Button } from '@/components/ui/button'
import { cn } from '@/shared/utils/cn'

import { GoogleBrandIcon } from './GoogleBrandIcon'
import { googleSignInButtonVariants } from './GoogleSignInButton.styles'

type GoogleSignInButtonProps = {
  disabled?: boolean
  onPress: () => void | Promise<void>
}

export function GoogleSignInButton({ disabled, onPress }: GoogleSignInButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      disabled={disabled}
      className={cn(googleSignInButtonVariants())}
      onClick={() => void onPress()}
    >
      <GoogleBrandIcon aria-hidden />
      Continue with Google
    </Button>
  )
}
