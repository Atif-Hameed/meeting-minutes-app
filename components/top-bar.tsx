import Link from 'next/link'

export default function TopBar() {
  return (
    <div className="border-b border-[#2a2a2a] bg-[#111]">
      <div className="max-w-6xl mx-auto px-4 md:px-6 h-12 flex items-center justify-between">
        <Link
          href="/"
          className="text-white font-semibold text-sm tracking-tight hover:text-[#f59e0b] transition-colors"
        >
          Meeting Minutes
        </Link>
        <Link
          href="/reports/new"
          className="bg-[#f59e0b] hover:bg-[#d97706] text-black text-xs font-semibold px-3 py-1.5 rounded transition-colors"
        >
          + New Report
        </Link>
      </div>
    </div>
  )
}
