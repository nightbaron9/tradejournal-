import { Link } from 'react-router-dom'
import { AuthLayout } from '../components/AuthLayout'

export function ResetPasswordPage() {
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
      <div className="auth-alert auth-alert-info">
        Password reset is currently mocked while the backend auth flow is being built.
      </div>

      <form className="auth-form">
        <label className="auth-field">
          <span>Email address</span>
          <input type="email" placeholder="you@example.com" />
        </label>

        <button className="auth-button" type="button">
          Send reset link
        </button>
      </form>
    </AuthLayout>
  )
}
