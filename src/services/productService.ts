import { apiFetch } from './client'
import type { ServerProduct } from '../types'

interface ProductsResult {
  products: ServerProduct[]
  total: number
  page: number
  totalPages: number
}

export async function getProducts(params?: Record<string, string>): Promise<ProductsResult> {
  const qs = params ? `?${new URLSearchParams(params)}` : ''
  const { data } = await apiFetch<ProductsResult>(`/products${qs}`)
  return data
}

export async function getProduct(id: string): Promise<ServerProduct> {
  const { data } = await apiFetch<ServerProduct>(`/products/${id}`)
  return data
}

export async function createProduct(formData: FormData): Promise<ServerProduct> {
  const { data } = await apiFetch<ServerProduct>('/products', {
    method: 'POST',
    body: formData,
  })
  return data
}

export async function updateProduct(
  id: string,
  body: Partial<Omit<ServerProduct, '_id' | 'createdAt' | 'updatedAt'>>
): Promise<ServerProduct> {
  const { data } = await apiFetch<ServerProduct>(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  })
  return data
}

export async function deleteProduct(id: string): Promise<void> {
  await apiFetch(`/products/${id}`, { method: 'DELETE' })
}

export async function uploadProductImage(
  id: string,
  file: File
): Promise<{ product: ServerProduct; imageUrl: string }> {
  const form = new FormData()
  form.append('image', file)
  const { data } = await apiFetch<{ product: ServerProduct; imageUrl: string }>(
    `/products/${id}/image`,
    { method: 'POST', body: form }
  )
  return data
}
