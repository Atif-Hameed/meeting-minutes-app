export const revalidate = 0

import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import TopBar from '@/components/top-bar'
import { ReportEditor } from '@/components/reports/report-editor'

interface Props {
  params: { id: string }
}

export default async function ReportDetailPage({ params }: Props) {
  const { data: report } = await supabase
    .from('reports')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!report) notFound()

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <TopBar />
      <ReportEditor report={report} />
    </div>
  )
}
