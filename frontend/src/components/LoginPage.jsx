import { useState } from 'react'
import { login } from '../api/auth'

export default function LoginPage({ onLogin, onGoToRegister }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      const role = await login(username, password)
      onLogin(role)
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
          <strong className="brand-title">Welcome back</strong>
          <p className="brand-copy">Sign in to continue.</p>
        </div>

        <div className="auth-steps">
          <p className="auth-steps-label">How it works</p>
          <ol className="auth-steps-list">
            <li>Register as a <strong>Teacher</strong> or <strong>Student</strong></li>
            <li>Teachers create quizzes &amp; manage questions</li>
            <li>Students browse and attempt quizzes</li>
          </ol>
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
              autoComplete="current-password"
            />
          </label>

          {error ? <p className="feedback error">{error}</p> : null}

          <button className="primary-button" type="submit" disabled={isLoading}>
            {isLoading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <button
          type="button"
          className="guest-button"
          disabled={isLoading}
          onClick={() => onLogin('ROLE_TEACHER')}
        >
          Continue as Guest
        </button>

        <p className="auth-switch">
          New user?{' '}
          <button type="button" className="link-button" onClick={onGoToRegister}>
            Create an account →
          </button>
        </p>

        <div className="auth-footer">
          <p>Built by{' '}
            <a
              href="https://portfolioharsha.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="auth-portfolio-link"
            >
              Harshavardhan
            </a>
          </p>
        </div>
      </div>
    </main>
  )
}
