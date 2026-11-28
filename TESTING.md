# Testing and release gates — V2.2

## Executed locally in authoring environment

| Check | Result |
|---|---|
| Node 22.16.0, npm 10.9.2 | Available |
| Node unit tests | 15 passed, 0 failed |
| TypeScript parser/transpile & local imports | 17 files, 0 errors |
| package.json / tsconfig.json JSON parse | PASS |
| netlify.toml parse | PASS |
| Original logo/banner and extracted robot WebP assets | 10 images decoded/verified |
| npm install | Blocked / timed out; registry hostname not resolved |
| Full tsc --noEmit | Blocked: TS2688 missing node and vite/client types |
| vite build | Blocked: vite not installed |
| Browser E2E / actual Supabase Auth/RLS / file exports | Not executed |
| npm audit / transitive lockfile | Not executed / not generated |

Unit tests cover date validity, WIB boundary, overdue, KPI math, cancelled tasks, task status/progress validation, restricted PIC patch, role guard, filtering, calendar and agenda validation. Syntax checks are not typechecking, nor do they test database policy behavior.

## Run on a network-enabled computer or CI

```bash
npm install
npm run verify
npm audit --omit=dev --audit-level=high
node scripts/check-source.cjs
```

Review high/critical vulnerabilities and regenerate/commit lockfile; do not blindly apply forced dependency changes. If an error appears, retain the actual log and resolve it before merging or deployment.

## Acceptance checklist (test database and separate test accounts)

- [ ] Missing URL/key or placeholder key shows configuration error; no data rendered.
- [ ] Direct links `/tasks`, `/reports`, `/activity` redirect unauthenticated users to `/login`.
- [ ] Valid Super Admin login, reload session, sign out, browser back does not reveal workspace.
- [ ] Inactive/missing profile denied, unknown role denied. Change profile role, refresh, verify previous data no longer accessible.
- [ ] Manager creates task, changes title/assignment/deadline/priority/progress, submits review, completes; reload confirms persistence. Create task from UI; never seed demo tasks into production.
- [ ] Two concurrent edits to same task: stale version rejected; refresh then retry.
- [ ] Manager can delete test task after confirmation; audit survives, comments/updates cascade as designed.
- [ ] PIC only reads their own member row, visible projects, own tasks, and permitted agenda. Cannot access other PIC's records via direct API; cannot create/delete tasks, reassign, change deadline, mark Completed, change role, read audit logs. Test both UI and direct API using separate PIC JWT (do not use postgres or service_role, which bypass restrictions).
- [ ] Anonymous API cannot read any application tables; inactive profile cannot access operational rows. Verify explicit grants and RLS policies on all nine tables.
- [ ] Management and Super Admin can access allowed reports; PIC report only own visible data.
- [ ] Calendar: create/update/delete test agenda in manager account, confirm shared/personal visibility for PIC and WIB date/time.
- [ ] Report filters work, Excel opens with valid worksheets, PDF opens and paginates, counts match UI, print works. Test unusual characters and long task names; built-in PDF font may not support all Unicode glyphs.
- [ ] Dashboard statistics match database after refresh; new task visible on second device after refresh; no simulated data.
- [ ] Brand images load, dark/light mode and mobile at 390px work, dialogs close with keyboard, global search functions.
- [ ] No unexpected browser console errors, 401/403 responses or CSP violations in intended operations.
- [ ] Notification inbox correctly marks only own notifications read. No automatic notifications expected.
- [ ] Netlify production build success and SPA deep links resolve. Preview deployment with no test credentials fails closed.
- [ ] Only then approve production use and add real management data.

## Read-only SQL checks

Run `supabase/verify_management.sql` in Supabase SQL Editor Database mode. For policy inventory, run:

```sql
select tablename, policyname, cmd, roles
from pg_catalog.pg_policies
where schemaname='public'
order by tablename, policyname;
```

RLS on and policy inventory do not prove behavior. Real test-account API calls are required. Do not repeat the already-applied schema or migration on existing Journey-Management.
