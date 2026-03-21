import { Box, Button, Heading, IconButton, Input, Stack, Text } from '@chakra-ui/react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import type { LoginFormErrors, LoginFormValues } from '../lib/login.schema'

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function EyeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3l18 18" />
      <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
      <path d="M9.9 5.1A11 11 0 0 1 12 5c6.4 0 10 7 10 7a17.6 17.6 0 0 1-4 4.9" />
      <path d="M6.7 6.7C3.8 8.5 2 12 2 12a17.7 17.7 0 0 0 10 7 10.9 10.9 0 0 0 5.3-1.3" />
    </svg>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.3-1.5 3.9-5.5 3.9-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.2.8 3.9 1.5l2.7-2.6C16.9 3.2 14.7 2.3 12 2.3 6.8 2.3 2.6 6.5 2.6 11.7S6.8 21.1 12 21.1c6.9 0 9.1-4.8 9.1-7.3 0-.5-.1-.9-.1-1.3H12Z" />
      <path fill="#34A853" d="M2.6 11.7c0 1.7.4 3.2 1.2 4.6l3.5-2.7c-.2-.6-.4-1.2-.4-1.9s.1-1.3.4-1.9l-3.5-2.7c-.8 1.3-1.2 2.9-1.2 4.6Z" />
      <path fill="#FBBC05" d="M12 21.1c2.7 0 4.9-.9 6.6-2.4l-3.2-2.5c-.9.6-2 .9-3.4.9-2.6 0-4.9-1.8-5.7-4.2l-3.6 2.8c1.7 3.2 5 5.4 8.9 5.4Z" />
      <path fill="#4285F4" d="M18.6 18.7c1.9-1.8 2.5-4.5 2.5-6.3 0-.5-.1-.9-.1-1.3H12v3.9h5.5c-.2 1-.8 2.4-1.9 3.2l3 2.4Z" />
    </svg>
  )
}

type LoginFormProps = {
  values: LoginFormValues
  errors: LoginFormErrors
  isSubmitting: boolean
  status: 'success' | 'error' | 'info' | null
  message: string
  onFieldChange: (field: keyof LoginFormValues, value: string) => void
  onSubmit: () => Promise<void>
  onGoogleSignIn: () => Promise<void>
}

export function LoginForm({
  values,
  errors,
  isSubmitting,
  status,
  message,
  onFieldChange,
  onSubmit,
  onGoogleSignIn,
}: LoginFormProps) {
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await onSubmit()
  }
  const [showPassword, setShowPassword] = useState(false)

  return (
    <Box
      w="full"
      maxW="420px"
      rounded="2xl"
      bg="var(--surface)"
      p={{ base: 5, md: 8 }}
      borderWidth="1px"
      borderColor="var(--border)"
      boxShadow="var(--card-shadow)"
    >
      <form onSubmit={handleSubmit}>
        <Stack gap={4}>
          <Heading size={{ base: 'lg', md: 'xl' }} textAlign="center" color="var(--text-secondary)">
            Entre na sua conta
          </Heading>
          <Text color="var(--muted-text)" textAlign="center" fontSize={{ base: 'sm', md: 'md' }}>
            Informe suas credenciais para acessar o sistema
          </Text>

          <Stack gap={2}>
            <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }} htmlFor="email">
              E-mail
            </label>
            <Input
              id="email"
              type="email"
              value={values.email}
              onChange={(event) => onFieldChange('email', event.target.value)}
              placeholder="Seu e-mail"
              h="3rem"
              rounded="full"
              borderColor="var(--accent)"
              color="var(--text-secondary)"
              bg="var(--surface)"
              _hover={{ borderColor: 'var(--accent)' }}
              _focusVisible={{
                borderColor: 'var(--accent)',
                boxShadow: '0 0 0 1px var(--accent)',
              }}
            />
          </Stack>
          {errors.email && <Text mt={-2} color="red.600" fontSize="sm">{errors.email}</Text>}

          <Stack gap={2}>
            <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }} htmlFor="password">
              Senha
            </label>
            <Box position="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={values.password}
                onChange={(event) => onFieldChange('password', event.target.value)}
                placeholder="Sua senha"
                pr="3.25rem"
                h="3rem"
                rounded="full"
                borderColor="var(--accent)"
                color="var(--text-secondary)"
                bg="var(--surface)"
                _hover={{ borderColor: 'var(--accent)' }}
                _focusVisible={{
                  borderColor: 'var(--accent)',
                  boxShadow: '0 0 0 1px var(--accent)',
                }}
              />
              <IconButton
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                type="button"
                variant="ghost"
                position="absolute"
                top="50%"
                right="0.5rem"
                transform="translateY(-50%)"
                minW="2.25rem"
                h="2.25rem"
                rounded="full"
                color="var(--muted-text)"
                _hover={{ bg: 'transparent', color: 'var(--accent-strong)' }}
                _active={{ bg: 'transparent' }}
                onClick={() => setShowPassword((current) => !current)}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </IconButton>
            </Box>
          </Stack>
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
            h="3rem"
            w="full"
            rounded="full"
            _hover={{ bg: 'var(--accent-strong)' }}
            loading={isSubmitting}
            loadingText="Entrando"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Enviando...' : 'Fazer login'}
          </Button>

          <Button
            type="button"
            variant="outline"
            h="3rem"
            w="full"
            rounded="full"
            borderColor="var(--border-strong)"
            color="var(--text-secondary)"
            bg="var(--surface)"
            _hover={{ bg: 'var(--surface-hover)' }}
            onClick={() => void onGoogleSignIn()}
          >
            <Box as="span" display="inline-flex" mr={2}>
              <GoogleIcon />
            </Box>
            Entrar com Google
          </Button>
        </Stack>
      </form>
    </Box>
  )
}
