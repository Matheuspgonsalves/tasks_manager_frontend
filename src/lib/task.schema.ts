import { z } from 'zod'

export const taskSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  description: z.string().min(1, 'Description is required.'),
  status: z.enum(['pending', 'done']),
  categoryId: z.string().optional(),
})

export const taskRegisterSchema = taskSchema.extend({
  userId: z.string().min(1, 'User is required.'),
})

export type TaskFormValues = z.infer<typeof taskSchema>
export type TaskFormErrors = Partial<Record<keyof TaskFormValues, string>>
