import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { formatDate } from '@/lib/utils'
import TopBar from '@/components/top-bar'
import { DeleteReportButton } from '@/components/reports/delete-report-button'

export default async function DashboardPage() {
  const { data: reports } = await supabase
    .from('reports')
    .select('*')
    .order('date', { ascending: false })

  const list = reports ?? []

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <TopBar />
      <main className="max-w-6xl mx-auto px-4 md:px-6 py-8">
        <div className="mb-6">
          <h1 className="text-base font-semibold text-white">Reports</h1>
          <p className="text-xs text-[#555] mt-0.5">All meeting minutes</p>
        </div>

        {list.length === 0 ? (
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
            <div className="overflow-x-auto">
              <div className="min-w-[600px]">
                <div className="grid grid-cols-[2fr_1.2fr_120px_1fr_36px] px-4 py-2.5 bg-[#111] border-b border-[#2a2a2a]">
                  <div className="text-[10px] font-medium text-[#444] uppercase tracking-widest">Meeting Title</div>
                  <div className="text-[10px] font-medium text-[#444] uppercase tracking-widest">Project</div>
                  <div className="text-[10px] font-medium text-[#444] uppercase tracking-widest">Date</div>
                  <div className="text-[10px] font-medium text-[#444] uppercase tracking-widest">Location</div>
                  <div />
                </div>

                <div className="divide-y divide-[#1c1c1c]">
                  {list.map(report => (
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
                      <DeleteReportButton id={report.id} title={report.meeting_title} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
