import { useEffect, useState } from 'react'
import { fetchQuizQuestions, submitQuiz } from '../api/quiz'

export default function QuizPlayer({ activeQuiz, onComplete }) {
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadQuizQuestions() {
      setIsLoading(true)
      setErrorMessage('')
      setAnswers({})

      try {
        const data = await fetchQuizQuestions(activeQuiz.quizId)
        if (isMounted) {
          setQuestions(data)
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error.message)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadQuizQuestions()

    return () => {
      isMounted = false
    }
  }, [activeQuiz.quizId])

  function handleAnswerChange(questionId, response) {
    setAnswers((current) => ({
      ...current,
      [questionId]: response,
    }))
  }

  const answeredCount = questions.filter((question) => answers[question.id]).length
  const allAnswered = questions.length > 0 && answeredCount === questions.length

  async function handleSubmit(event) {
    event.preventDefault()

    if (!allAnswered) {
      setErrorMessage('Please answer every question before submitting.')
      return
    }

    setErrorMessage('')
    setIsSubmitting(true)

    try {
      const payload = questions.map((question) => ({
        id: question.id,
        response: answers[question.id] ?? '',
      }))
      const score = await submitQuiz(activeQuiz.quizId, payload)
      onComplete({
        score,
        total: questions.length,
        title: activeQuiz.title,
      })
    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <p className="feedback">Loading quiz questions...</p>
  }

  if (errorMessage) {
    return <p className="feedback error">{errorMessage}</p>
  }

  return (
    <form className="quiz-form" onSubmit={handleSubmit}>
      <p className="feedback">
        Answered {answeredCount} of {questions.length} questions
      </p>

      {questions.map((question, index) => (
        <article className="quiz-question-card" key={question.id}>
          <p className="summary-label">Question {index + 1}</p>
          <h3>{question.questionTitle}</h3>
          <div className="option-stack">
            {[question.option1, question.option2, question.option3, question.option4].map((option) => (
              <label className="option-choice" key={option}>
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={option}
                  checked={answers[question.id] === option}
                  onChange={() => handleAnswerChange(question.id, option)}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </article>
      ))}

      {errorMessage ? <p className="feedback error">{errorMessage}</p> : null}

      <button className="primary-button" type="submit" disabled={isSubmitting || !allAnswered}>
        {isSubmitting ? 'Submitting...' : 'Submit quiz'}
      </button>
    </form>
  )
}
