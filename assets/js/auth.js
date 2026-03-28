// ─────────────────────────────────────────────────────────────────────────────
// SECURITY NOTE — FOR BACKEND ENGINEERS
// ─────────────────────────────────────────────────────────────────────────────
// This file is the UI layer only. Zero secrets, tokens, or auth logic live here.
// ALL of the following MUST be implemented server-side:
//
//   Passwords:
//   - Hash with argon2id (preferred) or bcrypt (cost >= 12). Never store plaintext.
//   - Never log or expose passwords in API responses.
//
//   Sessions:
//   - Issue a signed JWT (RS256) or opaque session token from the server.
//   - Set as httpOnly, Secure, SameSite=Strict cookie — NEVER in localStorage.
//   - "Remember me" = 30-day expiry; default = 24-hour expiry.
//   - On logout: invalidate server-side (token blocklist or session DB delete).
//
//   Rate limiting (server middleware, e.g. express-rate-limit):
//   - Sign-in: 5 attempts per 15 min per IP+email combo → 429 + lockout.
//   - Password reset: 3 requests per hour per email.
//   - Signup: 10 per hour per IP.
//
//   Email verification:
//   - Generate cryptographically random 32-byte token (crypto.randomBytes).
//   - Store hashed token + expiry (24h) in DB. Send raw token in email link.
//   - On verify: hash incoming token, compare to DB, check expiry, mark verified.
//   - Do NOT allow login until email is verified.
//
//   Password reset:
//   - Same token pattern as email verification but expiry = 15 minutes.
//   - Invalidate token after first use.
//   - Invalidate ALL existing sessions on password change.
//
//   Secrets (environment variables only — never in frontend):
//   - JWT_SECRET / RSA private key
//   - EMAIL_API_KEY (SendGrid, Postmark, etc.)
//   - DATABASE_URL
//   - SESSION_SECRET
//
//   Additional hardening:
//   - CSRF protection (double-submit cookie or synchronizer token).
//   - HTTPS everywhere — redirect HTTP → HTTPS.
//   - Helmet.js (or equivalent) for security headers.
//   - Content-Security-Policy header.
//   - Log auth events (login, logout, failed attempt, reset) with IP + timestamp.
//   - Never reveal whether an email exists (generic "if that email is registered..." message).
// ─────────────────────────────────────────────────────────────────────────────

// ── TAB SWITCHING ─────────────────────────────────────────────────────────────
const PANELS = ['signin','signup','verify','reset','newpw'];

function switchTab(tab) {
  PANELS.forEach(p => {
    document.getElementById('panel-'+p)?.classList.remove('active');
  });
  document.getElementById('panel-'+tab)?.classList.add('active');

  // Show/hide the top tab switcher only for signin/signup
  const tabs = document.getElementById('auth-tabs');
  tabs.style.display = (tab === 'signin' || tab === 'signup') ? 'flex' : 'none';

  // Update active tab highlight
  document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
  if (tab === 'signin') document.querySelectorAll('.auth-tab')[0].classList.add('active');
  if (tab === 'signup') document.querySelectorAll('.auth-tab')[1].classList.add('active');
}

// ── PASSWORD VISIBILITY TOGGLE ────────────────────────────────────────────────
function togglePw(inputId, iconEl) {
  const input = document.getElementById(inputId);
  const isHidden = input.type === 'password';
  input.type = isHidden ? 'text' : 'password';
  iconEl.innerHTML = isHidden
    ? `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 2l12 12" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><path d="M6.5 6.6A2 2 0 019.4 9.5M4.2 4.3C2.8 5.3 1.8 6.7 1 8c1.5 3 4.2 5 7 5 1.3 0 2.5-.4 3.6-1M7 3.1C7.3 3 7.7 3 8 3c2.8 0 5.5 2 7 5-.5 1-1.2 2-2 2.7" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>`
    : `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="currentColor" stroke-width="1.3"/><circle cx="8" cy="8" r="2" stroke="currentColor" stroke-width="1.3"/></svg>`;
}

