import { Box, Button, Heading, Input, Stack, Text } from '@chakra-ui/react'
import type { FormEvent } from 'react'
import type { RegisterFormErrors, RegisterFormValues } from '../lib/register.schema'

type RegisterFormProps = {
  values: RegisterFormValues
  errors: RegisterFormErrors
  isSubmitting: boolean
  status: 'success' | 'error' | null
  message: string
  onFieldChange: (field: keyof RegisterFormValues, value: string) => void
  onSubmit: () => Promise<void>
}

export function RegisterForm({
  values,
  errors,
  isSubmitting,
  status,
  message,
  onFieldChange,
  onSubmit,
}: RegisterFormProps) {
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await onSubmit()
  }

  return (
    <Box w="full" maxW="420px" rounded="xl" bg="white" p={{ base: 6, md: 8 }} shadow="lg" borderWidth="1px">
      <form onSubmit={handleSubmit}>
        <Stack gap={4}>
          <Heading size="xl" textAlign="center">
            Create your account
          </Heading>
          <Text color="gray.500" textAlign="center">
            Fill in your details to register
          </Text>

          <label className="text-sm font-medium text-slate-700" htmlFor="name">
            Name
          </label>
          <Input
            id="name"
            value={values.name}
            onChange={(event) => onFieldChange('name', event.target.value)}
            placeholder="John Doe"
          />
          {errors.name && <Text mt={-2} color="red.600" fontSize="sm">{errors.name}</Text>}

          <label className="text-sm font-medium text-slate-700" htmlFor="email">
            Email
          </label>
          <Input
            id="email"
            type="email"
            value={values.email}
            onChange={(event) => onFieldChange('email', event.target.value)}
            placeholder="john@email.com"
          />
          {errors.email && <Text mt={-2} color="red.600" fontSize="sm">{errors.email}</Text>}

          <label className="text-sm font-medium text-slate-700" htmlFor="password">
            Password
          </label>
          <Input
            id="password"
            type="password"
            value={values.password}
            onChange={(event) => onFieldChange('password', event.target.value)}
            placeholder="Enter your password"
          />
          {errors.password && <Text mt={-2} color="red.600" fontSize="sm">{errors.password}</Text>}

          {status && (
            <Box
              rounded="md"
              px={3}
              py={2}
              bg={status === 'success' ? 'green.50' : 'red.50'}
              borderWidth="1px"
              borderColor={status === 'success' ? 'green.200' : 'red.200'}
            >
              <Text color={status === 'success' ? 'green.700' : 'red.700'}>{message}</Text>
            </Box>
          )}

          <Button type="submit" bg="blue.600" color="white" _hover={{ bg: 'blue.700' }} disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Register'}
          </Button>
        </Stack>
      </form>
    </Box>
  )
}
