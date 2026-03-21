import { Box, Spinner, Text } from '@chakra-ui/react'
import { useEffect } from 'react'
import { persistGoogleSession } from '../lib/google-auth'

type AuthCallbackPageProps = {
  onNavigate: (path: string) => void
}

export function AuthCallbackPage({ onNavigate }: AuthCallbackPageProps) {
  useEffect(() => {
    async function completeAuth() {
      const success = await persistGoogleSession()
      onNavigate(success ? '/dashboard' : '/login')
    }

    void completeAuth()
  }, [onNavigate])

  return (
    <main className="relative min-h-screen" style={{ background: 'var(--app-bg)' }}>
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" px={4}>
        <Box
          w="full"
          maxW="380px"
          rounded="2xl"
          bg="var(--surface)"
          p={{ base: 6, md: 8 }}
          borderWidth="1px"
          borderColor="var(--border)"
          boxShadow="var(--card-shadow)"
          textAlign="center"
        >
          <Spinner color="var(--accent)" size="lg" />
          <Text mt={4} color="var(--text-secondary)" fontWeight="600">
            Finalizando login com Google...
          </Text>
        </Box>
      </Box>
    </main>
  )
}
