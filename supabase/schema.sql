-- JourneyFX Workspace | V1.0.0
-- Initial Supabase migration for a NEW, empty application schema.
-- Run once as postgres in Supabase SQL Editor; no demo data or credentials.
-- Do not add journeyfx_private to the exposed API schemas.
-- Existing tables with the same names cause an error and rollback.

begin;

create schema journeyfx_private;
revoke all on schema journeyfx_private from public, anon, authenticated;
grant usage on schema journeyfx_private to authenticated;

-- 01. Account profiles and master data
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null check (char_length(btrim(full_name)) between 1 and 150),
  role text not null default 'pic' check (role in ('super_admin','management','pic')),
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.team_members (
  id text primary key check (char_length(btrim(id)) between 1 and 100),
  user_id uuid unique references public.profiles(id) on delete set null,
  name text not null check (char_length(btrim(name)) between 1 and 150),
  initials text not null check (char_length(btrim(initials)) between 1 and 10),
  division text not null check (char_length(btrim(division)) between 1 and 150),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.projects (
  id text primary key default ('PRJ-' || gen_random_uuid()::text)
    check (char_length(btrim(id)) between 1 and 100),
  name text not null check (char_length(btrim(name)) between 1 and 150),
  pic_id text not null references public.team_members(id) on delete restrict,
  description text not null default '' check (char_length(description) <= 3000),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 02. Tasks: text identifiers match the React model.
-- Overdue is derived from deadline in Asia/Jakarta, never stored as a status.
create table public.tasks (
  id text primary key default ('JFX-' || gen_random_uuid()::text)
    check (char_length(btrim(id)) between 1 and 100),
  title text not null check (char_length(btrim(title)) between 1 and 200),
  project_id text not null references public.projects(id) on delete restrict,
  pic_id text not null references public.team_members(id) on delete restrict,
  deadline date not null,
  priority text not null default 'Medium' check (priority in ('Urgent','High','Medium','Low')),
  status text not null default 'Pending' check (status in ('Pending','In Progress','In Review','Completed','Cancelled')),
  progress integer not null default 0 check (progress between 0 and 100),
  created_by uuid, -- Historical Auth ID, deliberately retained after account deletion.
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz,
  constraint task_status_progress_check check (
    (status = 'Pending' and progress = 0) or
    (status in ('In Progress','In Review') and progress between 0 and 99) or
    (status = 'Completed' and progress = 100) or
    status = 'Cancelled'
  ),
  constraint task_completion_timestamp_check check (
    (status = 'Completed') = (completed_at is not null)
  )
);

create table public.task_updates (
  id uuid primary key default gen_random_uuid(),
  task_id text not null references public.tasks(id) on delete cascade,
  actor_id uuid,
  old_status text,
  new_status text not null,
  old_progress integer,
  new_progress integer not null,
  created_at timestamptz not null default now()
);

create table public.task_comments (
  id uuid primary key default gen_random_uuid(),
  task_id text not null references public.tasks(id) on delete cascade,
  author_id uuid not null default auth.uid(),
  body text not null check (char_length(btrim(body)) between 1 and 3000),
  created_at timestamptz not null default now()
);

create table public.agendas (
  id text primary key default ('AG-' || gen_random_uuid()::text)
    check (char_length(btrim(id)) between 1 and 100),
  title text not null check (char_length(btrim(title)) between 1 and 200),
  date date not null,
  time time without time zone not null, -- Local WIB wall-clock time.
  location text not null default '',
  pic_id text references public.team_members(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null check (char_length(btrim(title)) between 1 and 200),
  message text not null default '' check (char_length(message) <= 3000),
  read_at timestamptz,
  created_at timestamptz not null default now()
);

-- Audit snapshots survive task deletion. No client write permissions.
create table public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid,
  table_name text not null,
  record_id text not null,
  action text not null check (action in ('INSERT','UPDATE','DELETE')),
  old_data jsonb,
  new_data jsonb,
  created_at timestamptz not null default now()
);

-- 03. Query indexes
create index team_members_active_idx on public.team_members (is_active);
create index projects_pic_idx on public.projects (pic_id);
create index tasks_pic_idx on public.tasks (pic_id);
create index tasks_project_idx on public.tasks (project_id);
create index tasks_status_deadline_idx on public.tasks (status, deadline);
create index tasks_open_deadline_idx on public.tasks (deadline)
  where status not in ('Completed','Cancelled');
create index task_updates_task_idx on public.task_updates (task_id, created_at desc);
create index task_comments_task_idx on public.task_comments (task_id, created_at);
create index agendas_date_idx on public.agendas (date, time);
create index agendas_pic_idx on public.agendas (pic_id);
create index notifications_user_idx on public.notifications (user_id, created_at desc);
create index activity_logs_record_idx on public.activity_logs (table_name, record_id, created_at desc);

-- 04. RLS helpers: read only the calling user's trusted profile.
-- SECURITY DEFINER avoids recursive profile policies; empty search_path.
create function journeyfx_private.workspace_role()
returns text language sql stable security definer set search_path = '' as $$
  select p.role from public.profiles p
  where p.id = auth.uid() and p.is_active;
$$;

create function journeyfx_private.is_manager()
returns boolean language sql stable security definer set search_path = '' as $$
  select coalesce(journeyfx_private.workspace_role() in ('super_admin','management'), false);
$$;

create function journeyfx_private.is_super_admin()
returns boolean language sql stable security definer set search_path = '' as $$
  select coalesce(journeyfx_private.workspace_role() = 'super_admin', false);
$$;

create function journeyfx_private.current_pic_id()
returns text language sql stable security definer set search_path = '' as $$
  select m.id from public.team_members m
  join public.profiles p on p.id = m.user_id
  where p.id = auth.uid() and p.is_active and m.is_active and p.role = 'pic';
$$;

-- 05. Task workflow and trusted timestamps
create function journeyfx_private.touch_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create function journeyfx_private.guard_task_write()
returns trigger language plpgsql set search_path = '' as $$
begin
  if tg_op = 'INSERT' then
    new.created_by := auth.uid();
    new.created_at := now();
    new.completed_at := null;
    if new.status = 'Completed' then
      new.completed_at := now();
    end if;
  else
    if new.id is distinct from old.id then
      raise exception 'Task ID cannot be changed' using errcode = '42501';
    end if;

    -- PICs may edit only status and progress on their own open tasks.
    -- RLS independently checks ownership on both old and new rows.
    if journeyfx_private.workspace_role() = 'pic' then
      if old.status in ('Completed','Cancelled')
         or new.status not in ('In Progress','In Review')
         or (to_jsonb(new) - array['status','progress']) is distinct from
            (to_jsonb(old) - array['status','progress']) then
        raise exception 'PIC may only update progress or submit an open task for review'
          using errcode = '42501';
      end if;
    end if;

    new.created_by := old.created_by;
    new.created_at := old.created_at;
    if new.status = 'Completed' then
      new.completed_at := case when old.status = 'Completed'
        then old.completed_at else now() end;
    else
      new.completed_at := null;
    end if;
  end if;
  new.updated_at := now();
  return new;
end;
$$;

create trigger tasks_guard_before_write before insert or update on public.tasks
for each row execute function journeyfx_private.guard_task_write();

create trigger profiles_touch before update on public.profiles
for each row execute function journeyfx_private.touch_updated_at();
create trigger members_touch before update on public.team_members
for each row execute function journeyfx_private.touch_updated_at();
create trigger projects_touch before update on public.projects
for each row execute function journeyfx_private.touch_updated_at();
create trigger agendas_touch before update on public.agendas
for each row execute function journeyfx_private.touch_updated_at();

-- 06. Automatic history and audit
create function journeyfx_private.record_task_update()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if tg_op = 'INSERT' then
    insert into public.task_updates(task_id, actor_id, new_status, new_progress)
    values (new.id, auth.uid(), new.status, new.progress);
  elsif old.status is distinct from new.status or old.progress is distinct from new.progress then
    insert into public.task_updates(task_id, actor_id, old_status, new_status, old_progress, new_progress)
    values (new.id, auth.uid(), old.status, new.status, old.progress, new.progress);
  end if;
  return new;
end;
$$;

create trigger tasks_history after insert or update on public.tasks
for each row execute function journeyfx_private.record_task_update();

create function journeyfx_private.record_activity()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  before_row jsonb;
  after_row jsonb;
begin
  if tg_op <> 'INSERT' then before_row := to_jsonb(old); end if;
  if tg_op <> 'DELETE' then after_row := to_jsonb(new); end if;
  insert into public.activity_logs(actor_id, table_name, record_id, action, old_data, new_data)
  values (auth.uid(), tg_table_name, coalesce(after_row->>'id', before_row->>'id'), tg_op, before_row, after_row);
  if tg_op = 'DELETE' then return old; end if;
  return new;
end;
$$;

create trigger profiles_audit after insert or update or delete on public.profiles
for each row execute function journeyfx_private.record_activity();
create trigger members_audit after insert or update or delete on public.team_members
for each row execute function journeyfx_private.record_activity();
create trigger projects_audit after insert or update or delete on public.projects
for each row execute function journeyfx_private.record_activity();
create trigger tasks_audit after insert or update or delete on public.tasks
for each row execute function journeyfx_private.record_activity();
create trigger agendas_audit after insert or update or delete on public.agendas
for each row execute function journeyfx_private.record_activity();

-- 07. Explicit privileges (RLS is a second, independent boundary).
revoke all on public.profiles, public.team_members, public.projects, public.tasks,
  public.task_updates, public.task_comments, public.agendas, public.notifications,
  public.activity_logs from public, anon, authenticated;

grant select on public.profiles, public.team_members, public.projects, public.tasks,
  public.task_updates, public.task_comments, public.agendas, public.notifications,
  public.activity_logs to authenticated;
grant insert, update, delete on public.profiles, public.team_members, public.projects,
  public.tasks, public.agendas to authenticated;
grant insert (task_id, body) on public.task_comments to authenticated;
grant delete on public.task_comments to authenticated;
grant insert (user_id, title, message) on public.notifications to authenticated;
grant update (read_at) on public.notifications to authenticated;

revoke all on all functions in schema journeyfx_private from public, anon, authenticated;
grant execute on function journeyfx_private.workspace_role(), journeyfx_private.is_manager(),
  journeyfx_private.is_super_admin(), journeyfx_private.current_pic_id() to authenticated;

-- 08. Enable RLS on all application tables
alter table public.profiles enable row level security;
alter table public.team_members enable row level security;
alter table public.projects enable row level security;
alter table public.tasks enable row level security;
alter table public.task_updates enable row level security;
alter table public.task_comments enable row level security;
alter table public.agendas enable row level security;
alter table public.notifications enable row level security;
alter table public.activity_logs enable row level security;

-- Profiles: own profile readable even if inactive, to show access-denied UI.
-- Only active Super Admins may assign/change roles or activation.
create policy profiles_read on public.profiles for select to authenticated
using (id = (select auth.uid()) or (select journeyfx_private.is_super_admin()));
create policy profiles_admin_write on public.profiles for all to authenticated
using ((select journeyfx_private.is_super_admin()))
with check ((select journeyfx_private.is_super_admin()));

-- Team and projects: managers maintain master data; PIC sees own member row.
create policy members_read on public.team_members for select to authenticated
using ((select journeyfx_private.is_manager()) or id = (select journeyfx_private.current_pic_id()));
create policy members_admin_write on public.team_members for all to authenticated
using ((select journeyfx_private.is_super_admin()))
with check ((select journeyfx_private.is_super_admin()));

create policy projects_read on public.projects for select to authenticated
using (
  (select journeyfx_private.is_manager()) or pic_id = (select journeyfx_private.current_pic_id())
  or exists (select 1 from public.tasks t where t.project_id = projects.id
    and t.pic_id = (select journeyfx_private.current_pic_id()))
);
create policy projects_manager_write on public.projects for all to authenticated
using ((select journeyfx_private.is_manager()))
with check ((select journeyfx_private.is_manager()));

-- Tasks: management can create, assign, approve, delete; PIC own task only.
create policy tasks_read on public.tasks for select to authenticated
using ((select journeyfx_private.is_manager()) or pic_id = (select journeyfx_private.current_pic_id()));
create policy tasks_insert on public.tasks for insert to authenticated
with check ((select journeyfx_private.is_manager()));
create policy tasks_update on public.tasks for update to authenticated
using ((select journeyfx_private.is_manager()) or pic_id = (select journeyfx_private.current_pic_id()))
with check ((select journeyfx_private.is_manager()) or pic_id = (select journeyfx_private.current_pic_id()));
create policy tasks_delete on public.tasks for delete to authenticated
using ((select journeyfx_private.is_manager()));

-- History and comments inherit task visibility through tasks RLS.
create policy task_updates_read on public.task_updates for select to authenticated
using (exists (select 1 from public.tasks t where t.id = task_updates.task_id));
create policy comments_read on public.task_comments for select to authenticated
using (exists (select 1 from public.tasks t where t.id = task_comments.task_id));
create policy comments_insert on public.task_comments for insert to authenticated
with check (author_id = (select auth.uid()) and exists
  (select 1 from public.tasks t where t.id = task_comments.task_id));
create policy comments_delete on public.task_comments for delete to authenticated
using ((select journeyfx_private.is_manager()));

-- Agendas: null PIC means shared agenda for active workspace users.
create policy agendas_read on public.agendas for select to authenticated
using ((select journeyfx_private.is_manager()) or
  ((select journeyfx_private.current_pic_id()) is not null and
    (pic_id is null or pic_id = (select journeyfx_private.current_pic_id()))));
create policy agendas_manager_write on public.agendas for all to authenticated
using ((select journeyfx_private.is_manager()))
with check ((select journeyfx_private.is_manager()));

-- Notifications: only the active recipient can read/mark read.
create policy notifications_read on public.notifications for select to authenticated
using (user_id = (select auth.uid()) and (select journeyfx_private.workspace_role()) is not null);
create policy notifications_update on public.notifications for update to authenticated
using (user_id = (select auth.uid()) and (select journeyfx_private.workspace_role()) is not null)
with check (user_id = (select auth.uid()) and (select journeyfx_private.workspace_role()) is not null);
create policy notifications_insert on public.notifications for insert to authenticated
with check ((select journeyfx_private.is_manager()));

create policy activity_logs_read on public.activity_logs for select to authenticated
using ((select journeyfx_private.is_manager()));

commit;

-- 09. Setup notes (not executed)
-- Create Auth user in Supabase Dashboard, disable public signup, then insert
-- the first admin as postgres using the actual Auth UUID:
-- insert into public.profiles(id, full_name, role, is_active)
-- values ('<AUTH_USER_UUID>'::uuid, 'JourneyFX Administrator', 'super_admin', true);
-- Each PIC needs an active profile(role='pic') and active team_members row
-- with user_id set to that profile UUID. No automatic activation on signup.
-- Map database project_id/pic_id to React projectId/picId.
-- PIC updates must send only {status, progress}; no full-row replacement.
-- Overdue: status not in ('Completed','Cancelled') AND
-- deadline < (now() at time zone 'Asia/Jakarta')::date.
-- Reports use completed_at for current completion timestamp, not full history.
-- Task deletion cascades to comments/history; activity_logs retains task snapshot.
-- Do not use client-side local storage as a production data source.
