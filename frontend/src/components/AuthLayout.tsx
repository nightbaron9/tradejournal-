import type { PropsWithChildren, ReactNode } from 'react'

type AuthLayoutProps = PropsWithChildren<{
  title: string
  subtitle: string
  footer?: ReactNode
}>

export function AuthLayout({
  title,
  subtitle,
  footer,
  children,
}: AuthLayoutProps) {
  return (
    <div className="auth-page">
      <div className="auth-card-react">
        <div className="brand-row">
          <div className="brand-mark">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M2 11L6 7L9 9.5L13.5 4"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="brand-text">TradeLog</span>
        </div>

        <h1 className="auth-title">{title}</h1>
        <p className="auth-subtitle">{subtitle}</p>

        <div className="auth-form-stack">{children}</div>

        {footer ? <div className="auth-footer-react">{footer}</div> : null}
      </div>
    </div>
  )
}