// ── PASSWORD STRENGTH ─────────────────────────────────────────────────────────
function scorePassword(pw) {
  let score = 0;
  if (pw.length >= 12) score++;
  if (pw.length >= 16) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  // Common patterns penalty
  if (/^(.)+$/.test(pw) || /^(123|abc|qwerty)/i.test(pw)) score = Math.max(0, score - 2);
  return Math.min(4, score);
}

function renderStrength(score, barPrefix, labelId, strengthId) {
  const el = document.getElementById(strengthId);
  if (!el) return;
  el.style.display = 'block';
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const classes = ['', 'weak', 'fair', 'strong', 'strong'];
  document.getElementById(labelId).textContent = labels[score] || '';
  document.getElementById(labelId).style.color = score <= 1 ? 'var(--red)' : score === 2 ? '#f59e0b' : 'var(--green)';
  for (let i = 1; i <= 4; i++) {
    const bar = document.getElementById(barPrefix + i);
    bar.className = 'pw-bar' + (i <= score ? ' ' + classes[score] : '');
  }
}

// ── RATE LIMITING (UI layer — real enforcement is server-side) ────────────────
const rateLimitState = { attempts: 0, lockedUntil: null };
const MAX_ATTEMPTS = 5;
const LOCKOUT_SECONDS = 30;
let rateLimitTimer = null;

function checkRateLimit() {
  if (rateLimitState.lockedUntil && Date.now() < rateLimitState.lockedUntil) {
    const remaining = Math.ceil((rateLimitState.lockedUntil - Date.now()) / 1000);
    showRateLimit(remaining);
    return false;
  }
  return true;
}

function recordFailedAttempt() {
  rateLimitState.attempts++;
  if (rateLimitState.attempts >= MAX_ATTEMPTS) {
    rateLimitState.lockedUntil = Date.now() + LOCKOUT_SECONDS * 1000;
    rateLimitState.attempts = 0;
    showRateLimit(LOCKOUT_SECONDS);
  }
}

function showRateLimit(seconds) {
  const msg = document.getElementById('rate-limit-msg');
  const btn = document.getElementById('signin-btn');
  msg.classList.add('visible');
  btn.disabled = true;
  document.getElementById('signin-error')?.classList.remove('visible');

  let remaining = seconds;
  document.getElementById('rate-limit-countdown').textContent = remaining;

  clearInterval(rateLimitTimer);
  rateLimitTimer = setInterval(() => {
    remaining--;
    const el = document.getElementById('rate-limit-countdown');
    if (el) el.textContent = remaining;
    if (remaining <= 0) {
      clearInterval(rateLimitTimer);
      msg.classList.remove('visible');
      btn.disabled = false;
      rateLimitState.lockedUntil = null;
    }
  }, 1000);
}

// ── VALIDATION HELPERS ────────────────────────────────────────────────────────
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

function setFieldError(inputId, errId, show) {
  const input = document.getElementById(inputId);
  const err = document.getElementById(errId);
  if (!input || !err) return;
  input.classList.toggle('error', show);
  err.classList.toggle('visible', show);
}

function clearSigninError() {
  document.getElementById('signin-error')?.classList.remove('visible');
  ['signin-email','signin-password'].forEach(id => {
    document.getElementById(id)?.classList.remove('error');
  });
}

// ── SIGN IN VALIDATION + SUBMIT ───────────────────────────────────────────────
function submitSignin() {
  if (!checkRateLimit()) return;

  const email = document.getElementById('signin-email').value.trim();
  const password = document.getElementById('signin-password').value;

  let valid = true;
  if (!isValidEmail(email)) { setFieldError('signin-email', 'signin-email-err', true); valid = false; }
  if (password.length < 1)  { setFieldError('signin-password', null, true); valid = false; }
  if (!valid) return;

  const btn = document.getElementById('signin-btn');
  btn.classList.add('loading');
  btn.textContent = '';
  btn.disabled = true;

  // Simulate API call — replace with real fetch('/api/auth/signin', {...})
  setTimeout(() => {
    btn.classList.remove('loading');
    btn.textContent = 'Sign in';
    btn.disabled = false;

    // Demo: treat "demo@tradelog.io" / "Demo1234!pass" as valid
    if (email === 'demo@tradelog.io' && password === 'Demo1234!pass') {
      // In production: server sets httpOnly session cookie, redirects to app
      window.location.replace('https://nightbaron9.github.io/tradejournal-/dashboard.html');
    } else {
      recordFailedAttempt();
      if (checkRateLimit()) {
        // Security: same message for wrong email OR wrong password (no enumeration)
        const errEl = document.getElementById('signin-error');
        document.getElementById('signin-error-msg').textContent = 'Invalid email or password.';
        errEl.classList.add('visible');
        document.getElementById('signin-email').classList.add('error');
        document.getElementById('signin-password').classList.add('error');
        document.getElementById('signin-password').value = ''; // clear pw field on failure
        document.getElementById('signin-password').focus();
      }
    }
  }, 900);
}

