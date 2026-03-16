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
    <Box w="full" maxW="420px" rounded="2xl" bg="var(--surface)" p={{ base: 5, md: 8 }} boxShadow="var(--card-shadow)" borderWidth="1px" borderColor="var(--border)">
      <form onSubmit={handleSubmit}>
        <Stack gap={4}>
          <Heading size={{ base: 'lg', md: 'xl' }} textAlign="center" color="var(--text-secondary)">
            Crie sua conta
          </Heading>
          <Text color="var(--muted-text)" textAlign="center" fontSize={{ base: 'sm', md: 'md' }}>
            Preencha seus dados para se registrar
          </Text>

          <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }} htmlFor="name">
            Nome
          </label>
          <Input
            id="name"
            value={values.name}
            onChange={(event) => onFieldChange('name', event.target.value)}
            placeholder="Seu nome"
            borderColor="var(--border-strong)"
            color="var(--text-secondary)"
            bg="var(--surface)"
          />
          {errors.name && <Text mt={-2} color="red.600" fontSize="sm">{errors.name}</Text>}

          <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }} htmlFor="email">
            E-mail
          </label>
          <Input
            id="email"
            type="email"
            value={values.email}
            onChange={(event) => onFieldChange('email', event.target.value)}
            placeholder="voce@email.com"
            borderColor="var(--border-strong)"
            color="var(--text-secondary)"
            bg="var(--surface)"
          />
          {errors.email && <Text mt={-2} color="red.600" fontSize="sm">{errors.email}</Text>}

          <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }} htmlFor="password">
            Senha
          </label>
          <Input
            id="password"
            type="password"
            value={values.password}
            onChange={(event) => onFieldChange('password', event.target.value)}
            placeholder="Crie uma senha"
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
              bg={status === 'success' ? 'var(--success-bg)' : 'var(--danger-bg)'}
              borderWidth="1px"
              borderColor={status === 'success' ? 'var(--success-border)' : 'var(--danger-border)'}
            >
              <Text color={status === 'success' ? 'var(--success-text)' : 'var(--danger-text)'}>{message}</Text>
            </Box>
          )}

          <Button type="submit" bg="var(--accent)" color="white" h={{ base: '46px', md: '40px' }} w="full" _hover={{ bg: 'var(--accent-strong)' }} disabled={isSubmitting}>
            {isSubmitting ? 'Enviando...' : 'Registrar'}
          </Button>
        </Stack>
      </form>
    </Box>
  )
}
