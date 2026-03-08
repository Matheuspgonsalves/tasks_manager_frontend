import { RegisterForm } from '../components/RegisterForm'
import { useRegister } from '../hooks/useRegister'

export function RegisterPage() {
  const { values, errors, isSubmitting, status, message, updateField, submit } = useRegister()

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-200 px-4">
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