// ── SIGN UP VALIDATION ────────────────────────────────────────────────────────
function validateSignupName() {
  const v = document.getElementById('signup-name').value.trim();
  setFieldError('signup-name', 'signup-name-err', v.length < 1);
}
function validateSignupEmail() {
  const v = document.getElementById('signup-email').value.trim();
  setFieldError('signup-email', 'signup-email-err', !isValidEmail(v));
}
function validateSignupPassword() {
  const pw = document.getElementById('signup-password').value;
  const score = scorePassword(pw);
  renderStrength(score, 'pw-bar-', 'pw-strength-label', 'pw-strength');
  setFieldError('signup-password', 'signup-password-err', pw.length > 0 && pw.length < 12);
}
function validateSignupConfirm() {
  const pw = document.getElementById('signup-password').value;
  const cf = document.getElementById('signup-confirm').value;
  setFieldError('signup-confirm', 'signup-confirm-err', cf.length > 0 && cf !== pw);
}

function submitSignup() {
  const name    = document.getElementById('signup-name').value.trim();
  const email   = document.getElementById('signup-email').value.trim();
  const pw      = document.getElementById('signup-password').value;
  const confirm = document.getElementById('signup-confirm').value;
  const terms   = document.getElementById('signup-terms').checked;

  let valid = true;
  if (!name)            { setFieldError('signup-name',     'signup-name-err',     true); valid = false; }
  if (!isValidEmail(email)) { setFieldError('signup-email', 'signup-email-err', true); valid = false; }
  if (pw.length < 12)   { setFieldError('signup-password', 'signup-password-err', true); valid = false; }
  if (pw !== confirm)   { setFieldError('signup-confirm',  'signup-confirm-err',  true); valid = false; }
  if (!terms) {
    document.getElementById('signup-error-msg').textContent = 'Please accept the Terms of Service to continue.';
    document.getElementById('signup-error').classList.add('visible');
    valid = false;
  }
  if (!valid) return;

  const btn = document.getElementById('signup-btn');
  btn.classList.add('loading'); btn.textContent = ''; btn.disabled = true;

  // Simulate API — replace with fetch('/api/auth/signup', {...})
  setTimeout(() => {
    btn.classList.remove('loading'); btn.textContent = 'Create account'; btn.disabled = false;
    // Server creates account, sends verification email, returns 201
    document.getElementById('verify-email-display').textContent = email;
    switchTab('verify');
  }, 1000);
}

// ── EMAIL VERIFICATION ────────────────────────────────────────────────────────
let resendCooldown = false;
function resendVerification() {
  if (resendCooldown) return;
  resendCooldown = true;
  const btn = document.getElementById('resend-btn');
  btn.textContent = 'Email sent!';
  btn.style.color = 'var(--green)';
  btn.style.borderColor = 'var(--green)';
  // In production: POST /api/auth/resend-verification
  setTimeout(() => {
    resendCooldown = false;
    btn.textContent = 'Resend verification email';
    btn.style.color = '';
    btn.style.borderColor = '';
  }, 60000); // 60s cooldown to prevent spam
}

