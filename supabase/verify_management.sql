-- Read-only verification after migration
SELECT m.id, m.name, m.organization_role, m.division,
       m.is_active, cardinality(m.jobdesk) AS jobdesk_count,
       m.education_responsibility,
       p.id AS project_id, p.name AS project_name,
       p.is_active AS project_active
FROM public.team_members m
LEFT JOIN public.projects p ON p.pic_id = m.id
ORDER BY m.is_active DESC, m.name, p.id;
