import { clearToken, getToken } from './auth'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'

function authHeaders(extra = {}) {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}`, ...extra } : { ...extra }
}

function handle401(response) {
  if (response.status === 401 && getToken()) {
    clearToken()
    window.dispatchEvent(new Event('auth:logout'))
  }
  return response
}

export async function fetchAllQuestions() {
  const response = handle401(await fetch(`${API_BASE_URL}/Question/allQuestions`, {
    headers: authHeaders(),
  }))
  if (!response.ok) throw new Error(`Failed to load questions (${response.status})`)
  return response.json()
}

export async function fetchQuestionsByCategory(category) {
  const response = handle401(await fetch(`${API_BASE_URL}/Question/category/${encodeURIComponent(category)}`, {
    headers: authHeaders(),
  }))
  if (!response.ok) throw new Error(`Failed to load questions for ${category} (${response.status})`)
  return response.json()
}

export async function createQuestion(question) {
  const response = handle401(await fetch(`${API_BASE_URL}/Question/add`, {
    method: 'POST',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(question),
  }))

  if (!response.ok) {
    let message = `Failed to add question (${response.status})`
    try {
      const errorData = await response.json()
      if (Array.isArray(errorData.details) && errorData.details.length > 0) {
        message = errorData.details.join(', ')
      }
    } catch {
      // fall back to default message
    }
    throw new Error(message)
  }

  return response.text()
}

export async function deleteQuestion(questionId) {
  const response = handle401(await fetch(`${API_BASE_URL}/Question/delete/${questionId}`, {
    method: 'DELETE',
    headers: authHeaders(),
  }))
  const message = await response.text()
  if (!response.ok) throw new Error(message || `Failed to delete question (${response.status})`)
  return message
}
