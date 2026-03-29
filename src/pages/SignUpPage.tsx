import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
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
import { signUpFormSchema, type SignUpFormValues } from '@/features/auth/authForms.validation'
import { useCoachGoogleSignIn } from '@/features/auth/hooks/useCoachGoogleSignIn'
import { signUpCoachWithEmailPassword } from '@/lib/firebase/authService'
import { coachAuthErrorMessage } from '@/lib/firebase/firebaseAuthErrorMessage.helpers'
import { APP_ROUTE } from '@/shared/constants/routes.constants'

export default function SignUpPage() {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const { googleSignInPending, beginGoogleSignIn } = useCoachGoogleSignIn({
    successMessage: 'Signed in with Google',
  })
  const authBusy = submitting || googleSignInPending

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      displayName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  async function onSubmit(values: SignUpFormValues) {
    setSubmitting(true)
    try {
      await signUpCoachWithEmailPassword({
        email: values.email,
        password: values.password,
        displayName: values.displayName,
      })
      toast.success('Account ready — sample athletes and sessions were added.')
      navigate(APP_ROUTE.home, { replace: true })
    } catch (error: unknown) {
      toast.error(coachAuthErrorMessage(error))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-page-padding-x py-section">
      <Card className="w-full max-w-md overflow-hidden shadow-card">
        <CardHeader className="page-section-header">
          <CardTitle className="page-section-title">Create coach account</CardTitle>
          <CardDescription className="text-caption">
            Your data is stored in your Firebase project. Only you can access athletes and sessions
            tied to this account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-stack pt-card">
          <GoogleSignInButton disabled={authBusy} onPress={beginGoogleSignIn} />
          <AuthOAuthDivider />
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-stack">
              <FormField
                control={form.control}
                name="displayName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display name</FormLabel>
                    <FormControl>
                      <Input autoComplete="name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" autoComplete="new-password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm password</FormLabel>
                    <FormControl>
                      <Input type="password" autoComplete="new-password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={authBusy}>
                {submitting ? 'Creating account…' : 'Sign up'}
              </Button>
            </form>
          </Form>
          <p className="mt-stack text-center text-body-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to={APP_ROUTE.login} className="font-medium text-primary underline-offset-4 hover:underline">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
