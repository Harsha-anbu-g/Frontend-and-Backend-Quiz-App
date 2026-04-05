import { useEffect, useState } from 'react'
import './App.css'
import {
  createQuestion,
  deleteQuestion,
  fetchAllQuestions,
  fetchQuestionsByCategory,
} from './api/questions'
import { createQuiz, deleteQuiz, fetchAllQuizzes } from './api/quiz'
import CreateQuizForm from './components/CreateQuizForm'
import HomePage from './components/HomePage'
import QuestionForm from './components/QuestionForm'
import QuestionList from './components/QuestionList'
import QuizPlayer from './components/QuizPlayer'
import SavedQuizList from './components/SavedQuizList'

function normalizeCategory(category) {
  return category.trim().toLowerCase()
}

function formatCategoryLabel(category) {
  return category.charAt(0).toUpperCase() + category.slice(1)
}

function normalizeDifficultyLevel(difficultyLevel) {
  return difficultyLevel.trim().toLowerCase()
}

function getSectionMeta(currentView, activeQuiz) {
  switch (currentView) {
    case 'questions':
      return {
        eyebrow: 'Question Bank',
        title: 'Browse Questions',
        note: 'Review, filter, refresh, and delete questions from your PostgreSQL question bank.',
      }
    case 'add':
      return {
        eyebrow: 'Add Question',
        title: 'Create a Question',
        note: 'Add a new question so it can be reused in future quizzes.',
      }
    case 'createQuiz':
      return {
        eyebrow: 'Create Quiz',
        title: 'Build a Quiz',
        note: 'Use category, difficulty, and question count filters to generate a new quiz.',
      }
    case 'savedQuizzes':
      return {
        eyebrow: 'Saved Quizzes',
        title: 'Quiz Library',
        note: 'Open a saved quiz later or delete quizzes you no longer need.',
      }
    case 'takeQuiz':
      return {
        eyebrow: 'Take Quiz',
        title: activeQuiz?.title ?? 'Take Quiz',
        note: activeQuiz
          ? 'Answer every question, then submit to calculate your score.'
          : 'Choose a saved quiz or create a new one first.',
      }
    case 'result':
      return {
        eyebrow: 'Result',
        title: 'Quiz Result',
        note: 'See the score returned by the backend after submission.',
      }
    default:
      return {
        eyebrow: 'Home',
        title: 'Quiz Dashboard',
        note: 'Open the section you want from the navigation or home cards.',
      }
  }
}

