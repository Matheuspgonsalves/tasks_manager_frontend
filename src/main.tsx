import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import './index.css'
import App from './App'
import { ThemeProvider } from './lib/theme'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element not found')
}

createRoot(rootElement).render(
  <StrictMode>
    <ChakraProvider value={defaultSystem}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </ChakraProvider>
  </StrictMode>,
)
