export type Category = {
  id: string
  name: string
  isDefault: boolean
  ownerUserId: string | null
  createdAt: string
}

export type ApiBaseResponse = {
  success: boolean
  message: string
}

export type GetCategoriesResponse = ApiBaseResponse & {
  categories: Category[]
}

export type CreateCategoryResponse = ApiBaseResponse & {
  category: Category
}

export type CreateCategoryBody = {
  name: string
  userId: string
}
