import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthLayout } from '../components/AuthLayout'

export function SignInPage() {
  const navigate = useNavigate()

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    navigate('/app/dashboard')
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
          <input type="email" placeholder="you@example.com" defaultValue="brian@tradelog.io" />
        </label>
        <label className="auth-field">
          <span>Password</span>
          <input type="password" placeholder="••••••••" defaultValue="hunter2hunter2" />
        </label>
        <div className="auth-row">
          <label className="auth-checkbox">
            <input type="checkbox" defaultChecked />
            <span>Keep me signed in for 30 days</span>
          </label>
          <Link to="/auth/reset-password">Forgot password?</Link>
        </div>
        <button className="auth-button" type="submit">
          Sign in
        </button>
      </form>
    </AuthLayout>
  )
}
