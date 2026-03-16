import { Box, Text } from '@chakra-ui/react'
import { LoginForm } from '../components/LoginForm'
import { PublicHeader } from '../components/PublicHeader'
import { useLogin } from '../hooks/useLogin'

type LoginPageProps = {
  onLoginSuccess: () => void
  onNavigate: (path: string) => void
}

export function LoginPage({ onLoginSuccess, onNavigate }: LoginPageProps) {
  const { values, errors, isSubmitting, status, message, updateField, submit } = useLogin()
  const handleSubmit = async () => {
    const isSuccess = await submit()
    if (isSuccess) {
      onLoginSuccess()
    }
  }

  return (
    <main className="relative min-h-screen" style={{ background: 'var(--app-bg)' }}>
      <PublicHeader
        onNavigate={onNavigate}
        primaryAction={{ label: 'Registre-se', path: '/registre-se' }}
      />
      <div style={{ width: '100%', display: 'flex', minHeight: 'calc(100vh - 73px)', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', padding: '1.5rem 1rem' }}>
        <LoginForm
          values={values}
          errors={errors}
          isSubmitting={isSubmitting}
          status={status}
          message={message}
          onFieldChange={updateField}
          onSubmit={handleSubmit}
        />
        <Text color="var(--muted-text)" textAlign="center" px={4} maxW="24rem">
          Ainda não tem conta?{' '}
          <button type="button" onClick={() => onNavigate('/registre-se')} style={{ color: 'var(--accent)', fontWeight: 700 }}>
            Crie sua conta
          </button>
        </Text>
      </div>
    </main>
  )
}
