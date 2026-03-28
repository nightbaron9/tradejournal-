import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthLayout } from '../components/AuthLayout'

export function SignUpPage() {
  const navigate = useNavigate()

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
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
        <label className="auth-field">
          <span>Full name</span>
          <input type="text" placeholder="Brian Lin" />
        </label>
        <label className="auth-field">
          <span>Email</span>
          <input type="email" placeholder="you@example.com" />
        </label>
        <label className="auth-field">
          <span>Password</span>
          <input type="password" placeholder="Minimum 12 characters" />
        </label>
        <label className="auth-field">
          <span>Confirm password</span>
          <input type="password" placeholder="Re-enter password" />
        </label>
        <label className="auth-checkbox auth-checkbox-block">
          <input type="checkbox" defaultChecked />
          <span>I agree to the terms, privacy policy, and product updates.</span>
        </label>
        <button type="submit" className="auth-button">
          Create account
        </button>
      </form>
    </AuthLayout>
  )
}
