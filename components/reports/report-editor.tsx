'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { updateReportField } from '@/actions'
import { EditableSection } from '@/components/reports/editable-section'
import type { Report } from '@/lib/types'

const ACTION_STATUS = [
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'complete', label: 'Complete' },
  { value: 'on_hold', label: 'On Hold' },
]

const QUESTION_STATUS = [
  { value: 'open', label: 'Open' },
  { value: 'resolved', label: 'Resolved' },
]

const WORKSTREAM_STATUS = [
  { value: 'on_track', label: 'On Track' },
  { value: 'at_risk', label: 'At Risk' },
  { value: 'delayed', label: 'Delayed' },
]

interface ReportEditorProps {
  report: Report
}

export function ReportEditor({ report: initialReport }: ReportEditorProps) {
  const router = useRouter()
  const [report, setReport] = useState(initialReport)
  const [saved, setSaved] = useState(false)

  const showSaved = useCallback(() => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }, [])

  async function saveField(field: string, value: string) {
    const coerced = value.trim() || null
    setReport(prev => ({ ...prev, [field]: coerced }))
    await updateReportField(report.id, field, coerced)
    router.refresh()
    showSaved()
  }

  return (
    <main className="max-w-6xl mx-auto px-4 md:px-6 py-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs text-[#555] hover:text-[#a1a1aa] mb-7 transition-colors"
      >
        <ArrowLeft className="size-3" />
        All Reports
      </Link>

      {/* Report header */}
      <div className="mb-8 pb-7 border-b border-[#2a2a2a]">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <InlineField
              value={report.meeting_title}
              onSave={v => saveField('meeting_title', v)}
              placeholder="Meeting Title"
              className="text-xl font-semibold text-white w-full"
            />
            <div className="mt-2.5 flex flex-col md:flex-row md:flex-wrap md:items-center gap-y-1.5 md:gap-x-5 md:gap-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#555]">Date</span>
                <InlineField
                  value={report.date ?? ''}
                  onSave={v => saveField('date', v)}
                  type="date"
                  displayFormatter={formatDate}
                  className="text-sm text-[#a1a1aa]"
                />
              </div>
              <span className="hidden md:inline text-[#333]">·</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#555]">Location</span>
                <InlineField
                  value={report.location ?? ''}
                  onSave={v => saveField('location', v)}
                  placeholder="—"
                  className="text-sm text-[#a1a1aa]"
                />
              </div>
              <span className="hidden md:inline text-[#333]">·</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#555]">Prepared by</span>
                <InlineField
                  value={report.prepared_by ?? ''}
                  onSave={v => saveField('prepared_by', v)}
                  placeholder="—"
                  className="text-sm text-[#a1a1aa]"
                />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0 pt-0.5">
            {saved && <span className="text-xs text-[#f59e0b]">Saved</span>}
            <span className="text-xs text-[#333] border border-[#2a2a2a] rounded px-2 py-0.5">
              v{report.version}
            </span>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-2">
        <EditableSection
          title="Attendees"
          tableName="attendees"
          reportId={report.id}
          defaultRowValues={{ name: '', present: true }}
          onSaved={showSaved}
          columns={[
            { key: 'name',    label: 'Name',    type: 'text',     placeholder: 'Full name', flex: 2 },
            { key: 'company', label: 'Company', type: 'text',     placeholder: 'Company',   flex: 1.5 },
            { key: 'role',    label: 'Role',    type: 'text',     placeholder: 'Role',      flex: 1.5 },
            { key: 'present', label: 'Present', type: 'checkbox' },
          ]}
        />

        <EditableSection
          title="Discussion Topics"
          tableName="discussion_topics"
          reportId={report.id}
          defaultRowValues={{ title: '' }}
          onSaved={showSaved}
          columns={[
            { key: 'title',     label: 'Topic',     type: 'text', placeholder: 'Topic',         flex: 2 },
            { key: 'raised_by', label: 'Raised By', type: 'text', placeholder: 'Name',          flex: 1 },
            { key: 'summary',   label: 'Summary',   type: 'text', placeholder: 'Brief summary', flex: 3 },
          ]}
        />

        <EditableSection
          title="Action Items — VT"
          tableName="action_items"
          reportId={report.id}
          filterKey="type"
          filterValue="vt"
          defaultRowValues={{ description: '', status: 'open', type: 'vt' }}
          onSaved={showSaved}
          columns={[
            { key: 'description', label: 'Description', type: 'text',   placeholder: 'Action item', flex: 3 },
            { key: 'owner',       label: 'Owner',       type: 'text',   placeholder: 'Owner',       flex: 1 },
            { key: 'due_date',    label: 'Due Date',    type: 'date',                               flex: 1 },
            { key: 'status',      label: 'Status',      type: 'select', options: ACTION_STATUS,     flex: 1 },
          ]}
        />

        <EditableSection
          title="Action Items — Client"
          tableName="action_items"
          reportId={report.id}
          filterKey="type"
          filterValue="client"
          defaultRowValues={{ description: '', status: 'open', type: 'client' }}
          onSaved={showSaved}
          columns={[
            { key: 'description', label: 'Description', type: 'text',   placeholder: 'Action item', flex: 3 },
            { key: 'owner',       label: 'Owner',       type: 'text',   placeholder: 'Owner',       flex: 1 },
            { key: 'due_date',    label: 'Due Date',    type: 'date',                               flex: 1 },
            { key: 'status',      label: 'Status',      type: 'select', options: ACTION_STATUS,     flex: 1 },
          ]}
        />

        <EditableSection
          title="Questions & Concerns"
          tableName="questions_concerns"
          reportId={report.id}
          defaultRowValues={{ item: '', status: 'open' }}
          onSaved={showSaved}
          columns={[
            { key: 'item',      label: 'Question / Concern', type: 'text',   placeholder: 'Enter item', flex: 3 },
            { key: 'raised_by', label: 'Raised By',          type: 'text',   placeholder: 'Name',       flex: 1 },
            { key: 'response',  label: 'Response',           type: 'text',   placeholder: 'Response',   flex: 2 },
            { key: 'status',    label: 'Status',             type: 'select', options: QUESTION_STATUS,  flex: 1 },
          ]}
        />

        <EditableSection
          title="Status Reports"
          tableName="status_reports"
          reportId={report.id}
          defaultRowValues={{ workstream: '', status: 'on_track' }}
          onSaved={showSaved}
          columns={[
            { key: 'workstream', label: 'Workstream', type: 'text',   placeholder: 'Workstream',  flex: 2 },
            { key: 'status',     label: 'Status',     type: 'select', options: WORKSTREAM_STATUS, flex: 1 },
            { key: 'notes',      label: 'Notes',      type: 'text',   placeholder: 'Notes',       flex: 3 },
          ]}
        />

        <EditableSection
          title="Follow-up Items"
          tableName="followup_items"
          reportId={report.id}
          defaultRowValues={{ item: '' }}
          onSaved={showSaved}
          columns={[
            { key: 'item',                label: 'Item',        type: 'text', placeholder: 'Follow-up item', flex: 3 },
            { key: 'owner',               label: 'Owner',       type: 'text', placeholder: 'Owner',          flex: 1 },
            { key: 'target_meeting_date', label: 'Target Date', type: 'date',                                flex: 1 },
          ]}
        />

        <EditableSection
          title="Comments"
          tableName="comments"
          reportId={report.id}
          defaultRowValues={{ author: '', body: '' }}
          onSaved={showSaved}
          columns={[
            { key: 'author', label: 'Author',  type: 'text',     placeholder: 'Name',    flex: 1 },
            { key: 'body',   label: 'Comment', type: 'textarea', placeholder: 'Comment', flex: 4 },
          ]}
        />
      </div>
    </main>
  )
}

