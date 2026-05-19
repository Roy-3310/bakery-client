const BASE = '/api'

let _accessToken: string | null = null

export function setAccessToken(token: string | null): void {
  _accessToken = token
}

export function getAccessToken(): string | null {
  return _accessToken
}

async function tryRefresh(): Promise<string | null> {
  const rt = localStorage.getItem('refreshToken')
  if (!rt) return null

  try {
    const res = await fetch(`${BASE}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: rt }),
    })
    if (!res.ok) {
      localStorage.removeItem('refreshToken')
      _accessToken = null
      return null
    }
    const json = await res.json()
    const { accessToken, refreshToken } = json.data as { accessToken: string; refreshToken: string }
    _accessToken = accessToken
    localStorage.setItem('refreshToken', refreshToken)
    return accessToken
  } catch {
    return null
  }
}

export async function apiFetch<T = unknown>(
  path: string,
  init: RequestInit = {}
): Promise<{ data: T; message: string }> {
  const isFormData = init.body instanceof FormData

  const buildHeaders = (token: string | null): HeadersInit => ({
    ...(!isFormData ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(init.headers as Record<string, string>),
  })

  let res = await fetch(`${BASE}${path}`, { ...init, headers: buildHeaders(_accessToken) })

  if (res.status === 401) {
    const newToken = await tryRefresh()
    if (newToken) {
      res = await fetch(`${BASE}${path}`, { ...init, headers: buildHeaders(newToken) })
    }
  }

  const json = await res.json()
  if (!res.ok) throw new Error(json.errors?.[0] ?? json.message ?? '請求失敗')
  return { data: json.data as T, message: json.message as string }
}
