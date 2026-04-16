import { Box, Button, Container, Flex, HStack, Stack, Text } from '@chakra-ui/react'
import { useState } from 'react'
import { ThemeToggle } from './ThemeToggle'

type PublicHeaderProps = {
  onNavigate: (path: string) => void
  primaryAction: {
    label: string
    path: string
  }
  secondaryAction?: {
    label: string
    path: string
  }
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

export function PublicHeader({ onNavigate, primaryAction, secondaryAction }: PublicHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <Box
      as="header"
      position="sticky"
      top={0}
      zIndex={30}
      w="full"
      bg="var(--app-bg)"
      borderBottomWidth="1px"
      borderColor="var(--border)"
    >
      {/* Desktop */}
      <Container display={{ base: 'none', lg: 'block' }} maxW="7xl" px={{ base: 5, md: 10 }}>
        <Flex h="64px" align="center" justify="space-between" gap={4}>
          {/* Wordmark */}
          <HStack
            gap={2}
            flexShrink={0}
            cursor="pointer"
            onClick={() => onNavigate('/')}
            _hover={{ opacity: 0.75 }}
            transition="opacity 0.15s"
          >
            <Box w="8px" h="8px" borderRadius="2px" bg="var(--accent)" flexShrink={0} />
            <Text
              color="var(--text-primary)"
              fontSize="lg"
              fontWeight={800}
              letterSpacing="-0.04em"
            >
              Dolistify
            </Text>
          </HStack>

          <HStack gap={2} flexShrink={0}>
            <ThemeToggle compact />
            {secondaryAction && (
              <Button
                onClick={() => onNavigate(secondaryAction.path)}
                variant="ghost"
                h="38px"
                px={4}
                rounded="lg"
                fontWeight={600}
                fontSize="sm"
                color="var(--muted-text)"
                _hover={{ bg: 'var(--surface-hover)', color: 'var(--text-primary)' }}
              >
                {secondaryAction.label}
              </Button>
            )}
            <Button
              onClick={() => onNavigate(primaryAction.path)}
              h="38px"
              px={5}
              rounded="lg"
              fontWeight={700}
              fontSize="sm"
              bg="var(--accent)"
              color="white"
              _hover={{ bg: 'var(--accent-strong)' }}
              transition="all 0.15s"
            >
              {primaryAction.label}
            </Button>
          </HStack>
        </Flex>
      </Container>

      {/* Mobile */}
      <Container display={{ base: 'block', lg: 'none' }} maxW="7xl" px={{ base: 4, md: 6 }}>
        <Flex minH="64px" align="center" justify="space-between" gap={3}>
          <HStack
            gap={2}
            cursor="pointer"
            onClick={() => onNavigate('/')}
          >
            <Box w="7px" h="7px" borderRadius="2px" bg="var(--accent)" flexShrink={0} />
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
            <Flex align="center" justify="space-between" mb={8}>
              <HStack gap={2}>
                <Box w="7px" h="7px" borderRadius="2px" bg="var(--accent)" />
                <Text color="var(--text-primary)" fontSize="md" fontWeight={800} letterSpacing="-0.04em">
                  Dolistify
                </Text>
              </HStack>
              <Button
                aria-label="Fechar menu"
                onClick={() => setIsMobileMenuOpen(false)}
                variant="ghost"
                h="38px"
                minW="38px"
                px={0}
                rounded="lg"
                color="var(--muted-text)"
              >
                <CloseIcon />
              </Button>
            </Flex>

            <Stack gap={2}>
              {secondaryAction && (
                <Button
                  variant="ghost"
                  h="46px"
                  w="full"
                  justifyContent="flex-start"
                  px={4}
                  rounded="lg"
                  fontWeight={600}
                  fontSize="sm"
                  color="var(--muted-text)"
                  _hover={{ bg: 'var(--surface-hover)', color: 'var(--text-primary)' }}
                  onClick={() => { setIsMobileMenuOpen(false); onNavigate(secondaryAction.path) }}
                >
                  {secondaryAction.label}
                </Button>
              )}
              <Button
                h="46px"
                w="full"
                justifyContent="flex-start"
                px={4}
                rounded="lg"
                fontWeight={700}
                fontSize="sm"
                bg="var(--accent)"
                color="white"
                _hover={{ bg: 'var(--accent-strong)' }}
                onClick={() => { setIsMobileMenuOpen(false); onNavigate(primaryAction.path) }}
              >
                {primaryAction.label}
              </Button>
            </Stack>
          </Box>
        </Box>
      )}
    </Box>
  )
}
