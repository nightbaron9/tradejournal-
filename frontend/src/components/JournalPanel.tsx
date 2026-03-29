import { useEffect, useMemo, useState } from 'react'
import type { JournalEntry } from '../data/mockData'
import { useJournalEntries } from '../hooks/useTradingData'
import { SectionCard } from './SectionCard'

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MOODS: JournalEntry['mood'][] = ['Focused', 'Calm', 'Reactive', 'Confident', 'Frustrated']

function formatMonthLabel(date: Date) {
  return `${MONTHS[date.getMonth()]} ${date.getFullYear()}`
}

function normalizeTag(value: string) {
  return value.trim() || 'General'
}

type JournalCell = {
  key: string
  day: number
  currentMonth: boolean
  hasEntry: boolean
}

export function JournalPanel() {
  const { data: initialEntries, loading } = useJournalEntries()
  const [entries, setEntries] = useState<JournalEntry[]>(initialEntries)
  const [viewDate, setViewDate] = useState(new Date(2026, 2, 1))
  const [selectedDate, setSelectedDate] = useState('2026-03-11')
  const [search, setSearch] = useState('')
  const [tagFilter, setTagFilter] = useState('all')
  const [moodFilter, setMoodFilter] = useState('all')

  useEffect(() => {
    setEntries(initialEntries)
  }, [initialEntries])

  const tags = useMemo(() => ['all', ...new Set(entries.flatMap((entry) => entry.tags))], [entries])

  const moods = useMemo(
    () => ['all', ...new Set(entries.map((entry) => entry.mood))],
    [entries],
  )

  const monthCells = useMemo(() => {
    const year = viewDate.getFullYear()
    const month = viewDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const firstWeekday = firstDay.getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const daysInPreviousMonth = new Date(year, month, 0).getDate()
    const entrySet = new Set(entries.map((entry) => entry.date))
    const cells: JournalCell[] = []

    for (let index = 0; index < firstWeekday; index += 1) {
      const day = daysInPreviousMonth - firstWeekday + index + 1
      const cellDate = new Date(year, month - 1, day)
      const key = cellDate.toISOString().slice(0, 10)
      cells.push({
        key,
        day,
        currentMonth: false,
        hasEntry: entrySet.has(key),
      })
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      const cellDate = new Date(year, month, day)
      const key = cellDate.toISOString().slice(0, 10)
      cells.push({
        key,
        day,
        currentMonth: true,
        hasEntry: entrySet.has(key),
      })
    }

    while (cells.length % 7 !== 0) {
      const day = cells.length - (firstWeekday + daysInMonth) + 1
      const cellDate = new Date(year, month + 1, day)
      const key = cellDate.toISOString().slice(0, 10)
      cells.push({
        key,
        day,
        currentMonth: false,
        hasEntry: entrySet.has(key),
      })
    }

    return cells
  }, [entries, viewDate])

  const selectedEntry = useMemo(
    () => entries.find((entry) => entry.date === selectedDate) ?? null,
    [entries, selectedDate],
  )

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const matchesSearch =
        !search ||
        [entry.title, entry.note, entry.lesson, entry.tags.join(' ')]
          .join(' ')
          .toLowerCase()
          .includes(search.toLowerCase())

      const matchesTag = tagFilter === 'all' || entry.tags.includes(tagFilter)
      const matchesMood = moodFilter === 'all' || entry.mood === moodFilter
      const monthMatches = entry.date.startsWith(
        `${viewDate.getFullYear()}-${String(viewDate.getMonth() + 1).padStart(2, '0')}`,
      )

      return matchesSearch && matchesTag && matchesMood && monthMatches
    })
  }, [entries, moodFilter, search, tagFilter, viewDate])

  const lessons = useMemo(
    () =>
      filteredEntries.map((entry) => ({
        id: entry.id,
        text: entry.lesson,
      })),
    [filteredEntries],
  )

  function updateEntry<K extends keyof JournalEntry>(
    entryId: string,
    key: K,
    value: JournalEntry[K],
  ) {
    setEntries((current) =>
      current.map((entry) =>
        entry.id === entryId
          ? {
              ...entry,
              [key]: value,
            }
          : entry,
      ),
    )
  }

  function addLesson() {
    if (!selectedEntry) return
    const lesson = window.prompt('Add a lesson learned for this trading day:')
    if (!lesson?.trim()) return
    updateEntry(selectedEntry.id, 'lesson', lesson.trim())
  }

  function addEntry() {
    const id = `jnl-${Date.now()}`
    const date = selectedDate
    setEntries((current) => [
      {
        id,
        date,
        title: 'New journal entry',
        note: 'Capture the day, setup quality, emotions, and execution details here.',
        lesson: 'Add your key lesson learned.',
        mood: 'Focused',
        tags: ['General'],
      },
      ...current,
    ])
  }

  function previousMonth() {
    setViewDate((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1))
  }

  function nextMonth() {
    setViewDate((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1))
  }

  return (
    <div className="journal-layout">
      <aside className="journal-sidebar">
        <SectionCard
          title="Mini calendar"
          description="Navigate trading days and jump into entries by month."
          className="journal-sidebar-card"
        >
          <div className="journal-calendar-header">
            <button className="calendar-nav" type="button" onClick={previousMonth}>
              ←
            </button>
            <strong>{formatMonthLabel(viewDate)}</strong>
            <button className="calendar-nav" type="button" onClick={nextMonth}>
              →
            </button>
          </div>

          <div className="journal-calendar-dow">
            {DAYS.map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>

          <div className="journal-calendar-grid">
            {monthCells.map((cell) => (
              <button
                key={cell.key}
                type="button"
                className={`journal-calendar-cell ${cell.currentMonth ? '' : 'other-month'} ${cell.key === selectedDate ? 'selected' : ''} ${cell.hasEntry ? 'has-entry' : ''}`}
                onClick={() => setSelectedDate(cell.key)}
              >
                {cell.day}
              </button>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Lessons learned"
          description="Surface one key takeaway per trading day."
          className="journal-sidebar-card"
        >
          <div className="journal-lessons-list">
            {lessons.map((lesson) => (
              <div className="journal-lesson-item" key={lesson.id}>
                {lesson.text}
              </div>
            ))}
          </div>
          <button className="settings-btn secondary" type="button" onClick={addLesson}>
            + Add lesson
          </button>
        </SectionCard>
      </aside>

      <div className="journal-main">
        <SectionCard
          title="Notes and journal"
          description="Search, filter, and edit day-level journal entries tied to trading activity."
          actions={
            <button className="settings-btn primary" type="button" onClick={addEntry}>
              + New entry
            </button>
          }
          className="journal-main-card"
        >
          {loading ? <div className="auth-meta-text">Loading journal entries...</div> : null}
          <div className="journal-toolbar">
            <input
              className="journal-search-input"
              type="text"
              placeholder="Search notes…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <select value={tagFilter} onChange={(event) => setTagFilter(event.target.value)}>
              {tags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag === 'all' ? 'All tags' : tag}
                </option>
              ))}
            </select>
            <select value={moodFilter} onChange={(event) => setMoodFilter(event.target.value)}>
              {moods.map((mood) => (
                <option key={mood} value={mood}>
                  {mood === 'all' ? 'All moods' : mood}
                </option>
              ))}
            </select>
          </div>

          <div className="journal-entry-list">
            {filteredEntries.map((entry) => (
              <article
                className={`journal-entry-card ${entry.date === selectedDate ? 'selected' : ''}`}
                key={entry.id}
                onClick={() => setSelectedDate(entry.date)}
              >
                <div className="journal-entry-top">
                  <div>
                    <strong>{entry.title}</strong>
                    <p>{entry.date}</p>
                  </div>
                  <div className="journal-chip-row">
                    <span className="tag">{entry.mood}</span>
                    {entry.tags.map((tag) => (
                      <span className="tag muted" key={`${entry.id}-${tag}`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <p>{entry.note}</p>
              </article>
            ))}
          </div>

          {selectedEntry ? (
            <div className="journal-editor">
              <div className="journal-editor-header">
                <div>
                  <div className="section-label">Editing entry</div>
                  <h3>{selectedEntry.date}</h3>
                </div>
              </div>

              <div className="settings-form-grid">
                <label className="settings-field">
                  <span>Title</span>
                  <input
                    type="text"
                    value={selectedEntry.title}
                    onChange={(event) =>
                      updateEntry(selectedEntry.id, 'title', event.target.value)
                    }
                  />
                </label>

                <label className="settings-field">
                  <span>Mood</span>
                  <select
                    value={selectedEntry.mood}
                    onChange={(event) =>
                      updateEntry(selectedEntry.id, 'mood', event.target.value as JournalEntry['mood'])
                    }
                  >
                    {MOODS.map((mood) => (
                      <option key={mood} value={mood}>
                        {mood}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="settings-field">
                <span>Tags</span>
                <input
                  type="text"
                  value={selectedEntry.tags.join(', ')}
                  onChange={(event) =>
                    updateEntry(
                      selectedEntry.id,
                      'tags',
                      event.target.value
                        .split(',')
                        .map(normalizeTag)
                        .filter(Boolean),
                    )
                  }
                />
              </label>

              <label className="settings-field">
                <span>Lesson learned</span>
                <textarea
                  className="journal-textarea"
                  value={selectedEntry.lesson}
                  onChange={(event) =>
                    updateEntry(selectedEntry.id, 'lesson', event.target.value)
                  }
                />
              </label>

              <label className="settings-field">
                <span>Journal entry</span>
                <textarea
                  className="journal-textarea large"
                  value={selectedEntry.note}
                  onChange={(event) =>
                    updateEntry(selectedEntry.id, 'note', event.target.value)
                  }
                />
              </label>
            </div>
          ) : null}
        </SectionCard>
      </div>
    </div>
  )
}
