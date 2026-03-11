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
    <Box bg="#111827" borderRadius="2xl" borderWidth="1px" borderColor="whiteAlpha.200" boxShadow="2xl" p={6}>
      <Stack gap={4} as="form" onSubmit={(event) => {
        event.preventDefault()
        void onSubmit()
      }}>
        <Text color="gray.100" fontSize="2xl" fontWeight="800">Create Task</Text>

        <Field.Root invalid={Boolean(errors.title)}>
          <Field.Label color="gray.200">Title</Field.Label>
          <Input
            value={values.title}
            onChange={(event) => onFieldChange('title', event.target.value)}
            placeholder="Task title"
            bg="whiteAlpha.100"
            borderColor="whiteAlpha.200"
            color="gray.100"
          />
          {errors.title && <Field.ErrorText>{errors.title}</Field.ErrorText>}
        </Field.Root>

        <Field.Root invalid={Boolean(errors.description)}>
          <Field.Label color="gray.200">Description</Field.Label>
          <Textarea
            value={values.description}
            onChange={(event) => onFieldChange('description', event.target.value)}
            placeholder="Task description"
            bg="whiteAlpha.100"
            borderColor="whiteAlpha.200"
            color="gray.100"
          />
          {errors.description && <Field.ErrorText>{errors.description}</Field.ErrorText>}
        </Field.Root>

        <Field.Root invalid={Boolean(errors.status)}>
          <Field.Label color="gray.200">Status</Field.Label>
          <select
            value={values.status}
            onChange={(event) => onFieldChange('status', event.target.value)}
            style={{
              background: '#1f2937',
              color: '#e5e7eb',
              border: '1px solid rgba(255,255,255,0.2)',
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
            bg={status === 'success' ? 'green.900' : 'red.900'}
            borderWidth="1px"
            borderColor={status === 'success' ? 'green.600' : 'red.600'}
          >
            <Text color={status === 'success' ? 'green.100' : 'red.100'}>{message}</Text>
          </Box>
        )}

        <Button type="submit" colorPalette="blue" loading={isSubmitting}>Create Task</Button>
      </Stack>
    </Box>
  )
}
