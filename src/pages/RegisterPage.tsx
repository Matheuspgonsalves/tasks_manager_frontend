import { RegisterForm } from '../components/RegisterForm'
import { ThemeToggle } from '../components/ThemeToggle'
import { useRegister } from '../hooks/useRegister'

export function RegisterPage() {
  const { values, errors, isSubmitting, status, message, updateField, submit } = useRegister()

  return (
    <main className="relative flex min-h-screen items-center justify-center px-4" style={{ background: 'var(--app-bg)' }}>
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <RegisterForm
        values={values}
        errors={errors}
        isSubmitting={isSubmitting}
        status={status}
        message={message}
        onFieldChange={updateField}
        onSubmit={submit}
      />
    </main>
  )
}
