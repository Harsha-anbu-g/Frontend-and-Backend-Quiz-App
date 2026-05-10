import { clearToken, getToken } from './auth'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'

function buildQuery(params) {
  return new URLSearchParams(params).toString()
}

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

export async function createQuiz(payload) {
  const query = buildQuery(payload)
  const response = handle401(await fetch(`${API_BASE_URL}/quiz/create?${query}`, {
    method: 'POST',
    headers: authHeaders(),
  }))
  if (!response.ok) {
    const text = await response.text()
    throw new Error(text || `Failed to create quiz (${response.status})`)
  }
  return response.json()
}

export async function fetchAllQuizzes() {
  const response = handle401(await fetch(`${API_BASE_URL}/quiz/all`, {
    headers: authHeaders(),
  }))
  if (!response.ok) throw new Error(`Failed to load saved quizzes (${response.status})`)
  return response.json()
}

export async function deleteQuiz(quizId) {
  const response = handle401(await fetch(`${API_BASE_URL}/quiz/delete/${quizId}`, {
    method: 'DELETE',
    headers: authHeaders(),
  }))
  const message = await response.text()
  if (!response.ok) throw new Error(message || `Failed to delete quiz (${response.status})`)
  return message
}

export async function fetchQuizQuestions(quizId) {
  const response = handle401(await fetch(`${API_BASE_URL}/quiz/get/${quizId}`, {
    headers: authHeaders(),
  }))
  if (!response.ok) throw new Error(`Failed to load quiz questions (${response.status})`)
  return response.json()
}

export async function submitQuiz(quizId, responses) {
  const response = handle401(await fetch(`${API_BASE_URL}/quiz/submit/${quizId}`, {
    method: 'POST',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(responses),
  }))
  if (!response.ok) throw new Error(`Failed to submit quiz (${response.status})`)
  return response.json()
}
