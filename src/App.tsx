import { useEffect, useState } from 'react'
import { isAuthenticated } from './lib/auth'
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
    if (pathname === '/dashboard' && !isAuthenticated()) {
      navigate('/')
    }
  }, [pathname])

  if (pathname === '/dashboard' && isAuthenticated()) {
    return <DashboardPage />
  }

  return <LoginPage onLoginSuccess={() => navigate('/dashboard')} />
}

export default App
