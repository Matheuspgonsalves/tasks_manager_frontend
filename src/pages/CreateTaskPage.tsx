import { Box, Container } from '@chakra-ui/react'
import { DashboardHeader } from '../components/dashboard/DashboardHeader'
import { CreateTaskForm } from '../components/tasks/CreateTaskForm'
import { useCreateTask } from '../hooks/useCreateTask'

export function CreateTaskPage() {
  const { values, errors, isSubmitting, message, status, updateField, submit } = useCreateTask()

  return (
    <Box as="main" minH="100vh" bg="#090d16">
      <DashboardHeader active="create-task" />
      <Box
        bgGradient="radial(circle at top right, rgba(168,85,247,0.2), transparent 45%), radial(circle at top left, rgba(34,211,238,0.14), transparent 50%), linear-gradient(180deg, #0b1020 0%, #0a0f1d 100%)"
        pt={{ base: 10, md: 14 }}
        pb={16}
      >
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
