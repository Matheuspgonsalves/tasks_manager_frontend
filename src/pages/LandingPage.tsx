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
      bg="linear-gradient(180deg, var(--surface) 0%, var(--app-bg) 100%)"
      position="relative"
      overflow="hidden"
    >
      <Box
        position="absolute"
        top="-8rem"
        left="-8rem"
        w="24rem"
        h="24rem"
        borderRadius="full"
        bg="rgba(92,124,250,0.12)"
        filter="blur(18px)"
      />
      <Box
        position="absolute"
        bottom="-10rem"
        right="-8rem"
        w="28rem"
        h="28rem"
        borderRadius="full"
        bg="rgba(92,124,250,0.14)"
        filter="blur(30px)"
      />

      <PublicHeader
        onNavigate={onNavigate}
        secondaryAction={{ label: 'Faça Login', path: '/login' }}
        primaryAction={{ label: 'Registre-se', path: '/registre-se' }}
      />

      <Container maxW="7xl" px={{ base: 4, md: 8 }} position="relative">

        <Flex
          direction="column"
          align="center"
          justify="center"
          textAlign="center"
          minH={{ base: 'calc(100vh - 92px)', md: 'calc(100vh - 110px)' }}
          pb={{ base: 12, md: 20 }}
          pt={{ base: 6, md: 0 }}
        >
          <Stack gap={{ base: 4, md: 5 }} align="center" maxW={{ base: '100%', md: '62rem' }}>
            <Text
              color="var(--text-secondary)"
              fontWeight="900"
              fontSize={{ base: '2.5rem', sm: '3rem', md: '4.4rem', lg: '5rem' }}
              lineHeight={{ base: 1.1, md: 1.02 }}
              letterSpacing="-0.06em"
            >
              Organize suas tarefas com mais clareza, foco e constância.
            </Text>

            <Text
              color="var(--muted-text)"
              fontSize={{ base: 'md', sm: 'lg', md: '2xl' }}
              lineHeight={{ base: 1.65, md: 1.7 }}
              maxW="48rem"
            >
              O Dolistify centraliza sua rotina em um espaço simples e funcional para acompanhar atividades, visualizar progresso
              e manter o controle do que precisa ser feito no dia a dia.
            </Text>

            <Text color="var(--muted-text)" fontSize={{ base: 'sm', md: 'md' }} maxW="28rem">
              Login seguro, dashboard visual e gerenciamento de tarefas em uma experiência web responsiva.
            </Text>

            <Button
              size={{ base: 'md', md: 'lg' }}
              mt={2}
              bg="var(--accent)"
              color="white"
              px={{ base: 8, md: 10 }}
              w={{ base: 'full', sm: 'auto' }}
              maxW={{ base: '20rem', sm: 'none' }}
              h={{ base: '52px', md: '56px' }}
              rounded="xl"
              _hover={{ bg: 'var(--accent-strong)' }}
              onClick={() => onNavigate('/registre-se')}
            >
              Teste agora
            </Button>
          </Stack>
        </Flex>
      </Container>
    </Box>
  )
}
