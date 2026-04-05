const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'

function buildQuery(params) {
  return new URLSearchParams(params).toString()
}

export async function createQuiz(payload) {
  const query = buildQuery(payload)
  const response = await fetch(`${API_BASE_URL}/quiz/create?${query}`, {
    method: 'POST',
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message ?? `Failed to create quiz (${response.status})`)
  }

  return data
}

export async function fetchAllQuizzes() {
  const response = await fetch(`${API_BASE_URL}/quiz/all`)

  if (!response.ok) {
    throw new Error(`Failed to load saved quizzes (${response.status})`)
  }

  return response.json()
}

export async function deleteQuiz(quizId) {
  const response = await fetch(`${API_BASE_URL}/quiz/delete/${quizId}`, {
    method: 'DELETE',
  })

  const message = await response.text()

  if (!response.ok) {
    throw new Error(message || `Failed to delete quiz (${response.status})`)
  }

  return message
}

export async function fetchQuizQuestions(quizId) {
  const response = await fetch(`${API_BASE_URL}/quiz/get/${quizId}`)

  if (!response.ok) {
    throw new Error(`Failed to load quiz questions (${response.status})`)
  }

  return response.json()
}

export async function submitQuiz(quizId, responses) {
  const response = await fetch(`${API_BASE_URL}/quiz/submit/${quizId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(responses),
  })

  if (!response.ok) {
    throw new Error(`Failed to submit quiz (${response.status})`)
  }

  return response.json()
}
