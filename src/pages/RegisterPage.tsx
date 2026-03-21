import { Text } from '@chakra-ui/react'
import { PublicHeader } from '../components/PublicHeader'
import { RegisterForm } from '../components/RegisterForm'
import { useRegister } from '../hooks/useRegister'
import { signInWithGoogle } from '../lib/google-auth'

type RegisterPageProps = {
  onNavigate: (path: string) => void
}

export function RegisterPage({ onNavigate }: RegisterPageProps) {
  const { values, errors, isSubmitting, status, message, updateField, submit } = useRegister()
  const handleGoogleSignIn = async () => {
    await signInWithGoogle()
  }

  return (
    <main className="relative min-h-screen" style={{ background: 'var(--app-bg)' }}>
      <PublicHeader
        onNavigate={onNavigate}
        primaryAction={{ label: 'Faça Login', path: '/login' }}
      />
      <div style={{ width: '100%', display: 'flex', minHeight: 'calc(100vh - 73px)', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', padding: '1.5rem 1rem' }}>
        <RegisterForm
          values={values}
          errors={errors}
          isSubmitting={isSubmitting}
          status={status}
          message={message}
          onFieldChange={updateField}
          onSubmit={submit}
          onGoogleSignIn={handleGoogleSignIn}
        />
        <Text color="var(--muted-text)" textAlign="center" px={4} maxW="24rem">
          Já possui conta?{' '}
          <button type="button" onClick={() => onNavigate('/login')} style={{ color: 'var(--accent)', fontWeight: 700 }}>
            Entre agora
          </button>
        </Text>
      </div>
    </main>
  )
}
