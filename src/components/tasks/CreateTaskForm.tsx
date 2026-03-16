import { Box, Button, Field, Input, Stack, Text, Textarea } from '@chakra-ui/react'
import type { TaskFormErrors, TaskFormValues } from '../../lib/task.schema'

type CreateTaskFormProps = {
  values: TaskFormValues
  errors: TaskFormErrors
  isSubmitting: boolean
  status: 'success' | 'error' | null
  message: string
  onFieldChange: (field: keyof TaskFormValues, value: string) => void
  onSubmit: () => Promise<void>
}

export function CreateTaskForm({
  values,
  errors,
  isSubmitting,
  status,
  message,
  onFieldChange,
  onSubmit,
}: CreateTaskFormProps) {
  return (
    <Box bg="var(--surface)" borderRadius="2xl" borderWidth="1px" borderColor="var(--border)" boxShadow="var(--card-shadow)" p={{ base: 4, md: 6 }}>
      <Stack gap={4} as="form" onSubmit={(event) => {
        event.preventDefault()
        void onSubmit()
      }}>
        <Text color="var(--text-secondary)" fontSize={{ base: 'xl', md: '2xl' }} fontWeight="800">Create Task</Text>

        <Field.Root invalid={Boolean(errors.title)}>
          <Field.Label color="var(--muted-text)">Title</Field.Label>
          <Input
            value={values.title}
            onChange={(event) => onFieldChange('title', event.target.value)}
            placeholder="Task title"
            bg="var(--surface)"
            borderColor="var(--border-strong)"
            color="var(--text-secondary)"
          />
          {errors.title && <Field.ErrorText>{errors.title}</Field.ErrorText>}
        </Field.Root>

        <Field.Root invalid={Boolean(errors.description)}>
          <Field.Label color="var(--muted-text)">Description</Field.Label>
          <Textarea
            value={values.description}
            onChange={(event) => onFieldChange('description', event.target.value)}
            placeholder="Task description"
            bg="var(--surface)"
            borderColor="var(--border-strong)"
            color="var(--text-secondary)"
          />
          {errors.description && <Field.ErrorText>{errors.description}</Field.ErrorText>}
        </Field.Root>

        <Field.Root invalid={Boolean(errors.status)}>
          <Field.Label color="var(--muted-text)">Status</Field.Label>
          <select
            value={values.status}
            onChange={(event) => onFieldChange('status', event.target.value)}
            style={{
              background: 'var(--surface)',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-strong)',
              borderRadius: 10,
              padding: '12px 10px',
            }}
          >
            <option value="pending">Pending</option>
            <option value="done">Done</option>
          </select>
        </Field.Root>

        {status && (
          <Box
            rounded="md"
            px={3}
            py={2}
            bg={status === 'success' ? 'var(--success-bg)' : 'var(--danger-bg)'}
            borderWidth="1px"
            borderColor={status === 'success' ? 'var(--success-border)' : 'var(--danger-border)'}
          >
            <Text color={status === 'success' ? 'var(--success-text)' : 'var(--danger-text)'}>{message}</Text>
          </Box>
        )}

        <Button type="submit" colorPalette="blue" loading={isSubmitting} h={{ base: '46px', md: '40px' }}>Create Task</Button>
      </Stack>
    </Box>
  )
}
