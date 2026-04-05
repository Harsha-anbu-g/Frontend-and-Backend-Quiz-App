export default function HomePage({
  questionCount,
  savedQuizCount,
  activeQuiz,
  quizResult,
  onBrowseQuestions,
  onAddQuestion,
  onCreateQuiz,
  onOpenSavedQuizzes,
  onTakeQuiz,
  onViewResult,
}) {
  return (
    <>
      <section className="home-hero">
        <div className="home-hero-copy">
          <p className="eyebrow">Home</p>
          <h1>Welcome to your quiz dashboard.</h1>
          <p className="hero-copy">
            Manage your question bank, build quizzes with filters, save them for later,
            and take tests from one simple workspace.
          </p>
          <div className="hero-actions">
            <button className="primary-button" type="button" onClick={onCreateQuiz}>
              Create Quiz
            </button>
            <button className="secondary-button" type="button" onClick={onBrowseQuestions}>
              Browse Questions
            </button>
          </div>
        </div>

        <div className="home-stats">
          <article className="home-stat-card">
            <span className="home-stat-label">Questions</span>
            <strong>{questionCount}</strong>
          </article>
          <article className="home-stat-card">
            <span className="home-stat-label">Saved quizzes</span>
            <strong>{savedQuizCount}</strong>
          </article>
          <article className="home-stat-card">
            <span className="home-stat-label">Latest score</span>
            <strong>{quizResult ? `${quizResult.score}/${quizResult.total}` : 'No result yet'}</strong>
          </article>
        </div>
      </section>

      <section className="home-grid">
        <article className="home-card">
          <p className="summary-label">Question bank</p>
          <h3>View all questions</h3>
          <p>Check what is already stored and filter by category when needed.</p>
          <div className="home-card-actions">
            <button className="primary-button" type="button" onClick={onBrowseQuestions}>
              Open Questions
            </button>
          </div>
        </article>

        <article className="home-card">
          <p className="summary-label">Add content</p>
          <h3>Add a new question</h3>
          <p>Insert a new question into PostgreSQL so it can be reused in quizzes later.</p>
          <div className="home-card-actions">
            <button className="primary-button" type="button" onClick={onAddQuestion}>
              Add Question
            </button>
          </div>
        </article>

        <article className="home-card">
          <p className="summary-label">Quiz builder</p>
          <h3>Create a new quiz</h3>
          <p>Choose category, difficulty, and question count, then save the quiz.</p>
          <div className="home-card-actions">
            <button className="primary-button" type="button" onClick={onCreateQuiz}>
              Create Quiz
            </button>
          </div>
        </article>

        <article className="home-card">
          <p className="summary-label">Saved quizzes</p>
          <h3>Open previous quizzes</h3>
          <p>Return to a quiz later, reopen it, or clean up old quiz records.</p>
          <div className="home-card-actions">
            <button className="primary-button" type="button" onClick={onOpenSavedQuizzes}>
              Open Saved Quizzes
            </button>
          </div>
        </article>

        <article className="home-card">
          <p className="summary-label">Take test</p>
          <h3>{activeQuiz ? activeQuiz.title : 'No quiz selected yet'}</h3>
          <p>
            {activeQuiz
              ? 'Continue the currently opened quiz and submit your answers.'
              : 'Choose a saved quiz first, then return here to start the test.'}
          </p>
          <div className="home-card-actions">
            <button className="primary-button" type="button" onClick={onTakeQuiz}>
              {activeQuiz ? 'Take Quiz' : 'Choose Quiz'}
            </button>
          </div>
        </article>

        <article className="home-card">
          <p className="summary-label">Results</p>
          <h3>{quizResult ? quizResult.title : 'No result available yet'}</h3>
          <p>
            {quizResult
              ? `Your latest score is ${quizResult.score} out of ${quizResult.total}.`
              : 'Once you submit a quiz, the result will appear here for quick access.'}
          </p>
          <div className="home-card-actions">
            <button
              className="primary-button"
              type="button"
              onClick={onViewResult}
              disabled={!quizResult}
            >
              View Result
            </button>
          </div>
        </article>
      </section>
    </>
  )
}
