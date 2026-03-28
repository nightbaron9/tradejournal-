# Implementation Roadmap

## Purpose

This document translates the Calendar-Based Trading Journal PRD into an implementation-oriented backlog and sequencing plan. It is intended to help turn the restored HTML prototypes into a production application incrementally.

## Current Starting Point

The repository currently contains:

- `index.html` - authentication prototype
- `dashboard.html` - main application prototype
- `assets/css/*.css` - extracted prototype styles
- `assets/js/*.js` - extracted prototype logic
- `docs/product-requirements.md` - source-of-truth PRD

These assets are useful as a visual and interaction reference, but they are still static prototypes with mock data and browser-only logic.

## Implementation Priorities

### Priority 1: Establish application foundation

Goal: create a maintainable application shell that mirrors the prototype layout and navigation.

Deliverables:

- choose the production frontend stack
- define project structure
- create shared layout shell
- implement route structure for auth, dashboard, positions, and settings
- move prototype screens into reusable UI components

Suggested work items:

1. Create app scaffold and package manifest
2. Add shared styling tokens for color, spacing, typography, and states
3. Build sidebar, topbar, cards, tables, and form primitives
4. Replace inline click handlers with component state and event wiring
5. Preserve the current prototype look-and-feel while reducing duplication

### Priority 2: Authentication and protected app shell

Goal: turn the auth prototype into a real sign-in and account flow.

Deliverables:

- sign up
- sign in
- sign out
- session persistence
- route protection
- password reset flow

Suggested work items:

1. Define auth API contract
2. Implement user model and session handling
3. Build form validation and error handling from the prototype behavior
4. Add authenticated redirect rules
5. Add email verification handling if included in the first release

### Priority 3: Core data model and storage

Goal: define the system of record for trading data and journal content.

Deliverables:

- users table
- broker connections table
- trades table
- position snapshots table
- daily performance aggregates table
- notes and tags storage

Suggested work items:

1. Finalize timezone strategy for trade-date aggregation
2. Decide whether fees are included in MVP calculations
3. Model partial exits and short positions explicitly
4. Add deduplication keys for broker-imported trades
5. Define aggregate recomputation strategy for daily P/L

### Priority 4: Broker integration and sync jobs

Goal: import normalized broker data without exposing broker secrets client-side.

Deliverables:

- one broker integration
- secure token storage
- historical trade import
- periodic open-position sync
- sync status surfaces
- sync failure logging

Suggested work items:

1. Select the first broker based on auth complexity and endpoint quality
2. Build backend service for broker token exchange
3. Build initial historical import job
4. Build recurring position snapshot job
5. Add sync telemetry and retry handling

### Priority 5: Calendar and daily detail with real data

Goal: make the calendar the real primary experience for reviewing realized performance.

Deliverables:

- monthly calendar backed by stored aggregates
- daily profit/loss coloring
- trade count display
- monthly navigation
- daily detail drawer or page

Suggested work items:

1. Render month summary from daily aggregate records
2. Ensure day totals use realized P/L only
3. Add empty and error states for sparse or missing data
4. Attach daily notes and tags
5. Validate aggregation behavior around timezones and market close boundaries

### Priority 6: Dashboard metrics and open positions

Goal: provide trustworthy at-a-glance performance context.

Deliverables:

- total realized P/L
- total closed trades
- win rate
- average win
- average loss
- open positions panel
- last sync timestamp
- unrealized P/L separation

Suggested work items:

1. Create shared metrics computation layer
2. Define exact metric formulas in code and docs
3. Label broker-derived and delayed values clearly
4. Build positions table and states for sync failure
5. Add manual refresh trigger if desired

### Priority 7: Notes, tags, and journaling

Goal: support reflective review tied to trades and trading days.

Deliverables:

- day notes
- trade notes
- basic tags
- persistence model for journal metadata

Suggested work items:

1. Decide whether notes belong to day, trade, or both in MVP
2. Define initial setup tag taxonomy
3. Implement create/edit flows
4. Ensure notes persist independently of broker resyncs

### Priority 8: Analytics and post-MVP expansion

Goal: layer on deeper analysis after trusted data foundations are in place.

Potential deliverables:

- equity curve
- streak analysis
- setup analytics
- advanced filters
- CSV import
- multi-broker support
- options-specific analytics

## Recommended Initial Epics

### Epic 1: Prototype-to-app shell conversion

- Extract shared assets and reusable UI primitives
- Introduce page routing
- Preserve current visual design

### Epic 2: Auth and user management

- Account creation and sign-in
- Session management
- Protected routes

### Epic 3: Trading data foundation

- Database schema
- Trade normalization
- Daily aggregate generation

### Epic 4: Broker connectivity

- Connection setup
- Historical trade import
- Position sync

### Epic 5: Calendar journal experience

- Calendar rendering from live data
- Daily detail panel
- Notes and tags

### Epic 6: Metrics and positions dashboard

- Summary metric computation
- Open-position views
- Sync status display

## Key Decisions To Finalize Early

1. First broker to support
2. Frontend framework and backend stack
3. Authentication provider approach
4. Fee handling in P/L calculations
5. Timezone used for aggregation and display
6. Trade normalization strategy for partial exits
7. Whether manual trade edits are allowed in MVP

## Suggested Definition of Done for MVP

The MVP should be considered complete when a user can:

1. create an account and sign in securely
2. connect one broker account
3. import or sync historical closed trades
4. see daily realized P/L on the calendar
5. inspect a selected day and its trades
6. view open positions with slightly delayed unrealized P/L
7. understand the meaning of displayed metrics without ambiguity

## Immediate Next Build Task Recommendation

The highest-leverage next coding task is:

**Convert the static HTML prototypes into a structured frontend application with shared components, routes, and preserved visual parity.**

That step reduces future rework and makes the auth, calendar, metrics, and broker-connected features significantly easier to implement.
