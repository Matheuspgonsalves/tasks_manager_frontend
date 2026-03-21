import { z } from 'zod'

export const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?=.{8,}$).+$/

export const registerSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  email: z.string().email('Invalid email format.'),
  password: z
    .string()
    .min(1, 'Password is required.')
    .regex(
      strongPasswordRegex,
      'Password must be at least 8 characters long and include uppercase, lowercase, and special characters.',
    ),
})

export type RegisterFormValues = z.infer<typeof registerSchema>

export type RegisterFormErrors = Partial<Record<keyof RegisterFormValues, string>>
