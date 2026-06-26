-- ============================================================
-- Meeting Minutes App — Database Schema
-- Run this in the Supabase SQL editor
-- ============================================================

-- Enums
create type action_item_status as enum ('open', 'in_progress', 'complete', 'on_hold');
create type action_item_type   as enum ('vt', 'client');
create type question_status    as enum ('open', 'resolved');
create type workstream_status  as enum ('on_track', 'at_risk', 'delayed');

-- ------------------------------------------------------------
-- projects
-- ------------------------------------------------------------
create table projects (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- reports
-- ------------------------------------------------------------
create table reports (
  id               uuid primary key default gen_random_uuid(),
  project_id       uuid not null references projects(id) on delete cascade,
  meeting_title    text not null,
  project_name     text not null,
  date             date not null,
  location         text,
  prepared_by      text,
  version          integer not null default 1,
  parent_report_id uuid references reports(id) on delete set null,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- ------------------------------------------------------------
-- attendees
-- ------------------------------------------------------------
create table attendees (
  id         uuid primary key default gen_random_uuid(),
  report_id  uuid not null references reports(id) on delete cascade,
  name       text not null,
  company    text,
  role       text,
  present    boolean not null default true,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- discussion_topics
-- ------------------------------------------------------------
create table discussion_topics (
  id         uuid primary key default gen_random_uuid(),
  report_id  uuid not null references reports(id) on delete cascade,
  title      text not null,
  summary    text,
  raised_by  text,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- action_items
-- ------------------------------------------------------------
create table action_items (
  id          uuid primary key default gen_random_uuid(),
  report_id   uuid not null references reports(id) on delete cascade,
  description text not null,
  owner       text,
  due_date    date,
  status      action_item_status not null default 'open',
  type        action_item_type   not null default 'vt',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ------------------------------------------------------------
-- questions_concerns
-- ------------------------------------------------------------
create table questions_concerns (
  id         uuid primary key default gen_random_uuid(),
  report_id  uuid not null references reports(id) on delete cascade,
  item       text not null,
  raised_by  text,
  response   text,
  status     question_status not null default 'open',
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- status_reports
-- ------------------------------------------------------------
create table status_reports (
  id          uuid primary key default gen_random_uuid(),
  report_id   uuid not null references reports(id) on delete cascade,
  workstream  text not null,
  status      workstream_status not null default 'on_track',
  notes       text,
  created_at  timestamptz not null default now()
);

-- ------------------------------------------------------------
-- followup_items
-- ------------------------------------------------------------
create table followup_items (
  id                  uuid primary key default gen_random_uuid(),
  report_id           uuid not null references reports(id) on delete cascade,
  item                text not null,
  owner               text,
  target_meeting_date date,
  created_at          timestamptz not null default now()
);

-- ------------------------------------------------------------
-- comments
-- ------------------------------------------------------------
create table comments (
  id         uuid primary key default gen_random_uuid(),
  report_id  uuid not null references reports(id) on delete cascade,
  author     text not null,
  body       text not null,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- Auto-update updated_at on reports and action_items
-- ------------------------------------------------------------
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger reports_updated_at
  before update on reports
  for each row execute function set_updated_at();

create trigger action_items_updated_at
  before update on action_items
  for each row execute function set_updated_at();
