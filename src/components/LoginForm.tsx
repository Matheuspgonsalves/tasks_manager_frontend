import { Box, Button, Heading, Input, Stack, Text } from '@chakra-ui/react'
import type { FormEvent } from 'react'
import type { LoginFormErrors, LoginFormValues } from '../lib/login.schema'

type LoginFormProps = {
  values: LoginFormValues
  errors: LoginFormErrors
  isSubmitting: boolean
  status: 'success' | 'error' | 'info' | null
  message: string
  onFieldChange: (field: keyof LoginFormValues, value: string) => void
  onSubmit: () => Promise<void>
}

export function LoginForm({
  values,
  errors,
  isSubmitting,
  status,
  message,
  onFieldChange,
  onSubmit,
}: LoginFormProps) {
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await onSubmit()
  }

  return (
    <Box
      w="full"
      maxW="420px"
      rounded="2xl"
      bg="#FFFFFF"
      p={{ base: 6, md: 8 }}
      borderWidth="1px"
      borderColor="#E2E8F0"
      boxShadow="0 18px 40px rgba(15, 23, 42, 0.06)"
    >
      <form onSubmit={handleSubmit}>
        <Stack gap={4}>
          <Heading size="xl" textAlign="center" color="#1E293B">
            Sign in to your account
          </Heading>
          <Text color="#64748B" textAlign="center">
            Enter your credentials to access the system
          </Text>

          <label className="text-sm font-medium text-slate-700" htmlFor="email">
            Email
          </label>
          <Input
            id="email"
            type="email"
            value={values.email}
            onChange={(event) => onFieldChange('email', event.target.value)}
            placeholder="you@email.com"
            borderColor="#CBD5E1"
            color="#1E293B"
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
            placeholder="Your password"
            borderColor="#CBD5E1"
            color="#1E293B"
          />
          {errors.password && <Text mt={-2} color="red.600" fontSize="sm">{errors.password}</Text>}

          {status && (
            <Box
              rounded="md"
              px={3}
              py={2}
              bg={status === 'success' ? 'green.50' : status === 'info' ? 'blue.50' : 'red.50'}
              borderWidth="1px"
              borderColor={status === 'success' ? 'green.200' : status === 'info' ? 'blue.200' : 'red.200'}
            >
              <Text color={status === 'success' ? 'green.700' : status === 'info' ? 'blue.700' : 'red.700'}>
                {message}
              </Text>
            </Box>
          )}

          <Button
            type="submit"
            bg="#5C7CFA"
            color="white"
            _hover={{ bg: '#4F6EF7' }}
            loading={isSubmitting}
            loadingText="Signing in"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Login'}
          </Button>
        </Stack>
      </form>
    </Box>
  )
}