function App() {
  const [currentView, setCurrentView] = useState('home')
  const [questions, setQuestions] = useState([])
  const [questionBankCount, setQuestionBankCount] = useState(0)
  const [availableCategories, setAvailableCategories] = useState(['All'])
  const [availableDifficultyLevels, setAvailableDifficultyLevels] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [noticeMessage, setNoticeMessage] = useState('')
  const [noticeType, setNoticeType] = useState('success')
  const [refreshKey, setRefreshKey] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [activeQuiz, setActiveQuiz] = useState(null)
  const [quizResult, setQuizResult] = useState(null)
  const [savedQuizzes, setSavedQuizzes] = useState([])
  const [isLoadingSavedQuizzes, setIsLoadingSavedQuizzes] = useState(true)
  const [savedQuizErrorMessage, setSavedQuizErrorMessage] = useState('')
  const [quizLibraryRefreshKey, setQuizLibraryRefreshKey] = useState(0)
  const [deletingQuizId, setDeletingQuizId] = useState(null)
  const [deletingQuestionId, setDeletingQuestionId] = useState(null)

  useEffect(() => {
    let isMounted = true

    async function loadQuestions() {
      setIsLoading(true)
      setErrorMessage('')

      try {
        const allQuestions = await fetchAllQuestions()
        if (isMounted) {
          setQuestionBankCount(allQuestions.length)
          setAvailableCategories([
            'All',
            ...new Set(
              allQuestions
                .map((question) => question.category)
                .filter(Boolean)
                .map((category) => normalizeCategory(category)),
            ),
          ])
          setAvailableDifficultyLevels([
            ...new Set(
              allQuestions
                .map((question) => question.difficultyLevel)
                .filter(Boolean)
                .map((difficultyLevel) => normalizeDifficultyLevel(difficultyLevel)),
            ),
          ])
        }

        const data =
          selectedCategory === 'All'
            ? allQuestions
            : await fetchQuestionsByCategory(selectedCategory)

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

    loadQuestions()

    return () => {
      isMounted = false
    }
  }, [refreshKey, selectedCategory])

  useEffect(() => {
    let isMounted = true

    async function loadSavedQuizzes() {
      setIsLoadingSavedQuizzes(true)
      setSavedQuizErrorMessage('')

      try {
        const quizzes = await fetchAllQuizzes()
        if (isMounted) {
          setSavedQuizzes(quizzes)
        }
      } catch (error) {
        if (isMounted) {
          setSavedQuizErrorMessage(error.message)
        }
      } finally {
        if (isMounted) {
          setIsLoadingSavedQuizzes(false)
        }
      }
    }

    loadSavedQuizzes()

    return () => {
      isMounted = false
    }
  }, [quizLibraryRefreshKey])

  async function handleCreateQuestion(question) {
    setIsSubmitting(true)

    try {
      await createQuestion(question)
      setNoticeType('success')
      setNoticeMessage('Question added successfully.')
      setCurrentView('questions')
      setSelectedCategory('All')
      setRefreshKey((current) => current + 1)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleCreateQuiz(quizData) {
    setIsSubmitting(true)

    try {
      const createdQuiz = await createQuiz(quizData)
      setActiveQuiz(createdQuiz)
      setQuizResult(null)
      setNoticeType('success')
      setNoticeMessage(`Quiz "${createdQuiz.title}" created successfully.`)
      setQuizLibraryRefreshKey((current) => current + 1)
      setCurrentView('takeQuiz')
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleQuizComplete(result) {
    setQuizResult(result)
    setNoticeType('success')
    setNoticeMessage(`Quiz submitted. You scored ${result.score} out of ${result.total}.`)
    setCurrentView('result')
  }

  function handleTakeSavedQuiz(quiz) {
    setActiveQuiz(quiz)
    setQuizResult(null)
    setNoticeType('success')
    setNoticeMessage(`Opened quiz "${quiz.title}".`)
    setCurrentView('takeQuiz')
  }

  async function handleDeleteQuiz(quiz) {
    const confirmed = window.confirm(
      `Delete quiz "${quiz.title}"? This will remove it from the saved list and PostgreSQL.`,
    )

    if (!confirmed) {
      return
    }

    setDeletingQuizId(quiz.quizId)

    try {
      await deleteQuiz(quiz.quizId)
      setSavedQuizzes((current) => current.filter((item) => item.quizId !== quiz.quizId))

      if (activeQuiz?.quizId === quiz.quizId) {
        setActiveQuiz(null)
        setQuizResult(null)
        if (currentView === 'takeQuiz') {
          setCurrentView('savedQuizzes')
        }
      }

      setNoticeType('success')
      setNoticeMessage(`Quiz "${quiz.title}" deleted successfully.`)
    } catch (error) {
      setNoticeType('error')
      setNoticeMessage(error.message)
    } finally {
      setDeletingQuizId(null)
    }
  }

  async function handleDeleteQuestion(question) {
    const confirmed = window.confirm(
      'Delete this question? This will remove it from PostgreSQL and from any saved quizzes using it.',
    )

    if (!confirmed) {
      return
    }

    setDeletingQuestionId(question.id)

    try {
      await deleteQuestion(question.id)
      setQuestions((current) => current.filter((item) => item.id !== question.id))
      setNoticeType('success')
      setNoticeMessage('Question deleted successfully.')
      setRefreshKey((current) => current + 1)
      setQuizLibraryRefreshKey((current) => current + 1)
    } catch (error) {
      setNoticeType('error')
      setNoticeMessage(error.message)
    } finally {
      setDeletingQuestionId(null)
    }
  }

  function handleOpenTakeQuiz() {
    setCurrentView(activeQuiz ? 'takeQuiz' : 'savedQuizzes')
  }

  function handleOpenResult() {
    if (quizResult) {
      setCurrentView('result')
    }
  }

  const sectionMeta = getSectionMeta(currentView, activeQuiz)

  return (
    <main className="app-shell">
      <header className="site-header">
        <div className="brand-block">
          <p className="brand-kicker">Quiz App</p>
          <div>
            <strong className="brand-title">Quiz Control Center</strong>
            <p className="brand-copy">Create, save, and take quizzes from one place.</p>
          </div>
        </div>

        <nav className="site-nav" aria-label="Main navigation">
          <button
            className={currentView === 'home' ? 'nav-button active' : 'nav-button'}
            onClick={() => setCurrentView('home')}
            type="button"
          >
            Home
          </button>
          <button
            className={currentView === 'questions' ? 'nav-button active' : 'nav-button'}
            onClick={() => setCurrentView('questions')}
            type="button"
          >
            Questions
          </button>
          <button
            className={currentView === 'add' ? 'nav-button active' : 'nav-button'}
            onClick={() => setCurrentView('add')}
            type="button"
          >
            Add Question
          </button>
          <button
            className={currentView === 'createQuiz' ? 'nav-button active' : 'nav-button'}
            onClick={() => setCurrentView('createQuiz')}
            type="button"
          >
            Create Quiz
          </button>
          <button
            className={currentView === 'savedQuizzes' ? 'nav-button active' : 'nav-button'}
            onClick={() => setCurrentView('savedQuizzes')}
            type="button"
          >
            Saved Quizzes
          </button>
          <button
            className={currentView === 'takeQuiz' ? 'nav-button active' : 'nav-button'}
            onClick={handleOpenTakeQuiz}
            type="button"
          >
            Take Quiz
          </button>
          <button
            className={currentView === 'result' ? 'nav-button active' : 'nav-button'}
            onClick={handleOpenResult}
            type="button"
            disabled={!quizResult}
          >
            Result
          </button>
        </nav>
      </header>

      {noticeMessage ? <p className={`feedback ${noticeType}`}>{noticeMessage}</p> : null}

      {currentView === 'home' ? (
        <HomePage
          questionCount={questionBankCount}
          savedQuizCount={savedQuizzes.length}
          activeQuiz={activeQuiz}
          quizResult={quizResult}
          onBrowseQuestions={() => setCurrentView('questions')}
          onAddQuestion={() => setCurrentView('add')}
          onCreateQuiz={() => setCurrentView('createQuiz')}
          onOpenSavedQuizzes={() => setCurrentView('savedQuizzes')}
          onTakeQuiz={handleOpenTakeQuiz}
          onViewResult={handleOpenResult}
        />
      ) : (
        <section className="content-panel">
          <div className="section-header">
            <div>
              <p className="eyebrow">{sectionMeta.eyebrow}</p>
              <h2>{sectionMeta.title}</h2>
            </div>
            <span className="section-note">{sectionMeta.note}</span>
          </div>

          {currentView === 'questions' ? (
            <>
              <div className="toolbar">
                <label className="toolbar-field">
                  <span>Category</span>
                  <select
                    value={selectedCategory}
                    onChange={(event) => setSelectedCategory(event.target.value)}
                  >
                    {availableCategories.map((category) => (
                      <option key={category} value={category}>
                        {category === 'All' ? category : formatCategoryLabel(category)}
                      </option>
                    ))}
                  </select>
                </label>
                <button
                  className="secondary-button"
                  type="button"
                  onClick={() => setRefreshKey((current) => current + 1)}
                >
                  Refresh
                </button>
              </div>
              {isLoading ? <p className="feedback">Loading questions from the API...</p> : null}
              {errorMessage ? <p className="feedback error">{errorMessage}</p> : null}
              {!isLoading && !errorMessage ? (
                <QuestionList
                  questions={questions}
                  deletingQuestionId={deletingQuestionId}
                  onDeleteQuestion={handleDeleteQuestion}
                />
              ) : null}
            </>
          ) : null}

          {currentView === 'add' ? (
            <QuestionForm onSubmit={handleCreateQuestion} isSubmitting={isSubmitting} />
          ) : null}

          {currentView === 'createQuiz' ? (
            <CreateQuizForm
              categoryOptions={availableCategories.filter((category) => category !== 'All')}
              difficultyOptions={availableDifficultyLevels}
              onSubmit={handleCreateQuiz}
              isSubmitting={isSubmitting}
            />
          ) : null}

          {currentView === 'savedQuizzes' ? (
            <SavedQuizList
              quizzes={savedQuizzes}
              isLoading={isLoadingSavedQuizzes}
              errorMessage={savedQuizErrorMessage}
              deletingQuizId={deletingQuizId}
              onRefresh={() => setQuizLibraryRefreshKey((current) => current + 1)}
              onTakeQuiz={handleTakeSavedQuiz}
              onDeleteQuiz={handleDeleteQuiz}
            />
          ) : null}

          {currentView === 'takeQuiz' ? (
            activeQuiz ? (
              <QuizPlayer activeQuiz={activeQuiz} onComplete={handleQuizComplete} />
            ) : (
              <article className="result-card">
                <p className="summary-label">No active quiz</p>
                <h3>Choose a saved quiz or create a new one first.</h3>
                <button
                  className="primary-button"
                  type="button"
                  onClick={() => setCurrentView('savedQuizzes')}
                >
                  Open Saved Quizzes
                </button>
              </article>
            )
          ) : null}

          {currentView === 'result' ? (
            quizResult ? (
              <article className="result-card">
                <p className="summary-label">Quiz complete</p>
                <strong>{quizResult.title}</strong>
                <h3>
                  You scored {quizResult.score} out of {quizResult.total}
                </h3>
                <button
                  className="primary-button"
                  type="button"
                  onClick={() => setCurrentView('createQuiz')}
                >
                  Create another quiz
                </button>
              </article>
            ) : (
              <article className="result-card">
                <p className="summary-label">No result yet</p>
                <h3>Finish a quiz first to see your score here.</h3>
                <button
                  className="primary-button"
                  type="button"
                  onClick={() => setCurrentView('savedQuizzes')}
                >
                  Open Saved Quizzes
                </button>
              </article>
            )
          ) : null}
        </section>
      )}
    </main>
  )
}

export default App
