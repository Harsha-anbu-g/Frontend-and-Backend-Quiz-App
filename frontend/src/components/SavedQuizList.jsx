export default function SavedQuizList({
  quizzes,
  isLoading,
  errorMessage,
  deletingQuizId,
  onRefresh,
  onTakeQuiz,
  onDeleteQuiz,
}) {
  if (isLoading) {
    return <p className="feedback">Loading saved quizzes...</p>
  }

  if (errorMessage) {
    return <p className="feedback error">{errorMessage}</p>
  }

  if (quizzes.length === 0) {
    return (
      <div className="empty-state">
        <p>No quizzes saved yet.</p>
        <span>Create one first, then it will appear here for later use.</span>
      </div>
    )
  }

  return (
    <>
      <div className="toolbar">
        <button className="switch-button" type="button" onClick={onRefresh}>
          Refresh quizzes
        </button>
      </div>

      <div className="saved-quiz-grid">
        {quizzes.map((quiz, index) => (
          <article className="saved-quiz-card" key={quiz.quizId}>
            <p className="summary-label">Quiz #{index + 1}</p>
            <h3>{quiz.title}</h3>
            <p>{quiz.questionCount} questions</p>
            <div className="saved-quiz-actions">
              <button className="primary-button" type="button" onClick={() => onTakeQuiz(quiz)}>
                Take Quiz
              </button>
              <button
                className="danger-button"
                type="button"
                onClick={() => onDeleteQuiz(quiz)}
                disabled={deletingQuizId === quiz.quizId}
              >
                {deletingQuizId === quiz.quizId ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </article>
        ))}
      </div>
    </>
  )
}
