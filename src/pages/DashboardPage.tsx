import { Box, Container } from '@chakra-ui/react'
import { DashboardHeader } from '../components/dashboard/DashboardHeader'
import { DashboardStats } from '../components/dashboard/DashboardStats'
import { TaskList } from '../components/dashboard/TaskList'
import { useTasks } from '../hooks/useTasks'

export function DashboardPage() {
  const { tasks, stats, isLoading, errorMessage, busyTaskId, handleDelete, handleUpdate } = useTasks()

  return (
    <Box as="main" minH="100vh" bg="#F8FAFC">
      <DashboardHeader active="dashboard" />
      <Box pt={{ base: 8, md: 10 }} pb={{ base: 10, md: 12 }}>
        <Container maxW="7xl" px={{ base: 4, md: 8 }}>
          <DashboardStats stats={stats} />
        </Container>
      </Box>

      <Box pb={16}>
        <Container maxW="7xl" px={{ base: 4, md: 8 }}>
          {errorMessage ? (
            <Box bg="#FEF2F2" color="#B91C1C" borderRadius="xl" p={4} borderWidth="1px" borderColor="#FECACA">
              {errorMessage}
            </Box>
          ) : isLoading ? (
            <Box bg="#FFFFFF" color="#64748B" borderRadius="2xl" p={8} borderWidth="1px" borderColor="#E2E8F0" boxShadow="0 18px 40px rgba(15, 23, 42, 0.06)">
              Loading tasks...
            </Box>
          ) : (
            <TaskList tasks={tasks} busyTaskId={busyTaskId} onDeleteTask={handleDelete} onUpdateTask={handleUpdate} />
          )}
        </Container>
      </Box>
    </Box>
  )
}
