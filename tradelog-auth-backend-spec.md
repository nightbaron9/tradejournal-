# TradeLog — Authentication Security Specification

> **For backend engineers.** This document defines all auth requirements.  
> The frontend UI (`tradelog-auth.html`) contains zero secrets, tokens, or auth logic.

---

## 1. Password storage

| Requirement | Implementation |
|---|---|
| Algorithm | **argon2id** (preferred) or bcrypt with cost ≥ 12 |
| Never store | Plaintext, MD5, SHA-1/256 alone |
| Never log | Passwords, raw tokens, or session IDs |
| Never return | Password hash in any API response |

```js
// Node.js — argon2id
const argon2 = require('argon2');
const hash = await argon2.hash(password, { type: argon2.argon2id });
const valid = await argon2.verify(hash, password);
```

---

## 2. Session management

| Property | Value |
|---|---|
| Token type | Signed JWT (RS256) or opaque session ID |
| Storage | **httpOnly, Secure, SameSite=Strict cookie only** — never localStorage |
| Default expiry | 24 hours |
| "Remember me" expiry | 30 days |
| Invalidation | Token blocklist in Redis or DB session table delete |
| On password change | Invalidate ALL existing sessions immediately |
| On logout | Delete server-side session + clear cookie |

```js
// Express — set session cookie
res.cookie('session', token, {
  httpOnly: true,
  secure: true,           // HTTPS only
  sameSite: 'strict',
  maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000
});
```

---

## 3. Rate limiting

All limits enforced server-side via middleware (e.g. `express-rate-limit` + Redis store).

| Endpoint | Limit | Window | Response |
|---|---|---|---|
| `POST /auth/signin` | 5 attempts | 15 min per IP+email | 429 + `retry-after` header |
| `POST /auth/signup` | 10 requests | 1 hour per IP | 429 |
| `POST /auth/reset-password` | 3 requests | 1 hour per email | 429 |
| `POST /auth/resend-verification` | 2 requests | 1 hour per email | 429 |

```js
const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');

app.use('/auth/signin', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  store: new RedisStore({ client: redis }),
  keyGenerator: (req) => `${req.ip}:${req.body.email?.toLowerCase()}`,
  handler: (req, res) => res.status(429).json({ error: 'Too many attempts', retryAfter: 900 })
}));
```

---

## 4. Email verification

```
Flow:
  Signup → server generates 32-byte random token
         → stores SHA-256(token) + expiry (24h) in DB
         → sends raw token in email link: /auth/verify?token=<raw>
         → user clicks link → server hashes token, finds in DB, checks expiry
         → marks email_verified = true, deletes token, issues session
```

```js
const crypto = require('crypto');
const rawToken = crypto.randomBytes(32).toString('hex');    // send in email
const storedToken = crypto.createHash('sha256').update(rawToken).digest('hex'); // store in DB
```

**Rules:**
- Block login if `email_verified = false`
- Token is single-use — delete immediately on verification
- Resend cooldown: 60 seconds client-side, 2/hour server-side

---

## 5. Password reset tokens

Same pattern as email verification with stricter expiry:

| Property | Value |
|---|---|
| Token entropy | `crypto.randomBytes(32)` |
| Storage | SHA-256 hash in DB |
| Expiry | **15 minutes** |
| Single use | Delete token on first use |
| On success | Invalidate all active sessions, force re-login |
| Email enumeration | Always return 200 regardless of whether email exists |

```js
// Endpoint: POST /auth/reset-password
// Always respond with 200 — never reveal if email exists:
res.json({ message: "If that email is registered, a reset link has been sent." });
```

---

## 6. Secrets management

**Never in source code. Never in frontend. Always in environment variables.**

```bash
# .env (never commit — add to .gitignore)
JWT_SECRET=<256-bit random string>
# OR for RS256:
JWT_PRIVATE_KEY=<RSA private key PEM>
JWT_PUBLIC_KEY=<RSA public key PEM>

DATABASE_URL=postgres://...
REDIS_URL=redis://...
EMAIL_API_KEY=<SendGrid/Postmark key>
SESSION_SECRET=<random 64-byte hex>
```

Use a secrets manager in production (AWS Secrets Manager, Vault, Doppler).

---

## 7. Additional hardening

### HTTP headers (use `helmet` in Express)
```js
const helmet = require('helmet');
app.use(helmet());
// Sets: X-Content-Type-Options, X-Frame-Options, HSTS, Referrer-Policy, etc.
app.use(helmet.contentSecurityPolicy({
  directives: { defaultSrc: ["'self'"], scriptSrc: ["'self'"] }
}));
```

### CSRF protection
```js
// Double-submit cookie or synchronizer token
const csrf = require('csurf');
app.use(csrf({ cookie: { httpOnly: true, secure: true } }));
```

### Force HTTPS
```js
app.use((req, res, next) => {
  if (!req.secure) return res.redirect(301, 'https://' + req.headers.host + req.url);
  next();
});
```

### Auth event logging
Log all of these with IP, user agent, and timestamp:

| Event | Log level |
|---|---|
| Successful login | INFO |
| Failed login attempt | WARN |
| Account locked (rate limit) | WARN |
| Password changed | INFO |
| Password reset requested | INFO |
| Email verification sent/confirmed | INFO |
| Session invalidated | INFO |

---

## 8. API contract (frontend ↔ backend)

| Method | Endpoint | Body | Success | Error |
|---|---|---|---|---|
| POST | `/auth/signin` | `{email, password, rememberMe}` | 200 + set cookie | 401 / 429 |
| POST | `/auth/signup` | `{name, email, password}` | 201 | 409 (exists) / 429 |
| POST | `/auth/signout` | — | 200 + clear cookie | — |
| GET | `/auth/verify` | `?token=` | 302 → app | 400 (expired) |
| POST | `/auth/resend-verification` | `{email}` | 200 | 429 |
| POST | `/auth/reset-password` | `{email}` | 200 (always) | 429 |
| POST | `/auth/reset-password/confirm` | `{token, password}` | 200 + set cookie | 400 (expired) |
| GET | `/auth/me` | — | 200 + user object | 401 |

**General rules:**
- All endpoints: HTTPS only
- All POST endpoints: require `Content-Type: application/json`
- All responses: never include password hash or token in body
- Error messages: generic ("Invalid credentials") — never "wrong password" vs "email not found"
