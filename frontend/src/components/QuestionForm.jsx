import { useState } from 'react'

const initialForm = {
  questionTitle: '',
  option1: '',
  option2: '',
  option3: '',
  option4: '',
  rightAnswer: '',
  difficultyLevel: '',
  category: '',
}

export default function QuestionForm({ onSubmit, isSubmitting }) {
  const [formData, setFormData] = useState(initialForm)
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [feedbackType, setFeedbackType] = useState('')

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((current) => ({
      ...current,
      [name]: value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setFeedbackMessage('')
    setFeedbackType('')

    try {
      await onSubmit(formData)
      setFormData(initialForm)
      setFeedbackType('success')
      setFeedbackMessage('Question added successfully.')
    } catch (error) {
      setFeedbackType('error')
      setFeedbackMessage(error.message)
    }
  }

  return (
    <form className="question-form" onSubmit={handleSubmit}>
      <div className="form-field field-wide">
        <label htmlFor="questionTitle">Question title</label>
        <textarea
          id="questionTitle"
          name="questionTitle"
          value={formData.questionTitle}
          onChange={handleChange}
          rows="3"
          placeholder="What does JVM stand for?"
        />
      </div>

      <div className="form-field">
        <label htmlFor="category">Category</label>
        <input
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          placeholder="Java"
        />
      </div>

      <div className="form-field">
        <label htmlFor="difficultyLevel">Difficulty</label>
        <input
          id="difficultyLevel"
          name="difficultyLevel"
          value={formData.difficultyLevel}
          onChange={handleChange}
          placeholder="Easy"
        />
      </div>

      <div className="form-field">
        <label htmlFor="option1">Option 1</label>
        <input
          id="option1"
          name="option1"
          value={formData.option1}
          onChange={handleChange}
          placeholder="Java Virtual Machine"
        />
      </div>

      <div className="form-field">
        <label htmlFor="option2">Option 2</label>
        <input
          id="option2"
          name="option2"
          value={formData.option2}
          onChange={handleChange}
          placeholder="Java Variable Method"
        />
      </div>

      <div className="form-field">
        <label htmlFor="option3">Option 3</label>
        <input
          id="option3"
          name="option3"
          value={formData.option3}
          onChange={handleChange}
          placeholder="Joint Vector Model"
        />
      </div>

      <div className="form-field">
        <label htmlFor="option4">Option 4</label>
        <input
          id="option4"
          name="option4"
          value={formData.option4}
          onChange={handleChange}
          placeholder="Java Verified Module"
        />
      </div>

      <div className="form-field field-wide">
        <label htmlFor="rightAnswer">Right answer</label>
        <input
          id="rightAnswer"
          name="rightAnswer"
          value={formData.rightAnswer}
          onChange={handleChange}
          placeholder="Java Virtual Machine"
        />
      </div>

      {feedbackMessage ? (
        <p className={`form-feedback ${feedbackType}`}>{feedbackMessage}</p>
      ) : null}

      <button className="primary-button field-wide" type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Add question'}
      </button>
    </form>
  )
}
