import { Box, Container } from '@chakra-ui/react'
import { DashboardHeader } from '../components/dashboard/DashboardHeader'
import { DashboardStats } from '../components/dashboard/DashboardStats'
import { TaskList } from '../components/dashboard/TaskList'
import { useTasks } from '../hooks/useTasks'

export function DashboardPage() {
  const { tasks, stats, isLoading, errorMessage, busyTaskId, handleDelete, handleUpdate } = useTasks()

  return (
    <Box as="main" minH="100vh" bg="#090d16">
      <DashboardHeader active="dashboard" />
      <Box
        bgGradient="radial(circle at top right, rgba(168,85,247,0.2), transparent 45%), radial(circle at top left, rgba(34,211,238,0.14), transparent 50%), linear-gradient(180deg, #0b1020 0%, #0a0f1d 100%)"
        pt={{ base: 8, md: 10 }}
        pb={{ base: 36, md: 40 }}
      >
        <Container maxW="7xl" px={{ base: 4, md: 8 }}>
          <DashboardStats stats={stats} />
        </Container>
      </Box>

      <Box mt={{ base: -22, md: -24 }} pb={16}>
        <Container maxW="7xl" px={{ base: 4, md: 8 }}>
          {errorMessage ? (
            <Box bg="red.900" color="red.100" borderRadius="lg" p={4} borderWidth="1px" borderColor="red.500">
              {errorMessage}
            </Box>
          ) : isLoading ? (
            <Box bg="#111827" color="gray.300" borderRadius="2xl" p={8} borderWidth="1px" borderColor="whiteAlpha.200">
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
