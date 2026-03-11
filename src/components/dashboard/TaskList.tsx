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
    <Box bg="#111827" borderRadius="2xl" borderWidth="1px" borderColor="whiteAlpha.200" boxShadow="2xl" overflow="hidden">
      <Box px={5} py={4} borderBottomWidth="1px" borderColor="whiteAlpha.200">
        <Text color="gray.100" fontWeight="700" fontSize="lg">
          Your tasks
        </Text>
      </Box>

      {filteredTasks.length === 0 ? (
        <Box p={8}>
          <Text color="gray.300" textAlign="center">
            {tasks.length === 0 ? 'No tasks found for this user.' : 'No tasks match the selected filter.'}
          </Text>
        </Box>
      ) : (
        <Stack separator={<Separator borderColor="whiteAlpha.200" />} p={5} gap={4}>
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
                      bg="whiteAlpha.100"
                      borderColor="whiteAlpha.200"
                      color="gray.100"
                    />
                    <Textarea
                      value={editing.description}
                      onChange={(event) =>
                        setEditing((current) => (current ? { ...current, description: event.target.value } : null))
                      }
                      bg="whiteAlpha.100"
                      borderColor="whiteAlpha.200"
                      color="gray.100"
                    />
                    <select
                      value={editing.status}
                      onChange={(event) =>
                        setEditing((current) => (current ? { ...current, status: event.target.value as TaskStatus } : null))
                      }
                      style={{
                        background: '#1f2937',
                        color: '#e5e7eb',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: 8,
                        padding: '10px 12px',
                      }}
                    >
                      <option value="pending">Pending</option>
                      <option value="done">Done</option>
                    </select>
                    <HStack justify="flex-end">
                      <Button size="sm" variant="ghost" color="gray.300" onClick={() => setEditing(null)}>
                        Cancel
                      </Button>
                      <Button size="sm" colorPalette="blue" onClick={saveEdit} loading={isBusy}>
                        Save
                      </Button>
                    </HStack>
                  </Stack>
                ) : (
                  <Flex justify="space-between" align={{ base: 'flex-start', md: 'center' }} gap={3}>
                    <Box>
                      <Text fontSize="lg" fontWeight="700" color="gray.100">
                        {task.title}
                      </Text>
                      <Text mt={1} color="gray.300">
                        {task.description}
                      </Text>
                      {task.dueDate && (
                        <Text mt={2} fontSize="sm" color="gray.400">
                          Due: {task.dueDate}
                        </Text>
                      )}
                    </Box>
                    <HStack>
                      <Badge colorPalette={statusColor[task.status]} fontSize="0.8rem" px={3} py={1} borderRadius="full">
                        {statusLabel[task.status]}
                      </Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        color="gray.300"
                        onClick={() =>
                          setEditing({
                            taskId: task.id,
                            title: task.title,
                            description: task.description,
                            status: task.status,
                          })
                        }
                      >
                        ✏
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        color="red.300"
                        onClick={() => onDeleteTask(task.id)}
                        loading={isBusy}
                      >
                        🗑
                      </Button>
                    </HStack>
                  </Flex>
                )}
              </Box>
            )
          })}
        </Stack>
      )}

      <Flex
        borderTopWidth="1px"
        borderColor="whiteAlpha.200"
        px={5}
        py={4}
        align={{ base: 'flex-start', md: 'center' }}
        justify="space-between"
        gap={4}
        direction={{ base: 'column', md: 'row' }}
      >
        <Text color="gray.400" fontSize="sm">
          {filteredTasks.length} {filteredTasks.length === 1 ? 'item' : 'items'}
        </Text>
        <HStack gap={2}>
          <Button size="sm" variant={filter === 'all' ? 'subtle' : 'ghost'} colorPalette="blue" color={filter === 'all' ? undefined : 'gray.300'} onClick={() => setFilter('all')}>
            All
          </Button>
          <Button
            size="sm"
            variant={filter === 'active' ? 'subtle' : 'ghost'}
            colorPalette="blue"
            color={filter === 'active' ? undefined : 'gray.300'}
            onClick={() => setFilter('active')}
          >
            Active
          </Button>
          <Button
            size="sm"
            variant={filter === 'completed' ? 'subtle' : 'ghost'}
            colorPalette="blue"
            color={filter === 'completed' ? undefined : 'gray.300'}
            onClick={() => setFilter('completed')}
          >
            Completed
          </Button>
        </HStack>
        <Button
          size="sm"
          variant="ghost"
          color="gray.300"
          onClick={clearCompleted}
          disabled={completedTasks.length === 0 || isClearingCompleted}
          loading={isClearingCompleted}
        >
          Clear completed
        </Button>
      </Flex>
    </Box>
  )
}
