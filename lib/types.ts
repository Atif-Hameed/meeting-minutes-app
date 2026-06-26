export type ActionItemStatus = 'open' | 'in_progress' | 'complete' | 'on_hold'
export type ActionItemType = 'vt' | 'client'
export type QuestionStatus = 'open' | 'resolved'
export type WorkstreamStatus = 'on_track' | 'at_risk' | 'delayed'

export interface Project {
  id: string
  name: string
  created_at: string
}

export interface Report {
  id: string
  project_id: string
  meeting_title: string
  project_name: string
  date: string
  location: string | null
  prepared_by: string | null
  version: number
  parent_report_id: string | null
  created_at: string
  updated_at: string
}

export interface Attendee {
  id: string
  report_id: string
  name: string
  company: string | null
  role: string | null
  present: boolean
  created_at: string
}

export interface DiscussionTopic {
  id: string
  report_id: string
  title: string
  summary: string | null
  raised_by: string | null
  created_at: string
}

export interface ActionItem {
  id: string
  report_id: string
  description: string
  owner: string | null
  due_date: string | null
  status: ActionItemStatus
  type: ActionItemType
  created_at: string
  updated_at: string
}

export interface QuestionConcern {
  id: string
  report_id: string
  item: string
  raised_by: string | null
  response: string | null
  status: QuestionStatus
  created_at: string
}

export interface StatusReport {
  id: string
  report_id: string
  workstream: string
  status: WorkstreamStatus
  notes: string | null
  created_at: string
}

export interface FollowupItem {
  id: string
  report_id: string
  item: string
  owner: string | null
  target_meeting_date: string | null
  created_at: string
}

export interface Comment {
  id: string
  report_id: string
  author: string
  body: string
  created_at: string
}
