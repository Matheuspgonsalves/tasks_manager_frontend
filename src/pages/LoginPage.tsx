import { LoginForm } from '../components/LoginForm'
import { ThemeToggle } from '../components/ThemeToggle'
import { useLogin } from '../hooks/useLogin'

type LoginPageProps = {
  onLoginSuccess: () => void
}

export function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const { values, errors, isSubmitting, status, message, updateField, submit } = useLogin()
  const handleSubmit = async () => {
    const isSuccess = await submit()
    if (isSuccess) {
      onLoginSuccess()
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center px-4" style={{ background: 'var(--app-bg)' }}>
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <LoginForm
        values={values}
        errors={errors}
        isSubmitting={isSubmitting}
        status={status}
        message={message}
        onFieldChange={updateField}
        onSubmit={handleSubmit}
      />
    </main>
  )
}
