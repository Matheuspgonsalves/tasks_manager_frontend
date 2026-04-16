import { Badge, Box, Button, Flex, HStack, Input, Separator, Stack, Text } from '@chakra-ui/react'
import { useState } from 'react'
import type { ChangeEvent } from 'react'
import type { Category } from '../../types/category'
import type { Task, TaskStatus } from '../../types/task'
import { EditTaskModal } from './EditTaskModal'

type TaskListProps = {
  tasks: Task[]
  categories: Category[]
  isLoading: boolean
  busyTaskId: string | null
  statusFilter: 'all' | 'pending' | 'done'
  categoryFilter: string
  searchTerm: string
  onStatusFilterChange: (value: 'all' | 'pending' | 'done') => void
  onCategoryFilterChange: (value: string) => void
  onSearchTermChange: (value: string) => void
  onUpdateTask: (taskId: string, payload: Pick<Task, 'title' | 'description' | 'status' | 'categoryId'>) => Promise<void>
  onDeleteTask: (taskId: string) => Promise<void>
}

const statusBadge: Record<TaskStatus, { label: string; color: string; bg: string; border: string }> = {
  pending: {
    label: 'Pendente',
    color: '#B45309',
    bg: '#FFFBEB',
    border: '#FDE68A',
  },
  done: {
    label: 'Concluída',
    color: '#15803D',
    bg: '#F0FDF4',
    border: '#BBF7D0',
  },
}

type EditState = { task: Task }

function EditIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 1 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  )
}

function DeleteIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 14H6L5 6" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  )
}

function StatusDot({ status }: { status: TaskStatus }) {
  const s = statusBadge[status]
  return (
    <Box
      display="inline-flex"
      alignItems="center"
      gap={1.5}
      px={2.5}
      py={1}
      borderRadius="5px"
      bg={s.bg}
      border={`1px solid ${s.border}`}
      style={{ color: s.color }}
    >
      <Box w="5px" h="5px" borderRadius="full" bg={s.color} flexShrink={0} />
      <Text fontSize="xs" fontWeight={600} color={s.color} letterSpacing="0.01em">
        {s.label}
      </Text>
    </Box>
  )
}

