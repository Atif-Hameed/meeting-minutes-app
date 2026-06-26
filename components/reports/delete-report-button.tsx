'use client'

import { Trash2 } from 'lucide-react'
import { deleteReport } from '@/actions'

interface DeleteReportButtonProps {
  id: string
  title: string
}

export function DeleteReportButton({ id, title }: DeleteReportButtonProps) {
  async function handleDelete() {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return
    await deleteReport(id)
  }

  return (
    <button
      onClick={handleDelete}
      title="Delete report"
      className="flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 text-[#444] hover:text-[#ef4444] transition-all"
    >
      <Trash2 className="size-3.5" />
    </button>
  )
}
