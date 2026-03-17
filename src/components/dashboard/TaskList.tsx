import { Badge, Box, Button, Flex, HStack, Input, Separator, Stack, Text } from '@chakra-ui/react'
import { useState } from 'react'
import type { Category } from '../../types/category'
import type { Task, TaskStatus } from '../../types/task'
import { EditTaskModal } from './EditTaskModal'

type TaskListProps = {
  tasks: Task[]
  categories: Category[]
  busyTaskId: string | null
  onUpdateTask: (taskId: string, payload: Pick<Task, 'title' | 'description' | 'status' | 'categoryId'>) => Promise<void>
  onDeleteTask: (taskId: string) => Promise<void>
}

const statusColor: Record<TaskStatus, string> = {
  pending: 'orange',
  done: 'green',
}

const statusLabel: Record<TaskStatus, string> = {
  pending: 'Pending',
  done: 'Done',
}

type EditState = {
  task: Task
}

type TaskFilter = 'all' | 'active' | 'completed'

function EditIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 1 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  )
}

function DeleteIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  )
}

export function TaskList({ tasks, categories, busyTaskId, onUpdateTask, onDeleteTask }: TaskListProps) {
  const [editing, setEditing] = useState<EditState | null>(null)
  const [filter, setFilter] = useState<TaskFilter>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [isClearingCompleted, setIsClearingCompleted] = useState(false)

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'active') return task.status === 'pending'
    if (filter === 'completed') return task.status === 'done'
    return true
  })

  const normalizedSearch = searchTerm.trim().toLowerCase()
  const visibleTasks = filteredTasks.filter((task) => {
    if (!normalizedSearch) return true

    return [task.title, task.description, task.categoryName ?? '']
      .join(' ')
      .toLowerCase()
      .includes(normalizedSearch)
  })

  const completedTasks = tasks.filter((task) => task.status === 'done')

  async function clearCompleted() {
    if (completedTasks.length === 0) return

    setIsClearingCompleted(true)
    try {
      for (const task of completedTasks) {
        await onDeleteTask(task.id)
      }
    } finally {
      setIsClearingCompleted(false)
    }
  }

  return (
    <Stack gap={4}>
      <Text color="var(--text-secondary)" fontWeight="700" fontSize={{ base: 'xl', md: '2xl' }}>
        Your tasks
      </Text>

      <Box position="relative">
        <Box position="absolute" left={4} top="50%" transform="translateY(-50%)" color="var(--soft-text)" pointerEvents="none">
          <SearchIcon />
        </Box>
        <Input
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search tasks by title, description or category..."
          bg="var(--surface)"
          borderColor="var(--border)"
          color="var(--text-secondary)"
          h="48px"
          pl={12}
          borderRadius="xl"
          boxShadow="var(--card-shadow)"
        />
      </Box>

      <Box bg="var(--surface)" borderRadius="2xl" borderWidth="1px" borderColor="var(--border)" boxShadow="var(--card-shadow)" overflow="hidden">
        {visibleTasks.length === 0 ? (
          <Box p={8}>
            <Text color="var(--muted-text)" textAlign="center">
              {tasks.length === 0 ? 'No tasks found for this user.' : normalizedSearch ? 'No tasks match your search.' : 'No tasks match the selected filter.'}
            </Text>
          </Box>
        ) : (
          <Box>
            <Box
              display={{ base: 'none', md: 'grid' }}
              gridTemplateColumns="minmax(180px, 1.3fr) minmax(240px, 2fr) minmax(140px, 1fr) minmax(120px, 0.8fr) 88px"
              gap={4}
              px={5}
              py={3}
              borderBottomWidth="1px"
              borderColor="var(--border)"
              bg="var(--surface-muted)"
            >
              <Text fontSize="sm" fontWeight="700" color="var(--muted-text)">Task</Text>
              <Text fontSize="sm" fontWeight="700" color="var(--muted-text)">Description</Text>
              <Text fontSize="sm" fontWeight="700" color="var(--muted-text)">Category</Text>
              <Text fontSize="sm" fontWeight="700" color="var(--muted-text)">Status</Text>
              <Text fontSize="sm" fontWeight="700" color="var(--muted-text)" textAlign="right">Actions</Text>
            </Box>

            <Stack separator={<Separator borderColor="var(--border)" />} p={{ base: 4, md: 0 }} gap={{ base: 4, md: 0 }}>
              {visibleTasks.map((task) => {
                const isBusy = busyTaskId === task.id || isClearingCompleted

                return (
                  <Box key={task.id} px={{ base: 0, md: 5 }} py={{ base: 0, md: 4 }}>
                    <Box
                      display={{ base: 'flex', md: 'grid' }}
                      flexDirection="column"
                      gridTemplateColumns="minmax(180px, 1.3fr) minmax(240px, 2fr) minmax(140px, 1fr) minmax(120px, 0.8fr) 88px"
                      gap={{ base: 3, md: 4 }}
                      alignItems={{ base: 'stretch', md: 'center' }}
                    >
                      <Box minW="0">
                        <Text display={{ base: 'block', md: 'none' }} mb={1} fontSize="xs" textTransform="uppercase" letterSpacing="0.08em" color="var(--soft-text)">
                          Task
                        </Text>
                        <Text fontSize={{ base: 'md', md: 'md' }} fontWeight="700" color="var(--text-secondary)">
                          {task.title}
                        </Text>
                        {task.dueDate ? (
                          <Text mt={1} fontSize="sm" color="var(--soft-text)">
                            Due: {task.dueDate}
                          </Text>
                        ) : null}
                      </Box>

                      <Box minW="0">
                        <Text display={{ base: 'block', md: 'none' }} mb={1} fontSize="xs" textTransform="uppercase" letterSpacing="0.08em" color="var(--soft-text)">
                          Description
                        </Text>
                        <Text color="var(--muted-text)" fontSize="sm" lineClamp={2}>
                          {task.description}
                        </Text>
                      </Box>

                      <Box minW="0">
                        <Text display={{ base: 'block', md: 'none' }} mb={1} fontSize="xs" textTransform="uppercase" letterSpacing="0.08em" color="var(--soft-text)">
                          Category
                        </Text>
                        {task.categoryName ? (
                          <Badge colorPalette="blue" variant="subtle" fontSize="0.8rem" px={3} py={1} borderRadius="full">
                            {task.categoryName}
                          </Badge>
                        ) : (
                          <Text color="var(--soft-text)" fontSize="sm">
                            No category
                          </Text>
                        )}
                      </Box>

                      <Box minW="0">
                        <Text display={{ base: 'block', md: 'none' }} mb={1} fontSize="xs" textTransform="uppercase" letterSpacing="0.08em" color="var(--soft-text)">
                          Status
                        </Text>
                        <Badge colorPalette={statusColor[task.status]} fontSize="0.8rem" px={3} py={1} borderRadius="full">
                          {statusLabel[task.status]}
                        </Badge>
                      </Box>

                      <Flex justify={{ base: 'flex-end', md: 'flex-end' }}>
                        <HStack gap={1}>
                          <Button
                            size="sm"
                            variant="ghost"
                            color="var(--muted-text)"
                            minW="2.5rem"
                            px={0}
                            aria-label={`Edit ${task.title}`}
                            onClick={() => setEditing({ task })}
                          >
                            <EditIcon />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            color="var(--danger-text)"
                            minW="2.5rem"
                            px={0}
                            aria-label={`Delete ${task.title}`}
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

        <Flex
          borderTopWidth="1px"
          borderColor="var(--border)"
          px={{ base: 4, md: 5 }}
          py={4}
          align={{ base: 'flex-start', md: 'center' }}
          justify="space-between"
          gap={4}
          direction={{ base: 'column', md: 'row' }}
        >
          <Text color="var(--soft-text)" fontSize="sm">
            {visibleTasks.length} {visibleTasks.length === 1 ? 'item' : 'items'}
          </Text>
          <HStack gap={2} wrap="wrap">
            <Button size="sm" variant={filter === 'all' ? 'subtle' : 'ghost'} colorPalette="blue" color={filter === 'all' ? undefined : 'var(--muted-text)'} onClick={() => setFilter('all')}>
              All
            </Button>
            <Button
              size="sm"
              variant={filter === 'active' ? 'subtle' : 'ghost'}
              colorPalette="blue"
              color={filter === 'active' ? undefined : 'var(--muted-text)'}
              onClick={() => setFilter('active')}
            >
              Active
            </Button>
            <Button
              size="sm"
              variant={filter === 'completed' ? 'subtle' : 'ghost'}
              colorPalette="blue"
              color={filter === 'completed' ? undefined : 'var(--muted-text)'}
              onClick={() => setFilter('completed')}
            >
              Completed
            </Button>
          </HStack>
          <Button
            size="sm"
            variant="ghost"
            color="var(--muted-text)"
            onClick={clearCompleted}
            disabled={completedTasks.length === 0 || isClearingCompleted}
            loading={isClearingCompleted}
            alignSelf={{ base: 'stretch', md: 'auto' }}
          >
            Clear completed
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
