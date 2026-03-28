# TradeLog Product Requirements Document

## 1. Overview

TradeLog is a web application for active traders who want to authenticate securely, review trading performance, analyze closed and open positions, and keep a daily trading journal in one place.

This repository currently includes two clickable HTML prototypes:

- `index.html` - authentication flows
- `dashboard.html` - authenticated application experience

These prototypes should be treated as the initial UI reference for the product's information architecture, interactions, and visual direction.

## 2. Product Problem

Retail and professional traders often manage performance review, trade journaling, and broker context across multiple tools. That creates friction for:

- reviewing daily and monthly performance,
- identifying repeatable setups,
- understanding open risk,
- documenting trading lessons while context is fresh.

TradeLog aims to consolidate those workflows into a single product with a lightweight, fast, dashboard-first experience.

## 3. Target Users

### Primary user

- Self-directed trader who wants to track P&L, setups, habits, and lessons learned.

### Secondary users

- Swing traders monitoring both realized and unrealized P&L
- Day traders reviewing daily execution patterns
- Performance-focused traders who want analytics without a spreadsheet workflow

## 4. Product Goals

1. Allow users to create and access an account with modern authentication UX.
2. Give users a fast at-a-glance view of current trading performance.
3. Make it easy to inspect historical trading activity by day, trade, symbol, and setup.
4. Support reflective journaling tied to calendar days and trade outcomes.
5. Provide actionable analytics that help users improve process and risk management.

## 5. Non-Goals for MVP

- Live brokerage order entry
- Automated strategy execution
- Social features or public sharing
- Tax reporting workflows
- Multi-user teams or advisor dashboards
- Native mobile applications

## 6. MVP Scope

### In scope

- Authentication screens and flows
- Dashboard summary widgets
- Monthly performance calendar
- Trade log with filtering and sorting
- Open positions view
- Analytics dashboard
- Notes and journal experience
- User settings

### Out of scope for initial implementation

- Real backend integration
- Real broker sync
- File storage pipelines
- Notification delivery infrastructure beyond stubbed UX
- Role-based access control

## 7. Information Architecture

The authenticated app should include the following primary navigation:

1. Dashboard
2. Trade Log
3. Open Positions
4. Analytics
5. Notes & Journal
6. Settings

The app should support a collapsible sidebar and a persistent top bar with the current screen title and reporting period controls.

## 8. Authentication Requirements

The `index.html` prototype defines five auth panels:

1. Sign in
2. Create account
3. Email verification
4. Password reset request
5. Set new password

### 8.1 Sign in

Users must be able to:

- enter email and password,
- toggle password visibility,
- optionally select "keep me signed in for 30 days",
- navigate to account creation,
- navigate to forgot password,
- submit with keyboard enter support.

Validation and UX requirements:

- invalid email should show inline field error,
- failed authentication should show a top-level error banner,
- repeated failures should trigger a temporary lockout message with countdown,
- sign-in button should support loading state.

### 8.2 Create account

Users must be able to:

- enter full name,
- enter email,
- create password,
- confirm password,
- accept terms and privacy policy,
- submit account creation.

Validation requirements:

- name is required,
- email must be valid,
- password must be at least 12 characters,
- password strength indicator should update as user types,
- confirm password must match,
- terms acceptance is required.

### 8.3 Email verification

After successful sign-up, the app should:

- show a verification confirmation screen,
- display the email address being verified,
- allow resend verification with cooldown protection,
- offer navigation back to sign in.

### 8.4 Password reset request

Users must be able to:

- submit their email address to request a reset link,
- see a success state confirming the email was sent,
- return to sign in.

### 8.5 Set new password

Users must be able to:

- enter a new password,
- confirm it,
- view password strength,
- complete password reset,
- see an expired-link style error when relevant.

On successful completion, the flow should transition into the authenticated experience.

## 9. Application Requirements

## 9.1 Dashboard

The dashboard is the default authenticated landing screen.

Required capabilities:

- summary widgets showing key trading metrics,
- configurable widget slots from grouped metric choices,
- monthly trading calendar with daily P&L states,
- weekly summary column,
- header summary for month-level P&L and active trading days,
- selectable trading day drawer with:
  - date,
  - day P&L,
  - win/loss stats,
  - list of trades,
  - freeform notes.

Expected behavior:

- users can switch reporting period between MTD, YTD, and all time,
- widget selections recalculate with current period,
- clicking a day opens contextual drill-down.

## 9.2 Trade Log

The trade log should present a table of closed trades and support:

- symbol search,
- filtering by side,
- filtering by result,
- filtering by setup,
- sortable columns,
- summary stats strip above the table,
- visible trade count.

Each row should expose at minimum:

- symbol,
- date,
- side,
- entry price,
- exit price,
- quantity,
- P&L,
- setup/tag context.

