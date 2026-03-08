import { Badge, Box, Button, Heading, Stack, Text } from '@chakra-ui/react'

function App() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-6 py-16">
      <Box
        w="full"
        rounded="2xl"
        bg="white"
        p={{ base: 6, md: 10 }}
        shadow="xl"
        borderWidth="1px"
      >
        <Stack gap={4}>
          <Badge bg="green.100" color="green.700" w="fit-content">
            Projeto inicializado
          </Badge>

          <Heading size="2xl">Tasks Manager Frontend</Heading>

          <Text color="gray.600">
            Base do projeto criada com React + Vite, Tailwind CSS e Chakra UI.
          </Text>

          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
            Próximo passo: criar páginas, rotas e componentes do sistema.
          </div>

          <Button bg="blue.600" color="white" w="fit-content" _hover={{ bg: 'blue.700' }}>
            Começar desenvolvimento
          </Button>
        </Stack>
      </Box>
    </main>
  )
}

export default App