export function TaskList({
  tasks,
  categories,
  isLoading,
  busyTaskId,
  statusFilter,
  categoryFilter,
  searchTerm,
  onStatusFilterChange,
  onCategoryFilterChange,
  onSearchTermChange,
  onUpdateTask,
  onDeleteTask,
}: TaskListProps) {
  const [editing, setEditing] = useState<EditState | null>(null)
  const [isClearingCompleted, setIsClearingCompleted] = useState(false)
  const completedTasks = tasks.filter((t) => t.status === 'done')
  const visibleTasks = tasks
  const normalizedSearch = searchTerm.trim()

  async function clearCompleted() {
    if (completedTasks.length === 0) return
    setIsClearingCompleted(true)
    try {
      for (const task of completedTasks) await onDeleteTask(task.id)
    } finally {
      setIsClearingCompleted(false)
    }
  }

  return (
    <Stack gap={4}>
      {/* Section header */}
      <Flex align="center" justify="space-between" gap={4} wrap="wrap">
        <Box>
          <Text color="var(--text-primary)" fontWeight={800} fontSize={{ base: 'lg', md: 'xl' }} letterSpacing="-0.03em">
            Suas tarefas
          </Text>
          <Text color="var(--muted-text)" fontSize="sm" fontWeight={400} mt={0.5}>
            {tasks.length === 0 ? 'Nenhuma tarefa criada ainda' : `${tasks.length} ${tasks.length === 1 ? 'tarefa' : 'tarefas'} no total`}
          </Text>
        </Box>
      </Flex>

      {/* Filters */}
      <Flex direction={{ base: 'column', md: 'row' }} gap={3}>
        <Box position="relative" flex="1">
          <Box
            position="absolute"
            left={3}
            top="50%"
            transform="translateY(-50%)"
            color="var(--soft-text)"
            pointerEvents="none"
            zIndex={1}
            display="flex"
          >
            <SearchIcon />
          </Box>
          <Input
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            placeholder="Buscar tarefas..."
            bg="var(--surface)"
            borderColor="var(--border)"
            color="var(--text-primary)"
            h="42px"
            pl={9}
            borderRadius="lg"
            fontSize="sm"
            fontWeight={500}
            _placeholder={{ color: 'var(--soft-text)' }}
            _hover={{ borderColor: 'var(--border-strong)' }}
            _focusVisible={{ borderColor: 'var(--accent)', boxShadow: '0 0 0 2px var(--accent-soft)' }}
          />
        </Box>

        <Box
          as="select"
          value={categoryFilter}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => onCategoryFilterChange(e.target.value)}
          w={{ base: '100%', md: '220px' }}
          bg="var(--surface)"
          color="var(--text-primary)"
          border="1px solid var(--border)"
          borderRadius="8px"
          px={3}
          h="42px"
          flexShrink={0}
          fontSize="0.875rem"
          fontWeight={500}
        >
          <option value="">Todas as categorias</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </Box>
      </Flex>

      {/* Table card */}
      <Box
        bg="var(--surface)"
        borderRadius="10px"
        borderWidth="1px"
        borderColor="var(--border)"
        boxShadow="var(--card-shadow)"
        overflow="hidden"
      >
        {isLoading ? (
          <Box p={10} textAlign="center">
            <Text color="var(--muted-text)" fontSize="sm">Carregando tarefas...</Text>
          </Box>
        ) : visibleTasks.length === 0 ? (
          <Box p={10} textAlign="center">
            <Text color="var(--soft-text)" fontSize="2xl" mb={2}>—</Text>
            <Text color="var(--muted-text)" fontSize="sm">
              {tasks.length === 0
                ? 'Nenhuma tarefa ainda. Crie sua primeira!'
                : normalizedSearch
                ? 'Nenhuma tarefa corresponde à busca.'
                : 'Nenhuma tarefa com os filtros selecionados.'}
            </Text>
          </Box>
        ) : (
          <Box>
            {/* Table header */}
            <Box
              display={{ base: 'none', md: 'grid' }}
              gridTemplateColumns="minmax(160px, 1.2fr) minmax(220px, 2fr) minmax(130px, 1fr) minmax(110px, 0.8fr) 80px"
              gap={4}
              px={5}
              py={3}
              borderBottomWidth="1px"
              borderColor="var(--border)"
              bg="var(--surface-muted)"
            >
              {['Tarefa', 'Descrição', 'Categoria', 'Status', 'Ações'].map((col, i) => (
                <Text
                  key={col}
                  fontSize="0.7rem"
                  fontWeight={700}
                  color="var(--soft-text)"
                  textTransform="uppercase"
                  letterSpacing="0.08em"
                  textAlign={i === 4 ? 'right' : 'left'}
                >
                  {col}
                </Text>
              ))}
            </Box>

            <Stack separator={<Separator borderColor="var(--border)" />} p={{ base: 4, md: 0 }} gap={{ base: 4, md: 0 }}>
              {visibleTasks.map((task) => {
                const isBusy = busyTaskId === task.id || isClearingCompleted

                return (
                  <Box
                    key={task.id}
                    px={{ base: 0, md: 5 }}
                    py={{ base: 0, md: 4 }}
                    transition="background 0.1s"
                    _hover={{ bg: { base: 'transparent', md: 'var(--surface-hover)' } }}
                  >
                    <Box
                      display={{ base: 'flex', md: 'grid' }}
                      flexDirection="column"
                      gridTemplateColumns="minmax(160px, 1.2fr) minmax(220px, 2fr) minmax(130px, 1fr) minmax(110px, 0.8fr) 80px"
                      gap={{ base: 2.5, md: 4 }}
                      alignItems={{ base: 'stretch', md: 'center' }}
                    >
                      {/* Title */}
                      <Box minW={0}>
                        <Text display={{ base: 'block', md: 'none' }} mb={0.5} fontSize="0.65rem" textTransform="uppercase" letterSpacing="0.1em" color="var(--soft-text)" fontWeight={600}>
                          Tarefa
                        </Text>
                        <Text fontSize="sm" fontWeight={700} color="var(--text-primary)" lineClamp={1}>
                          {task.title}
                        </Text>
                        {task.dueDate && (
                          <Text mt={0.5} fontSize="xs" color="var(--soft-text)" fontWeight={500}>
                            Prazo: {task.dueDate}
                          </Text>
                        )}
                      </Box>

                      {/* Description */}
                      <Box minW={0}>
                        <Text display={{ base: 'block', md: 'none' }} mb={0.5} fontSize="0.65rem" textTransform="uppercase" letterSpacing="0.1em" color="var(--soft-text)" fontWeight={600}>
                          Descrição
                        </Text>
                        <Text color="var(--muted-text)" fontSize="sm" fontWeight={400} lineClamp={2}>
                          {task.description}
                        </Text>
                      </Box>

                      {/* Category */}
                      <Box minW={0}>
                        <Text display={{ base: 'block', md: 'none' }} mb={0.5} fontSize="0.65rem" textTransform="uppercase" letterSpacing="0.1em" color="var(--soft-text)" fontWeight={600}>
                          Categoria
                        </Text>
                        {task.categoryName ? (
                          <Badge
                            variant="subtle"
                            fontSize="0.7rem"
                            fontWeight={600}
                            px={2}
                            py={0.5}
                            borderRadius="4px"
                            bg="var(--surface-muted)"
                            color="var(--muted-text)"
                            borderWidth="1px"
                            borderColor="var(--border)"
                            letterSpacing="0.01em"
                          >
                            {task.categoryName}
                          </Badge>
                        ) : (
                          <Text color="var(--soft-text)" fontSize="xs" fontWeight={400}>—</Text>
                        )}
                      </Box>

                      {/* Status */}
                      <Box minW={0}>
                        <Text display={{ base: 'block', md: 'none' }} mb={0.5} fontSize="0.65rem" textTransform="uppercase" letterSpacing="0.1em" color="var(--soft-text)" fontWeight={600}>
                          Status
                        </Text>
                        <StatusDot status={task.status} />
                      </Box>

                      {/* Actions */}
                      <Flex justify="flex-end">
                        <HStack gap={0.5}>
                          <Button
                            size="sm"
                            variant="ghost"
                            color="var(--muted-text)"
                            minW="32px"
                            h="32px"
                            px={0}
                            rounded="md"
                            aria-label={`Editar ${task.title}`}
                            _hover={{ bg: 'var(--surface-active)', color: 'var(--accent)' }}
                            onClick={() => setEditing({ task })}
                          >
                            <EditIcon />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            color="var(--muted-text)"
                            minW="32px"
                            h="32px"
                            px={0}
                            rounded="md"
                            aria-label={`Excluir ${task.title}`}
                            _hover={{ bg: 'var(--danger-bg)', color: 'var(--danger-text)' }}
                            onClick={() => onDeleteTask(task.id)}
                            loading={isBusy}
                          >
                            <DeleteIcon />
                          </Button>
                        </HStack>
                      </Flex>
                    </Box>
                  </Box>
                )
              })}
            </Stack>
          </Box>
        )}

        {/* Footer */}
        <Flex
          borderTopWidth="1px"
          borderColor="var(--border)"
          px={{ base: 4, md: 5 }}
          py={3}
          align="center"
          justify="space-between"
          gap={4}
          wrap="wrap"
          bg="var(--surface-muted)"
        >
          <Text color="var(--soft-text)" fontSize="xs" fontWeight={500}>
            {visibleTasks.length} {visibleTasks.length === 1 ? 'item' : 'itens'}
          </Text>

          <HStack gap={1}>
            {(['all', 'pending', 'done'] as const).map((filter) => {
              const labels = { all: 'Todas', pending: 'Pendentes', done: 'Concluídas' }
              const active = statusFilter === filter
              return (
                <Button
                  key={filter}
                  size="xs"
                  h="28px"
                  px={3}
                  rounded="md"
                  fontWeight={active ? 700 : 500}
                  fontSize="xs"
                  bg={active ? 'var(--accent-soft)' : 'transparent'}
                  color={active ? 'var(--accent)' : 'var(--muted-text)'}
                  borderWidth="1px"
                  borderColor={active ? 'var(--accent-border)' : 'transparent'}
                  _hover={{ bg: active ? 'var(--accent-soft)' : 'var(--surface-hover)', color: active ? 'var(--accent)' : 'var(--text-primary)' }}
                  onClick={() => onStatusFilterChange(filter)}
                >
                  {labels[filter]}
                </Button>
              )
            })}
          </HStack>

          <Button
            size="xs"
            h="28px"
            px={3}
            rounded="md"
            fontWeight={500}
            fontSize="xs"
            variant="ghost"
            color="var(--muted-text)"
            _hover={{ bg: 'var(--danger-bg)', color: 'var(--danger-text)' }}
            onClick={clearCompleted}
            disabled={completedTasks.length === 0 || isClearingCompleted}
            loading={isClearingCompleted}
          >
            Limpar concluídas
          </Button>
        </Flex>
      </Box>

      <EditTaskModal
        key={editing?.task.id ?? 'closed'}
        task={editing?.task ?? null}
        categories={categories}
        isSubmitting={Boolean(editing?.task && busyTaskId === editing.task.id)}
        onClose={() => setEditing(null)}
        onSubmit={async (taskId, payload) => {
          await onUpdateTask(taskId, payload)
          setEditing(null)
        }}
      />
    </Stack>
  )
}
