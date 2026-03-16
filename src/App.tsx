import { useEffect, useState } from 'react'
import { isAuthenticated, subscribeToAuthChanges } from './lib/auth'
import { CreateTaskPage } from './pages/CreateTaskPage'
import { DashboardPage } from './pages/DashboardPage'
import { LandingPage } from './pages/LandingPage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'

function navigate(path: string) {
  window.history.pushState({}, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

function App() {
  const [pathname, setPathname] = useState(window.location.pathname)
  const [authenticated, setAuthenticated] = useState(() => isAuthenticated())

  useEffect(() => {
    const handlePopState = () => setPathname(window.location.pathname)
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => subscribeToAuthChanges(() => setAuthenticated(isAuthenticated())), [])

  useEffect(() => {
    const privateRoutes = ['/dashboard', '/create-task']
    if (privateRoutes.includes(pathname) && !authenticated) {
      navigate('/login')
    }
  }, [authenticated, pathname])

  if (pathname === '/create-task' && authenticated) {
    return <CreateTaskPage />
  }

  if (pathname === '/dashboard' && authenticated) {
    return <DashboardPage />
  }

  if (pathname === '/login') {
    return <LoginPage onLoginSuccess={() => navigate('/dashboard')} onNavigate={navigate} />
  }

  if (pathname === '/registre-se') {
    return <RegisterPage onNavigate={navigate} />
  }

  return <LandingPage onNavigate={navigate} />
}

export default App
