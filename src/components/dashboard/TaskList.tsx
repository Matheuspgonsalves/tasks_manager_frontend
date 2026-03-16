import { Badge, Box, Button, Flex, HStack, Input, Separator, Stack, Text, Textarea } from '@chakra-ui/react'
import { useState } from 'react'
import type { Task, TaskStatus } from '../../types/task'

type TaskListProps = {
  tasks: Task[]
  busyTaskId: string | null
  onUpdateTask: (taskId: string, payload: Pick<Task, 'title' | 'description' | 'status'>) => Promise<void>
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
  taskId: string
  title: string
  description: string
  status: TaskStatus
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

export function TaskList({ tasks, busyTaskId, onUpdateTask, onDeleteTask }: TaskListProps) {
  const [editing, setEditing] = useState<EditState | null>(null)
  const [filter, setFilter] = useState<TaskFilter>('all')
  const [isClearingCompleted, setIsClearingCompleted] = useState(false)

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'active') return task.status === 'pending'
    if (filter === 'completed') return task.status === 'done'
    return true
  })

  const completedTasks = tasks.filter((task) => task.status === 'done')

  async function saveEdit() {
    if (!editing) return
    await onUpdateTask(editing.taskId, {
      title: editing.title.trim(),
      description: editing.description.trim(),
      status: editing.status,
    })
    setEditing(null)
  }

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
    <Box bg="var(--surface)" borderRadius="2xl" borderWidth="1px" borderColor="var(--border)" boxShadow="var(--card-shadow)" overflow="hidden">
      <Box px={{ base: 4, md: 5 }} py={4} borderBottomWidth="1px" borderColor="var(--border)">
        <Text color="var(--text-secondary)" fontWeight="700" fontSize={{ base: 'md', md: 'lg' }}>
          Your tasks
        </Text>
      </Box>

      {filteredTasks.length === 0 ? (
        <Box p={8}>
          <Text color="var(--muted-text)" textAlign="center">
            {tasks.length === 0 ? 'No tasks found for this user.' : 'No tasks match the selected filter.'}
          </Text>
        </Box>
      ) : (
        <Stack separator={<Separator borderColor="var(--border)" />} p={{ base: 4, md: 5 }} gap={4}>
          {filteredTasks.map((task) => {
            const isEditing = editing?.taskId === task.id
            const isBusy = busyTaskId === task.id || isClearingCompleted

            return (
              <Box key={task.id}>
                {isEditing ? (
                  <Stack gap={3}>
                    <Input
                      value={editing.title}
                      onChange={(event) => setEditing((current) => (current ? { ...current, title: event.target.value } : null))}
                      bg="var(--surface)"
                      borderColor="var(--border-strong)"
                      color="var(--text-secondary)"
                    />
                    <Textarea
                      value={editing.description}
                      onChange={(event) =>
                        setEditing((current) => (current ? { ...current, description: event.target.value } : null))
                      }
                      bg="var(--surface)"
                      borderColor="var(--border-strong)"
                      color="var(--text-secondary)"
                    />
                    <select
                      value={editing.status}
                      onChange={(event) =>
                        setEditing((current) => (current ? { ...current, status: event.target.value as TaskStatus } : null))
                      }
                      style={{
                        background: 'var(--surface)',
                        color: 'var(--text-secondary)',
                        border: '1px solid var(--border-strong)',
                        borderRadius: 8,
                        padding: '10px 12px',
                      }}
                    >
                      <option value="pending">Pending</option>
                      <option value="done">Done</option>
                    </select>
                    <HStack justify="flex-end">
                      <Button size="sm" variant="ghost" color="var(--muted-text)" onClick={() => setEditing(null)}>
                        Cancel
                      </Button>
                      <Button size="sm" colorPalette="blue" onClick={saveEdit} loading={isBusy}>
                        Save
                      </Button>
                    </HStack>
                  </Stack>
                ) : (
                  <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'stretch', md: 'center' }} gap={3}>
                    <Box flex="1" minW="0">
                      <Text fontSize={{ base: 'md', md: 'lg' }} fontWeight="700" color="var(--text-secondary)">
                        {task.title}
                      </Text>
                      <Text mt={1} color="var(--muted-text)" fontSize={{ base: 'sm', md: 'md' }}>
                        {task.description}
                      </Text>
                      {task.dueDate && (
                        <Text mt={2} fontSize="sm" color="var(--soft-text)">
                          Due: {task.dueDate}
                        </Text>
                      )}
                    </Box>
                    <Flex
                      align="center"
                      justify={{ base: 'space-between', md: 'flex-end' }}
                      gap={2}
                      wrap="wrap"
                      width={{ base: '100%', md: 'auto' }}
                      flexShrink={0}
                    >
                      <Badge colorPalette={statusColor[task.status]} fontSize="0.8rem" px={3} py={1} borderRadius="full">
                        {statusLabel[task.status]}
                      </Badge>
                      <HStack gap={1} ml={{ base: 'auto', md: 0 }}>
                        <Button
                          size="sm"
                          variant="ghost"
                          color="var(--muted-text)"
                          minW="2.5rem"
                          px={0}
                          aria-label={`Edit ${task.title}`}
                          onClick={() =>
                            setEditing({
                              taskId: task.id,
                              title: task.title,
                              description: task.description,
                              status: task.status,
                            })
                          }
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
                  </Flex>
                )}
              </Box>
            )
          })}
        </Stack>
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
          {filteredTasks.length} {filteredTasks.length === 1 ? 'item' : 'items'}
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
  )
}
