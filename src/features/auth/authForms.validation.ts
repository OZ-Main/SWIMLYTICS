import { z } from 'zod'

export const signInFormSchema = z.object({
  email: z.string().trim().email('Enter a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
})

export type SignInFormValues = z.infer<typeof signInFormSchema>

export const signUpFormSchema = z
  .object({
    displayName: z.string().trim().min(1, 'Display name is required.'),
    email: z.string().trim().email('Enter a valid email address.'),
    password: z.string().min(8, 'Use at least 8 characters.'),
    confirmPassword: z.string().min(1, 'Confirm your password.'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  })

export type SignUpFormValues = z.infer<typeof signUpFormSchema>
