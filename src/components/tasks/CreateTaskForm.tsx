import { Box, Button, Field, Input, Stack, Text, Textarea } from '@chakra-ui/react'
import type { TaskFormErrors, TaskFormValues } from '../../lib/task.schema'
import type { Category } from '../../types/category'

type CreateTaskFormProps = {
  values: TaskFormValues
  errors: TaskFormErrors
  isSubmitting: boolean
  status: 'success' | 'error' | null
  message: string
  categories: Category[]
  isLoadingCategories: boolean
  categoriesErrorMessage: string
  onFieldChange: (field: keyof TaskFormValues, value: string) => void
  onSubmit: () => Promise<void>
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

export function CreateTaskForm({
  values,
  errors,
  isSubmitting,
  status,
  message,
  categories,
  isLoadingCategories,
  categoriesErrorMessage,
  onFieldChange,
  onSubmit,
}: CreateTaskFormProps) {
  return (
    <Box
      bg="var(--surface)"
      borderRadius="12px"
      borderWidth="1px"
      borderColor="var(--border)"
      boxShadow="var(--card-shadow)"
      p={{ base: 5, md: 7 }}
    >
      <Box mb={6}>
        <Box display="flex" alignItems="center" gap={2} mb={1}>
          <Box w="5px" h="5px" borderRadius="1px" bg="var(--accent)" flexShrink={0} />
          <Text color="var(--text-primary)" fontSize="xl" fontWeight={800} letterSpacing="-0.03em">
            Nova tarefa
          </Text>
        </Box>
        <Text color="var(--muted-text)" fontSize="sm" pl="13px">
          Preencha os campos para criar uma nova tarefa
        </Text>
      </Box>

      <Stack
        gap={4}
        as="form"
        onSubmit={(e) => { e.preventDefault(); void onSubmit() }}
      >
        {/* Title */}
        <Field.Root invalid={Boolean(errors.title)}>
          <label style={fieldLabel} htmlFor="task-title">Título</label>
          <Input
            id="task-title"
            value={values.title}
            onChange={(e) => onFieldChange('title', e.target.value)}
            placeholder="Nome da tarefa"
            h="44px"
            rounded="lg"
            fontSize="sm"
            fontWeight={500}
            bg="var(--surface)"
            borderColor="var(--border-strong)"
            color="var(--text-primary)"
            _placeholder={{ color: 'var(--soft-text)' }}
            _hover={{ borderColor: 'var(--muted-text)' }}
            _focusVisible={{ borderColor: 'var(--accent)', boxShadow: '0 0 0 2px var(--accent-soft)' }}
          />
          {errors.title && <Field.ErrorText fontSize="xs">{errors.title}</Field.ErrorText>}
        </Field.Root>

        {/* Description */}
        <Field.Root invalid={Boolean(errors.description)}>
          <label style={fieldLabel} htmlFor="task-desc">Descrição</label>
          <Textarea
            id="task-desc"
            value={values.description}
            onChange={(e) => onFieldChange('description', e.target.value)}
            placeholder="Descreva a tarefa"
            rounded="lg"
            fontSize="sm"
            fontWeight={500}
            bg="var(--surface)"
            borderColor="var(--border-strong)"
            color="var(--text-primary)"
            minH="96px"
            _placeholder={{ color: 'var(--soft-text)' }}
            _hover={{ borderColor: 'var(--muted-text)' }}
            _focusVisible={{ borderColor: 'var(--accent)', boxShadow: '0 0 0 2px var(--accent-soft)' }}
          />
          {errors.description && <Field.ErrorText fontSize="xs">{errors.description}</Field.ErrorText>}
        </Field.Root>

        {/* Status */}
        <Field.Root invalid={Boolean(errors.status)}>
          <label style={fieldLabel}>Status inicial</label>
          <select
            value={values.status}
            onChange={(e) => onFieldChange('status', e.target.value)}
            style={selectStyle}
          >
            <option value="pending">Pendente</option>
            <option value="done">Concluída</option>
          </select>
        </Field.Root>

        {/* Category */}
        <Field.Root invalid={Boolean(errors.categoryId)}>
          <label style={fieldLabel}>Categoria</label>
          <select
            value={values.categoryId ?? ''}
            onChange={(e) => onFieldChange('categoryId', e.target.value)}
            disabled={isLoadingCategories || categories.length === 0}
            style={{ ...selectStyle, opacity: (isLoadingCategories || categories.length === 0) ? 0.5 : 1 }}
          >
            <option value="">
              {isLoadingCategories
                ? 'Carregando...'
                : categories.length === 0
                ? 'Nenhuma categoria disponível'
                : 'Selecionar categoria'}
            </option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} {c.isDefault ? '(Padrão)' : '(Personalizada)'}
              </option>
            ))}
          </select>
          {errors.categoryId && <Field.ErrorText fontSize="xs">{errors.categoryId}</Field.ErrorText>}
          {!errors.categoryId && categoriesErrorMessage && <Field.ErrorText fontSize="xs">{categoriesErrorMessage}</Field.ErrorText>}
        </Field.Root>

        {/* Status banner */}
        {status && (
          <Box
            px={3}
            py={2.5}
            borderRadius="8px"
            bg={status === 'success' ? 'var(--success-bg)' : 'var(--danger-bg)'}
            borderWidth="1px"
            borderColor={status === 'success' ? 'var(--success-border)' : 'var(--danger-border)'}
          >
            <Text
              fontSize="sm"
              fontWeight={500}
              color={status === 'success' ? 'var(--success-text)' : 'var(--danger-text)'}
            >
              {message}
            </Text>
          </Box>
        )}

        <Button
          type="submit"
          bg="var(--accent)"
          color="white"
          h="44px"
          w="full"
          rounded="lg"
          fontWeight={700}
          fontSize="sm"
          letterSpacing="-0.01em"
          _hover={{ bg: 'var(--accent-strong)' }}
          loading={isSubmitting}
          mt={1}
        >
          Criar tarefa
        </Button>
      </Stack>
    </Box>
  )
}
