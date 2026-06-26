'use client'

import { useState, useEffect, useCallback } from 'react'
import { ChevronDown, ChevronRight, Plus, Trash2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { addSectionRow, updateSectionRow, deleteSectionRow } from '@/actions'

export type FieldType = 'text' | 'date' | 'select' | 'checkbox' | 'textarea'

export interface ColumnConfig {
  key: string
  label: string
  type: FieldType
  options?: Array<{ value: string; label: string }>
  placeholder?: string
  flex?: number
}

interface EditableSectionProps {
  title: string
  tableName: string
  reportId: string
  columns: ColumnConfig[]
  defaultRowValues?: Record<string, unknown>
  filterKey?: string
  filterValue?: string
  onSaved?: () => void
}

export function EditableSection({
  title,
  tableName,
  reportId,
  columns,
  defaultRowValues = {},
  filterKey,
  filterValue,
  onSaved,
}: EditableSectionProps) {
  const [open, setOpen] = useState(true)
  const [rows, setRows] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)

  const showSaved = useCallback(() => {
    setSaved(true)
    onSaved?.()
    setTimeout(() => setSaved(false), 2000)
  }, [onSaved])

  useEffect(() => {
    async function fetchRows() {
      let query = supabase
        .from(tableName)
        .select('*')
        .eq('report_id', reportId)

      if (filterKey && filterValue) {
        query = query.eq(filterKey, filterValue)
      }

      const { data } = await query.order('created_at', { ascending: true })
      setRows(data ?? [])
      setLoading(false)
    }
    fetchRows()
  }, [tableName, reportId, filterKey, filterValue])

  async function handleUpdate(rowId: string, field: string, value: unknown) {
    setRows(prev => prev.map(r => r.id === rowId ? { ...r, [field]: value } : r))
    await updateSectionRow(tableName, rowId, field, value, reportId)
    showSaved()
  }

  async function handleAdd() {
    const newRow: Record<string, unknown> = {
      report_id: reportId,
      ...defaultRowValues,
    }
    const result = await addSectionRow(tableName, newRow, reportId)
    if (result) setRows(prev => [...prev, result])
  }

  async function handleDelete(rowId: string) {
    setRows(prev => prev.filter(r => r.id !== rowId))
    await deleteSectionRow(tableName, rowId, reportId)
  }

  return (
    <div className="border border-[#2a2a2a] rounded-md overflow-hidden">
      {/* Section header */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-left bg-[#111] hover:bg-[#161616] transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-0.5 h-3.5 bg-[#f59e0b] rounded-full shrink-0" />
          <span className="text-sm font-medium text-white">{title}</span>
          <span className="text-xs text-[#444] tabular-nums">{rows.length}</span>
        </div>
        <div className="flex items-center gap-3">
          {saved && <span className="text-xs text-[#f59e0b]">Saved</span>}
          {open
            ? <ChevronDown className="size-3.5 text-[#555]" />
            : <ChevronRight className="size-3.5 text-[#555]" />
          }
        </div>
      </button>

      {open && (
        <div>
          {loading ? (
            <div className="px-4 py-4 text-sm text-[#444] border-t border-[#1c1c1c]">Loading...</div>
          ) : rows.length === 0 ? (
            <div className="px-4 py-4 border-t border-[#1c1c1c]">
              <div className="border border-dashed border-[#2a2a2a] rounded px-4 py-5 text-center text-xs text-[#444]">
                No entries yet. Use &ldquo;Add row&rdquo; below to get started.
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto border-t border-[#2a2a2a]">
              <div className="min-w-[560px]">
                {/* Column header */}
                <div className="flex items-center px-4 py-2 bg-[#0d0d0d]">
                  {columns.map(col => (
                    <div
                      key={col.key}
                      style={col.type === 'checkbox' ? { width: 52, flexShrink: 0 } : { flex: col.flex ?? 1, minWidth: 0 }}
                      className="text-[10px] font-medium text-[#444] uppercase tracking-widest pr-3"
                    >
                      {col.label}
                    </div>
                  ))}
                  <div style={{ width: 28, flexShrink: 0 }} />
                </div>
                {/* Rows */}
                <div className="divide-y divide-[#1c1c1c] border-t border-[#1c1c1c]">
                  {rows.map(row => (
                    <div key={String(row.id)} className="flex items-center px-4 py-1 group hover:bg-[#141414] transition-colors">
                      {columns.map(col => (
                        <div
                          key={col.key}
                          style={col.type === 'checkbox' ? { width: 52, flexShrink: 0 } : { flex: col.flex ?? 1, minWidth: 0 }}
                          className="pr-2"
                        >
                          <EditableCell
                            column={col}
                            value={row[col.key] as CellValue}
                            onChange={value => handleUpdate(row.id as string, col.key, value)}
                          />
                        </div>
                      ))}
                      <button
                        onClick={() => handleDelete(row.id as string)}
                        style={{ width: 28, flexShrink: 0 }}
                        className="flex justify-center opacity-0 group-hover:opacity-100 text-[#444] hover:text-red-400 transition-all"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Add row */}
          <div className="px-4 py-3 border-t border-[#1c1c1c]">
            <button
              onClick={handleAdd}
              className="flex items-center gap-1.5 text-xs text-[#a1a1aa] border border-dashed border-[#333] hover:border-[#f59e0b] hover:text-[#f59e0b] px-3 py-1.5 rounded transition-colors"
            >
              <Plus className="size-3.5" />
              Add row
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

type CellValue = string | boolean | null | undefined

interface EditableCellProps {
  column: ColumnConfig
  value: CellValue
  onChange: (value: CellValue) => void
}

function EditableCell({ column, value, onChange }: EditableCellProps) {
  const initVal: CellValue = column.type === 'checkbox' ? (value ?? false) : (value ?? '')
  const [draft, setDraft] = useState<CellValue>(initVal)

  useEffect(() => {
    setDraft(column.type === 'checkbox' ? (value ?? false) : (value ?? ''))
  }, [value, column.type])

  const inputBase =
    'w-full bg-transparent text-sm text-white placeholder:text-[#3a3a3a] border-0 outline-none focus:bg-[#1e1e1e] rounded px-1.5 py-1.5 -mx-1.5 transition-colors min-w-0 block'

  if (column.type === 'checkbox') {
    return (
      <input
        type="checkbox"
        checked={!!draft}
        onChange={e => {
          setDraft(e.target.checked)
          onChange(e.target.checked)
        }}
        className="accent-[#f59e0b] cursor-pointer"
      />
    )
  }

  if (column.type === 'select' && column.options) {
    return (
      <select
        value={String(draft ?? '')}
        onChange={e => {
          setDraft(e.target.value)
          onChange(e.target.value)
        }}
        style={{ colorScheme: 'dark' }}
        className="w-full bg-transparent text-sm text-white border-0 outline-none focus:bg-[#1e1e1e] rounded px-1 py-1.5 -mx-1 cursor-pointer transition-colors"
      >
        {column.options.map(opt => (
          <option key={opt.value} value={opt.value} className="bg-[#1a1a1a] text-white">
            {opt.label}
          </option>
        ))}
      </select>
    )
  }

  if (column.type === 'textarea') {
    return (
      <textarea
        value={String(draft ?? '')}
        placeholder={column.placeholder}
        onChange={e => setDraft(e.target.value)}
        onBlur={() => { if (draft !== (value ?? '')) onChange(draft) }}
        rows={2}
        className={inputBase + ' resize-none'}
      />
    )
  }

  return (
    <input
      type={column.type === 'date' ? 'date' : 'text'}
      value={String(draft ?? '')}
      placeholder={column.placeholder}
      onChange={e => setDraft(e.target.value)}
      onBlur={() => { if (draft !== (value ?? '')) onChange(draft) }}
      style={column.type === 'date' ? { colorScheme: 'dark' } : undefined}
      className={inputBase}
    />
  )
}
