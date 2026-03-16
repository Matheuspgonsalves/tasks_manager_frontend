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

function BrandMark() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
      <path d="M21 12a9 9 0 0 0-15.5-6.36" />
      <path d="M3 4v5h5" />
      <path d="M3 12a9 9 0 0 0 15.5 6.36" />
      <path d="M21 20v-5h-5" />
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

type HeaderActionButtonProps = {
  label: string
  onClick: () => void
  accent?: boolean
  fullWidth?: boolean
}

function HeaderActionButton({ label, onClick, accent = false, fullWidth = false }: HeaderActionButtonProps) {
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
      color={accent ? 'white' : 'var(--muted-text)'}
      bg={accent ? 'var(--accent)' : 'transparent'}
      borderWidth="1px"
      borderColor={accent ? 'var(--accent)' : 'transparent'}
      transition="all 0.2s ease"
      _hover={{
        bg: accent ? 'var(--accent-strong)' : 'var(--surface-hover)',
        color: accent ? 'white' : 'var(--accent-strong)',
      }}
      _active={{
        bg: accent ? 'var(--accent-strong)' : 'var(--surface-active)',
      }}
    >
      <Text>{label}</Text>
    </Button>
  )
}

export function PublicHeader({ onNavigate, primaryAction, secondaryAction }: PublicHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const actionButtons = (
    <>
      {secondaryAction && (
        <HeaderActionButton
          label={secondaryAction.label}
          onClick={() => {
            setIsMobileMenuOpen(false)
            onNavigate(secondaryAction.path)
          }}
        />
      )}
      <HeaderActionButton
        label={primaryAction.label}
        accent
        onClick={() => {
          setIsMobileMenuOpen(false)
          onNavigate(primaryAction.path)
        }}
      />
    </>
  )

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
        <Flex h="72px" align="center" justify="space-between" gap={4}>
          <HStack
            gap={3}
            flexShrink={0}
            align="center"
            cursor="pointer"
            onClick={() => onNavigate('/')}
          >
            <Box color="var(--accent)">
              <BrandMark />
            </Box>
            <Text color="var(--text-secondary)" fontSize={{ base: 'xl', md: '2xl' }} fontWeight="800" letterSpacing="-0.03em">
              Dolistify
            </Text>
          </HStack>

          <HStack gap={3} flexShrink={0}>
            <ThemeToggle compact />
            {actionButtons}
          </HStack>
        </Flex>
      </Container>

      <Container display={{ base: 'block', lg: 'none' }} maxW="7xl" px={{ base: 4, md: 6 }}>
        <Flex minH="72px" align="center" justify="space-between" py={3} gap={3}>
          <HStack
            gap={3}
            minW={0}
            cursor="pointer"
            onClick={() => onNavigate('/')}
          >
            <Box color="var(--accent)">
              <BrandMark />
            </Box>
            <Text color="var(--text-secondary)" fontSize="xl" fontWeight="800" letterSpacing="-0.03em">
              Dolistify
            </Text>
          </HStack>

          <HStack gap={2} flexShrink={0}>
            <ThemeToggle compact />
            <Button
              aria-label={isMobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
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
                  <BrandMark />
                </Box>
                <Text color="var(--text-secondary)" fontSize="lg" fontWeight="800">
                  Menu
                </Text>
              </HStack>

              <Button
                aria-label="Fechar menu"
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
              {secondaryAction && (
                <HeaderActionButton
                  label={secondaryAction.label}
                  fullWidth
                  onClick={() => {
                    setIsMobileMenuOpen(false)
                    onNavigate(secondaryAction.path)
                  }}
                />
              )}
              <HeaderActionButton
                label={primaryAction.label}
                accent
                fullWidth
                onClick={() => {
                  setIsMobileMenuOpen(false)
                  onNavigate(primaryAction.path)
                }}
              />
            </Stack>
          </Box>
        </Box>
      )}
    </Box>
  )
}
