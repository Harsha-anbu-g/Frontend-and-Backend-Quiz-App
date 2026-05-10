const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'

export function getToken() {
  return localStorage.getItem('token')
}

export function saveToken(token) {
  localStorage.setItem('token', token)
}

export function clearToken() {
  localStorage.removeItem('token')
}

export function getRole() {
  const token = getToken()
  if (!token) return null
  try {
    // JWT uses Base64url (- and _ instead of + and /). atob() requires standard Base64.
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    const payload = JSON.parse(atob(base64))
    return payload.role ?? null
  } catch {
    return null
  }
}

export function isLoggedIn() {
  return getToken() !== null && getRole() !== null
}

export async function login(username, password) {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })

  if (!response.ok) {
    throw new Error('Invalid username or password')
  }

  const token = await response.text()
  saveToken(token)
  return getRole()
}

export async function register(username, password, role) {
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, role }),
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || 'Registration failed')
  }
}
