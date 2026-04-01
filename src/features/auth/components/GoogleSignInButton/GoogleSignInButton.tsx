import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { cn } from '@/shared/utils/cn'

import { GoogleBrandIcon } from './GoogleBrandIcon'
import { googleSignInButtonVariants } from './GoogleSignInButton.styles'

type GoogleSignInButtonProps = {
  disabled?: boolean
  onPress: () => void | Promise<void>
}

export function GoogleSignInButton({ disabled, onPress }: GoogleSignInButtonProps) {
  const { t } = useTranslation()

  return (
    <Button
      type="button"
      variant="outline"
      disabled={disabled}
      className={cn(googleSignInButtonVariants())}
      onClick={() => void onPress()}
    >
      <GoogleBrandIcon aria-hidden />
      {t('auth.continueGoogle')}
    </Button>
  )
}
