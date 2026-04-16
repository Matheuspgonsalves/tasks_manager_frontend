import { Box, Button, Container, Flex, HStack, Stack, Text } from '@chakra-ui/react'
import { useState } from 'react'
import type { ReactElement } from 'react'
import { ThemeToggle } from '../ThemeToggle'
import { clearAuthSession } from '../../lib/auth'
import { logout } from '../../services/auth.service'

function navigate(path: string) {
  window.history.pushState({}, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

type DashboardHeaderProps = {
  active: 'dashboard' | 'create-task' | 'categories'
}

type NavItem = {
  key: string
  label: string
  isActive?: boolean
  onClick: () => void
  icon: ReactElement
}

function DashboardIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="4.5" rx="1" />
      <rect x="14" y="10.5" width="7" height="10.5" rx="1" />
      <rect x="3" y="13.5" width="7" height="7.5" rx="1" />
    </svg>
  )
}

function CreateTaskIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  )
}

function CategoriesIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10 4H5a1 1 0 0 0-1 1v5l8.5 8.5a2.1 2.1 0 0 0 3 0l3-3a2.1 2.1 0 0 0 0-3L10 4Z" />
      <path d="M7.5 7.5h.01" />
    </svg>
  )
}

function LogoutIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  )
}

function MenuIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}

function NavButton({ label, icon, isActive, onClick, fullWidth = false }: NavItem & { fullWidth?: boolean }) {
  return (
    <Button
      onClick={onClick}
      variant="ghost"
      h="36px"
      px={3}
      gap={2}
      w={fullWidth ? 'full' : 'auto'}
      justifyContent={fullWidth ? 'flex-start' : 'center'}
      rounded="md"
      fontWeight={isActive ? 700 : 500}
      fontSize="sm"
      color={isActive ? 'var(--accent)' : 'var(--muted-text)'}
      bg={isActive ? 'var(--accent-soft)' : 'transparent'}
      position="relative"
      transition="all 0.15s"
      _hover={{
        bg: isActive ? 'var(--accent-soft)' : 'var(--surface-hover)',
        color: isActive ? 'var(--accent)' : 'var(--text-primary)',
      }}
    >
      <Box color="currentColor" display="flex" alignItems="center">{icon}</Box>
      <Text>{label}</Text>
      {isActive && !fullWidth && (
        <Box
          position="absolute"
          bottom="-1px"
          left="12px"
          right="12px"
          h="2px"
          bg="var(--accent)"
          borderRadius="full"
        />
      )}
    </Button>
  )
}

