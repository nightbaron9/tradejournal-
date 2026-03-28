import { useMemo, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthLayout } from '../components/AuthLayout'
import { isValidEmail, passwordStrengthLabel, scorePassword } from '../utils/auth'

export function SignUpPage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [acceptedTerms, setAcceptedTerms] = useState(true)
  const [loading, setLoading] = useState(false)
  const [bannerError, setBannerError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const passwordScore = useMemo(() => scorePassword(password), [password])
  const passwordStrength = useMemo(
    () => passwordStrengthLabel(passwordScore),
    [passwordScore],
  )

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextErrors = {
      name: name.trim() ? '' : 'Please enter your name.',
      email: isValidEmail(email) ? '' : 'Please enter a valid email.',
      password:
        password.length >= 12 ? '' : 'Password must be at least 12 characters.',
      confirmPassword:
        password === confirmPassword ? '' : 'Passwords do not match.',
    }

    setFieldErrors(nextErrors)

    if (!acceptedTerms) {
      setBannerError('Please accept the Terms of Service to continue.')
    } else {
      setBannerError('')
    }

    if (
      nextErrors.name ||
      nextErrors.email ||
      nextErrors.password ||
      nextErrors.confirmPassword ||
      !acceptedTerms
    ) {
      return
    }

    setLoading(true)
    await new Promise((resolve) => window.setTimeout(resolve, 900))
    navigate('/app/dashboard')
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start reviewing your performance with a calendar-first trading journal."
      footer={
        <>
          Already have an account? <Link to="/auth/sign-in">Sign in</Link>
        </>
      }
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        {bannerError ? <div className="auth-alert auth-alert-error">{bannerError}</div> : null}

        <label className="auth-field">
          <span>Full name</span>
          <input
            type="text"
            placeholder="Brian Lin"
            value={name}
            onChange={(event) => {
              setName(event.target.value)
              setFieldErrors((current) => ({ ...current, name: '' }))
            }}
            className={fieldErrors.name ? 'auth-input-error' : ''}
          />
          {fieldErrors.name ? <small className="auth-field-error">{fieldErrors.name}</small> : null}
        </label>
        <label className="auth-field">
          <span>Email</span>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value)
              setFieldErrors((current) => ({ ...current, email: '' }))
            }}
            className={fieldErrors.email ? 'auth-input-error' : ''}
          />
          {fieldErrors.email ? (
            <small className="auth-field-error">{fieldErrors.email}</small>
          ) : null}
        </label>
        <label className="auth-field">
          <span>Password</span>
          <input
            type="password"
            placeholder="Minimum 12 characters"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value)
              setFieldErrors((current) => ({ ...current, password: '' }))
            }}
            className={fieldErrors.password ? 'auth-input-error' : ''}
          />
          {password ? (
            <small className={`auth-strength auth-strength-${passwordStrength.toLowerCase()}`}>
              Password strength: {passwordStrength}
            </small>
          ) : null}
          {fieldErrors.password ? (
            <small className="auth-field-error">{fieldErrors.password}</small>
          ) : null}
        </label>
        <label className="auth-field">
          <span>Confirm password</span>
          <input
            type="password"
            placeholder="Re-enter password"
            value={confirmPassword}
            onChange={(event) => {
              setConfirmPassword(event.target.value)
              setFieldErrors((current) => ({ ...current, confirmPassword: '' }))
            }}
            className={fieldErrors.confirmPassword ? 'auth-input-error' : ''}
          />
          {fieldErrors.confirmPassword ? (
            <small className="auth-field-error">{fieldErrors.confirmPassword}</small>
          ) : null}
        </label>
        <label className="auth-checkbox auth-checkbox-block">
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={(event) => setAcceptedTerms(event.target.checked)}
          />
          <span>I agree to the terms, privacy policy, and product updates.</span>
        </label>
        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? 'Creating account...' : 'Create account'}
        </button>
      </form>
    </AuthLayout>
  )
}
