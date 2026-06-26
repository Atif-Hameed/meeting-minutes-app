'use server'

import { revalidatePath } from 'next/cache'
import { supabase } from '@/lib/supabase'

export async function createReport(data: {
  meetingTitle: string
  projectName: string
  date: string
  location: string
  preparedBy: string
}): Promise<string> {
  let projectId: string

  const { data: existing } = await supabase
    .from('projects')
    .select('id')
    .eq('name', data.projectName)
    .maybeSingle()

  if (existing) {
    projectId = existing.id
  } else {
    const { data: newProject, error } = await supabase
      .from('projects')
      .insert({ name: data.projectName })
      .select('id')
      .single()
    if (error || !newProject) throw new Error('Failed to create project')
    projectId = newProject.id
  }

  const { data: report, error } = await supabase
    .from('reports')
    .insert({
      project_id: projectId,
      meeting_title: data.meetingTitle,
      project_name: data.projectName,
      date: data.date,
      location: data.location || null,
      prepared_by: data.preparedBy || null,
    })
    .select('id')
    .single()

  if (error || !report) throw new Error('Failed to create report')

  revalidatePath('/')
  return report.id
}

export async function updateReportField(
  id: string,
  field: string,
  value: string | null
): Promise<void> {
  await supabase.from('reports').update({ [field]: value }).eq('id', id)
  revalidatePath('/')
  revalidatePath(`/reports/${id}`)
}

export async function deleteReport(id: string): Promise<void> {
  await supabase.from('reports').delete().eq('id', id)
  revalidatePath('/')
}
