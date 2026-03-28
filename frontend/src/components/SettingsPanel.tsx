import { useMemo, useState } from 'react'
import {
  brokerConnection,
  brokerOptions,
  currencyOptions,
  dateFormatOptions,
  settingsNotificationPreferences,
  settingsProfile,
  timezoneOptions,
} from '../data/mockData'

type SettingsState = {
  broker: typeof brokerConnection
  profile: typeof settingsProfile
  preferences: {
    timezone: string
    currency: string
    dateFormat: string
    requireTags: boolean
    showOpenPositionSummary: boolean
  }
  notifications: typeof settingsNotificationPreferences
}

function cloneInitialState(): SettingsState {
  return {
    broker: { ...brokerConnection },
    profile: { ...settingsProfile },
    preferences: {
      timezone: settingsProfile.timezone,
      currency: settingsProfile.currency,
      dateFormat: settingsProfile.dateFormat,
      requireTags: true,
      showOpenPositionSummary: true,
    },
    notifications: { ...settingsNotificationPreferences },
  }
}

export function SettingsPanel() {
  const [settings, setSettings] = useState<SettingsState>(cloneInitialState)
  const [statusMessage, setStatusMessage] = useState('All changes saved')
  const [isSaving, setIsSaving] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const brokerBadge = useMemo(
    () =>
      settings.broker.connected
        ? `Connected · syncing every ${settings.broker.syncFrequency} · last sync ${settings.broker.lastSync}`
        : 'Disconnected · live syncing is paused until a broker is connected',
    [settings.broker.connected, settings.broker.lastSync, settings.broker.syncFrequency],
  )

  function queueAutosave(message = 'Changes saved') {
    setIsSaving(true)
    setStatusMessage('Saving changes...')

    window.setTimeout(() => {
      setIsSaving(false)
      setStatusMessage(message)
    }, 500)
  }

  function updateBroker<K extends keyof SettingsState['broker']>(
    key: K,
    value: SettingsState['broker'][K],
  ) {
    setSettings((current: SettingsState) => ({
      ...current,
      broker: {
        ...current.broker,
        [key]: value,
      },
    }))
    queueAutosave()
  }

  function updateProfile<K extends keyof SettingsState['profile']>(
    key: K,
    value: SettingsState['profile'][K],
  ) {
    setSettings((current: SettingsState) => ({
      ...current,
      profile: {
        ...current.profile,
        [key]: value,
      },
    }))
    queueAutosave()
  }

  function updatePreferences<K extends keyof SettingsState['preferences']>(
    key: K,
    value: SettingsState['preferences'][K],
  ) {
    setSettings((current: SettingsState) => ({
      ...current,
      preferences: {
        ...current.preferences,
        [key]: value,
      },
    }))
    queueAutosave()
  }

  function updateNotifications<K extends keyof SettingsState['notifications']>(
    key: K,
    value: SettingsState['notifications'][K],
  ) {
    setSettings((current: SettingsState) => ({
      ...current,
      notifications: {
        ...current.notifications,
        [key]: value,
      },
    }))
    queueAutosave()
  }

  async function handleBrokerConnect() {
    setIsConnecting(true)
    setStatusMessage('Starting broker connection...')

    await new Promise((resolve) => window.setTimeout(resolve, 900))

    setSettings((current: SettingsState) => ({
      ...current,
      broker: {
        ...current.broker,
        connected: true,
        brokerName: 'Interactive Brokers',
        statusLabel: 'Connected',
        lastSync: 'Just now',
      },
    }))
    setIsConnecting(false)
    setStatusMessage('Broker connected')
  }

  function handleBrokerDisconnect() {
    const shouldDisconnect = window.confirm(
      'Disconnect broker access? Open positions will remain visible from the last synced snapshot until the next connection.',
    )

    if (!shouldDisconnect) return

    setSettings((current: SettingsState) => ({
      ...current,
      broker: {
        ...current.broker,
        connected: false,
        lastSync: 'Sync paused',
      },
    }))
    setStatusMessage('Broker disconnected')
  }

  async function handleRefresh() {
    setIsRefreshing(true)
    setStatusMessage('Refreshing broker sync...')
    await new Promise((resolve) => window.setTimeout(resolve, 700))
    setSettings((current: SettingsState) => ({
      ...current,
      broker: {
        ...current.broker,
        lastSync: 'Just now',
      },
    }))
    setIsRefreshing(false)
    setStatusMessage('Broker sync refreshed')
  }

  function handleSaveAll() {
    queueAutosave('All settings saved')
  }

  function handleDangerAction(actionLabel: string) {
    const confirmed = window.confirm(
      `${actionLabel}? This is a mocked confirmation flow for the React prototype.`,
    )
    if (confirmed) {
      setStatusMessage(`${actionLabel} requested`)
    }
  }

  return (
    <div className="screen-stack">
      <section className="panel">
        <div className="panel-heading">
          <div>
            <h2>Broker connection</h2>
            <p>Manage connection status, sync frequency, and auto-import settings.</p>
          </div>
          <div className={`settings-status-chip ${isSaving ? 'is-saving' : ''}`}>
            {statusMessage}
          </div>
        </div>

        <div className="settings-grid">
          <article className="settings-card">
            <div className="settings-card-head">
              <div>
                <div className="settings-card-title">Connected broker</div>
                <div className="settings-card-copy">{brokerBadge}</div>
              </div>
              <div className={`broker-pill ${settings.broker.connected ? 'connected' : ''}`}>
                <span className="broker-dot" />
                {settings.broker.connected ? 'Connected' : 'Disconnected'}
              </div>
            </div>

            <div className="settings-action-row">
              {settings.broker.connected ? (
                <>
                  <button className="secondary-btn" type="button" onClick={handleRefresh} disabled={isRefreshing}>
                    {isRefreshing ? 'Refreshing...' : 'Refresh sync'}
                  </button>
                  <button className="settings-button danger" type="button" onClick={handleBrokerDisconnect}>
                    Disconnect
                  </button>
                </>
              ) : (
                <button className="auth-button" type="button" onClick={handleBrokerConnect} disabled={isConnecting}>
                  {isConnecting ? 'Connecting...' : 'Connect broker'}
                </button>
              )}
            </div>
          </article>

          <article className="settings-card">
            <div className="settings-card-title">Sync preferences</div>
            <div className="settings-form-grid">
              <label className="settings-field">
                <span>Sync frequency</span>
                <select
                  value={settings.broker.syncFrequency}
                  onChange={(event) => updateBroker('syncFrequency', event.target.value)}
                >
                  {brokerOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label className="settings-toggle-row">
                <div>
                  <div className="settings-toggle-title">Auto-import closed trades</div>
                  <div className="settings-toggle-copy">
                    Pull completed trade history into the journal automatically.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.broker.autoImportTrades}
                  onChange={(event) =>
                    updateBroker('autoImportTrades', event.target.checked)
                  }
                />
              </label>

              <div className="settings-inline-note">
                Leave room in the account model for future multi-broker support, but keep MVP
                broker selection to a single connected provider.
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <h2>Profile and preferences</h2>
            <p>Mirror the prototype settings fields with autosave-style interactions.</p>
          </div>
        </div>

        <div className="settings-grid settings-grid-three">
          <article className="settings-card">
            <div className="settings-card-title">Profile</div>
            <div className="settings-form-grid">
              <label className="settings-field">
                <span>Full name</span>
                <input
                  type="text"
                  value={settings.profile.name}
                  onChange={(event) => updateProfile('name', event.target.value)}
                />
              </label>
              <label className="settings-field">
                <span>Email</span>
                <input
                  type="email"
                  value={settings.profile.email}
                  onChange={(event) => updateProfile('email', event.target.value)}
                />
              </label>
            </div>
          </article>

          <article className="settings-card">
            <div className="settings-card-title">Regional preferences</div>
            <div className="settings-form-grid">
              <label className="settings-field">
                <span>Timezone</span>
                <select
                  value={settings.preferences.timezone}
                  onChange={(event) => updatePreferences('timezone', event.target.value)}
                >
                  {timezoneOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label className="settings-field">
                <span>Currency</span>
                <select
                  value={settings.preferences.currency}
                  onChange={(event) => updatePreferences('currency', event.target.value)}
                >
                  {currencyOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label className="settings-field">
                <span>Date format</span>
                <select
                  value={settings.preferences.dateFormat}
                  onChange={(event) => updatePreferences('dateFormat', event.target.value)}
                >
                  {dateFormatOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </article>

          <article className="settings-card">
            <div className="settings-card-title">Trading defaults</div>
            <div className="settings-form-grid">
              <label className="settings-toggle-row">
                <div>
                  <div className="settings-toggle-title">Require tags for journal entries</div>
                  <div className="settings-toggle-copy">
                    Encourage setup tagging when notes are added.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.preferences.requireTags}
                  onChange={(event) => updatePreferences('requireTags', event.target.checked)}
                />
              </label>
              <label className="settings-toggle-row">
                <div>
                  <div className="settings-toggle-title">Show open-position P/L on dashboard</div>
                  <div className="settings-toggle-copy">
                    Keep unrealized P/L visibly separate from realized calendar totals.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.preferences.showOpenPositionSummary}
                  onChange={(event) =>
                    updatePreferences('showOpenPositionSummary', event.target.checked)
                  }
                />
              </label>
            </div>
          </article>
        </div>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <h2>Notifications and account actions</h2>
            <p>Mock alert preferences and destructive settings flows from the prototype.</p>
          </div>
        </div>

        <div className="settings-grid">
          <article className="settings-card">
            <div className="settings-card-title">Notifications</div>
            <div className="settings-form-grid">
              <label className="settings-toggle-row">
                <div>
                  <div className="settings-toggle-title">Journal reminder</div>
                  <div className="settings-toggle-copy">
                    Remind me to review performance at the end of each trading day.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifications.journalReminder}
                  onChange={(event) =>
                    updateNotifications('journalReminder', event.target.checked)
                  }
                />
              </label>
              <label className="settings-toggle-row">
                <div>
                  <div className="settings-toggle-title">Broker sync errors</div>
                  <div className="settings-toggle-copy">
                    Alert me if broker connection fails or data stops syncing.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifications.brokerSyncErrors}
                  onChange={(event) =>
                    updateNotifications('brokerSyncErrors', event.target.checked)
                  }
                />
              </label>
            </div>
          </article>

          <article className="settings-card settings-card-danger">
            <div className="settings-card-title">Account actions</div>
            <div className="settings-form-grid">
              <button
                className="settings-button"
                type="button"
                onClick={() => handleDangerAction('Reset account data')}
              >
                Reset account
              </button>
              <button
                className="settings-button danger"
                type="button"
                onClick={() => handleDangerAction('Delete account')}
              >
                Delete account
              </button>
            </div>
          </article>
        </div>

        <div className="settings-footer-actions">
          <button className="secondary-btn" type="button" onClick={handleSaveAll}>
            {isSaving ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      </section>
    </div>
  )
}
