export default function HomePage({
  userRole,
  questionCount,
  quizzes,
  isLoadingQuizzes,
  quizResult,
  onAddQuestion,
  onBrowseQuestions,
  onCreateQuiz,
  onTakeQuiz,
  onViewResult,
}) {
  const isTeacher = userRole === 'ROLE_TEACHER'

  return (
    <div className="workspace">
      <section className="workspace-section" aria-label="Your quizzes">
        <div className="workspace-head">
          <h2>Your quizzes</h2>
          {isTeacher && (
            <button className="primary-button" type="button" onClick={onCreateQuiz}>
              + New quiz
            </button>
          )}
        </div>

        {isLoadingQuizzes ? (
          <p className="empty-row">Loading quizzes…</p>
        ) : quizzes.length === 0 ? (
          <p className="empty-row">
            No quizzes yet.{' '}
            {isTeacher ? (
              <button className="link-button" type="button" onClick={onCreateQuiz}>
                Create your first quiz
              </button>
            ) : (
              'Check back once your teacher has published one.'
            )}
          </p>
        ) : (
          quizzes.map((quiz) => (
            <div className="quiz-row" key={quiz.quizId}>
              <div className="quiz-row-main">
                <span className="quiz-row-title">{quiz.title}</span>
                <span className="quiz-row-meta">
                  {quiz.questionCount} question{quiz.questionCount === 1 ? '' : 's'}
                </span>
              </div>
              <div className="row-actions">
                <button className="row-button" type="button" onClick={() => onTakeQuiz(quiz)}>
                  Take →
                </button>
              </div>
            </div>
          ))
        )}
      </section>

      {isTeacher && (
        <section className="workspace-section" aria-label="Question bank">
          <div className="workspace-head">
            <h2>Question bank</h2>
            <button className="row-button" type="button" onClick={onAddQuestion}>
              + Add question
            </button>
          </div>
          <div className="fact-row">
            <span className="fact-label">
              {questionCount} question{questionCount === 1 ? '' : 's'} stored
            </span>
            <div className="row-actions">
              <button className="row-button" type="button" onClick={onBrowseQuestions}>
                Open →
              </button>
            </div>
          </div>
        </section>
      )}

      <section className="workspace-section" aria-label="Latest result">
        <div className="workspace-head">
          <h2>Latest result</h2>
        </div>
        {quizResult ? (
          <div className="fact-row">
            <span className="fact-label">{quizResult.title}</span>
            <div className="row-actions">
              <span className="fact-value">
                {quizResult.score}/{quizResult.total}
              </span>
              <button className="row-button" type="button" onClick={onViewResult}>
                View →
              </button>
            </div>
          </div>
        ) : (
          <p className="empty-row">Nothing graded yet. Take a quiz to get a score.</p>
        )}
      </section>
    </div>
  )
}
