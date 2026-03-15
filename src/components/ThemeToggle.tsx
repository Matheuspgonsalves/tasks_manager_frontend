import { Button, HStack, Text } from '@chakra-ui/react'
import { useThemeMode } from '../lib/theme'

type ThemeToggleProps = {
  compact?: boolean
}

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2.5" />
      <path d="M12 19.5V22" />
      <path d="M4.93 4.93l1.77 1.77" />
      <path d="M17.3 17.3l1.77 1.77" />
      <path d="M2 12h2.5" />
      <path d="M19.5 12H22" />
      <path d="M4.93 19.07l1.77-1.77" />
      <path d="M17.3 6.7l1.77-1.77" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
      <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z" />
    </svg>
  )
}

export function ThemeToggle({ compact = false }: ThemeToggleProps) {
  const { mode, toggleMode } = useThemeMode()
  const nextLabel = mode === 'light' ? 'Dark' : 'Light'

  return (
    <Button
      onClick={toggleMode}
      variant="ghost"
      h="42px"
      px={compact ? 3 : 4}
      rounded="xl"
      fontWeight="600"
      fontSize="sm"
      color="var(--muted-text)"
      borderWidth="1px"
      borderColor="var(--border)"
      bg="var(--surface)"
      transition="all 0.2s ease"
      _hover={{
        bg: 'var(--surface-hover)',
        color: 'var(--accent)',
      }}
      _active={{
        bg: 'var(--surface-active)',
      }}
      aria-label={`Switch to ${nextLabel.toLowerCase()} theme`}
      title={`Switch to ${nextLabel.toLowerCase()} theme`}
    >
      <HStack gap={2}>
        {mode === 'light' ? <MoonIcon /> : <SunIcon />}
        {!compact && <Text>{nextLabel} Mode</Text>}
      </HStack>
    </Button>
  )
}
