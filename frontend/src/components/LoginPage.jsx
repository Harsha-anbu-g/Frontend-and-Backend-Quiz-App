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

        <form onSubmit={handleSubmit} className="auth-form">
          <label className="auth-field">
            <span>Username</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
            />
          </label>

          <label className="auth-field">
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          {error ? <p className="feedback error">{error}</p> : null}

          <button className="primary-button" type="submit" disabled={isLoading}>
            {isLoading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="auth-switch">
          Don&apos;t have an account?{' '}
          <button type="button" className="link-button" onClick={onGoToRegister}>
            Register
          </button>
        </p>
      </div>
    </main>
  )
}
