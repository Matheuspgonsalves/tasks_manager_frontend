import { Box, SimpleGrid, Text } from '@chakra-ui/react'
import type { DashboardStats as DashboardStatsType } from '../../types/task'

type DashboardStatsProps = {
  stats: DashboardStatsType
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const cards = [
    { label: 'Tasks done', value: stats.done, tone: 'cyan.300' },
    { label: 'In progress', value: stats.inProgress, tone: 'orange.300' },
    { label: 'Completed', value: stats.completed, tone: 'green.300' },
    { label: 'Total tasks', value: stats.total, tone: 'purple.300' },
  ]

  return (
    <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} gap={4}>
      {cards.map((card) => (
        <Box
          key={card.label}
          p={5}
          borderRadius="xl"
          bg="whiteAlpha.100"
          borderWidth="1px"
          borderColor="whiteAlpha.200"
          boxShadow="lg"
          backdropFilter="blur(8px)"
        >
          <Text color="whiteAlpha.700" fontSize="xs" textTransform="uppercase" letterSpacing="0.16em" fontWeight="700">
            {card.label}
          </Text>
          <Text color={card.tone} mt={2} fontSize="3xl" fontWeight="900">
            {card.value}
          </Text>
        </Box>
      ))}
    </SimpleGrid>
  )
}
