import { Box, Button, Flex, HStack, Input, Separator, Stack, Text } from '@chakra-ui/react'
import { useState } from 'react'
import type { Category } from '../../types/category'

type CategoriesListProps = {
  categories: Category[]
  busyCategoryId: string | null
  onAddCategory: () => void
  onDeleteCategory: (categoryId: string) => Promise<void>
  onUpdateCategory: (categoryId: string, name: string) => Promise<void>
}

type EditState = { categoryId: string; name: string }

function EditIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 1 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  )
}

function DeleteIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 14H6L5 6" />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  )
}

export function CategoriesList({
  categories,
  busyCategoryId,
  onAddCategory,
  onDeleteCategory,
  onUpdateCategory,
}: CategoriesListProps) {
  const [editing, setEditing] = useState<EditState | null>(null)

  async function saveEdit() {
    if (!editing) return
    const trimmed = editing.name.trim()
    if (!trimmed) return
    await onUpdateCategory(editing.categoryId, trimmed)
    setEditing(null)
  }

  return (
    <Box
      bg="var(--surface)"
      borderRadius="10px"
      borderWidth="1px"
      borderColor="var(--border)"
      boxShadow="var(--card-shadow)"
      overflow="hidden"
    >
      {/* Header */}
      <Flex
        px={{ base: 4, md: 5 }}
        py={4}
        borderBottomWidth="1px"
        borderColor="var(--border)"
        justify="space-between"
        align={{ base: 'flex-start', sm: 'center' }}
        gap={3}
        direction={{ base: 'column', sm: 'row' }}
      >
        <Box>
          <Text color="var(--text-primary)" fontWeight={800} fontSize="md" letterSpacing="-0.03em">
            Categorias
          </Text>
          <Text mt={0.5} color="var(--muted-text)" fontSize="sm">
            Gerencie categorias padrão e personalizadas.
          </Text>
        </Box>

        <Button
          h="38px"
          px={4}
          rounded="lg"
          fontWeight={700}
          fontSize="sm"
          gap={2}
          bg="var(--accent)"
          color="white"
          _hover={{ bg: 'var(--accent-strong)' }}
          onClick={onAddCategory}
          flexShrink={0}
        >
          <PlusIcon />
          Nova categoria
        </Button>
      </Flex>

      {categories.length === 0 ? (
        <Box p={10} textAlign="center">
          <Text color="var(--soft-text)" fontSize="2xl" mb={2}>—</Text>
          <Text color="var(--muted-text)" fontSize="sm">Nenhuma categoria encontrada ainda.</Text>
        </Box>
      ) : (
        <Box>
          {/* Table header */}
          <Box
            display={{ base: 'none', md: 'grid' }}
            gridTemplateColumns="minmax(200px, 1.4fr) minmax(110px, 0.7fr) minmax(200px, 1.8fr) 80px"
            gap={4}
            px={5}
            py={3}
            borderBottomWidth="1px"
            borderColor="var(--border)"
            bg="var(--surface-muted)"
          >
            {['Nome', 'Tipo', 'Detalhes', 'Ações'].map((col, i) => (
              <Text
                key={col}
                fontSize="0.7rem"
                fontWeight={700}
                color="var(--soft-text)"
                textTransform="uppercase"
                letterSpacing="0.08em"
                textAlign={i === 3 ? 'right' : 'left'}
              >
                {col}
              </Text>
            ))}
          </Box>

          <Stack separator={<Separator borderColor="var(--border)" />} p={{ base: 4, md: 0 }} gap={{ base: 4, md: 0 }}>
            {categories.map((category) => {
              const isEditing = editing?.categoryId === category.id
              const isBusy = busyCategoryId === category.id

              return (
                <Box key={category.id} px={{ base: 0, md: 5 }} py={{ base: 0, md: 4 }}>
                  {isEditing ? (
                    <Stack gap={2.5}>
                      <Input
                        value={editing.name}
                        onChange={(e) => setEditing((s) => (s ? { ...s, name: e.target.value } : null))}
                        h="40px"
                        rounded="lg"
                        fontSize="sm"
                        fontWeight={500}
                        bg="var(--surface)"
                        borderColor="var(--border-strong)"
                        color="var(--text-primary)"
                        _focusVisible={{ borderColor: 'var(--accent)', boxShadow: '0 0 0 2px var(--accent-soft)' }}
                        autoFocus
                      />
                      <HStack justify="flex-end" gap={2}>
                        <Button
                          size="sm"
                          h="34px"
                          px={3}
                          rounded="lg"
                          variant="ghost"
                          fontWeight={600}
                          fontSize="sm"
                          color="var(--muted-text)"
                          _hover={{ bg: 'var(--surface-hover)', color: 'var(--text-primary)' }}
                          onClick={() => setEditing(null)}
                        >
                          Cancelar
                        </Button>
                        <Button
                          size="sm"
                          h="34px"
                          px={4}
                          rounded="lg"
                          fontWeight={700}
                          fontSize="sm"
                          bg="var(--accent)"
                          color="white"
                          _hover={{ bg: 'var(--accent-strong)' }}
                          onClick={() => void saveEdit()}
                          loading={isBusy}
                          disabled={!editing.name.trim()}
                        >
                          Salvar
                        </Button>
                      </HStack>
                    </Stack>
                  ) : (
                    <Box
                      display={{ base: 'flex', md: 'grid' }}
                      flexDirection="column"
                      gridTemplateColumns="minmax(200px, 1.4fr) minmax(110px, 0.7fr) minmax(200px, 1.8fr) 80px"
                      gap={{ base: 2.5, md: 4 }}
                      alignItems={{ base: 'stretch', md: 'center' }}
                    >
                      <Box minW={0}>
                        <Text display={{ base: 'block', md: 'none' }} mb={0.5} fontSize="0.65rem" textTransform="uppercase" letterSpacing="0.1em" color="var(--soft-text)" fontWeight={600}>
                          Nome
                        </Text>
                        <Text fontSize="sm" fontWeight={700} color="var(--text-primary)">
                          {category.name}
                        </Text>
                      </Box>

                      <Box minW={0}>
                        <Text display={{ base: 'block', md: 'none' }} mb={0.5} fontSize="0.65rem" textTransform="uppercase" letterSpacing="0.1em" color="var(--soft-text)" fontWeight={600}>
                          Tipo
                        </Text>
                        <Box
                          display="inline-flex"
                          alignItems="center"
                          px={2.5}
                          py={1}
                          borderRadius="5px"
                          bg={category.isDefault ? 'var(--accent-soft)' : 'var(--surface-muted)'}
                          borderWidth="1px"
                          borderColor={category.isDefault ? 'var(--accent-border)' : 'var(--border)'}
                        >
                          <Text
                            fontSize="0.7rem"
                            fontWeight={600}
                            color={category.isDefault ? 'var(--accent)' : 'var(--muted-text)'}
                            letterSpacing="0.03em"
                          >
                            {category.isDefault ? 'Padrão' : 'Personalizada'}
                          </Text>
                        </Box>
                      </Box>

                      <Box minW={0}>
                        <Text display={{ base: 'block', md: 'none' }} mb={0.5} fontSize="0.65rem" textTransform="uppercase" letterSpacing="0.1em" color="var(--soft-text)" fontWeight={600}>
                          Detalhes
                        </Text>
                        <Text color="var(--muted-text)" fontSize="sm" fontWeight={400}>
                          {category.isDefault ? 'Disponível para todos os usuários' : 'Criada na sua conta'}
                        </Text>
                      </Box>

                      <HStack gap={0.5} justify="flex-end">
                        {!category.isDefault && (
                          <Button
                            size="sm"
                            variant="ghost"
                            color="var(--muted-text)"
                            minW="32px"
                            h="32px"
                            px={0}
                            rounded="md"
                            aria-label={`Editar ${category.name}`}
                            _hover={{ bg: 'var(--surface-active)', color: 'var(--accent)' }}
                            onClick={() => setEditing({ categoryId: category.id, name: category.name })}
                          >
                            <EditIcon />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          color="var(--muted-text)"
                          minW="32px"
                          h="32px"
                          px={0}
                          rounded="md"
                          aria-label={`${category.isDefault ? 'Ocultar' : 'Excluir'} ${category.name}`}
                          _hover={{ bg: 'var(--danger-bg)', color: 'var(--danger-text)' }}
                          onClick={() => void onDeleteCategory(category.id)}
                          loading={isBusy}
                        >
                          <DeleteIcon />
                        </Button>
                      </HStack>
                    </Box>
                  )}
                </Box>
              )
            })}
          </Stack>
        </Box>
      )}

      {/* Footer */}
      <Flex
        borderTopWidth="1px"
        borderColor="var(--border)"
        px={{ base: 4, md: 5 }}
        py={3}
        justify="space-between"
        align="center"
        gap={3}
        wrap="wrap"
        bg="var(--surface-muted)"
      >
        <Text color="var(--soft-text)" fontSize="xs" fontWeight={500}>
          {categories.length} {categories.length === 1 ? 'categoria' : 'categorias'}
        </Text>
        <Text color="var(--soft-text)" fontSize="xs" fontWeight={400}>
          Padrão: ocultar · Personalizadas: editar ou excluir
        </Text>
      </Flex>
    </Box>
  )
}
