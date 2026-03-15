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
    <Box bg="#FFFFFF" borderRadius="2xl" borderWidth="1px" borderColor="#E2E8F0" boxShadow="0 18px 40px rgba(15, 23, 42, 0.06)" p={6}>
      <Stack gap={4} as="form" onSubmit={(event) => {
        event.preventDefault()
        void onSubmit()
      }}>
        <Text color="#1E293B" fontSize="2xl" fontWeight="800">Create Task</Text>

        <Field.Root invalid={Boolean(errors.title)}>
          <Field.Label color="#475569">Title</Field.Label>
          <Input
            value={values.title}
            onChange={(event) => onFieldChange('title', event.target.value)}
            placeholder="Task title"
            bg="#FFFFFF"
            borderColor="#CBD5E1"
            color="#1E293B"
          />
          {errors.title && <Field.ErrorText>{errors.title}</Field.ErrorText>}
        </Field.Root>

        <Field.Root invalid={Boolean(errors.description)}>
          <Field.Label color="#475569">Description</Field.Label>
          <Textarea
            value={values.description}
            onChange={(event) => onFieldChange('description', event.target.value)}
            placeholder="Task description"
            bg="#FFFFFF"
            borderColor="#CBD5E1"
            color="#1E293B"
          />
          {errors.description && <Field.ErrorText>{errors.description}</Field.ErrorText>}
        </Field.Root>

        <Field.Root invalid={Boolean(errors.status)}>
          <Field.Label color="#475569">Status</Field.Label>
          <select
            value={values.status}
            onChange={(event) => onFieldChange('status', event.target.value)}
            style={{
              background: '#ffffff',
              color: '#1e293b',
              border: '1px solid #CBD5E1',
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
            bg={status === 'success' ? '#ECFDF5' : '#FEF2F2'}
            borderWidth="1px"
            borderColor={status === 'success' ? '#A7F3D0' : '#FECACA'}
          >
            <Text color={status === 'success' ? '#047857' : '#B91C1C'}>{message}</Text>
          </Box>
        )}

        <Button type="submit" colorPalette="blue" loading={isSubmitting}>Create Task</Button>
      </Stack>
    </Box>
  )
}
