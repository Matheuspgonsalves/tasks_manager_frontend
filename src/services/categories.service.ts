import { InvalidApiResponseError, UnauthorizedError, apiEndpoints, apiFetch } from '../lib/api'
import type { ApiBaseResponse, Category, CreateCategoryBody, CreateCategoryResponse, GetCategoriesResponse } from '../types/category'

type CategoryApiShape = {
  id?: string
  name?: string
  isDefault?: boolean
  is_default?: boolean
  ownerUserId?: string | null
  owner_user_id?: string | null
  createdAt?: string
  created_at?: string
}

type ApiEnvelope = {
  success?: boolean
  message?: string
  category?: CategoryApiShape
  categories?: CategoryApiShape[]
}

function buildHeaders(includeJsonContentType = false): HeadersInit | undefined {
  if (!includeJsonContentType) {
    return undefined
  }

  return {
    'Content-Type': 'application/json',
  }
}

function getErrorMessage(payload: unknown, fallbackMessage: string) {
  if (payload && typeof payload === 'object' && 'message' in payload && typeof payload.message === 'string') {
    return payload.message
  }

  return fallbackMessage
}

function normalizeCategory(category: CategoryApiShape): Category {
  return {
    id: category.id ?? '',
    name: category.name ?? 'Untitled category',
    isDefault: category.isDefault ?? category.is_default ?? false,
    ownerUserId: category.ownerUserId ?? category.owner_user_id ?? null,
    createdAt: category.createdAt ?? category.created_at ?? '',
  }
}

async function parseJsonSafely(response: Response): Promise<unknown> {
  const text = await response.text()
  if (!text) return null

  try {
    return JSON.parse(text) as unknown
  } catch {
    throw new InvalidApiResponseError()
  }
}

async function parseEnvelope(response: Response, fallbackMessage: string): Promise<ApiEnvelope> {
  const payload = await parseJsonSafely(response)

  if (!response.ok) {
    throw new Error(getErrorMessage(payload, fallbackMessage))
  }

  if (!payload || typeof payload !== 'object') {
    throw new InvalidApiResponseError()
  }

  return payload as ApiEnvelope
}

export async function getCategoriesByUserId(userId: string): Promise<GetCategoriesResponse> {
  const response = await apiFetch(apiEndpoints.users.categoriesByUserId(userId), {
    method: 'GET',
    headers: buildHeaders(),
  })

  if (response.status === 401) {
    throw new UnauthorizedError()
  }

  if (response.status === 404) {
    return {
      success: true,
      message: 'No categories found.',
      categories: [],
    }
  }

  const payload = await parseEnvelope(response, 'Failed to fetch categories.')

  return {
    success: payload.success ?? true,
    message: payload.message ?? 'Categories fetched successfully',
    categories: Array.isArray(payload.categories) ? payload.categories.map(normalizeCategory).filter((category) => category.id) : [],
  }
}

export async function createCategory(payload: CreateCategoryBody): Promise<CreateCategoryResponse> {
  const response = await apiFetch(apiEndpoints.users.createCategory, {
    method: 'POST',
    headers: buildHeaders(true),
    body: JSON.stringify(payload),
  })

  if (response.status === 401) {
    throw new UnauthorizedError()
  }

  const envelope = await parseEnvelope(response, 'Failed to create category.')

  if (!envelope.category) {
    throw new InvalidApiResponseError('The server did not return the created category.')
  }

  return {
    success: envelope.success ?? true,
    message: envelope.message ?? 'Category successfully created',
    category: normalizeCategory(envelope.category),
  }
}

export async function updateCategory(categoryId: string, payload: CreateCategoryBody): Promise<ApiBaseResponse & { category?: Category }> {
  const response = await apiFetch(apiEndpoints.users.categoryById(categoryId), {
    method: 'PUT',
    headers: buildHeaders(true),
    body: JSON.stringify(payload),
  })

  if (response.status === 401) {
    throw new UnauthorizedError()
  }

  const envelope = await parseEnvelope(response, 'Failed to update category.')

  return {
    success: envelope.success ?? true,
    message: envelope.message ?? 'Category updated successfully',
    category: envelope.category ? normalizeCategory(envelope.category) : undefined,
  }
}

export async function deleteCategory(categoryId: string): Promise<ApiBaseResponse> {
  const response = await apiFetch(apiEndpoints.users.categoryById(categoryId), {
    method: 'DELETE',
    headers: buildHeaders(),
  })

  if (response.status === 401) {
    throw new UnauthorizedError()
  }

  const envelope = await parseEnvelope(response, 'Failed to remove category.')

  return {
    success: envelope.success ?? true,
    message: envelope.message ?? 'Category removed successfully',
  }
}
