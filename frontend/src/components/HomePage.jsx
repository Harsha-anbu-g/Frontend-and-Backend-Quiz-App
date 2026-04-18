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
          <p className="eyebrow">How it works</p>
          <h1>Prepare. Then examine.</h1>
          <p className="hero-copy">
            Build your question bank first, then generate quizzes from those questions and test yourself.
          </p>
        </div>

        <div className="home-stats">
          <article className="home-stat-card">
            <span className="home-stat-label">Questions in bank</span>
            <strong>{questionCount}</strong>
          </article>
          <article className="home-stat-card">
            <span className="home-stat-label">Saved quizzes</span>
            <strong>{savedQuizCount}</strong>
          </article>
          <article className="home-stat-card">
            <span className="home-stat-label">Latest score</span>
            <strong>{quizResult ? `${quizResult.score}/${quizResult.total}` : '—'}</strong>
          </article>
        </div>
      </section>

      <div className="home-phases">
        {/* Step 1: Question Bank */}
        <section className="home-phase home-phase--prepare">
          <div className="phase-header">
            <span className="phase-badge phase-badge--prepare">Step 1</span>
            <div>
              <h2 className="phase-title">Question Bank</h2>
              <p className="phase-desc">Add and manage your questions.</p>
            </div>
          </div>

          <article className="home-card">
            <p className="summary-label">Question bank</p>
            <h3>Browse &amp; manage questions</h3>
            <p>View all stored questions, filter by category, add new ones, or delete old ones.</p>
            <div className="home-card-actions">
              <button className="primary-button" type="button" onClick={onBrowseQuestions}>
                Open Question Bank
              </button>
              <button className="secondary-button" type="button" onClick={onAddQuestion}>
                Add Question
              </button>
            </div>
            <span className="home-card-count">{questionCount} questions stored</span>
          </article>
        </section>

        {/* Step 2: Create Your Quiz */}
        <section className="home-phase home-phase--build">
          <div className="phase-header">
            <span className="phase-badge phase-badge--build">Step 2</span>
            <div>
              <h2 className="phase-title">Create Your Quiz</h2>
              <p className="phase-desc">Build and save quizzes from your questions.</p>
            </div>
          </div>

          <article className="home-card">
            <p className="summary-label">Quiz builder</p>
            <h3>Create a new quiz</h3>
            <p>Filter by category and difficulty to generate a quiz from your question bank.</p>
            <div className="home-card-actions">
              <button className="primary-button" type="button" onClick={onCreateQuiz}>
                Create Quiz
              </button>
            </div>
          </article>

        </section>

        {/* Step 3: Take Exam */}
        <section className="home-phase home-phase--exam">
          <div className="phase-header">
            <span className="phase-badge phase-badge--exam">Step 3</span>
            <div>
              <h2 className="phase-title">Take Exam</h2>
              <p className="phase-desc">Sit the quiz and see your score.</p>
            </div>
          </div>

          <article className="home-card">
            <p className="summary-label">Take Quiz</p>
            <h3>Your saved quizzes</h3>
            <p>Pick a saved quiz and start the exam. Your answers are submitted for scoring.</p>
            <div className="home-card-actions">
              <button className="primary-button" type="button" onClick={onOpenSavedQuizzes}>
                Take Quiz
              </button>
            </div>
          </article>

          <article className="home-card">
            <p className="summary-label">Results</p>
            <h3>{quizResult ? `${quizResult.score} / ${quizResult.total}` : 'No result yet'}</h3>
            <p>
              {quizResult
                ? `Latest: ${quizResult.title}`
                : 'Submit a quiz to see your score here.'}
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
      </div>
    </>
  )
}