export function DashboardHeader({ active }: DashboardHeaderProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  async function handleLogout() {
    setIsLoggingOut(true)
    try {
      await logout()
    } catch {
      // Clear local session even if backend is temporarily unavailable.
    } finally {
      clearAuthSession()
      setIsMobileMenuOpen(false)
      navigate('/')
      setIsLoggingOut(false)
    }
  }

  const navItems: NavItem[] = [
    {
      key: 'dashboard',
      label: 'Dashboard',
      isActive: active === 'dashboard',
      onClick: () => { setIsMobileMenuOpen(false); navigate('/dashboard') },
      icon: <DashboardIcon />,
    },
    {
      key: 'create-task',
      label: 'Nova tarefa',
      isActive: active === 'create-task',
      onClick: () => { setIsMobileMenuOpen(false); navigate('/create-task') },
      icon: <CreateTaskIcon />,
    },
    {
      key: 'create-categories',
      label: 'Categorias',
      isActive: active === 'categories',
      onClick: () => { setIsMobileMenuOpen(false); navigate('/categories') },
      icon: <CategoriesIcon />,
    },
  ]

  return (
    <Box
      as="header"
      position="sticky"
      top={0}
      zIndex={30}
      w="full"
      bg="var(--surface)"
      borderBottomWidth="1px"
      borderColor="var(--border)"
    >
      {/* Desktop */}
      <Container display={{ base: 'none', lg: 'block' }} maxW="7xl" px={{ base: 5, md: 10 }}>
        <Flex h="60px" align="center" justify="space-between" gap={4}>
          {/* Left: wordmark + nav */}
          <HStack gap={6} flex="1" minW={0}>
            <HStack
              gap={2}
              flexShrink={0}
              cursor="pointer"
              onClick={() => navigate('/dashboard')}
              _hover={{ opacity: 0.7 }}
              transition="opacity 0.15s"
            >
              <Box w="7px" h="7px" borderRadius="2px" bg="var(--accent)" flexShrink={0} />
              <Text color="var(--text-primary)" fontSize="md" fontWeight={800} letterSpacing="-0.04em">
                Dolistify
              </Text>
            </HStack>

            {/* Nav separator */}
            <Box w="1px" h="20px" bg="var(--border)" flexShrink={0} />

            <HStack gap={1} overflowX="auto" whiteSpace="nowrap" css={{ scrollbarWidth: 'none' }}>
              {navItems.map((item) => (
                <NavButton key={item.key} {...item} />
              ))}
            </HStack>
          </HStack>

          {/* Right: theme + logout */}
          <HStack gap={2} flexShrink={0}>
            <ThemeToggle compact />
            <Button
              onClick={handleLogout}
              loading={isLoggingOut}
              variant="ghost"
              h="36px"
              px={3}
              gap={2}
              rounded="md"
              fontWeight={500}
              fontSize="sm"
              color="var(--muted-text)"
              _hover={{ bg: 'var(--danger-bg)', color: 'var(--danger-text)' }}
              transition="all 0.15s"
            >
              <LogoutIcon />
              <Text>Sair</Text>
            </Button>
          </HStack>
        </Flex>
      </Container>

      {/* Mobile */}
      <Container display={{ base: 'block', lg: 'none' }} maxW="7xl" px={{ base: 4, md: 6 }}>
        <Flex minH="60px" align="center" justify="space-between" gap={3}>
          <HStack gap={2} cursor="pointer" onClick={() => navigate('/dashboard')}>
            <Box w="7px" h="7px" borderRadius="2px" bg="var(--accent)" />
            <Text color="var(--text-primary)" fontSize="md" fontWeight={800} letterSpacing="-0.04em">
              Dolistify
            </Text>
          </HStack>

          <HStack gap={2} flexShrink={0}>
            <ThemeToggle compact />
            <Button
              aria-label={isMobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
              onClick={() => setIsMobileMenuOpen((c) => !c)}
              variant="ghost"
              h="38px"
              minW="38px"
              px={0}
              rounded="lg"
              borderWidth="1px"
              borderColor="var(--border)"
              color="var(--text-primary)"
            >
              {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </Button>
          </HStack>
        </Flex>
      </Container>

      {/* Mobile drawer */}
      {isMobileMenuOpen && (
        <Box display={{ base: 'block', lg: 'none' }} position="fixed" inset={0} zIndex={40}>
          <Box position="absolute" inset={0} bg="rgba(0,0,0,0.3)" onClick={() => setIsMobileMenuOpen(false)} />
          <Box
            position="absolute"
            top={0}
            right={0}
            h="100dvh"
            w={{ base: '82%', sm: '20rem' }}
            bg="var(--surface)"
            borderLeftWidth="1px"
            borderColor="var(--border)"
            boxShadow="var(--card-shadow)"
            px={5}
            py={5}
          >
            <Flex align="center" justify="space-between" mb={6}>
              <HStack gap={2}>
                <Box w="7px" h="7px" borderRadius="2px" bg="var(--accent)" />
                <Text color="var(--text-primary)" fontSize="md" fontWeight={800} letterSpacing="-0.04em">
                  Dolistify
                </Text>
              </HStack>
              <Button
                aria-label="Fechar menu"
                onClick={() => setIsMobileMenuOpen(false)}
                variant="ghost" h="38px" minW="38px" px={0} rounded="lg"
                color="var(--muted-text)"
              >
                <CloseIcon />
              </Button>
            </Flex>

            <Stack gap={1}>
              {navItems.map((item) => (
                <NavButton key={item.key} {...item} fullWidth />
              ))}
            </Stack>

            <Box mt={6} pt={5} borderTopWidth="1px" borderColor="var(--border)">
              <Text color="var(--soft-text)" fontSize="xs" fontWeight={600} textTransform="uppercase" letterSpacing="0.12em" mb={3}>
                Preferências
              </Text>
              <ThemeToggle compact />
            </Box>

            <Box mt={4}>
              <Button
                onClick={handleLogout}
                loading={isLoggingOut}
                variant="ghost"
                h="44px"
                px={4}
                w="full"
                justifyContent="flex-start"
                gap={2}
                rounded="lg"
                fontWeight={600}
                fontSize="sm"
                color="var(--danger-text)"
                bg="var(--danger-bg)"
                borderWidth="1px"
                borderColor="var(--danger-border)"
              >
                <LogoutIcon />
                <Text>Sair da conta</Text>
              </Button>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  )
}
