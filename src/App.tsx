import { useEffect, useState } from 'react'
import { isAuthenticated } from './lib/auth'
import { CreateTaskPage } from './pages/CreateTaskPage'
import { DashboardPage } from './pages/DashboardPage'
import { LoginPage } from './pages/LoginPage'

function navigate(path: string) {
  window.history.pushState({}, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

function App() {
  const [pathname, setPathname] = useState(window.location.pathname)

  useEffect(() => {
    const handlePopState = () => setPathname(window.location.pathname)
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => {
    const privateRoutes = ['/dashboard', '/create-task']
    if (privateRoutes.includes(pathname) && !isAuthenticated()) {
      navigate('/')
    }
  }, [pathname])

  if (pathname === '/create-task' && isAuthenticated()) {
    return <CreateTaskPage />
  }

  if (pathname === '/dashboard' && isAuthenticated()) {
    return <DashboardPage />
  }

  return <LoginPage onLoginSuccess={() => navigate('/dashboard')} />
}

export default App
