import { Box, SimpleGrid, Text } from '@chakra-ui/react'
import type { DashboardStats as DashboardStatsType } from '../../types/task'

type DashboardStatsProps = {
  stats: DashboardStatsType
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const cards = [
    { label: 'Tasks done', value: stats.done, tone: '#4F6EF7' },
    { label: 'In progress', value: stats.inProgress, tone: '#F59E0B' },
    { label: 'Completed', value: stats.completed, tone: '#10B981' },
    { label: 'Total tasks', value: stats.total, tone: '#334155' },
  ]

  return (
    <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} gap={4}>
      {cards.map((card) => (
        <Box
          key={card.label}
          p={5}
          borderRadius="2xl"
          bg="var(--surface)"
          borderWidth="1px"
          borderColor="var(--border)"
          boxShadow="var(--card-shadow)"
        >
          <Text color="var(--muted-text)" fontSize="xs" textTransform="uppercase" letterSpacing="0.16em" fontWeight="700">
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
