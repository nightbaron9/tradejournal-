# Product Requirements Document (PRD)

## Product Name

Calendar-Based Trading Journal

## Document Status

Draft v1.0

## Owner

Brian Lin

## Purpose

This document defines the purpose, scope, features, functionality, and expected behavior of a calendar-based trading journal application that helps traders monitor and evaluate trading performance. It is intended to guide engineering, design, and stakeholder alignment during product development.

---

## 1. Product Overview

### 1.1 Product Summary

The Calendar-Based Trading Journal is a web application that allows traders to track and review their performance through a calendar-first interface. The app will show realized profit and loss (P/L) on a daily calendar, display open positions with slightly delayed unrealized P/L from a connected broker, and provide key trading performance metrics such as win rate, average win, average loss, and total realized P/L.

The product is intended to support trader self-review, performance analysis, and pattern recognition. It is not intended to execute trades, provide financial advice, or function as a brokerage platform.

### 1.2 Vision

Give traders a clean, intuitive way to understand how they are performing over time by combining broker-connected data, historical trade review, and calendar-based performance visualization.

### 1.3 Problem Statement

Many traders struggle to consistently review performance in a structured way. Brokerage platforms may show positions and account balances, but often do not provide a focused, journaling-oriented experience that helps traders understand:

* How they perform day by day
* Which days were profitable or unprofitable
* Their win rate and net results over time
* Their open positions and unrealized P/L
* The relationship between daily behavior and trading outcomes

Existing tools are often either too basic, too expensive, too cluttered, or not designed around a visual review workflow.

### 1.4 Product Goals

* Provide a calendar-first user experience for daily performance review
* Allow users to connect a broker account and import/sync position and trade data
* Surface core metrics that help traders evaluate performance
* Distinguish clearly between realized and unrealized P/L
* Create a simple, trustworthy interface that users can check daily
* Support a phased MVP that can be expanded later

### 1.5 Non-Goals

The MVP will not:

* Execute trades
* Provide tax reporting
* Support multiple brokers at launch
* Support social/community features
* Support advanced options analytics or Greeks
* Provide tick-by-tick real-time streaming in v1
* Function as a portfolio management or order management system

---

## 2. Target Users

### 2.1 Primary User

Active retail traders who want to review trading performance, track wins and losses, and monitor open positions through a clean dashboard.

### 2.2 User Characteristics

* Trades stocks and/or simple instruments
* Wants insight into daily trading behavior
* Values visual summaries and performance trends
* May currently use spreadsheets or brokerage history pages
* Wants broker-connected automation rather than fully manual entry

### 2.3 User Needs

* See daily performance quickly
* Understand current open-position status
* Track realized P/L and win rate accurately
* Review past trading days in a structured way
* Trust that the displayed data is consistent and understandable

---

## 3. Core Product Principles

1. **Calendar first**: the calendar is the primary interface, not an afterthought.
2. **Trustworthy metrics**: performance calculations must be clearly defined and consistent.
3. **Realized vs unrealized separation**: historical results and live position values must not be confused.
4. **Simplicity over complexity**: the initial experience should feel easy to use and easy to read.
5. **Broker-connected, not broker-dependent**: the app should normalize broker data into its own structure.

---

## 4. Scope

### 4.1 MVP Scope

The MVP will include:

* User authentication
* One supported broker integration
* Broker connection flow
* Periodic sync of open positions
* Import/sync of completed trade data if available from broker
* Calendar view with daily realized P/L
* Dashboard summary metrics
* Open positions panel
* Daily trade detail view
* Notes/tags support at basic level

### 4.2 Post-MVP Scope

Potential future enhancements:

* Multiple broker support
* CSV import
* Screenshot attachments
* Advanced filtering and search
* Setup-based performance analytics
* Equity curve chart
* Streak and consistency tracking
* Mobile optimization and native app versions
* Options-specific analytics
* Notifications and reminders

---

## 5. Functional Requirements

### 5.1 Authentication and User Accounts

**Description:** Users must be able to create an account, sign in, and securely access their own journal data.

**Requirements:**

* Users can sign up with email/password or supported auth provider
* Users can sign in and sign out
* Each user only sees their own data
* Sessions persist securely across visits

**Expected Behavior:**

* Unauthenticated users are redirected to login/signup
* Authenticated users are routed to the main dashboard/calendar

---

### 5.2 Broker Connection

**Description:** Users can connect one broker account in order to import positions and trade history.

**Requirements:**

