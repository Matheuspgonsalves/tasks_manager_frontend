import { Box, Button, Container, Flex, HStack, Stack, Text } from '@chakra-ui/react'
import { useState } from 'react'
import type { ReactElement } from 'react'
import { ThemeToggle } from '../ThemeToggle'
import { clearAuthSession } from '../../lib/auth'
import { logout } from '../../services/auth.service'

function noopAction() {
  // Placeholder while target pages are not implemented.
}

function navigate(path: string) {
  window.history.pushState({}, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

type DashboardHeaderProps = {
  active: 'dashboard' | 'create-task'
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
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="4.5" rx="1.5" />
      <rect x="14" y="10.5" width="7" height="10.5" rx="1.5" />
      <rect x="3" y="13.5" width="7" height="7.5" rx="1.5" />
    </svg>
  )
}

function CreateTaskIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
      <path d="M12 5v14" />
      <path d="M5 12h14" />
      <path d="M5 5h14v14H5z" />
    </svg>
  )
}

function CategoriesIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
      <path d="M10 4H5a1 1 0 0 0-1 1v5l8.5 8.5a2.1 2.1 0 0 0 3 0l3-3a2.1 2.1 0 0 0 0-3L10 4Z" />
      <path d="M7.5 7.5h.01" />
      <path d="m14 6 4 4" />
    </svg>
  )
}

function LogoutIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  )
}

function MenuIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}

type NavButtonProps = NavItem & {
  fullWidth?: boolean
}

