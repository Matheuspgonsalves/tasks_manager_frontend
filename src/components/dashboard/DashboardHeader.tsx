import { Box, Button, Container, Flex, HStack, Text } from '@chakra-ui/react'
import { useState } from 'react'
import type { ReactElement } from 'react'
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

function NavButton({ label, icon, isActive, onClick }: NavItem) {
  return (
    <Button
      onClick={onClick}
      variant="ghost"
      h="42px"
      px={4}
      rounded="xl"
      fontWeight="600"
      fontSize="sm"
      color={isActive ? '#5C7CFA' : '#64748B'}
      bg={isActive ? '#EEF2FF' : 'transparent'}
      borderWidth="1px"
      borderColor={isActive ? '#E0E7FF' : 'transparent'}
      transition="all 0.2s ease"
      _hover={{
        bg: isActive ? '#E8EDFF' : '#F8FAFC',
        color: '#4F6EF7',
      }}
      _active={{
        bg: isActive ? '#E0E7FF' : '#EEF2FF',
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

  async function handleLogout() {
    setIsLoggingOut(true)

    try {
      await logout()
    } catch {
      // Clear local session even if the backend is temporarily unavailable.
    } finally {
      clearAuthSession()
      navigate('/')
      setIsLoggingOut(false)
    }
  }

  const navItems: NavItem[] = [
    {
      key: 'dashboard',
      label: 'Dashboard',
      isActive: active === 'dashboard',
      onClick: () => navigate('/dashboard'),
      icon: <DashboardIcon />,
    },
    {
      key: 'create-task',
      label: 'New Task',
      isActive: active === 'create-task',
      onClick: () => navigate('/create-task'),
      icon: <CreateTaskIcon />,
    },
    {
      key: 'create-categories',
      label: 'Categories',
      onClick: noopAction,
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
      bg="#FFFFFF"
      borderBottomWidth="1px"
      borderColor="#E2E8F0"
      boxShadow="0 1px 0 rgba(148, 163, 184, 0.08)"
    >
      <Container maxW="7xl" px={{ base: 4, md: 8 }}>
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
              <Box color="#5C7CFA">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
                  <path d="M21 12a9 9 0 0 0-15.5-6.36" />
                  <path d="M3 4v5h5" />
                  <path d="M3 12a9 9 0 0 0 15.5 6.36" />
                  <path d="M21 20v-5h-5" />
                </svg>
              </Box>
              <Text color="#1E293B" fontSize={{ base: 'xl', md: '2xl' }} fontWeight="800" letterSpacing="-0.03em">
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

          <Button
            alignSelf={{ base: 'flex-end', lg: 'center' }}
            onClick={handleLogout}
            loading={isLoggingOut}
            variant="ghost"
            h="42px"
            px={4}
            rounded="xl"
            fontWeight="600"
            fontSize="sm"
            color="#64748B"
            transition="all 0.2s ease"
            flexShrink={0}
            _hover={{
              bg: '#F8FAFC',
              color: '#4F6EF7',
            }}
            _active={{
              bg: '#EEF2FF',
            }}
          >
            <HStack gap={2}>
              <LogoutIcon />
              <Text>Logout</Text>
            </HStack>
          </Button>
        </Flex>
      </Container>
    </Box>
  )
}
