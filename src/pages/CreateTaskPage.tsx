import { Box, Container } from '@chakra-ui/react'
import { DashboardHeader } from '../components/dashboard/DashboardHeader'
import { CreateTaskForm } from '../components/tasks/CreateTaskForm'
import { useCreateTask } from '../hooks/useCreateTask'

export function CreateTaskPage() {
  const { values, errors, isSubmitting, message, status, updateField, submit } = useCreateTask()

  return (
    <Box as="main" minH="100vh" bg="var(--app-bg)">
      <DashboardHeader active="create-task" />
      <Box pt={{ base: 10, md: 14 }} pb={16}>
        <Container maxW="4xl" px={{ base: 4, md: 8 }}>
          <CreateTaskForm
            values={values}
            errors={errors}
            isSubmitting={isSubmitting}
            status={status}
            message={message}
            onFieldChange={updateField}
            onSubmit={submit}
          />
        </Container>
      </Box>
    </Box>
  )
}
