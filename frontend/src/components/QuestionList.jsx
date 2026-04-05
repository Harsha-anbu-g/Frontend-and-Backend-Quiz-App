export default function QuestionList({ questions, deletingQuestionId, onDeleteQuestion }) {
  if (questions.length === 0) {
    return (
      <div className="empty-state">
        <p>No questions found yet.</p>
        <span>Add some records in PostgreSQL or through the backend API first.</span>
      </div>
    )
  }

  return (
    <div className="question-grid">
      {questions.map((question, index) => (
        <article className="question-card" key={question.id}>
          <div className="question-meta">
            <span className="question-count">Question {index + 1}</span>
            <span className="question-tag">{question.category}</span>
            <span className="question-level">{question.difficultyLevel}</span>
          </div>
          <h3>{question.questionTitle}</h3>
          <ul>
            <li>{question.option1}</li>
            <li>{question.option2}</li>
            <li>{question.option3}</li>
            <li>{question.option4}</li>
          </ul>
          <p className="answer-note">
            <span className="answer-label">Correct answer</span>
            <span className="answer-value">{question.rightAnswer || 'Not set'}</span>
          </p>
          <div className="question-actions">
            <button
              className="danger-button"
              type="button"
              onClick={() => onDeleteQuestion(question)}
              disabled={deletingQuestionId === question.id}
            >
              {deletingQuestionId === question.id ? 'Deleting...' : 'Delete Question'}
            </button>
          </div>
        </article>
      ))}
    </div>
  )
}
