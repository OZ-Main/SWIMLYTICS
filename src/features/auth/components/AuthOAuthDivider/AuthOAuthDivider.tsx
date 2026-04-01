import { useTranslation } from 'react-i18next'

import { Separator } from '@/components/ui/separator'

import { authOAuthDividerLabelVariants, authOAuthDividerRowVariants } from './AuthOAuthDivider.styles'

export function AuthOAuthDivider() {
  const { t } = useTranslation()

  return (
    <div
      className={authOAuthDividerRowVariants()}
      role="separator"
      aria-label={t('auth.orContinueEmail')}
    >
      <Separator className="min-w-0 flex-1" />
      <span className={authOAuthDividerLabelVariants()}>{t('auth.or')}</span>
      <Separator className="min-w-0 flex-1" />
    </div>
  )
}
