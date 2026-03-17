import { Box, Container, Text } from '@chakra-ui/react'
import { useState } from 'react'
import { CategoriesList } from '../components/categories/CategoriesList'
import { CreateCategoryModal } from '../components/categories/CreateCategoryModal'
import { DashboardHeader } from '../components/dashboard/DashboardHeader'
import { useCategories } from '../hooks/useCategories'

export function CategoriesPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const {
    categories,
    isLoading,
    errorMessage,
    successMessage,
    busyCategoryId,
    isCreating,
    handleCreateCategory,
    handleDeleteCategory,
    handleUpdateCategory,
  } = useCategories()

  return (
    <Box as="main" minH="100vh" bg="var(--app-bg)">
      <DashboardHeader active="categories" />

      <Box pt={{ base: 10, md: 14 }} pb={16}>
        <Container maxW="7xl" px={{ base: 4, md: 8 }}>
          {successMessage ? (
            <Box mb={5} bg="var(--success-bg)" color="var(--success-text)" borderRadius="xl" p={4} borderWidth="1px" borderColor="var(--success-border)">
              {successMessage}
            </Box>
          ) : null}

          {errorMessage ? (
            <Box mb={5} bg="var(--danger-bg)" color="var(--danger-text)" borderRadius="xl" p={4} borderWidth="1px" borderColor="var(--danger-border)">
              {errorMessage}
            </Box>
          ) : null}

          {isLoading ? (
            <Box bg="var(--surface)" color="var(--muted-text)" borderRadius="2xl" p={8} borderWidth="1px" borderColor="var(--border)" boxShadow="var(--card-shadow)">
              Loading categories...
            </Box>
          ) : (
            <CategoriesList
              categories={categories}
              busyCategoryId={busyCategoryId}
              onAddCategory={() => setIsCreateModalOpen(true)}
              onDeleteCategory={async (categoryId) => {
                await handleDeleteCategory(categoryId)
              }}
              onUpdateCategory={async (categoryId, name) => {
                await handleUpdateCategory(categoryId, name)
              }}
            />
          )}

          {!isLoading && categories.length > 0 ? (
            <Text mt={5} color="var(--soft-text)" fontSize="sm" textAlign="center">
              New categories are added to the list immediately after a successful creation.
            </Text>
          ) : null}
        </Container>
      </Box>

      <CreateCategoryModal
        isOpen={isCreateModalOpen}
        isSubmitting={isCreating}
        errorMessage={errorMessage}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={async (name) => {
          const response = await handleCreateCategory(name)
          return response.success
        }}
      />
    </Box>
  )
}