* Support one broker in MVP
* User can initiate broker connection flow
* Access credentials/tokens must be stored securely server-side
* User can disconnect broker account
* App stores broker account metadata and connection status

**Expected Behavior:**

* A connected user sees sync status and broker connection confirmation
* A disconnected user is prompted to connect a broker before live syncing works

**Notes:**

* Broker selection for MVP should prioritize accessible documentation and position/trade endpoints
* Slightly delayed synchronization is acceptable in v1

---

### 5.3 Position Sync

**Description:** The system periodically syncs open positions from the connected broker.

**Requirements:**

* Fetch open positions on a configurable interval (recommended: every 1 to 5 minutes)
* Store position snapshots in the application database
* Display current open positions in the UI
* Show unrealized P/L separately from realized P/L

**Expected Behavior:**

* Users see current open positions with symbol, quantity, average entry, current value, and unrealized P/L
* If sync fails, users see a non-blocking status/error state
* Last updated timestamp is visible

---

### 5.4 Trade History Import / Sync

**Description:** The app imports closed trades or fills from the broker and uses them to build journal history.

**Requirements:**

* Pull historical trade/order data where supported
* Normalize imported data into app-specific trade records
* Avoid duplicate records on repeated syncs
* Support incremental updates after initial import

**Expected Behavior:**

* Users see past trades represented consistently in the journal
* Historical data can be re-synced without corrupting totals

---

### 5.5 Calendar View

**Description:** The calendar is the primary interface for reviewing daily realized performance.

**Requirements:**

* Month-based calendar layout
* Each day cell shows daily realized P/L
* Each day cell shows trade count
* Each day visually indicates positive, negative, or neutral result
* Users can click a day to view more detail

**Expected Behavior:**

* Green state for profitable day
* Red state for losing day
* Neutral/gray state for zero or no activity
* Users can navigate between months

**Calendar Definition:**
For MVP, each calendar day represents **net realized P/L from trades closed on that date**.

This does **not** include unrealized P/L from open positions.

---

### 5.6 Daily Detail View

**Description:** Users can inspect the details of a selected calendar day.

**Requirements:**

* Show all closed trades for the selected day
* Show net daily realized P/L
* Show trade count, wins, losses
* Show notes or tags if present

**Expected Behavior:**

* Clicking a day opens a panel, drawer, or dedicated page
* Users can quickly review what happened that day

---

### 5.7 Dashboard Metrics

**Description:** The product surfaces key summary metrics that help users assess overall performance.

**Requirements:**

* Total closed trades
* Win rate
* Total realized P/L
* Average win
* Average loss
* Optional: current unrealized P/L summary

**Metric Definitions:**

* **Win Rate** = number of profitable closed trades / total closed trades
* **Total Realized P/L** = sum of P/L from all closed trades in scope
* **Average Win** = average P/L of profitable closed trades
* **Average Loss** = average P/L of losing closed trades

**Expected Behavior:**

* Metrics update as imported/synced trade data changes
* Users can trust that all metrics are based on closed trades unless clearly labeled otherwise

---

### 5.8 Open Positions Panel

**Description:** A dedicated section displays current broker-connected open positions.

**Requirements:**

* Show current open positions
* Show symbol, quantity, cost basis/average entry, market value, unrealized P/L
* Show last sync time
* Refresh on slightly delayed schedule

**Expected Behavior:**

* Users can distinguish open positions from historical trades
* Panel is visually separate from calendar history

---

### 5.9 Notes and Tags

**Description:** Users can annotate trade activity with notes or simple tags.

**Requirements:**

* Add/edit note for a trade or day
* Add/edit simple tags such as setup names
* Persist metadata with trade/day records

**Expected Behavior:**

* Notes help users review lessons and patterns later
* Tags can later support filtering and analytics

---

## 6. Data Definitions and Behavior

### 6.1 Core Definitions

To prevent confusion, the product must use the following concepts consistently:

* **Closed Trade:** A trade or position that has been fully exited and is eligible for realized P/L reporting
* **Realized P/L:** Profit or loss associated with closed trades only
* **Open Position:** A currently active position not yet fully exited
* **Unrealized P/L:** Current estimated profit or loss on open positions based on latest synced broker data
* **Daily Performance:** Net realized P/L for trades closed on a given date

### 6.2 Important Rules

* The calendar shows **realized** P/L only
* Open-position fluctuations do not alter past calendar totals
* Unrealized P/L is shown only in the open positions area or explicitly labeled components
* If fees are included, they must be included consistently throughout all calculations
* Timezone behavior must be defined for daily aggregation and displayed consistently to the user

