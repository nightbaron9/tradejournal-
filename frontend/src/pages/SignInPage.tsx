import type { FormEvent } from 'react'
import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthLayout } from '../components/AuthLayout'
import { isValidEmail } from '../utils/auth'

export function SignInPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('brian@tradelog.io')
  const [password, setPassword] = useState('hunter2hunter2')
  const [remember, setRemember] = useState(true)
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [formError, setFormError] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [loading, setLoading] = useState(false)

  const remainingAttempts = useMemo(() => Math.max(0, 5 - attempts), [attempts])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    let valid = true
    setEmailError('')
    setPasswordError('')
    setFormError('')

    if (!isValidEmail(email)) {
      setEmailError('Please enter a valid email.')
      valid = false
    }

    if (!password.trim()) {
      setPasswordError('Please enter your password.')
      valid = false
    }

    if (!valid) return

    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 800))
    setLoading(false)

    if (email === 'demo@tradelog.io' && password === 'Demo1234!pass') {
      navigate('/app/dashboard')
      return
    }

    setAttempts((current) => current + 1)
    setFormError('Invalid email or password.')
    setPassword('')
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your TradeLog account"
      footer={
        <>
          Don&apos;t have an account? <Link to="/auth/sign-up">Create one</Link>
        </>
      }
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <label className="auth-field">
          <span>Email address</span>
          <input
            className={emailError ? 'input-error' : ''}
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value)
              setEmailError('')
              setFormError('')
            }}
          />
          {emailError ? <span className="field-error">{emailError}</span> : null}
        </label>
        <label className="auth-field">
          <span>Password</span>
          <input
            className={passwordError ? 'input-error' : ''}
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value)
              setPasswordError('')
              setFormError('')
            }}
          />
          {passwordError ? <span className="field-error">{passwordError}</span> : null}
        </label>
        {formError ? <div className="auth-alert auth-alert-error">{formError}</div> : null}
        {attempts > 0 ? (
          <div className="auth-meta-text">
            {remainingAttempts > 0
              ? `${remainingAttempts} attempts remaining before server-side lockout would apply.`
              : 'Server-side lockout would now apply in production.'}
          </div>
        ) : null}
        <div className="auth-row">
          <label className="auth-checkbox">
            <input
              type="checkbox"
              checked={remember}
              onChange={(event) => setRemember(event.target.checked)}
            />
            <span>Keep me signed in for 30 days</span>
          </label>
          <Link to="/auth/reset-password">Forgot password?</Link>
        </div>
        <button className="auth-button" type="submit" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
        <div className="auth-meta-text">
          Demo login: <code>demo@tradelog.io</code> / <code>Demo1234!pass</code>
        </div>
      </form>
    </AuthLayout>
  )
}