// ─── Inline field ─────────────────────────────────────────────────────────────

interface InlineFieldProps {
  value: string
  onSave: (value: string) => void
  type?: 'text' | 'date'
  placeholder?: string
  className?: string
  displayFormatter?: (v: string) => string
}

function InlineField({
  value,
  onSave,
  type = 'text',
  placeholder = '—',
  className = '',
  displayFormatter,
}: InlineFieldProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)

  useEffect(() => { setDraft(value) }, [value])

  function commit() {
    if (draft !== value) onSave(draft)
    setEditing(false)
  }

  if (editing) {
    return (
      <input
        autoFocus
        type={type}
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') setEditing(false) }}
        style={type === 'date' ? { colorScheme: 'dark' } : undefined}
        className={`bg-[#1e1e1e] border border-[#f59e0b] rounded px-2 py-0.5 outline-none ${className}`}
      />
    )
  }

  const display = displayFormatter && value ? displayFormatter(value) : value

  return (
    <span
      onClick={() => setEditing(true)}
      title="Click to edit"
      className={`cursor-text rounded px-1 -ml-1 border border-transparent hover:border-[#2a2a2a] hover:bg-[#161616] transition-colors inline-block ${className}`}
    >
      {display || <span className="text-[#444]">{placeholder}</span>}
    </span>
  )
}
