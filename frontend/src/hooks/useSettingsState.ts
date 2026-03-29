import { useMemo, useState } from 'react'
import {
  brokerConnection,
  settingsNotificationPreferences,
  settingsProfile,
} from '../data/mockData'

export type SettingsState = {
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

export function useSettingsState() {
  const [settings, setSettings] = useState<SettingsState>(cloneInitialState)

  const brokerBadge = useMemo(
    () =>
      settings.broker.connected
        ? `Connected · syncing every ${settings.broker.syncFrequency} · last sync ${settings.broker.lastSync}`
        : 'Disconnected · live syncing is paused until a broker is connected',
    [settings.broker.connected, settings.broker.lastSync, settings.broker.syncFrequency],
  )

  function updateBroker<K extends keyof SettingsState['broker']>(
    key: K,
    value: SettingsState['broker'][K],
  ) {
    setSettings((current) => ({
      ...current,
      broker: {
        ...current.broker,
        [key]: value,
      },
    }))
  }

  function updateProfile<K extends keyof SettingsState['profile']>(
    key: K,
    value: SettingsState['profile'][K],
  ) {
    setSettings((current) => ({
      ...current,
      profile: {
        ...current.profile,
        [key]: value,
      },
    }))
  }

  function updatePreferences<K extends keyof SettingsState['preferences']>(
    key: K,
    value: SettingsState['preferences'][K],
  ) {
    setSettings((current) => ({
      ...current,
      preferences: {
        ...current.preferences,
        [key]: value,
      },
    }))
  }

  function updateNotifications<K extends keyof SettingsState['notifications']>(
    key: K,
    value: SettingsState['notifications'][K],
  ) {
    setSettings((current) => ({
      ...current,
      notifications: {
        ...current.notifications,
        [key]: value,
      },
    }))
  }

  return {
    brokerBadge,
    cloneInitialState,
    settings,
    setSettings,
    updateBroker,
    updateNotifications,
    updatePreferences,
    updateProfile,
  }
}