function NavButton({ label, icon, isActive, onClick, fullWidth = false }: NavButtonProps) {
  return (
    <Button
      onClick={onClick}
      variant="ghost"
      h="42px"
      px={4}
      w={fullWidth ? 'full' : 'auto'}
      justifyContent={fullWidth ? 'flex-start' : 'center'}
      rounded="xl"
      fontWeight="600"
      fontSize="sm"
      color={isActive ? 'var(--accent)' : 'var(--muted-text)'}
      bg={isActive ? 'var(--accent-soft)' : 'transparent'}
      borderWidth="1px"
      borderColor={isActive ? 'var(--accent-border)' : 'transparent'}
      transition="all 0.2s ease"
      _hover={{
        bg: isActive ? 'var(--accent-soft)' : 'var(--surface-hover)',
        color: 'var(--accent-strong)',
      }}
      _active={{
        bg: isActive ? 'var(--accent-soft)' : 'var(--surface-active)',
      }}
    >
      <HStack gap={2} align="center">
        <Box color="currentColor">{icon}</Box>
        <Text>{label}</Text>
      </HStack>
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
      // Clear local session even if the backend is temporarily unavailable.
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
      onClick: () => {
        setIsMobileMenuOpen(false)
        navigate('/dashboard')
      },
      icon: <DashboardIcon />,
    },
    {
      key: 'create-task',
      label: 'New Task',
      isActive: active === 'create-task',
      onClick: () => {
        setIsMobileMenuOpen(false)
        navigate('/create-task')
      },
      icon: <CreateTaskIcon />,
    },
    {
      key: 'create-categories',
      label: 'Categories',
      onClick: () => {
        setIsMobileMenuOpen(false)
        noopAction()
      },
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
      boxShadow="0 1px 0 rgba(148, 163, 184, 0.08)"
    >
      <Container display={{ base: 'none', lg: 'block' }} maxW="7xl" px={{ base: 4, md: 8 }}>
        <Flex
          h={{ base: 'auto', lg: '72px' }}
          minH={{ base: '72px', lg: '72px' }}
          align={{ base: 'flex-start', lg: 'center' }}
          justify="space-between"
          gap={4}
          py={{ base: 3, lg: 0 }}
          direction={{ base: 'column', lg: 'row' }}
        >
          <Flex
            align={{ base: 'flex-start', lg: 'center' }}
            justify="flex-start"
            w="full"
            gap={{ base: 4, lg: 8 }}
            direction={{ base: 'column', lg: 'row' }}
            flex="1"
          >
            <HStack gap={3} flexShrink={0} align="center">
              <Box color="var(--accent)">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
                  <path d="M21 12a9 9 0 0 0-15.5-6.36" />
                  <path d="M3 4v5h5" />
                  <path d="M3 12a9 9 0 0 0 15.5 6.36" />
                  <path d="M21 20v-5h-5" />
                </svg>
              </Box>
              <Text color="var(--text-secondary)" fontSize={{ base: 'xl', md: '2xl' }} fontWeight="800" letterSpacing="-0.03em">
                Dolistify
              </Text>
            </HStack>

            <HStack
              gap={2}
              flexWrap={{ base: 'wrap', lg: 'nowrap' }}
              justify="flex-start"
              align="center"
              flex="1"
              overflowX={{ base: 'visible', lg: 'auto' }}
              whiteSpace="nowrap"
              css={{
                scrollbarWidth: 'none',
              }}
            >
              {navItems.map((item) => (
                <NavButton
                  key={item.key}
                  label={item.label}
                  icon={item.icon}
                  isActive={item.isActive}
                  onClick={item.onClick}
                />
              ))}
            </HStack>
          </Flex>

          <HStack alignSelf={{ base: 'flex-end', lg: 'center' }} gap={3} flexShrink={0}>
            <ThemeToggle compact />
            <Button
              onClick={handleLogout}
              loading={isLoggingOut}
              variant="ghost"
              h="42px"
              px={4}
              rounded="xl"
              fontWeight="600"
              fontSize="sm"
              color="var(--muted-text)"
              transition="all 0.2s ease"
              _hover={{
                bg: 'var(--surface-hover)',
                color: 'var(--accent-strong)',
              }}
              _active={{
                bg: 'var(--surface-active)',
              }}
            >
              <HStack gap={2}>
                <LogoutIcon />
                <Text>Logout</Text>
              </HStack>
            </Button>
          </HStack>
        </Flex>
      </Container>

      <Container display={{ base: 'block', lg: 'none' }} maxW="7xl" px={{ base: 4, md: 6 }}>
        <Flex minH="72px" align="center" justify="space-between" py={3} gap={3}>
          <HStack gap={3} minW={0}>
            <Box color="var(--accent)">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
                <path d="M21 12a9 9 0 0 0-15.5-6.36" />
                <path d="M3 4v5h5" />
                <path d="M3 12a9 9 0 0 0 15.5 6.36" />
                <path d="M21 20v-5h-5" />
              </svg>
            </Box>
            <Text color="var(--text-secondary)" fontSize="xl" fontWeight="800" letterSpacing="-0.03em">
              Dolistify
            </Text>
          </HStack>

          <HStack gap={2} flexShrink={0}>
            <ThemeToggle compact />
            <Button
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setIsMobileMenuOpen((current) => !current)}
              variant="ghost"
              h="42px"
              minW="42px"
              px={0}
              rounded="xl"
              borderWidth="1px"
              borderColor="var(--border)"
              color="var(--text-secondary)"
              bg="var(--surface)"
            >
              {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </Button>
          </HStack>
        </Flex>
      </Container>

      {isMobileMenuOpen && (
        <Box display={{ base: 'block', lg: 'none' }} position="fixed" inset={0} zIndex={40}>
          <Box position="absolute" inset={0} bg="rgba(15, 23, 42, 0.38)" onClick={() => setIsMobileMenuOpen(false)} />
          <Box
            position="absolute"
            top={0}
            right={0}
            h="100dvh"
            w={{ base: '86%', sm: '22rem' }}
            bg="var(--surface)"
            borderLeftWidth="1px"
            borderColor="var(--border)"
            boxShadow="0 24px 60px rgba(15, 23, 42, 0.22)"
            px={4}
            py={5}
          >
            <Flex align="center" justify="space-between" gap={3} mb={6}>
              <HStack gap={3}>
                <Box color="var(--accent)">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
                    <path d="M21 12a9 9 0 0 0-15.5-6.36" />
                    <path d="M3 4v5h5" />
                    <path d="M3 12a9 9 0 0 0 15.5 6.36" />
                    <path d="M21 20v-5h-5" />
                  </svg>
                </Box>
                <Text color="var(--text-secondary)" fontSize="lg" fontWeight="800">
                  Menu
                </Text>
              </HStack>

              <Button
                aria-label="Close menu"
                onClick={() => setIsMobileMenuOpen(false)}
                variant="ghost"
                h="40px"
                minW="40px"
                px={0}
                rounded="xl"
                color="var(--text-secondary)"
              >
                <CloseIcon />
              </Button>
            </Flex>

            <Stack gap={2}>
              {navItems.map((item) => (
                <NavButton
                  key={item.key}
                  label={item.label}
                  icon={item.icon}
                  isActive={item.isActive}
                  onClick={item.onClick}
                  fullWidth
                />
              ))}
            </Stack>

            <Box mt={6} pt={5} borderTopWidth="1px" borderColor="var(--border)">
              <Text color="var(--soft-text)" fontSize="xs" textTransform="uppercase" letterSpacing="0.18em" mb={3}>
                Preferences
              </Text>
              <ThemeToggle compact />
            </Box>

            <Button
              onClick={handleLogout}
              loading={isLoggingOut}
              variant="ghost"
              h="46px"
              px={4}
              mt={6}
              w="full"
              justifyContent="flex-start"
              rounded="xl"
              fontWeight="600"
              fontSize="sm"
              color="var(--danger-text)"
              bg="var(--danger-bg)"
              borderWidth="1px"
              borderColor="var(--danger-border)"
            >
              <HStack gap={2}>
                <LogoutIcon />
                <Text>Logout</Text>
              </HStack>
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  )
}
