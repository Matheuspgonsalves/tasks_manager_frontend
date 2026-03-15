/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

type ThemeMode = 'light' | 'dark'

type ThemeContextValue = {
  mode: ThemeMode
  toggleMode: () => void
}

const STORAGE_KEY = 'theme_mode'

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

function getInitialMode(): ThemeMode {
  if (typeof window === 'undefined') {
    return 'light'
  }

  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') {
    return stored
  }

  return 'light'
}

type ThemeProviderProps = {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [mode, setMode] = useState<ThemeMode>(() => getInitialMode())

  useEffect(() => {
    document.documentElement.dataset.theme = mode
    window.localStorage.setItem(STORAGE_KEY, mode)
  }, [mode])

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      toggleMode: () => setMode((current) => (current === 'light' ? 'dark' : 'light')),
    }),
    [mode],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useThemeMode() {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error('useThemeMode must be used within ThemeProvider')
  }

  return context
}
