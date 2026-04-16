import { Box, SimpleGrid, Text } from '@chakra-ui/react'
import type { DashboardStats as DashboardStatsType } from '../../types/task'

type DashboardStatsProps = {
  stats: DashboardStatsType
}

const cards = (stats: DashboardStatsType) => [
  {
    label: 'Tarefas concluídas',
    value: stats.done,
    accentColor: '#15803D',
    description: 'finalizadas',
  },
  {
    label: 'Em andamento',
    value: stats.inProgress,
    accentColor: '#D97706',
    description: 'pendentes',
  },
  {
    label: 'Completadas',
    value: stats.completed,
    accentColor: '#0284C7',
    description: 'no total',
  },
  {
    label: 'Total de tarefas',
    value: stats.total,
    accentColor: 'var(--border-strong)',
    description: 'criadas',
  },
]

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <SimpleGrid columns={{ base: 2, md: 4 }} gap={3}>
      {cards(stats).map((card) => (
        <Box
          key={card.label}
          position="relative"
          bg="var(--surface)"
          borderWidth="1px"
          borderColor="var(--border)"
          borderRadius="10px"
          overflow="hidden"
          boxShadow="var(--card-shadow)"
          p={5}
        >
          {/* Left accent stripe */}
          <Box
            position="absolute"
            left={0}
            top={0}
            bottom={0}
            w="3px"
            bg={card.accentColor}
          />

          <Text
            color="var(--muted-text)"
            fontSize="xs"
            fontWeight={600}
            letterSpacing="0.04em"
            textTransform="uppercase"
            mb={3}
            lineClamp={1}
          >
            {card.label}
          </Text>

          <Box display="flex" alignItems="baseline" gap={2}>
            <Text
              color="var(--text-primary)"
              fontSize="2.25rem"
              fontWeight={800}
              lineHeight={1}
              letterSpacing="-0.04em"
            >
              {card.value}
            </Text>
            <Text color="var(--soft-text)" fontSize="xs" fontWeight={500}>
              {card.description}
            </Text>
          </Box>
        </Box>
      ))}
    </SimpleGrid>
  )
}
