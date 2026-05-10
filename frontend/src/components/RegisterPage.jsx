import { useState } from 'react'
import { register } from '../api/auth'

export default function RegisterPage({ onRegistered, onGoToLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('ROLE_STUDENT')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      await register(username, password, role)
      onRegistered()
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="auth-shell">
      <div className="auth-card">
        <div className="brand-block">
          <p className="brand-kicker">Quiz App</p>
          <strong className="brand-title">Create account</strong>
          <p className="brand-copy">Join as a teacher or student.</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <label className="auth-field">
            <span>Username</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
              autoComplete="username"
            />
          </label>

          <label className="auth-field">
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
          </label>

          <label className="auth-field">
            <span>I am a</span>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="ROLE_STUDENT">Student</option>
              <option value="ROLE_TEACHER">Teacher</option>
            </select>
          </label>

          {error ? <p className="feedback error">{error}</p> : null}

          <button className="primary-button" type="submit" disabled={isLoading}>
            {isLoading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?{' '}
          <button type="button" className="link-button" onClick={onGoToLogin}>
            Sign In
          </button>
        </p>
      </div>
    </main>
  )
}
