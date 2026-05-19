import { apiFetch, setAccessToken } from './client'
import type { User } from '../types'

interface AuthData {
  user: User
  accessToken: string
  refreshToken: string
}

export async function login(email: string, password: string): Promise<User> {
  const { data } = await apiFetch<AuthData>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  setAccessToken(data.accessToken)
  localStorage.setItem('refreshToken', data.refreshToken)
  return data.user
}

export async function register(
  name: string,
  email: string,
  password: string,
  role: 'admin' | 'staff' = 'staff'
): Promise<User> {
  const { data } = await apiFetch<AuthData>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password, role }),
  })
  setAccessToken(data.accessToken)
  localStorage.setItem('refreshToken', data.refreshToken)
  return data.user
}

export async function logout(): Promise<void> {
  try {
    await apiFetch('/auth/logout', { method: 'POST' })
  } finally {
    setAccessToken(null)
    localStorage.removeItem('refreshToken')
  }
}

export async function refreshSession(): Promise<User | null> {
  const rt = localStorage.getItem('refreshToken')
  if (!rt) return null

  try {
    const res = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: rt }),
    })
    if (!res.ok) {
      localStorage.removeItem('refreshToken')
      return null
    }
    const json = await res.json()
    const { accessToken, refreshToken } = json.data as { accessToken: string; refreshToken: string }
    setAccessToken(accessToken)
    localStorage.setItem('refreshToken', refreshToken)

    const { data: user } = await apiFetch<User>('/auth/me')
    return user
  } catch {
    return null
  }
}