## 9.3 Open Positions

The open positions screen should include:

- summary cards for unrealized performance and exposure,
- a sortable positions table,
- position allocation visualization,
- long vs short exposure breakdown,
- notes or commentary area for active positions,
- manual refresh/sync action.

The UI should distinguish realized portfolio review from current open-risk monitoring.

## 9.4 Analytics

The analytics screen should support:

- summary metrics for the selected range,
- filter drawer for side, result, symbol, and session,
- equity curve,
- daily P&L,
- rolling win rate,
- P&L distribution,
- win vs loss size comparison,
- streak analysis,
- risk cards,
- weekday/hour/session breakdowns,
- symbol performance chart,
- long vs short comparison.

Requirements:

- analytics should recompute from current filters,
- filter badge should indicate active filters,
- reset action should clear analytics filters.

## 9.5 Notes & Journal

The journal experience should combine calendar context with reflective writing.

Required capabilities:

- mini calendar navigation,
- date selection,
- journal entry list for the current month,
- search across notes,
- filter by tag,
- filter by mood,
- expandable entry detail,
- lesson tracking,
- mood selection,
- tag management,
- quick creation of new entries.

Journal data should stay connected to trading dates so users can correlate execution quality and emotional state with outcomes.

## 9.6 Settings

The settings area should cover:

- broker connection status and sync preferences,
- profile details,
- timezone, currency, and date format preferences,
- trading preferences,
- notification and reminder toggles,
- account management actions.

Destructive actions should require confirmation in a production implementation.

## 10. Data Model Requirements

The product should support, at minimum, these entities:

### User

- id
- name
- email
- password hash
- timezone
- currency
- date format
- preferences

### Broker connection

- id
- user id
- broker name
- connection status
- last synced at
- sync frequency

### Trade

- id
- user id
- broker connection id
- symbol
- side
- quantity
- entry price
- exit price
- opened at
- closed at
- realized P&L
- setup tag
- session
- notes

### Position

- id
- user id
- symbol
- side
- quantity
- average entry
- last price
- market value
- unrealized P&L
- updated at

### Journal entry

- id
- user id
- trade date
- note
- lessons learned
- mood
- confidence
- tags

### Daily performance snapshot

- id
- user id
- date
- realized P&L
- trade count
- win count
- loss count

## 11. Functional Requirements

### Required system behavior

- The app must support a responsive layout for desktop and smaller screens.
- The sidebar must collapse and expand.
- Screen navigation must update the topbar title.
- Period selection must refresh dashboard and analytics views.
- Journal notes entered from calendar/day context should stay synchronized with journal entries.
- Settings changes should support autosave-style interactions in the UI.

### Validation and state handling

- Forms must provide inline validation.
- Loading, success, and error states must be visible in the UI.
- Empty states should be shown where data is absent.
- Destructive settings actions must be guarded by confirmation.

## 12. Visual and UX Principles

The prototype suggests the following visual direction:

- clean, desktop-first SaaS layout,
- light theme with subtle card shadows,
- compact information density,
- blue as primary action color,
- green/red semantic use for profit and loss,
- restrained typography with Inter and Inter Tight,
- drill-down interactions instead of full page transitions where possible.

## 13. Technical Notes for Implementation

The current HTML files are static prototypes with inline CSS and JavaScript. A production implementation should likely:

- separate presentation, state, and data layers,
- move repeated UI patterns into reusable components,
- replace inline event handlers with application logic,
- connect prototype demo data to real persisted backend data,
- define API contracts for auth, trades, positions, analytics, journal, and settings.

## 14. Suggested MVP Build Order

1. Convert static auth screens into real authenticated flows.
2. Establish core app shell with sidebar, topbar, and screen routing.
3. Implement trade and daily performance data model.
4. Build dashboard metrics and calendar.
5. Implement trade log filters and table.
6. Add journal entry persistence and calendar-note syncing.
7. Add open positions and analytics views.
8. Finish settings and broker sync workflows.

## 15. Success Metrics

- account creation completion rate,
- sign-in success rate,
- weekly active traders,
- journal entry completion rate,
- percentage of users reviewing analytics weekly,
- number of tagged trades per active user,
- retention of users after first broker sync.

## 16. Open Questions

1. Which broker integrations should be supported first?
2. Should users manually import trades before live broker sync exists?
3. Which analytics are required for MVP versus later releases?
4. What is the canonical taxonomy for setups, tags, and sessions?
5. Should journal notes attach to individual trades, days, or both?
6. What retention and deletion policies are required for trading data?
7. Is the initial release desktop-only, or should mobile usability be a formal requirement?

## 17. Deliverables in This Branch

- Restored initial clickable UI prototypes in `index.html` and `dashboard.html`
- Product requirements document in `docs/product-requirements.md`

