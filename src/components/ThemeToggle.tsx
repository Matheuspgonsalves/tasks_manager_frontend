import { Box, Button, HStack, Text } from '@chakra-ui/react'
import { useThemeMode } from '../lib/theme'

type ThemeToggleProps = {
  compact?: boolean
}

function SunIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2.5M12 19.5V22M4.93 4.93l1.77 1.77M17.3 17.3l1.77 1.77M2 12h2.5M19.5 12H22M4.93 19.07l1.77-1.77M17.3 6.7l1.77-1.77" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z" />
    </svg>
  )
}

export function ThemeToggle({ compact = false }: ThemeToggleProps) {
  const { mode, toggleMode } = useThemeMode()
  const isDark = mode === 'dark'

  return (
    <Button
      onClick={toggleMode}
      variant="ghost"
      h="36px"
      px={compact ? 2.5 : 3.5}
      rounded="lg"
      fontWeight={500}
      fontSize="xs"
      color="var(--muted-text)"
      borderWidth="1px"
      borderColor="var(--border)"
      bg="var(--surface)"
      gap={2}
      transition="all 0.15s"
      _hover={{ bg: 'var(--surface-hover)', color: 'var(--text-primary)', borderColor: 'var(--border-strong)' }}
      aria-label={isDark ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
      title={isDark ? 'Tema claro' : 'Tema escuro'}
    >
      <Box color="currentColor" display="flex" alignItems="center">
        {isDark ? <SunIcon /> : <MoonIcon />}
      </Box>
      {!compact && (
        <Text fontSize="xs" fontWeight={500}>
          {isDark ? 'Claro' : 'Escuro'}
        </Text>
      )}
    </Button>
  )
}
