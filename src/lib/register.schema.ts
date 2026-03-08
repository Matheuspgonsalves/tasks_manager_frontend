import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  email: z.string().email('Invalid email format.'),
  password: z.string().min(1, 'Password is required.'),
})

export type RegisterFormValues = z.infer<typeof registerSchema>

export type RegisterFormErrors = Partial<Record<keyof RegisterFormValues, string>>
