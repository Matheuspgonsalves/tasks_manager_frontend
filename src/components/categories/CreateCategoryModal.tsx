import { Box, Button, Field, Flex, Input, Stack, Text } from '@chakra-ui/react'
import { useState } from 'react'

type CreateCategoryModalProps = {
  isOpen: boolean
  isSubmitting: boolean
  errorMessage: string
  onClose: () => void
  onSubmit: (name: string) => Promise<boolean>
}

export function CreateCategoryModal({ isOpen, isSubmitting, errorMessage, onClose, onSubmit }: CreateCategoryModalProps) {
  const [name, setName] = useState('')
  const [validationMessage, setValidationMessage] = useState('')

  if (!isOpen) {
    return null
  }

  function handleClose() {
    setName('')
    setValidationMessage('')
    onClose()
  }

  async function handleSubmit() {
    const trimmedName = name.trim()

    if (!trimmedName) {
      setValidationMessage('Category name is required.')
      return
    }

    setValidationMessage('')
    const success = await onSubmit(trimmedName)

    if (success) {
      setName('')
      setValidationMessage('')
      onClose()
    }
  }

  return (
    <Box position="fixed" inset={0} zIndex={50} bg="rgba(15, 23, 42, 0.35)" display="flex" alignItems="center" justifyContent="center" px={4}>
      <Box
        as="section"
        role="dialog"
        aria-modal="true"
        w="full"
        maxW="md"
        bg="var(--surface)"
        borderWidth="1px"
        borderColor="var(--border)"
        borderRadius="2xl"
        boxShadow="var(--card-shadow)"
        p={{ base: 4, md: 6 }}
      >
        <Stack gap={5}>
          <Box>
            <Text color="var(--text-secondary)" fontSize={{ base: 'xl', md: '2xl' }} fontWeight="800">
              Create category
            </Text>
            <Text mt={1} color="var(--muted-text)" fontSize="sm">
              Add a custom category without leaving this page.
            </Text>
          </Box>

          <Field.Root invalid={Boolean(validationMessage || errorMessage)}>
            <Field.Label color="var(--muted-text)">Category name</Field.Label>
            <Input
              value={name}
              onChange={(event) => {
                setName(event.target.value)
                setValidationMessage('')
              }}
              placeholder="e.g. Work"
              bg="var(--surface)"
              borderColor="var(--border-strong)"
              color="var(--text-secondary)"
              autoFocus
            />
            {(validationMessage || errorMessage) && <Field.ErrorText>{validationMessage || errorMessage}</Field.ErrorText>}
          </Field.Root>

          <Flex justify="flex-end" gap={3}>
            <Button variant="ghost" color="var(--muted-text)" onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button colorPalette="blue" onClick={() => void handleSubmit()} loading={isSubmitting}>
              Create category
            </Button>
          </Flex>
        </Stack>
      </Box>
    </Box>
  )
}
