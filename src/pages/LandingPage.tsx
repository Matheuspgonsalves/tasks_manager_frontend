import { Box, Button, Container, Flex, Stack, Text } from '@chakra-ui/react'
import { PublicHeader } from '../components/PublicHeader'

type LandingPageProps = {
  onNavigate: (path: string) => void
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <Box
      as="main"
      minH="100vh"
      bg="var(--app-bg)"
      position="relative"
      overflow="hidden"
    >
      {/* Subtle dot-grid texture — editorial, structural */}
      <Box
        position="absolute"
        inset={0}
        pointerEvents="none"
        zIndex={0}
        style={{
          backgroundImage:
            'radial-gradient(circle, var(--border) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          opacity: 0.7,
        }}
      />

      {/* Accent line — top-right decorative element */}
      <Box
        position="absolute"
        top={0}
        right={0}
        w={{ base: '160px', md: '280px' }}
        h="3px"
        bg="var(--accent)"
        zIndex={1}
      />

      <PublicHeader
        onNavigate={onNavigate}
        secondaryAction={{ label: 'Entrar', path: '/login' }}
        primaryAction={{ label: 'Registre-se', path: '/registre-se' }}
      />

      <Container maxW="7xl" px={{ base: 5, md: 10 }} position="relative" zIndex={1}>
        <Flex
          direction="column"
          align={{ base: 'flex-start', lg: 'flex-start' }}
          justify="center"
          minH={{ base: 'calc(100vh - 73px)', md: 'calc(100vh - 73px)' }}
          pb={{ base: 16, md: 24 }}
          pt={{ base: 10, md: 0 }}
          maxW="52rem"
        >
          <Stack gap={{ base: 6, md: 8 }} align="flex-start">

            {/* Label pill */}
            <Box
              as="span"
              display="inline-flex"
              alignItems="center"
              gap={2}
              px={3}
              py={1}
              fontSize="0.7rem"
              fontWeight={700}
              letterSpacing="0.14em"
              textTransform="uppercase"
              color="var(--accent)"
              bg="var(--accent-soft)"
              border="1px solid var(--accent-border)"
              borderRadius="4px"
            >
              <Box
                as="span"
                w="6px"
                h="6px"
                borderRadius="full"
                bg="var(--accent)"
                display="inline-block"
              />
              Gerenciador de tarefas
            </Box>

            {/* Headline */}
            <Box>
              <Text
                as="h1"
                fontSize={{ base: '3.2rem', sm: '4rem', md: '5.5rem', lg: '6.5rem' }}
                fontWeight={800}
                lineHeight={0.92}
                letterSpacing="-0.04em"
                color="var(--text-primary)"
                mb={0}
              >
                Organize.
              </Text>
              <Text
                as="span"
                display="block"
                fontSize={{ base: '3.2rem', sm: '4rem', md: '5.5rem', lg: '6.5rem' }}
                fontWeight={800}
                lineHeight={0.92}
                letterSpacing="-0.04em"
                color="var(--accent)"
              >
                Priorize.
              </Text>
              <Text
                as="span"
                display="block"
                fontSize={{ base: '3.2rem', sm: '4rem', md: '5.5rem', lg: '6.5rem' }}
                fontWeight={800}
                lineHeight={0.92}
                letterSpacing="-0.04em"
                color="var(--text-primary)"
              >
                Execute.
              </Text>
            </Box>

            {/* Hairline separator */}
            <Box w="80px" h="2px" bg="var(--border-strong)" />

            {/* Subtitle */}
            <Text
              color="var(--muted-text)"
              fontSize={{ base: 'md', md: 'lg' }}
              lineHeight={1.65}
              maxW="34rem"
              fontWeight={400}
            >
              Centralize sua rotina em um espaço limpo e funcional. Acompanhe atividades,
              visualize progresso e mantenha o foco no que realmente importa.
            </Text>

            {/* CTAs */}
            <Flex gap={3} wrap="wrap" align="center">
              <Button
                size="lg"
                bg="var(--accent)"
                color="white"
                px={{ base: 7, md: 8 }}
                h={{ base: '50px', md: '52px' }}
                rounded="lg"
                fontWeight={700}
                fontSize={{ base: 'sm', md: 'md' }}
                letterSpacing="-0.01em"
                _hover={{ bg: 'var(--accent-strong)', transform: 'translateY(-1px)', boxShadow: '0 8px 24px rgba(21,128,61,0.28)' }}
                transition="all 0.18s ease"
                onClick={() => onNavigate('/registre-se')}
              >
                Começar gratuitamente
              </Button>
              <Button
                size="lg"
                variant="ghost"
                color="var(--muted-text)"
                px={{ base: 5, md: 6 }}
                h={{ base: '50px', md: '52px' }}
                rounded="lg"
                fontWeight={600}
                fontSize={{ base: 'sm', md: 'md' }}
                _hover={{ color: 'var(--text-primary)', bg: 'transparent' }}
                onClick={() => onNavigate('/login')}
              >
                Já tenho conta →
              </Button>
            </Flex>

            {/* Social proof note */}
            <Text color="var(--soft-text)" fontSize="xs" fontWeight={500} letterSpacing="0.02em">
              Login seguro · Dashboard visual · Responsivo
            </Text>

          </Stack>
        </Flex>
      </Container>

      {/* Bottom accent line */}
      <Box
        position="absolute"
        bottom={0}
        left={0}
        w={{ base: '80px', md: '160px' }}
        h="3px"
        bg="var(--accent)"
        zIndex={1}
      />
    </Box>
  )
}
