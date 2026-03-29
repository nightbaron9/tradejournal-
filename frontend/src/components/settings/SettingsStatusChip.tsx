type SettingsStatusChipProps = {
  message: string
  isSaving?: boolean
}

export function SettingsStatusChip({
  message,
  isSaving = false,
}: SettingsStatusChipProps) {
  return (
    <div className={`settings-status-chip ${isSaving ? 'is-saving' : ''}`}>
      {message}
    </div>
  )
}
