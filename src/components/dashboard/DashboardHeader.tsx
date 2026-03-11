import {
  Box,
  Button,
  Container,
  Flex,
  HStack,
  MenuContent,
  MenuItem,
  MenuPositioner,
  MenuRoot,
  MenuTrigger,
  Text,
} from '@chakra-ui/react'

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

export function DashboardHeader({ active }: DashboardHeaderProps) {
  return (
    <Box
      as="header"
      w="full"
      borderBottomWidth="1px"
      borderColor="whiteAlpha.100"
      bg="rgba(6, 11, 20, 0.9)"
      backdropFilter="blur(8px)"
      position="sticky"
      top={0}
      zIndex={30}
    >
      <Container maxW="7xl" px={{ base: 4, md: 8 }}>
        <Flex align="center" justify="space-between" py={4}>
          <Box>
            <Text color="whiteAlpha.700" fontSize="xs" textTransform="uppercase" letterSpacing="0.28em" fontWeight="700">
              Dashboard
            </Text>
            <Text color="gray.100" fontSize={{ base: 'lg', md: 'xl' }} fontWeight="900" letterSpacing="0.24em">
              TASKS
            </Text>
          </Box>

          <MenuRoot>
            <MenuTrigger asChild>
              <Button
                aria-label="Open menu"
                bg="whiteAlpha.50"
                color="gray.100"
                borderWidth="1px"
                borderColor="whiteAlpha.300"
                _hover={{ bg: 'whiteAlpha.100' }}
                _expanded={{ bg: 'whiteAlpha.100' }}
                minW="44px"
                h="44px"
                px={0}
                fontSize="xl"
              >
                ☰
              </Button>
            </MenuTrigger>
            <MenuPositioner>
              <MenuContent
                minW="220px"
                borderRadius="lg"
                borderColor="whiteAlpha.200"
                bg="#111827"
                color="gray.100"
                boxShadow="xl"
                zIndex={40}
              >
                <MenuItem
                  value="tasks"
                  onClick={() => navigate('/dashboard')}
                  color="gray.100"
                  _hover={{ bg: 'whiteAlpha.100' }}
                  bg={active === 'dashboard' ? 'whiteAlpha.100' : 'transparent'}
                >
                  Tasks
                </MenuItem>
                <MenuItem
                  value="create-task"
                  onClick={() => navigate('/create-task')}
                  color="gray.100"
                  _hover={{ bg: 'whiteAlpha.100' }}
                  bg={active === 'create-task' ? 'whiteAlpha.100' : 'transparent'}
                >
                  <HStack justify="space-between" w="full">
                    <Text>Create Task</Text>
                  </HStack>
                </MenuItem>
                <MenuItem value="categories" onClick={noopAction} color="gray.100" _hover={{ bg: 'whiteAlpha.100' }}>
                  <HStack justify="space-between" w="full">
                    <Text>Categories</Text>
                    <Text color="gray.500" fontSize="xs">
                      Soon
                    </Text>
                  </HStack>
                </MenuItem>
              </MenuContent>
            </MenuPositioner>
          </MenuRoot>
        </Flex>
      </Container>
    </Box>
  )
}
