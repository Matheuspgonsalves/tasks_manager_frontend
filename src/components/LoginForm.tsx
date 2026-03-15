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
      bg="var(--surface)"
      p={{ base: 6, md: 8 }}
      borderWidth="1px"
      borderColor="var(--border)"
      boxShadow="var(--card-shadow)"
    >
      <form onSubmit={handleSubmit}>
        <Stack gap={4}>
          <Heading size="xl" textAlign="center" color="var(--text-secondary)">
            Sign in to your account
          </Heading>
          <Text color="var(--muted-text)" textAlign="center">
            Enter your credentials to access the system
          </Text>

          <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }} htmlFor="email">
            Email
          </label>
          <Input
            id="email"
            type="email"
            value={values.email}
            onChange={(event) => onFieldChange('email', event.target.value)}
            placeholder="you@email.com"
            borderColor="var(--border-strong)"
            color="var(--text-secondary)"
            bg="var(--surface)"
          />
          {errors.email && <Text mt={-2} color="red.600" fontSize="sm">{errors.email}</Text>}

          <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }} htmlFor="password">
            Password
          </label>
          <Input
            id="password"
            type="password"
            value={values.password}
            onChange={(event) => onFieldChange('password', event.target.value)}
            placeholder="Your password"
            borderColor="var(--border-strong)"
            color="var(--text-secondary)"
            bg="var(--surface)"
          />
          {errors.password && <Text mt={-2} color="red.600" fontSize="sm">{errors.password}</Text>}

          {status && (
            <Box
              rounded="md"
              px={3}
              py={2}
              bg={status === 'success' ? 'var(--success-bg)' : status === 'info' ? 'var(--accent-soft)' : 'var(--danger-bg)'}
              borderWidth="1px"
              borderColor={status === 'success' ? 'var(--success-border)' : status === 'info' ? 'var(--accent-border)' : 'var(--danger-border)'}
            >
              <Text color={status === 'success' ? 'var(--success-text)' : status === 'info' ? 'var(--accent-strong)' : 'var(--danger-text)'}>
                {message}
              </Text>
            </Box>
          )}

          <Button
            type="submit"
            bg="var(--accent)"
            color="white"
            _hover={{ bg: 'var(--accent-strong)' }}
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
