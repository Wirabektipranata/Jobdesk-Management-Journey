# JourneyFX Enterprise Workspace V2.2

Internal management system — React 18, TypeScript, Vite, Supabase, Netlify. Official JourneyFX logo/banner and robot assets from the supplied branding. No demo task data in the authenticated application.

## Existing Journey-Management project (important)

Your screenshots show that the 9 tables, RLS activation, Super Admin, and V2.2 master data migration are already present. **Do not run `supabase/schema.sql` or the migration again on that database.** `supabase/verify_management.sql` is read-only. The SQL files are retained for reproducibility and future new databases, not automatic deployment. This app does not run migrations on startup.

Expected master data: Mas Kus (Lead MIB Broker, PRJ-007), Ara (PRJ-003), Jimmy (PRJ-001), Ari (PRJ-004), Dephri (internal ID `depri`, PRJ-002), Nathan (PRJ-005). Five PICs are organizational peers. Zuzu / PRJ-006 remain archived. The organizational role is not the security role. The Super Admin profile is separate. Tasks are initially empty. No PIC Auth accounts are included or created automatically.

## Upgrade existing repository safely

1. Keep a backup/tag of the current repository. Make it private if it contains internal material. Remove any real credentials from the repository and rotate exposed secret credentials.
2. Extract ZIP. Copy the **contents** of the extracted folder (including `.github`, `.gitignore`, `.env.example`) into the existing working tree. Do not delete `.git`. Remove legacy source files not present in the new tree (in particular `src/services/taskStore.ts`, duplicate `vite-env.d.ts`, old pages and configs) to avoid stale TypeScript checks. This version uses plain CSS instead of Tailwind; remove old `postcss.config.js` and `tailwind.config.js` from the working tree. Do not retain an old lockfile incompatible with the new package.json; regenerate it. Do not upload `node_modules`, `dist`, or `.env`.
3. Use a new branch, e.g. `upgrade/v2.2`, first. With Node 22 and npm >=10 run:

```bash
npm install
npm run verify
npm audit --omit=dev --audit-level=high
```

4. Review and fix any reported error or security finding before release. Commit the newly generated `package-lock.json` along with the files. GitHub Actions runs typecheck, tests, build and runtime dependency audit. There is no fabricated lockfile in this ZIP; npm registry was unavailable in the authoring environment.
5. Test locally with a separate test Supabase project and `.env.local` copied from `.env.example`. The local app fails closed if credentials are missing/invalid. Never use `service_role`, `sb_secret_...`, a database password, or a privileged backend credential in a `VITE_` variable.
6. On Netlify project `journeyfx-workspace`, keep existing production variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (actual publishable key). Additional variables are retained for compatibility; notification and export feature flags are implemented. Demo mode is deliberately not supported, regardless of the flag. Other branding/timezone values are fixed by design to JourneyFX V2.2 / WIB. No database connection is configured for deploy previews unless you provide a separate test project. Netlify build command is `npm run verify`, output `dist`, Node 22. No additional Tailwind setup is needed.
7. After branch CI passes and test environment security checks pass, merge to main and deploy. In Supabase Authentication > URL Configuration set Site URL to your actual production Netlify URL. No OAuth, magic-link or reset-password flow is included. Keep public signup and anonymous sign-in disabled.
8. Test production with Super Admin before inviting PICs. Check the deployment log and follow TESTING.md. A green build is not proof of RLS security.

## Features

- Login using Supabase password auth, session validation via getUser, active profile and role checks, protected application routes, local-session logout. RLS and DB triggers remain the actual authorization boundary.
- Live reads of all nine-table schema data as permitted by the current account; task detail loads comments and progress history. Explicit refresh and visibility-change refresh, not realtime subscriptions. No local task cache; browser stores Supabase auth session and theme preference only.
- Dashboard with completion rate, overdue derived using WIB date, project progress, priority tasks and agenda. Cancelled tasks excluded from completion denominator.
- Tasks list/Kanban, search and filters, create/edit/delete for Management and Super Admin; PIC can only change open task status to In Progress or In Review and update progress. No drag-and-drop. Approval center uses status In Review and manager edits. History/comment deletion on task deletion follows original schema; confirm before deletion. Optimistic concurrency checks compare updated_at.
- Team & PIC from migrated master data, jobdesk, education responsibility, projects; archived rows retained. Account/master data administration remains in Supabase Dashboard, not in frontend.
- Calendar with month view and agenda CRUD for managers; PIC read as allowed by RLS.
- Filtered reports (deadline-based, not completion-date-based) and Excel/PDF exports, print. Export reflects only RLS-visible records. Notification inbox reads existing rows and marks them read; no automatic notification creation or messaging service included.
- Journey Assistant is rule-based navigation and reminders (not an LLM), global search, responsive sidebar, dark/light theme, official images. Fonts fall back to system fonts when Montserrat/Inter are not installed.

## Scope / limitations

This is a full source-code package, not a verified production deployment. Offline syntax checks and unit tests are recorded in TESTING.md. Full dependency installation, real typecheck, Vite build, browser E2E, actual Supabase login/CRUD/RLS and file exports must still be tested in an environment with dependencies and authorized test accounts. No live changes to GitHub, Netlify or Supabase were performed. Do not enter sensitive business data until acceptance tests pass. Supabase RLS activation was seen in prior screenshots, but policy behavior must be independently tested.
