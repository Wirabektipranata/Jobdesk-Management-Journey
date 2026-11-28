-- JourneyFX Workspace V2.2 | Master Data Migration
-- Run in Supabase SQL Editor (Database) as postgres.
-- Existing tables, Auth accounts, user_id links and historical tasks are retained.
BEGIN;

-- Prevent concurrent edits during the migration.
LOCK TABLE public.profiles, public.team_members, public.projects,
  public.tasks, public.agendas IN SHARE ROW EXCLUSIVE MODE;

-- Stop rather than silently reassign work or deactivate an active login.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM public.tasks
    WHERE status NOT IN ('Completed', 'Cancelled')
      AND (pic_id = 'zuzu' OR project_id = 'PRJ-006'
           OR (project_id = 'PRJ-004' AND pic_id = 'kus'))
  ) THEN
    RAISE EXCEPTION 'Migration stopped: review open tasks for Zuzu, PRJ-006 or Mas Kus in PRJ-004 first.';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.agendas
    WHERE pic_id = 'zuzu' AND date >= (now() AT TIME ZONE 'Asia/Jakarta')::date
  ) THEN
    RAISE EXCEPTION 'Migration stopped: review upcoming agendas assigned to Zuzu first.';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.team_members m
    JOIN public.profiles p ON p.id = m.user_id
    WHERE m.id = 'zuzu' AND p.is_active
  ) THEN
    RAISE EXCEPTION 'Migration stopped: Zuzu has an active linked login; review account access separately.';
  END IF;

  IF EXISTS (SELECT 1 FROM public.projects WHERE id = 'PRJ-007' AND pic_id <> 'kus')
    OR EXISTS (SELECT 1 FROM public.team_members WHERE id = 'ari' AND lower(btrim(name)) <> 'ari') THEN
    RAISE EXCEPTION 'Migration stopped: Ari or PRJ-007 ID already belongs to another record.';
  END IF;
END;
$$;

-- Organization metadata is separate from profiles.role (application access).
ALTER TABLE public.team_members
  ADD COLUMN IF NOT EXISTS organization_role text,
  ADD COLUMN IF NOT EXISTS jobdesk text[] NOT NULL DEFAULT ARRAY[]::text[],
  ADD COLUMN IF NOT EXISTS education_responsibility text NOT NULL DEFAULT '';

INSERT INTO public.team_members
  (id, name, initials, division, organization_role, jobdesk, education_responsibility, is_active)
VALUES
  ('ara', 'Ara', 'AR', 'Administration & Finance', 'PIC',
   ARRAY['Administrasi', 'Database anggota', 'Moderasi', 'Keuangan',
         'Rekap & laporan keuangan komunitas', 'Pengarsipan dokumen & data'],
   'Tata kelola & keuangan komunitas', true),
  ('jimmy', 'Jimmy', 'JM', 'Coordination & Planning', 'PIC',
   ARRAY['Perencanaan', 'Koordinasi', 'Meeting & notulen', 'Komunikasi MIB',
         'Moderator Social Media', 'Pembantu Admin Chat (Customer Service)'],
   'Aturan, etika & tata tertib komunitas', true),
  ('ari', 'Ari', 'AI', 'Education & Community', 'PIC',
   ARRAY['Edukasi', 'Live streaming', 'Trading bersama', 'Event',
         'Kelas & materi pemula', 'Review & jurnal trading mingguan'],
   'Koordinator utama kurikulum trading', true),
  ('depri', 'Dephri', 'DP', 'Client & Onboarding', 'PIC',
   ARRAY['Pelayanan anggota', 'Registrasi', 'Follow-up',
         'Project Website EA, coding & pengembangan',
         'Welcome & pendampingan anggota baru', 'Survei & masukan anggota'],
   'Onboarding, platform & cara bergabung', true),
  ('nathan', 'Nathan', 'NT', 'Digital & Marketing', 'PIC',
   ARRAY['AI Bot', 'VPS', 'Website', 'Workspace', 'Konten', 'Marketing'],
   'Tools, bot & teknologi untuk trader', true),
  ('kus', 'Mas Kus', 'MK', 'Lead MIB Broker', 'Lead MIB Broker',
   ARRAY['Koordinasi broker', 'Kemitraan', 'Arahan terkait MIB'], '', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  initials = EXCLUDED.initials,
  division = EXCLUDED.division,
  organization_role = EXCLUDED.organization_role,
  jobdesk = EXCLUDED.jobdesk,
  education_responsibility = EXCLUDED.education_responsibility,
  is_active = EXCLUDED.is_active
WHERE (team_members.name, team_members.initials, team_members.division,
       team_members.organization_role, team_members.jobdesk,
       team_members.education_responsibility, team_members.is_active)
  IS DISTINCT FROM
      (EXCLUDED.name, EXCLUDED.initials, EXCLUDED.division,
       EXCLUDED.organization_role, EXCLUDED.jobdesk,
       EXCLUDED.education_responsibility, EXCLUDED.is_active);

-- Retain old IDs and references. PRJ-004 is the existing community project.
INSERT INTO public.projects (id, name, pic_id, description, is_active)
VALUES
  ('PRJ-001', 'Coordination & Planning', 'jimmy', 'Perencanaan, koordinasi, meeting, notulen dan komunikasi MIB.', true),
  ('PRJ-002', 'Client & Onboarding', 'depri', 'Pelayanan, registrasi, follow-up, pengembangan website EA dan pendampingan anggota.', true),
  ('PRJ-003', 'Administration & Finance', 'ara', 'Administrasi, database, moderasi, keuangan dan pengarsipan.', true),
  ('PRJ-004', 'Education & Community', 'ari', 'Edukasi, live streaming, trading bersama, event, kelas pemula dan review jurnal.', true),
  ('PRJ-005', 'Digital & Marketing', 'nathan', 'AI Bot, VPS, website, workspace, konten dan marketing.', true),
  ('PRJ-007', 'Broker & MIB Coordination', 'kus', 'Koordinasi broker, kemitraan dan arahan terkait MIB.', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  pic_id = EXCLUDED.pic_id,
  description = EXCLUDED.description,
  is_active = EXCLUDED.is_active
WHERE (projects.name, projects.pic_id, projects.description, projects.is_active)
  IS DISTINCT FROM (EXCLUDED.name, EXCLUDED.pic_id, EXCLUDED.description, EXCLUDED.is_active);

-- Archive old master data without deleting rows or Auth accounts.
UPDATE public.projects SET is_active = false
WHERE id = 'PRJ-006' AND is_active;
UPDATE public.team_members SET is_active = false
WHERE id = 'zuzu' AND is_active;

COMMIT;
