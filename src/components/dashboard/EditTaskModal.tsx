import { Box, Button, Field, Flex, Input, Stack, Text, Textarea } from '@chakra-ui/react'
import { useState } from 'react'
import type { Category } from '../../types/category'
import type { Task, TaskStatus } from '../../types/task'

type EditTaskModalProps = {
  task: Task | null
  categories: Category[]
  isSubmitting: boolean
  onClose: () => void
  onSubmit: (taskId: string, payload: Pick<Task, 'title' | 'description' | 'status' | 'categoryId'>) => Promise<void>
}

type FormState = {
  title: string
  description: string
  status: TaskStatus
  categoryId: string
}

export function EditTaskModal({ task, categories, isSubmitting, onClose, onSubmit }: EditTaskModalProps) {
  const [validationMessage, setValidationMessage] = useState('')
  const [formState, setFormState] = useState<FormState>(() => ({
    title: task?.title ?? '',
    description: task?.description ?? '',
    status: task?.status ?? 'pending',
    categoryId: task?.categoryId ?? '',
  }))

  if (!task) {
    return null
  }

  async function handleSubmit() {
    if (!formState.title.trim() || !formState.description.trim()) {
      setValidationMessage('Title and description are required.')
      return
    }

    setValidationMessage('')
    await onSubmit(task.id, {
      title: formState.title.trim(),
      description: formState.description.trim(),
      status: formState.status,
      categoryId: formState.categoryId || undefined,
    })
    onClose()
  }

  return (
    <Box position="fixed" inset={0} zIndex={50} bg="rgba(15, 23, 42, 0.35)" display="flex" alignItems="center" justifyContent="center" px={4}>
      <Box
        as="section"
        role="dialog"
        aria-modal="true"
        w="full"
        maxW="xl"
        bg="var(--surface)"
        borderWidth="1px"
        borderColor="var(--border)"
        borderRadius="2xl"
        boxShadow="var(--card-shadow)"
        p={{ base: 4, md: 6 }}
      >
        <Stack gap={4}>
          <Box>
            <Text color="var(--text-secondary)" fontSize={{ base: 'xl', md: '2xl' }} fontWeight="800">
              Edit task
            </Text>
            <Text mt={1} color="var(--muted-text)" fontSize="sm">
              Update the task details without leaving the dashboard.
            </Text>
          </Box>

          <Field.Root invalid={Boolean(validationMessage)}>
            <Field.Label color="var(--muted-text)">Title</Field.Label>
            <Input
              value={formState.title}
              onChange={(event) => setFormState((current) => ({ ...current, title: event.target.value }))}
              bg="var(--surface)"
              borderColor="var(--border-strong)"
              color="var(--text-secondary)"
            />
          </Field.Root>

          <Field.Root invalid={Boolean(validationMessage)}>
            <Field.Label color="var(--muted-text)">Description</Field.Label>
            <Textarea
              value={formState.description}
              onChange={(event) => setFormState((current) => ({ ...current, description: event.target.value }))}
              bg="var(--surface)"
              borderColor="var(--border-strong)"
              color="var(--text-secondary)"
            />
          </Field.Root>

          <Field.Root>
            <Field.Label color="var(--muted-text)">Status</Field.Label>
            <select
              value={formState.status}
              onChange={(event) => setFormState((current) => ({ ...current, status: event.target.value as TaskStatus }))}
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

          <Field.Root>
            <Field.Label color="var(--muted-text)">Category</Field.Label>
            <select
              value={formState.categoryId}
              onChange={(event) => setFormState((current) => ({ ...current, categoryId: event.target.value }))}
              style={{
                background: 'var(--surface)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-strong)',
                borderRadius: 10,
                padding: '12px 10px',
              }}
            >
              <option value="">No category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name} {category.isDefault ? '(Default)' : '(Custom)'}
                </option>
              ))}
            </select>
            {validationMessage ? <Field.ErrorText>{validationMessage}</Field.ErrorText> : null}
          </Field.Root>

          <Flex justify="flex-end" gap={3}>
            <Button variant="ghost" color="var(--muted-text)" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button colorPalette="blue" onClick={() => void handleSubmit()} loading={isSubmitting}>
              Save
            </Button>
          </Flex>
        </Stack>
      </Box>
    </Box>
  )
}
