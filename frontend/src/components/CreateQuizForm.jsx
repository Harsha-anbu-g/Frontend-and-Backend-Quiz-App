import { useState } from 'react'

const initialForm = {
  title: '',
  category: '',
  difficultyLevel: '',
  numQ: 5,
}

function formatCategoryLabel(category) {
  return category.charAt(0).toUpperCase() + category.slice(1)
}

function formatDifficultyLabel(difficultyLevel) {
  return difficultyLevel.charAt(0).toUpperCase() + difficultyLevel.slice(1)
}

export default function CreateQuizForm({
  categoryOptions,
  difficultyOptions,
  onSubmit,
  isSubmitting,
}) {
  const [formData, setFormData] = useState(initialForm)
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [feedbackType, setFeedbackType] = useState('')

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((current) => ({
      ...current,
      [name]: name === 'numQ' ? Number(value) : value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setFeedbackMessage('')
    setFeedbackType('')

    try {
      await onSubmit(formData)
      setFeedbackType('success')
      setFeedbackMessage('Quiz created successfully. The app is moving to the quiz view.')
    } catch (error) {
      setFeedbackType('error')
      setFeedbackMessage(error.message)
    }
  }

  return (
    <form className="question-form" onSubmit={handleSubmit}>
      <div className="form-field field-wide">
        <label htmlFor="title">Quiz title</label>
        <input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Java Basics Quiz"
        />
      </div>

      <div className="form-field">
        <label htmlFor="category">Category</label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
        >
          <option value="">Any category</option>
          {categoryOptions.map((category) => (
            <option key={category} value={category}>
              {formatCategoryLabel(category)}
            </option>
          ))}
        </select>
      </div>

      <div className="form-field">
        <label htmlFor="numQ">Number of questions</label>
        <input
          id="numQ"
          name="numQ"
          type="number"
          min="1"
          value={formData.numQ}
          onChange={handleChange}
        />
      </div>

      <div className="form-field">
        <label htmlFor="difficultyLevel">Difficulty</label>
        <select
          id="difficultyLevel"
          name="difficultyLevel"
          value={formData.difficultyLevel}
          onChange={handleChange}
        >
          <option value="">Any difficulty</option>
          {difficultyOptions.map((difficultyLevel) => (
            <option key={difficultyLevel} value={difficultyLevel}>
              {formatDifficultyLabel(difficultyLevel)}
            </option>
          ))}
        </select>
      </div>

      {feedbackMessage ? (
        <p className={`form-feedback ${feedbackType}`}>{feedbackMessage}</p>
      ) : null}

      <button className="primary-button field-wide" type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating...' : 'Create quiz'}
      </button>
    </form>
  )
}
