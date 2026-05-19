import { apiFetch } from './client'
import type { Order, OrderCustomer, OrderStatus, PaymentStatus } from '../types'

interface OrdersResult {
  orders: Order[]
  total: number
  page: number
  totalPages: number
}

export interface CreateOrderPayload {
  customer: OrderCustomer
  items: { productId: string; quantity: number }[]
}

export async function createOrder(payload: CreateOrderPayload): Promise<Order> {
  const { data } = await apiFetch<Order>('/orders', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  return data
}

export async function getOrders(params?: Record<string, string>): Promise<OrdersResult> {
  const qs = params ? `?${new URLSearchParams(params)}` : ''
  const { data } = await apiFetch<OrdersResult>(`/orders${qs}`)
  return data
}

export async function getOrder(id: string): Promise<Order> {
  const { data } = await apiFetch<Order>(`/orders/${id}`)
  return data
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
  paymentStatus?: PaymentStatus
): Promise<Order> {
  const { data } = await apiFetch<Order>(`/orders/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status, ...(paymentStatus ? { paymentStatus } : {}) }),
  })
  return data
}
