import { Box, Container } from '@chakra-ui/react'
import { DashboardHeader } from '../components/dashboard/DashboardHeader'
import { DashboardStats } from '../components/dashboard/DashboardStats'
import { TaskList } from '../components/dashboard/TaskList'
import { useTasks } from '../hooks/useTasks'

export function DashboardPage() {
  const { tasks, stats, isLoading, errorMessage, busyTaskId, categories, handleDelete, handleUpdate } = useTasks()

  return (
    <Box as="main" minH="100vh" bg="var(--app-bg)">
      <DashboardHeader active="dashboard" />
      <Box pt={{ base: 8, md: 10 }} pb={{ base: 10, md: 12 }}>
        <Container maxW="7xl" px={{ base: 4, md: 8 }}>
          <DashboardStats stats={stats} />
        </Container>
      </Box>

      <Box pb={16}>
        <Container maxW="7xl" px={{ base: 4, md: 8 }}>
          {errorMessage ? (
            <Box bg="var(--danger-bg)" color="var(--danger-text)" borderRadius="xl" p={4} borderWidth="1px" borderColor="var(--danger-border)">
              {errorMessage}
            </Box>
          ) : isLoading ? (
            <Box bg="var(--surface)" color="var(--muted-text)" borderRadius="2xl" p={8} borderWidth="1px" borderColor="var(--border)" boxShadow="var(--card-shadow)">
              Loading tasks...
            </Box>
          ) : (
            <TaskList tasks={tasks} categories={categories} busyTaskId={busyTaskId} onDeleteTask={handleDelete} onUpdateTask={handleUpdate} />
          )}
        </Container>
      </Box>
    </Box>
  )
}
