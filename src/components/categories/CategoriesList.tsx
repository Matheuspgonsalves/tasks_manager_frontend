import { Badge, Box, Button, Flex, HStack, Input, Separator, Stack, Text } from '@chakra-ui/react'
import { useState } from 'react'
import type { Category } from '../../types/category'

type CategoriesListProps = {
  categories: Category[]
  busyCategoryId: string | null
  onAddCategory: () => void
  onDeleteCategory: (categoryId: string) => Promise<void>
  onUpdateCategory: (categoryId: string, name: string) => Promise<void>
}

type EditState = {
  categoryId: string
  name: string
}

function EditIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 1 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  )
}

function DeleteIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
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

    const trimmedName = editing.name.trim()
    if (!trimmedName) {
      return
    }

    await onUpdateCategory(editing.categoryId, trimmedName)
    setEditing(null)
  }

  return (
    <Box bg="var(--surface)" borderRadius="2xl" borderWidth="1px" borderColor="var(--border)" boxShadow="var(--card-shadow)" overflow="hidden">
      <Flex
        px={{ base: 4, md: 5 }}
        py={4}
        borderBottomWidth="1px"
        borderColor="var(--border)"
        justify="space-between"
        align={{ base: 'flex-start', md: 'center' }}
        gap={3}
        direction={{ base: 'column', md: 'row' }}
      >
        <Box>
          <Text color="var(--text-secondary)" fontWeight="700" fontSize={{ base: 'md', md: 'lg' }}>
            Your categories
          </Text>
          <Text mt={1} color="var(--muted-text)" fontSize="sm">
            Manage system defaults and your own custom categories in one place.
          </Text>
        </Box>

        <Button colorPalette="blue" onClick={onAddCategory}>
          Add category
        </Button>
      </Flex>

      {categories.length === 0 ? (
        <Box p={8}>
          <Text color="var(--muted-text)" textAlign="center">
            No categories found for this user yet.
          </Text>
        </Box>
      ) : (
        <Box>
          <Box
            display={{ base: 'none', md: 'grid' }}
            gridTemplateColumns="minmax(220px, 1.4fr) minmax(120px, 0.8fr) minmax(220px, 1.8fr) 88px"
            gap={4}
            px={5}
            py={3}
            borderBottomWidth="1px"
            borderColor="var(--border)"
            bg="var(--surface-muted)"
          >
            <Text fontSize="sm" fontWeight="700" color="var(--muted-text)">Name</Text>
            <Text fontSize="sm" fontWeight="700" color="var(--muted-text)">Type</Text>
            <Text fontSize="sm" fontWeight="700" color="var(--muted-text)">Details</Text>
            <Text fontSize="sm" fontWeight="700" color="var(--muted-text)" textAlign="right">Actions</Text>
          </Box>

          <Stack separator={<Separator borderColor="var(--border)" />} p={{ base: 4, md: 0 }} gap={{ base: 4, md: 0 }}>
            {categories.map((category) => {
              const isEditing = editing?.categoryId === category.id
              const isBusy = busyCategoryId === category.id

              return (
                <Box key={category.id} px={{ base: 0, md: 5 }} py={{ base: 0, md: 4 }}>
                  {isEditing ? (
                    <Stack gap={3}>
                      <Input
                        value={editing.name}
                        onChange={(event) => setEditing((current) => (current ? { ...current, name: event.target.value } : null))}
                        bg="var(--surface)"
                        borderColor="var(--border-strong)"
                        color="var(--text-secondary)"
                      />
                      <HStack justify="flex-end">
                        <Button size="sm" variant="ghost" color="var(--muted-text)" onClick={() => setEditing(null)}>
                          Cancel
                        </Button>
                        <Button size="sm" colorPalette="blue" onClick={() => void saveEdit()} loading={isBusy} disabled={!editing.name.trim()}>
                          Save
                        </Button>
                      </HStack>
                    </Stack>
                  ) : (
                    <Box
                      display={{ base: 'flex', md: 'grid' }}
                      flexDirection="column"
                      gridTemplateColumns="minmax(220px, 1.4fr) minmax(120px, 0.8fr) minmax(220px, 1.8fr) 88px"
                      gap={{ base: 3, md: 4 }}
                      alignItems={{ base: 'stretch', md: 'center' }}
                    >
                      <Box minW="0">
                        <Text display={{ base: 'block', md: 'none' }} mb={1} fontSize="xs" textTransform="uppercase" letterSpacing="0.08em" color="var(--soft-text)">
                          Name
                        </Text>
                        <Text fontSize={{ base: 'md', md: 'md' }} fontWeight="700" color="var(--text-secondary)">
                          {category.name}
                        </Text>
                      </Box>

                      <Box minW="0">
                        <Text display={{ base: 'block', md: 'none' }} mb={1} fontSize="xs" textTransform="uppercase" letterSpacing="0.08em" color="var(--soft-text)">
                          Type
                        </Text>
                        <Badge colorPalette={category.isDefault ? 'purple' : 'blue'} fontSize="0.8rem" px={3} py={1} borderRadius="full">
                          {category.isDefault ? 'Default' : 'Custom'}
                        </Badge>
                      </Box>

                      <Box minW="0">
                        <Text display={{ base: 'block', md: 'none' }} mb={1} fontSize="xs" textTransform="uppercase" letterSpacing="0.08em" color="var(--soft-text)">
                          Details
                        </Text>
                        <Text color="var(--muted-text)" fontSize="sm">
                          {category.isDefault ? 'Available for all users by default' : 'Created in your account'}
                        </Text>
                      </Box>

                      <HStack gap={1} justify="flex-end">
                        {!category.isDefault && (
                          <Button
                            size="sm"
                            variant="ghost"
                            color="var(--muted-text)"
                            minW="2.5rem"
                            px={0}
                            aria-label={`Edit ${category.name}`}
                            onClick={() => setEditing({ categoryId: category.id, name: category.name })}
                          >
                            <EditIcon />
                          </Button>
                        )}

                        <Button
                          size="sm"
                          variant="ghost"
                          color="var(--danger-text)"
                          minW="2.5rem"
                          px={0}
                          aria-label={`${category.isDefault ? 'Hide' : 'Delete'} ${category.name}`}
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

      <Flex borderTopWidth="1px" borderColor="var(--border)" px={{ base: 4, md: 5 }} py={4} justify="space-between" align={{ base: 'flex-start', md: 'center' }} direction={{ base: 'column', md: 'row' }} gap={3}>
        <Text color="var(--soft-text)" fontSize="sm">
          {categories.length} {categories.length === 1 ? 'category' : 'categories'}
        </Text>
        <Text color="var(--soft-text)" fontSize="sm">
          Default categories can be hidden, custom categories can be edited or deleted.
        </Text>
      </Flex>
    </Box>
  )
}
