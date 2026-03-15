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
    <Box bg="#FFFFFF" borderRadius="2xl" borderWidth="1px" borderColor="#E2E8F0" boxShadow="0 18px 40px rgba(15, 23, 42, 0.06)" overflow="hidden">
      <Box px={5} py={4} borderBottomWidth="1px" borderColor="#E2E8F0">
        <Text color="#1E293B" fontWeight="700" fontSize="lg">
          Your tasks
        </Text>
      </Box>

      {filteredTasks.length === 0 ? (
        <Box p={8}>
          <Text color="#64748B" textAlign="center">
            {tasks.length === 0 ? 'No tasks found for this user.' : 'No tasks match the selected filter.'}
          </Text>
        </Box>
      ) : (
        <Stack separator={<Separator borderColor="#E2E8F0" />} p={5} gap={4}>
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
                      bg="#FFFFFF"
                      borderColor="#CBD5E1"
                      color="#1E293B"
                    />
                    <Textarea
                      value={editing.description}
                      onChange={(event) =>
                        setEditing((current) => (current ? { ...current, description: event.target.value } : null))
                      }
                      bg="#FFFFFF"
                      borderColor="#CBD5E1"
                      color="#1E293B"
                    />
                    <select
                      value={editing.status}
                      onChange={(event) =>
                        setEditing((current) => (current ? { ...current, status: event.target.value as TaskStatus } : null))
                      }
                      style={{
                        background: '#ffffff',
                        color: '#1e293b',
                        border: '1px solid #CBD5E1',
                        borderRadius: 8,
                        padding: '10px 12px',
                      }}
                    >
                      <option value="pending">Pending</option>
                      <option value="done">Done</option>
                    </select>
                    <HStack justify="flex-end">
                      <Button size="sm" variant="ghost" color="#64748B" onClick={() => setEditing(null)}>
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
                      <Text fontSize="lg" fontWeight="700" color="#1E293B">
                        {task.title}
                      </Text>
                      <Text mt={1} color="#64748B">
                        {task.description}
                      </Text>
                      {task.dueDate && (
                        <Text mt={2} fontSize="sm" color="#94A3B8">
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
                        color="#64748B"
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
                        color="#DC2626"
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
        borderColor="#E2E8F0"
        px={5}
        py={4}
        align={{ base: 'flex-start', md: 'center' }}
        justify="space-between"
        gap={4}
        direction={{ base: 'column', md: 'row' }}
      >
        <Text color="#94A3B8" fontSize="sm">
          {filteredTasks.length} {filteredTasks.length === 1 ? 'item' : 'items'}
        </Text>
        <HStack gap={2}>
          <Button size="sm" variant={filter === 'all' ? 'subtle' : 'ghost'} colorPalette="blue" color={filter === 'all' ? undefined : '#64748B'} onClick={() => setFilter('all')}>
            All
          </Button>
          <Button
            size="sm"
            variant={filter === 'active' ? 'subtle' : 'ghost'}
            colorPalette="blue"
            color={filter === 'active' ? undefined : '#64748B'}
            onClick={() => setFilter('active')}
          >
            Active
          </Button>
          <Button
            size="sm"
            variant={filter === 'completed' ? 'subtle' : 'ghost'}
            colorPalette="blue"
            color={filter === 'completed' ? undefined : '#64748B'}
            onClick={() => setFilter('completed')}
          >
            Completed
          </Button>
        </HStack>
        <Button
          size="sm"
          variant="ghost"
          color="#64748B"
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
