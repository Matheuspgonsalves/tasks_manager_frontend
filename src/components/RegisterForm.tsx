import { Box, Button, IconButton, Input, Stack, Text } from '@chakra-ui/react'
import { useState } from 'react'
import { strongPasswordRegex } from '../lib/register.schema'
import type { RegisterFormErrors, RegisterFormValues } from '../lib/register.schema'

function EyeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function EyeOffIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3l18 18" />
      <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
      <path d="M9.9 5.1A11 11 0 0 1 12 5c6.4 0 10 7 10 7a17.6 17.6 0 0 1-4 4.9" />
      <path d="M6.7 6.7C3.8 8.5 2 12 2 12a17.7 17.7 0 0 0 10 7 10.9 10.9 0 0 0 5.3-1.3" />
    </svg>
  )
}

function GoogleIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.3-1.5 3.9-5.5 3.9-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.2.8 3.9 1.5l2.7-2.6C16.9 3.2 14.7 2.3 12 2.3 6.8 2.3 2.6 6.5 2.6 11.7S6.8 21.1 12 21.1c6.9 0 9.1-4.8 9.1-7.3 0-.5-.1-.9-.1-1.3H12Z" />
      <path fill="#34A853" d="M2.6 11.7c0 1.7.4 3.2 1.2 4.6l3.5-2.7c-.2-.6-.4-1.2-.4-1.9s.1-1.3.4-1.9l-3.5-2.7c-.8 1.3-1.2 2.9-1.2 4.6Z" />
      <path fill="#FBBC05" d="M12 21.1c2.7 0 4.9-.9 6.6-2.4l-3.2-2.5c-.9.6-2 .9-3.4.9-2.6 0-4.9-1.8-5.7-4.2l-3.6 2.8c1.7 3.2 5 5.4 8.9 5.4Z" />
      <path fill="#4285F4" d="M18.6 18.7c1.9-1.8 2.5-4.5 2.5-6.3 0-.5-.1-.9-.1-1.3H12v3.9h5.5c-.2 1-.8 2.4-1.9 3.2l3 2.4Z" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m5 12 5 5L20 7" />
    </svg>
  )
}

function MinusIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M6 12h12" />
    </svg>
  )
}

type RegisterFormProps = {
  values: RegisterFormValues
  errors: RegisterFormErrors
  isSubmitting: boolean
  status: 'success' | 'error' | null
  message: string
  onFieldChange: (field: keyof RegisterFormValues, value: string) => void
  onSubmit: () => Promise<void>
  onGoogleSignIn: () => Promise<void>
}

