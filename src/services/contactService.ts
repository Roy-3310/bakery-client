import { apiFetch } from './client'
import type { ContactMessage } from '../types'

interface MessagesResult {
  messages: ContactMessage[]
  total: number
  page: number
  totalPages: number
}

export async function submitContactForm(
  name: string,
  email: string,
  message: string
): Promise<string> {
  const { message: msg } = await apiFetch('/contact', {
    method: 'POST',
    body: JSON.stringify({ name, email, message }),
  })
  return msg
}

export async function getMessages(params?: Record<string, string>): Promise<MessagesResult> {
  const qs = params ? `?${new URLSearchParams(params)}` : ''
  const { data } = await apiFetch<MessagesResult>(`/contact${qs}`)
  return data
}

export async function markMessageAsRead(id: string): Promise<ContactMessage> {
  const { data } = await apiFetch<ContactMessage>(`/contact/${id}/read`, { method: 'PATCH' })
  return data
}