// ── PASSWORD RESET ────────────────────────────────────────────────────────────
function submitReset() {
  const email = document.getElementById('reset-email').value.trim();
  if (!isValidEmail(email)) {
    setFieldError('reset-email', null, true);
    document.getElementById('reset-email').classList.add('error');
    return;
  }

  const btn = document.getElementById('reset-btn');
  btn.classList.add('loading'); btn.textContent = ''; btn.disabled = true;

  // Simulate API — replace with fetch('/api/auth/reset-password', {...})
  setTimeout(() => {
    btn.classList.remove('loading'); btn.textContent = 'Send reset link'; btn.disabled = false;
    // Security: show success regardless of whether email exists (prevents enumeration)
    document.getElementById('reset-success').classList.add('visible');
    document.getElementById('reset-email').disabled = true;
    btn.disabled = true;
  }, 800);
}

// ── NEW PASSWORD (after reset link) ──────────────────────────────────────────
function validateNewPw() {
  const pw = document.getElementById('newpw-password').value;
  renderStrength(scorePassword(pw), 'npw-bar-', 'newpw-strength-label', 'newpw-strength');
  setFieldError('newpw-password', 'newpw-password-err', pw.length > 0 && pw.length < 12);
}
function validateNewPwConfirm() {
  const pw = document.getElementById('newpw-password').value;
  const cf = document.getElementById('newpw-confirm').value;
  setFieldError('newpw-confirm', 'newpw-confirm-err', cf.length > 0 && cf !== pw);
}
function submitNewPassword() {
  const pw = document.getElementById('newpw-password').value;
  const cf = document.getElementById('newpw-confirm').value;
  if (pw.length < 12) { setFieldError('newpw-password', 'newpw-password-err', true); return; }
  if (pw !== cf)      { setFieldError('newpw-confirm',  'newpw-confirm-err',  true); return; }

  const btn = document.getElementById('newpw-btn');
  btn.classList.add('loading'); btn.textContent = ''; btn.disabled = true;

  // Replace with: fetch('/api/auth/reset-password/confirm', { token: urlToken, password: pw })
  // Server: validate token not expired, hash pw with argon2id, invalidate ALL sessions, redirect
  setTimeout(() => {
    btn.classList.remove('loading'); btn.textContent = 'Set new password'; btn.disabled = false;
      window.location.replace('https://nightbaron9.github.io/tradejournal-/dashboard.html');
  }, 900);
}

// ── LAUNCH APP ───────────────────────────────────────────────────────────────
function launchApp() {
  // In production this would be handled by the server setting a session cookie
  // and redirecting. In this demo we show a success screen and link to the dashboard.
  document.querySelector('.auth-card').innerHTML = `
    <div style="text-align:center;padding:12px 0 8px">
      <div style="width:52px;height:52px;border-radius:50%;background:var(--green-bg);
                  display:flex;align-items:center;justify-content:center;margin:0 auto 16px;border:1px solid #bbf7d0">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M5 12l5 5L19 7" stroke="#16a34a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <div style="font-family:'Inter Tight',sans-serif;font-size:20px;font-weight:700;
                  letter-spacing:-0.03em;margin-bottom:6px">Signed in!</div>
      <div style="font-size:13px;color:var(--text3);margin-bottom:24px">
        Welcome back, Brian. Your session is active.
      </div>
      <a href="https://nightbaron9.github.io/tradejournal-/dashboard.html" target="_self"
         style="display:inline-flex;align-items:center;gap:8px;font-family:inherit;
                font-size:14px;font-weight:600;color:#fff;background:var(--blue);
                border-radius:8px;padding:11px 28px;text-decoration:none;
                transition:background .15s"
         onmouseover="this.style.background='#1d4ed8'"
         onmouseout="this.style.background='var(--blue)'">
        Open TradeLog
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </a>
      <div style="margin-top:16px;font-size:11px;color:var(--text3)">
        Or open the dashboard file directly in your browser.
      </div>
    </div>
  `;
}

// ── INIT ──────────────────────────────────────────────────────────────────────
// In production: check URL for ?mode=reset&token=... or ?mode=verify&token=...
// and switch to the appropriate panel after validating the token server-side.
const urlParams = new URLSearchParams(window.location.search);
const mode = urlParams.get('mode');
if (mode === 'reset') switchTab('newpw');
if (mode === 'verify') {
  // In production: server validates token, marks email verified, redirects to app
  switchTab('verify');
}
