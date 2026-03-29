import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAppContext } from '../app/AppContext'
import { AuthAlert } from '../components/auth/AuthAlert'
import { AuthLayout } from '../components/AuthLayout'
import { isValidEmail } from '../utils/auth'

export function ResetPasswordPage() {
  const { requestPasswordReset } = useAppContext()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.')
      setSuccess(false)
      return
    }

    setError('')
    setIsSubmitting(true)
    void requestPasswordReset({ email })
      .then(() => {
        setSuccess(true)
      })
      .catch(() => {
        setError('Unable to submit reset request right now.')
      })
      .finally(() => {
        setIsSubmitting(false)
      })
  }

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter your email and we will send a reset link."
      footer={
        <span>
          Remembered your password? <Link to="/auth/sign-in">Back to sign in</Link>
        </span>
      }
    >
      <AuthAlert tone="info">
        Password reset stays generic for security; backend delivery is still mocked.
      </AuthAlert>

      {success ? (
        <AuthAlert tone="success">
          If that email is registered, a reset link has been sent.
        </AuthAlert>
      ) : null}

      {error ? <div className="field-error visible">{error}</div> : null}

      <form className="auth-form" onSubmit={handleSubmit}>
        <label className={`auth-field ${error ? 'has-error' : ''}`}>
          <span>Email address</span>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value)
              if (error) setError('')
            }}
            disabled={success}
          />
        </label>

        <button className="auth-button" type="submit" disabled={isSubmitting || success}>
          {isSubmitting ? 'Sending...' : success ? 'Email sent' : 'Send reset link'}
        </button>
      </form>
    </AuthLayout>
  )
}
