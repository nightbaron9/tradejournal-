type AuthAlertProps = {
  tone: 'error' | 'info' | 'success'
  children: string
}

export function AuthAlert({ tone, children }: AuthAlertProps) {
  return <div className={`auth-alert auth-alert-${tone}`}>{children}</div>
}
