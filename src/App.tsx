import { useEffect, useState } from 'react'
import { isAuthenticated, subscribeToAuthChanges } from './lib/auth'
import { CreateTaskPage } from './pages/CreateTaskPage'
import { DashboardPage } from './pages/DashboardPage'
import { LoginPage } from './pages/LoginPage'

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
      navigate('/')
    }
  }, [authenticated, pathname])

  if (pathname === '/create-task' && authenticated) {
    return <CreateTaskPage />
  }

  if (pathname === '/dashboard' && authenticated) {
    return <DashboardPage />
  }

  return <LoginPage onLoginSuccess={() => navigate('/dashboard')} />
}

export default App
