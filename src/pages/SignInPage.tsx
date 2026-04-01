import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { AuthOAuthDivider } from '@/features/auth/components/AuthOAuthDivider/AuthOAuthDivider'
import { GoogleSignInButton } from '@/features/auth/components/GoogleSignInButton/GoogleSignInButton'
import { signInFormSchema, type SignInFormValues } from '@/features/auth/authForms.validation'
import { useCoachGoogleSignIn } from '@/features/auth/hooks/useCoachGoogleSignIn'
import { signInCoachWithEmailPassword } from '@/lib/firebase/authService'
import { coachAuthErrorMessage } from '@/lib/firebase/firebaseAuthErrorMessage.helpers'
import { APP_ROUTE } from '@/shared/constants/routes.constants'

export default function SignInPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const { googleSignInPending, beginGoogleSignIn } = useCoachGoogleSignIn({
    successMessage: t('auth.signedIn'),
  })
  const authBusy = submitting || googleSignInPending

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: { email: '', password: '' },
  })

  async function onSubmit(values: SignInFormValues) {
    setSubmitting(true)
    try {
      await signInCoachWithEmailPassword(values.email, values.password)
      toast.success(t('auth.signedIn'))
      navigate(APP_ROUTE.home, { replace: true })
    } catch (error: unknown) {
      toast.error(coachAuthErrorMessage(error))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="px-page-padding-x mx-4 flex min-h-screen flex-col items-center justify-center bg-background py-section">
      <Card className="w-full max-w-md overflow-hidden shadow-card">
        <CardHeader className="page-section-header">
          <CardTitle className="page-section-title">{t('auth.signIn')}</CardTitle>
          <CardDescription className="text-caption">{t('auth.signInDescription')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-stack pt-card">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-stack">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('auth.email')}</FormLabel>
                    <FormControl>
                      <Input type="email" autoComplete="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('auth.password')}</FormLabel>
                    <FormControl>
                      <Input type="password" autoComplete="current-password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={authBusy}>
                {submitting ? t('auth.signingIn') : t('auth.signIn')}
              </Button>
            </form>
          </Form>
          <AuthOAuthDivider />
          <GoogleSignInButton disabled={authBusy} onPress={beginGoogleSignIn} />

          <p className="mt-stack text-center text-body-sm text-muted-foreground">
            {t('auth.noAccount')}{' '}
            <Link
              to={APP_ROUTE.signUp}
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              {t('auth.createOne')}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