### 6.3 Edge Cases to Handle

* Duplicate trade imports
* Missing or partial broker data
* Partial exits
* Short positions
* Delayed price updates
* Temporary API failures
* Market closed periods

MVP may defer some advanced edge-case handling, but system behavior must remain stable and transparent.

---

## 7. User Experience Requirements

### 7.1 UX Goals

* The app should feel clean, modern, and focused
* The calendar should be the primary visual anchor
* The interface should avoid clutter and overloading users with too many metrics at once
* Users should understand the difference between historical results and live position data immediately

### 7.2 Design Expectations

* Clear positive/negative visual cues
* Easy monthly navigation
* Fast access to day-level detail
* Responsive layout suitable for desktop first
* Mobile responsiveness desirable, though desktop may be prioritized for MVP

### 7.3 Core Screens

* Authentication screen
* Main dashboard/calendar screen
* Broker connection/settings screen
* Daily detail view
* Open positions panel/component

---

## 8. Technical Requirements

### 8.1 Architecture

The app should use a web architecture that separates frontend UI from backend broker/data logic.

Suggested architecture:

* Frontend web app
* Backend/server routes for broker interactions
* Database for normalized trade and performance records
* Scheduled jobs for periodic sync

### 8.2 Data Storage

The application must store normalized internal records for:

* users
* broker connections
* trades
* position snapshots
* daily performance aggregates
* notes/tags

### 8.3 Security

* Broker credentials/tokens must never be exposed client-side
* Sensitive secrets must be stored securely server-side
* User data must be isolated by account
* Access controls must prevent cross-user data exposure

### 8.4 Performance

* Calendar page should load quickly with summarized monthly data
* Position sync should not block UI rendering
* Dashboard metrics should be derived efficiently from stored data

---

## 9. Reporting and Metrics Accuracy Requirements

The product must prioritize trust and consistency over excessive feature scope.

### Requirements:

* All metric formulas must be documented and consistent
* Any value that is estimated, delayed, or broker-sourced should be labeled appropriately
* Historical daily totals must remain stable once imported and processed unless a resync or correction occurs
* The system should log sync failures or discrepancies for debugging

---

## 10. Success Metrics

### 10.1 Product Success Metrics

* Users can connect a broker account successfully
* Users can view daily performance on the calendar without manual entry
* Users can identify open positions and unrealized P/L clearly
* Users can understand win rate and realized P/L at a glance
* Users return regularly to review performance

### 10.2 MVP Success Criteria

The MVP is successful if a user can:

1. Create an account
2. Connect one broker
3. View open positions with slightly delayed unrealized P/L
4. See historical daily realized P/L on a calendar
5. Open a day and inspect trade details
6. View summary performance metrics with confidence

---

## 11. Risks and Considerations

### 11.1 Product Risks

* Ambiguous P/L definitions may reduce trust
* Broker API limitations may affect data completeness
* Sync delays may cause confusion if not clearly communicated
* Supporting too many features too early may slow delivery

### 11.2 Technical Risks

* Broker auth complexity
* Inconsistent trade/fill schemas
* Data reconciliation issues between positions and trade history
* Edge-case handling for partial exits and short positions

### 11.3 Mitigation Strategy

* Start with one broker only
* Use slightly delayed sync rather than full live streaming
* Document formulas clearly
* Separate realized and unrealized data in both backend and UI
* Normalize broker data into internal schemas

---

## 12. Release Plan

### Phase 1

* Finalize requirements
* Define database schema
* Build static UI with mock data

### Phase 2

* Add authentication
* Add broker connection flow
* Add backend data model

### Phase 3

* Implement trade import and daily aggregation
* Build calendar behavior with real data

### Phase 4

* Implement open positions sync
* Display unrealized P/L and sync timestamps

### Phase 5

* Refine dashboard, notes/tags, and UX polish
* Prepare for user testing and iteration

---

## 13. Open Questions

* Which broker will be supported first?
* Will fees be included in realized P/L from launch?
* Will partial exits be fully supported in MVP or deferred?
* Which asset classes are supported in v1: equities only, or more?
* What timezone will be used for day aggregation and display?
* Will users be allowed to manually edit imported trade data?

---

## 14. Final Product Statement

The Calendar-Based Trading Journal is a broker-connected web application designed to help traders review historical performance and monitor current positions through a clean, calendar-first interface. The MVP will focus on trustworthy performance tracking, clear distinction between realized and unrealized P/L, and a simple workflow that makes daily review fast and intuitive.
