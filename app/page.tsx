'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Trash2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import TopBar from '@/components/top-bar'
import type { Report } from '@/lib/types'

export default function DashboardPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('reports')
      .select('*')
      .order('date', { ascending: false })
      .then(({ data }) => {
        setReports(data ?? [])
        setLoading(false)
      })
  }, [])

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return
    setReports(prev => prev.filter(r => r.id !== id))
    await supabase.from('reports').delete().eq('id', id)
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <TopBar />
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-base font-semibold text-white">Reports</h1>
          <p className="text-xs text-[#555] mt-0.5">All meeting minutes</p>
        </div>

        {loading ? (
          <p className="text-sm text-[#444]">Loading...</p>
        ) : reports.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-sm text-[#555]">No reports yet.</p>
            <Link
              href="/reports/new"
              className="mt-3 text-sm text-[#f59e0b] hover:underline underline-offset-2"
            >
              Create your first report →
            </Link>
          </div>
        ) : (
          <div className="border border-[#2a2a2a] rounded-md overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-[2fr_1.2fr_120px_1fr_36px] px-4 py-2.5 bg-[#111] border-b border-[#2a2a2a]">
              <div className="text-[10px] font-medium text-[#444] uppercase tracking-widest">Meeting Title</div>
              <div className="text-[10px] font-medium text-[#444] uppercase tracking-widest">Project</div>
              <div className="text-[10px] font-medium text-[#444] uppercase tracking-widest">Date</div>
              <div className="text-[10px] font-medium text-[#444] uppercase tracking-widest">Location</div>
              <div />
            </div>

            {/* Rows */}
            <div className="divide-y divide-[#1c1c1c]">
              {reports.map(report => (
                <div
                  key={report.id}
                  className="grid grid-cols-[2fr_1.2fr_120px_1fr_36px] px-4 py-3 hover:bg-[#161616] transition-colors group"
                >
                  <Link href={`/reports/${report.id}`} className="text-sm text-white font-medium truncate pr-4">
                    {report.meeting_title}
                  </Link>
                  <Link href={`/reports/${report.id}`} className="text-sm text-[#a1a1aa] truncate pr-4">
                    {report.project_name}
                  </Link>
                  <Link href={`/reports/${report.id}`} className="text-sm text-[#a1a1aa]">
                    {formatDate(report.date)}
                  </Link>
                  <Link href={`/reports/${report.id}`} className="text-sm text-[#a1a1aa] truncate">
                    {report.location ?? '—'}
                  </Link>
                  <button
                    onClick={() => handleDelete(report.id, report.meeting_title)}
                    className="flex items-center justify-center opacity-0 group-hover:opacity-100 text-[#444] hover:text-[#ef4444] transition-all"
                    title="Delete report"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '—'
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
