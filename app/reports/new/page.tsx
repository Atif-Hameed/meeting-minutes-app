'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { formatDate } from '@/lib/utils'
import { createReport } from '@/actions'
import TopBar from '@/components/top-bar'
import type { Report } from '@/lib/types'

export default function NewReportPage() {
  const router = useRouter()
  const [previousReports, setPreviousReports] = useState<Pick<Report, 'id' | 'meeting_title' | 'project_name' | 'date' | 'location' | 'prepared_by'>[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    meetingTitle: '',
    projectName: '',
    date: new Date().toISOString().split('T')[0],
    location: '',
    preparedBy: '',
  })

  useEffect(() => {
    supabase
      .from('reports')
      .select('id, meeting_title, project_name, date, location, prepared_by')
      .order('created_at', { ascending: false })
      .limit(50)
      .then(({ data }) => setPreviousReports(data ?? []))
  }, [])

  function handleLoadPrevious(reportId: string) {
    const r = previousReports.find(x => x.id === reportId)
    if (!r) return
    setForm(prev => ({
      ...prev,
      projectName: r.project_name,
      location: r.location ?? '',
      preparedBy: r.prepared_by ?? '',
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.meetingTitle.trim() || !form.projectName.trim() || !form.date) return
    setSubmitting(true)

    try {
      const reportId = await createReport({
        meetingTitle: form.meetingTitle.trim(),
        projectName: form.projectName.trim(),
        date: form.date,
        location: form.location.trim(),
        preparedBy: form.preparedBy.trim(),
      })
      router.push(`/reports/${reportId}`)
    } catch (err) {
      console.error(err)
      setSubmitting(false)
    }
  }

  const label = 'block text-xs font-medium text-[#a1a1aa] mb-1.5'
  const input =
    'w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-md px-3 py-2 text-sm text-white placeholder:text-[#3a3a3a] outline-none focus:border-[#f59e0b] transition-colors'

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <TopBar />
      <main className="max-w-lg mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-base font-semibold text-white">New Report</h1>
          <p className="text-xs text-[#555] mt-0.5">Create a new meeting minutes report</p>
        </div>

        {previousReports.length > 0 && (
          <div className="mb-7 pb-7 border-b border-[#2a2a2a]">
            <label className={label}>Load from previous report</label>
            <select
              defaultValue=""
              onChange={e => handleLoadPrevious(e.target.value)}
              style={{ colorScheme: 'dark' }}
              className={input + ' cursor-pointer'}
            >
              <option value="" className="bg-[#1a1a1a]">
                — Select to copy details —
              </option>
              {previousReports.map(r => (
                <option key={r.id} value={r.id} className="bg-[#1a1a1a]">
                  {r.meeting_title} · {r.project_name} ({formatDate(r.date)})
                </option>
              ))}
            </select>
            <p className="mt-1.5 text-[11px] text-[#444]">
              Copies project, location, and prepared by. Date and title remain blank.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={label}>Meeting Title <span className="text-[#f59e0b]">*</span></label>
            <input
              required
              type="text"
              value={form.meetingTitle}
              onChange={e => setForm(p => ({ ...p, meetingTitle: e.target.value }))}
              placeholder="e.g. Weekly Coordination Meeting"
              className={input}
            />
          </div>

          <div>
            <label className={label}>Project Name <span className="text-[#f59e0b]">*</span></label>
            <input
              required
              type="text"
              value={form.projectName}
              onChange={e => setForm(p => ({ ...p, projectName: e.target.value }))}
              placeholder="e.g. Project Alpha"
              className={input}
            />
          </div>

          <div>
            <label className={label}>Date <span className="text-[#f59e0b]">*</span></label>
            <input
              required
              type="date"
              value={form.date}
              onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
              style={{ colorScheme: 'dark' }}
              className={input}
            />
          </div>

          <div>
            <label className={label}>Location</label>
            <input
              type="text"
              value={form.location}
              onChange={e => setForm(p => ({ ...p, location: e.target.value }))}
              placeholder="e.g. Conference Room B / Zoom"
              className={input}
            />
          </div>

          <div>
            <label className={label}>Prepared By</label>
            <input
              type="text"
              value={form.preparedBy}
              onChange={e => setForm(p => ({ ...p, preparedBy: e.target.value }))}
              placeholder="Your name"
              className={input}
            />
          </div>

          <div className="flex items-center gap-4 pt-3">
            <button
              type="submit"
              disabled={submitting}
              className="bg-[#f59e0b] hover:bg-[#d97706] disabled:opacity-50 disabled:cursor-not-allowed text-black text-sm font-semibold px-5 py-2 rounded-md transition-colors"
            >
              {submitting ? 'Creating...' : 'Create Report'}
            </button>
            <Link
              href="/"
              className="text-sm text-[#555] hover:text-[#a1a1aa] transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </main>
    </div>
  )
}
