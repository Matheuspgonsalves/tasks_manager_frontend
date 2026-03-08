import { LoginForm } from '../components/LoginForm'
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
    <main className="flex min-h-screen items-center justify-center bg-slate-200 px-4">
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
