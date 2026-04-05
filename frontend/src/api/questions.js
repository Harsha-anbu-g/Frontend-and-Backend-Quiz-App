const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'

export async function fetchAllQuestions() {
  const response = await fetch(`${API_BASE_URL}/Question/allQuestions`)

  if (!response.ok) {
    throw new Error(`Failed to load questions (${response.status})`)
  }

  return response.json()
}

export async function fetchQuestionsByCategory(category) {
  const response = await fetch(`${API_BASE_URL}/Question/category/${encodeURIComponent(category)}`)

  if (!response.ok) {
    throw new Error(`Failed to load questions for ${category} (${response.status})`)
  }

  return response.json()
}

export async function createQuestion(question) {
  const response = await fetch(`${API_BASE_URL}/Question/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(question),
  })

  if (!response.ok) {
    let message = `Failed to add question (${response.status})`

    try {
      const errorData = await response.json()
      if (Array.isArray(errorData.details) && errorData.details.length > 0) {
        message = errorData.details.join(', ')
      }
    } catch {
      // Fall back to the default message when the response is not JSON.
    }

    throw new Error(message)
  }

  return response.text()
}

export async function deleteQuestion(questionId) {
  const response = await fetch(`${API_BASE_URL}/Question/delete/${questionId}`, {
    method: 'DELETE',
  })

  const message = await response.text()

  if (!response.ok) {
    throw new Error(message || `Failed to delete question (${response.status})`)
  }

  return message
}
