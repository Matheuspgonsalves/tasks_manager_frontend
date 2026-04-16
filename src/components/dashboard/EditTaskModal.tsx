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

const fieldLabel: React.CSSProperties = {
  fontSize: '0.8125rem',
  fontWeight: 600,
  color: 'var(--text-secondary)',
  letterSpacing: '-0.01em',
  marginBottom: '6px',
  display: 'block',
}

const selectStyle: React.CSSProperties = {
  width: '100%',
  background: 'var(--surface)',
  color: 'var(--text-primary)',
  border: '1px solid var(--border-strong)',
  borderRadius: '8px',
  padding: '10px 36px 10px 12px',
  fontSize: '0.875rem',
  fontWeight: 500,
}

export function EditTaskModal({ task, categories, isSubmitting, onClose, onSubmit }: EditTaskModalProps) {
  const [validationMessage, setValidationMessage] = useState('')
  const [formState, setFormState] = useState<FormState>(() => ({
    title: task?.title ?? '',
    description: task?.description ?? '',
    status: task?.status ?? 'pending',
    categoryId: task?.categoryId ?? '',
  }))

  if (!task) return null

  async function handleSubmit() {
    if (!formState.title.trim() || !formState.description.trim()) {
      setValidationMessage('Título e descrição são obrigatórios.')
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
    <Box
      position="fixed"
      inset={0}
      zIndex={50}
      bg="rgba(0,0,0,0.35)"
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={4}
    >
      <Box
        as="section"
        role="dialog"
        aria-modal="true"
        w="full"
        maxW="480px"
        bg="var(--surface)"
        borderWidth="1px"
        borderColor="var(--border)"
        borderRadius="12px"
        boxShadow="var(--card-shadow)"
        p={{ base: 5, md: 6 }}
      >
        <Stack gap={4}>
          {/* Header */}
          <Box>
            <Box display="flex" alignItems="center" gap={2} mb={1}>
              <Box w="5px" h="5px" borderRadius="1px" bg="var(--accent)" flexShrink={0} />
              <Text color="var(--text-primary)" fontSize="lg" fontWeight={800} letterSpacing="-0.03em">
                Editar tarefa
              </Text>
            </Box>
            <Text color="var(--muted-text)" fontSize="sm" pl="13px">
              Atualize os detalhes sem sair do dashboard.
            </Text>
          </Box>

          {/* Title */}
          <Field.Root invalid={Boolean(validationMessage)}>
            <label style={fieldLabel}>Título</label>
            <Input
              value={formState.title}
              onChange={(e) => setFormState((s) => ({ ...s, title: e.target.value }))}
              h="44px"
              rounded="lg"
              fontSize="sm"
              fontWeight={500}
              bg="var(--surface)"
              borderColor="var(--border-strong)"
              color="var(--text-primary)"
              _focusVisible={{ borderColor: 'var(--accent)', boxShadow: '0 0 0 2px var(--accent-soft)' }}
            />
          </Field.Root>

          {/* Description */}
          <Field.Root>
            <label style={fieldLabel}>Descrição</label>
            <Textarea
              value={formState.description}
              onChange={(e) => setFormState((s) => ({ ...s, description: e.target.value }))}
              rounded="lg"
              fontSize="sm"
              fontWeight={500}
              bg="var(--surface)"
              borderColor="var(--border-strong)"
              color="var(--text-primary)"
              minH="96px"
              _focusVisible={{ borderColor: 'var(--accent)', boxShadow: '0 0 0 2px var(--accent-soft)' }}
            />
          </Field.Root>

          {/* Status */}
          <Box>
            <label style={fieldLabel}>Status</label>
            <select
              value={formState.status}
              onChange={(e) => setFormState((s) => ({ ...s, status: e.target.value as TaskStatus }))}
              style={selectStyle}
            >
              <option value="pending">Pendente</option>
              <option value="done">Concluída</option>
            </select>
          </Box>

          {/* Category */}
          <Box>
            <label style={fieldLabel}>Categoria</label>
            <select
              value={formState.categoryId}
              onChange={(e) => setFormState((s) => ({ ...s, categoryId: e.target.value }))}
              style={selectStyle}
            >
              <option value="">Sem categoria</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.isDefault ? '(Padrão)' : '(Personalizada)'}
                </option>
              ))}
            </select>

            {validationMessage && (
              <Text mt={1.5} color="var(--danger-text)" fontSize="xs" fontWeight={500}>
                {validationMessage}
              </Text>
            )}
          </Box>

          {/* Actions */}
          <Flex justify="flex-end" gap={2} pt={1}>
            <Button
              variant="ghost"
              h="40px"
              px={4}
              rounded="lg"
              fontSize="sm"
              fontWeight={600}
              color="var(--muted-text)"
              _hover={{ bg: 'var(--surface-hover)', color: 'var(--text-primary)' }}
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              h="40px"
              px={5}
              rounded="lg"
              fontSize="sm"
              fontWeight={700}
              bg="var(--accent)"
              color="white"
              _hover={{ bg: 'var(--accent-strong)' }}
              onClick={() => void handleSubmit()}
              loading={isSubmitting}
            >
              Salvar
            </Button>
          </Flex>
        </Stack>
      </Box>
    </Box>
  )
}
