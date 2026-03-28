export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())
}

export function scorePassword(password: string) {
  let score = 0

  if (password.length >= 12) score += 1
  if (password.length >= 16) score += 1
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1
  if (/[0-9]/.test(password)) score += 1
  if (/[^A-Za-z0-9]/.test(password)) score += 1

  if (/^(.)\1+$/.test(password) || /^(123|abc|qwerty)/i.test(password)) {
    score = Math.max(0, score - 2)
  }

  return Math.min(4, score)
}

export function passwordStrengthLabel(score: number) {
  return ['', 'Weak', 'Fair', 'Good', 'Strong'][score] ?? ''
}
