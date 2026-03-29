import { useState } from 'react'
import { SettingsStatusChip } from './settings/SettingsStatusChip'
import { useSettingsState, type SettingsState } from '../hooks/useSettingsState'
import { brokerOptions, currencyOptions, dateFormatOptions, timezoneOptions } from '../data/mockData'
import { useAppContext } from '../app/AppContext'
import type { SettingsPayload } from '../api/contracts'

function toSettingsPayload(settings: SettingsState): SettingsPayload {
  return {
    profile: {
      name: settings.profile.name,
      email: settings.profile.email,
    },
    preferences: {
      timezone: settings.preferences.timezone,
      currency: settings.preferences.currency,
      dateFormat: settings.preferences.dateFormat,
      requireTags: settings.preferences.requireTags,
      showOpenPositionSummary: settings.preferences.showOpenPositionSummary,
    },
    notifications: {
      journalReminder: settings.notifications.journalReminder,
      weeklyReview: settings.notifications.weeklyReview,
      brokerSyncErrors: settings.notifications.brokerSyncErrors,
    },
  }
}

export function SettingsPanel() {
  const { brokerService } = useAppContext()
  const {
    brokerBadge,
    settings,
    setSettings,
    updateBroker,
    updateNotifications,
    updatePreferences,
    updateProfile,
  } = useSettingsState()

  const [statusMessage, setStatusMessage] = useState('All changes saved')
  const [isSaving, setIsSaving] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  async function saveSettings(message = 'Changes saved') {
    setIsSaving(true)
    setStatusMessage('Saving changes...')

    try {
      await brokerService.updateSettings(toSettingsPayload(settings))
      setStatusMessage(message)
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : 'Unable to save settings right now.')
    } finally {
      setIsSaving(false)
    }
  }

  async function handleBrokerConnect() {
    setIsConnecting(true)
    setStatusMessage('Starting broker connection...')

    try {
      const nextBroker = settings.broker.brokerName || brokerOptions[0]
      const response = await brokerService.connectBroker({ brokerName: nextBroker })
      setSettings((current) => ({
        ...current,
        broker: {
          ...current.broker,
          connected: response.status.connected,
          brokerName: response.status.brokerName,
          statusLabel: response.status.statusLabel,
          lastSync: response.status.lastSync,
          syncFrequency: response.status.syncFrequency,
          autoImportTrades: response.status.autoImportTrades,
        },
      }))
      setStatusMessage('Broker connected')
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : 'Unable to connect broker.')
    } finally {
      setIsConnecting(false)
    }
  }

  async function handleBrokerDisconnect() {
    const shouldDisconnect = window.confirm(
      'Disconnect broker access? Open positions will remain visible from the last synced snapshot until the next connection.',
    )

    if (!shouldDisconnect) return

    setStatusMessage('Disconnecting broker...')

    try {
      const response = await brokerService.disconnectBroker()
      setSettings((current) => ({
        ...current,
        broker: {
          ...current.broker,
          connected: response.status.connected,
          statusLabel: response.status.statusLabel,
          lastSync: response.status.lastSync,
        },
      }))
      setStatusMessage('Broker disconnected')
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : 'Unable to disconnect broker.')
    }
  }

  async function handleRefresh() {
    setIsRefreshing(true)
    setStatusMessage('Refreshing broker sync...')

    try {
      const response = await brokerService.refreshBroker()
      setSettings((current) => ({
        ...current,
        broker: {
          ...current.broker,
          connected: response.status.connected,
          statusLabel: response.status.statusLabel,
          lastSync: response.status.lastSync,
          syncFrequency: response.status.syncFrequency,
          autoImportTrades: response.status.autoImportTrades,
        },
      }))
      setStatusMessage('Broker sync refreshed')
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : 'Unable to refresh broker sync.')
    } finally {
      setIsRefreshing(false)
    }
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
          <SettingsStatusChip message={statusMessage} isSaving={isSaving} />
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
                {settings.broker.statusLabel}
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
                <span>Connected broker</span>
                <select
                  value={settings.broker.brokerName}
                  onChange={(event) => updateBroker('brokerName', event.target.value)}
                >
                  {brokerOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label className="settings-field">
                <span>Sync frequency</span>
                <select
                  value={settings.broker.syncFrequency}
                  onChange={(event) => updateBroker('syncFrequency', event.target.value)}
                >
                  <option value="1 minute">1 minute</option>
                  <option value="2 minutes">2 minutes</option>
                  <option value="5 minutes">5 minutes</option>
                  <option value="15 minutes">15 minutes</option>
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
                  onChange={(event) => updateBroker('autoImportTrades', event.target.checked)}
                />
              </label>

              <div className="settings-inline-note">
                Leave room in the account model for future multi-broker support, but keep MVP broker
                selection to a single connected provider.
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
                  onChange={(event) => updateNotifications('journalReminder', event.target.checked)}
                />
              </label>
              <label className="settings-toggle-row">
                <div>
                  <div className="settings-toggle-title">Weekly review</div>
                  <div className="settings-toggle-copy">
                    Send a weekly recap reminder to review performance trends.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifications.weeklyReview}
                  onChange={(event) => updateNotifications('weeklyReview', event.target.checked)}
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
                  onChange={(event) => updateNotifications('brokerSyncErrors', event.target.checked)}
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
          <button
            className="secondary-btn"
            type="button"
            onClick={() => {
              void saveSettings('All settings saved')
            }}
          >
            {isSaving ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      </section>
    </div>
  )
}
