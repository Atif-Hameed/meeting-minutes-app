'use server'

import { revalidatePath } from 'next/cache'
import { supabase } from '@/lib/supabase'

export async function addSectionRow(
  tableName: string,
  data: Record<string, unknown>,
  reportId: string
): Promise<Record<string, unknown> | null> {
  const { data: row } = await supabase.from(tableName).insert(data).select().single()
  revalidatePath('/')
  revalidatePath(`/reports/${reportId}`)
  return row
}

export async function updateSectionRow(
  tableName: string,
  id: string,
  field: string,
  value: unknown,
  reportId: string
): Promise<void> {
  await supabase.from(tableName).update({ [field]: value }).eq('id', id)
  revalidatePath('/')
  revalidatePath(`/reports/${reportId}`)
}

export async function deleteSectionRow(
  tableName: string,
  id: string,
  reportId: string
): Promise<void> {
  await supabase.from(tableName).delete().eq('id', id)
  revalidatePath('/')
  revalidatePath(`/reports/${reportId}`)
}