export function RegisterForm({
  values,
  errors,
  isSubmitting,
  status,
  message,
  onFieldChange,
  onSubmit,
  onGoogleSignIn,
}: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const shouldShowPasswordHint = values.password.length > 0 && !strongPasswordRegex.test(values.password)
  const passwordChecks = [
    { label: '8+ caracteres', met: values.password.length >= 8 },
    { label: 'Letra minúscula', met: /[a-z]/.test(values.password) },
    { label: 'Letra maiúscula', met: /[A-Z]/.test(values.password) },
    { label: 'Caractere especial', met: /[^A-Za-z0-9]/.test(values.password) },
  ]

  return (
    <Box
      w="full"
      maxW="400px"
      bg="var(--surface)"
      p={{ base: 6, md: 8 }}
      borderWidth="1px"
      borderColor="var(--border)"
      borderRadius="12px"
      boxShadow="var(--card-shadow)"
    >
      {/* Header */}
      <Box mb={6}>
        <Box display="flex" alignItems="center" gap={2} mb={1}>
          <Box w="5px" h="5px" borderRadius="1px" bg="var(--accent)" flexShrink={0} />
          <Text color="var(--text-primary)" fontSize="xl" fontWeight={800} letterSpacing="-0.03em">
            Criar conta
          </Text>
        </Box>
        <Text color="var(--muted-text)" fontSize="sm" fontWeight={400} pl="13px">
          Preencha seus dados para se registrar
        </Text>
      </Box>

      <form onSubmit={(e) => { e.preventDefault(); void onSubmit() }}>
        <Stack gap={4}>
          {/* Name */}
          <Stack gap={1.5}>
            <label
              htmlFor="name"
              style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '-0.01em' }}
            >
              Nome
            </label>
            <Input
              id="name"
              value={values.name}
              onChange={(e) => onFieldChange('name', e.target.value)}
              placeholder="Seu nome completo"
              h="44px"
              rounded="lg"
              fontSize="sm"
              fontWeight={500}
              borderColor="var(--border-strong)"
              color="var(--text-primary)"
              bg="var(--surface)"
              _placeholder={{ color: 'var(--soft-text)' }}
              _hover={{ borderColor: 'var(--muted-text)' }}
              _focusVisible={{ borderColor: 'var(--accent)', boxShadow: '0 0 0 2px var(--accent-soft)' }}
            />
            {errors.name && <Text color="var(--danger-text)" fontSize="xs" fontWeight={500}>{errors.name}</Text>}
          </Stack>

          {/* Email */}
          <Stack gap={1.5}>
            <label
              htmlFor="email"
              style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '-0.01em' }}
            >
              E-mail
            </label>
            <Input
              id="email"
              type="email"
              value={values.email}
              onChange={(e) => onFieldChange('email', e.target.value)}
              placeholder="seu@email.com"
              h="44px"
              rounded="lg"
              fontSize="sm"
              fontWeight={500}
              borderColor="var(--border-strong)"
              color="var(--text-primary)"
              bg="var(--surface)"
              _placeholder={{ color: 'var(--soft-text)' }}
              _hover={{ borderColor: 'var(--muted-text)' }}
              _focusVisible={{ borderColor: 'var(--accent)', boxShadow: '0 0 0 2px var(--accent-soft)' }}
            />
            {errors.email && <Text color="var(--danger-text)" fontSize="xs" fontWeight={500}>{errors.email}</Text>}
          </Stack>

          {/* Password */}
          <Stack gap={1.5}>
            <label
              htmlFor="password"
              style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '-0.01em' }}
            >
              Senha
            </label>
            <Box position="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={values.password}
                onChange={(e) => onFieldChange('password', e.target.value)}
                placeholder="••••••••"
                pr="3rem"
                h="44px"
                rounded="lg"
                fontSize="sm"
                fontWeight={500}
                borderColor="var(--border-strong)"
                color="var(--text-primary)"
                bg="var(--surface)"
                _placeholder={{ color: 'var(--soft-text)' }}
                _hover={{ borderColor: 'var(--muted-text)' }}
                _focusVisible={{ borderColor: 'var(--accent)', boxShadow: '0 0 0 2px var(--accent-soft)' }}
              />
              <IconButton
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                type="button"
                variant="ghost"
                position="absolute"
                top="50%"
                right="0.5rem"
                transform="translateY(-50%)"
                minW="2rem"
                h="2rem"
                rounded="md"
                color="var(--soft-text)"
                _hover={{ bg: 'transparent', color: 'var(--muted-text)' }}
                _active={{ bg: 'transparent' }}
                onClick={() => setShowPassword((c) => !c)}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </IconButton>
            </Box>

            {/* Password strength checklist */}
            {shouldShowPasswordHint && (
              <Box
                mt={1}
                p={3}
                bg="var(--surface-muted)"
                borderRadius="8px"
                borderWidth="1px"
                borderColor="var(--border)"
              >
                <Stack gap={1.5}>
                  {passwordChecks.map((req) => (
                    <Box
                      key={req.label}
                      display="flex"
                      alignItems="center"
                      gap={2}
                      color={req.met ? 'var(--success-text)' : 'var(--muted-text)'}
                    >
                      <Box display="flex" alignItems="center" flexShrink={0}>
                        {req.met ? <CheckIcon /> : <MinusIcon />}
                      </Box>
                      <Text fontSize="xs" fontWeight={500}>{req.label}</Text>
                    </Box>
                  ))}
                </Stack>
              </Box>
            )}

            {errors.password && <Text color="var(--danger-text)" fontSize="xs" fontWeight={500}>{errors.password}</Text>}
          </Stack>

          {/* Status message */}
          {status && (
            <Box
              px={3}
              py={2.5}
              borderRadius="8px"
              bg={status === 'success' ? 'var(--success-bg)' : 'var(--danger-bg)'}
              borderWidth="1px"
              borderColor={status === 'success' ? 'var(--success-border)' : 'var(--danger-border)'}
            >
              <Text
                fontSize="sm"
                fontWeight={500}
                color={status === 'success' ? 'var(--success-text)' : 'var(--danger-text)'}
              >
                {message}
              </Text>
            </Box>
          )}

          {/* Submit */}
          <Button
            type="submit"
            bg="var(--accent)"
            color="white"
            h="44px"
            w="full"
            rounded="lg"
            fontWeight={700}
            fontSize="sm"
            letterSpacing="-0.01em"
            _hover={{ bg: 'var(--accent-strong)' }}
            disabled={isSubmitting}
            mt={1}
          >
            {isSubmitting ? 'Criando conta...' : 'Criar conta'}
          </Button>

          {/* Divider */}
          <Box display="flex" alignItems="center" gap={3}>
            <Box flex={1} h="1px" bg="var(--border)" />
            <Text fontSize="xs" fontWeight={500} color="var(--soft-text)" letterSpacing="0.04em" textTransform="uppercase">
              ou
            </Text>
            <Box flex={1} h="1px" bg="var(--border)" />
          </Box>

          {/* Google */}
          <Button
            type="button"
            variant="outline"
            h="44px"
            w="full"
            rounded="lg"
            fontWeight={600}
            fontSize="sm"
            borderColor="var(--border-strong)"
            color="var(--text-secondary)"
            bg="var(--surface)"
            gap={2.5}
            _hover={{ bg: 'var(--surface-hover)', borderColor: 'var(--muted-text)' }}
            onClick={() => void onGoogleSignIn()}
          >
            <GoogleIcon />
            Continuar com Google
          </Button>
        </Stack>
      </form>
    </Box>
  )
}
