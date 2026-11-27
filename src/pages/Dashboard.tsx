// ==================================================
// JOURNEYFX WORKSPACE
// Internal Jobdesk & Project Management System
// Version 1.0.0
// Executive Management Dashboard
// ==================================================

import { Link } from 'react-router-dom';
import { useWorkspaceTasks } from '../services/taskStore';

import {
  ClipboardList,
  CheckCircle2,
  Clock3,
  AlertCircle,
  CalendarDays,
  Users,
  Layers3,
  ArrowUpRight,
  ChevronRight,
  BarChart3,
  ListChecks,
} from 'lucide-react';


// ==================================================
// 01. TYPE DEFINITIONS
// ==================================================

export type TaskStatus =
  | 'Pending'
  | 'In Progress'
  | 'In Review'
  | 'Completed'
  | 'Cancelled';

export type TaskPriority =
  | 'Urgent'
  | 'High'
  | 'Medium'
  | 'Low';

export interface Task {
  id: string;
  title: string;
  projectId: string;
  picId: string;
  deadline: string;
  priority: TaskPriority;
  status: TaskStatus;
  progress: number;
}

export interface TeamMember {
  id: string;
  name: string;
  initials: string;
  division: string;
}

export interface Project {
  id: string;
  name: string;
  picId: string;
  description: string;
}

export interface Agenda {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  picId: string;
}


// ==================================================
// 02. DATE UTILITIES
// ==================================================

export function getJakartaDate(
  offsetDays = 0
): string {

  const parts = new Intl.DateTimeFormat(
    'en-CA',
    {
      timeZone: 'Asia/Jakarta',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }
  ).formatToParts(new Date());

  const year = parts.find(
    (part) => part.type === 'year'
  )?.value;

  const month = parts.find(
    (part) => part.type === 'month'
  )?.value;

  const day = parts.find(
    (part) => part.type === 'day'
  )?.value;

  const date = new Date(
    `${year}-${month}-${day}T00:00:00Z`
  );

  date.setUTCDate(
    date.getUTCDate() + offsetDays
  );

  return date.toISOString().slice(0, 10);
}

export function formatDate(
  date: string
): string {
  return new Intl.DateTimeFormat(
    'id-ID',
    {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      timeZone: 'Asia/Jakarta',
    }
  ).format(new Date(`${date}T00:00:00+07:00`));
}


// ==================================================
// 03. TEAM MEMBERS
// DEMONSTRATION DATA
// ==================================================

export const TEAM_MEMBERS: TeamMember[] = [

  {
    id: 'jimmy',
    name: 'Jimmy',
    initials: 'JM',
    division: 'Coordination & IB',
  },

  {
    id: 'depri',
    name: 'Depri',
    initials: 'DP',
    division: 'Client & Onboarding',
  },

  {
    id: 'ara',
    name: 'Ara',
    initials: 'AR',
    division: 'Administration & Database',
  },

  {
    id: 'kus',
    name: 'Mas Kus',
    initials: 'MK',
    division: 'Community & Event',
  },

  {
    id: 'nathan',
    name: 'Nathan',
    initials: 'NT',
    division: 'Content & Marketing',
  },

  {
    id: 'zuzu',
    name: 'Zuzu',
    initials: 'ZZ',
    division: 'Finance & Quality',
  },

];


// ==================================================
// 04. PROJECT DATA
// ==================================================

export const DEMO_PROJECTS: Project[] = [

  {
    id: 'PRJ-001',
    name: 'Operational Management',
    picId: 'jimmy',
    description:
      'Koordinasi, evaluasi, dan pengembangan operasional tim.',
  },

  {
    id: 'PRJ-002',
    name: 'Client & Onboarding',
    picId: 'depri',
    description:
      'Administrasi onboarding dan pelayanan client.',
  },

  {
    id: 'PRJ-003',
    name: 'Administration & Database',
    picId: 'ara',
    description:
      'Pengelolaan database, dokumentasi, dan administrasi.',
  },

  {
    id: 'PRJ-004',
    name: 'Community & Event',
    picId: 'kus',
    description:
      'Pengembangan komunitas, webinar, dan gathering.',
  },

  {
    id: 'PRJ-005',
    name: 'Content & Marketing',
    picId: 'nathan',
    description:
      'Pengembangan branding dan konten edukasi.',
  },

  {
    id: 'PRJ-006',
    name: 'Finance & Quality',
    picId: 'zuzu',
    description:
      'Monitoring anggaran dan evaluasi kualitas operasional.',
  },

];


// ==================================================
// 05. TASK DATA
// ==================================================

export const DEMO_TASKS: Task[] = [

  {
    id: 'JFX-001',
    title: 'Evaluasi target mingguan',
    projectId: 'PRJ-001',
    picId: 'jimmy',
    deadline: getJakartaDate(2),
    priority: 'High',
    status: 'In Progress',
    progress: 75,
  },

  {
    id: 'JFX-002',
    title: 'Koordinasi internal management',
    projectId: 'PRJ-001',
    picId: 'jimmy',
    deadline: getJakartaDate(-1),
    priority: 'Medium',
    status: 'Completed',
    progress: 100,
  },

  {
    id: 'JFX-003',
    title: 'Follow-up onboarding client',
    projectId: 'PRJ-002',
    picId: 'depri',
    deadline: getJakartaDate(-2),
    priority: 'High',
    status: 'In Progress',
    progress: 60,
  },

  {
    id: 'JFX-004',
    title: 'Penyusunan checklist onboarding',
    projectId: 'PRJ-002',
    picId: 'depri',
    deadline: getJakartaDate(1),
    priority: 'Medium',
    status: 'Completed',
    progress: 100,
  },

  {
    id: 'JFX-005',
    title: 'Validasi database member',
    projectId: 'PRJ-003',
    picId: 'ara',
    deadline: getJakartaDate(-1),
    priority: 'Urgent',
    status: 'Pending',
    progress: 0,
  },

  {
    id: 'JFX-006',
    title: 'Review dokumentasi operasional',
    projectId: 'PRJ-003',
    picId: 'ara',
    deadline: getJakartaDate(1),
    priority: 'Medium',
    status: 'In Review',
    progress: 90,
  },

  {
    id: 'JFX-007',
    title: 'Persiapan coffee gathering',
    projectId: 'PRJ-004',
    picId: 'kus',
    deadline: getJakartaDate(4),
    priority: 'High',
    status: 'In Progress',
    progress: 40,
  },

  {
    id: 'JFX-008',
    title: 'Penyusunan agenda webinar',
    projectId: 'PRJ-004',
    picId: 'kus',
    deadline: getJakartaDate(6),
    priority: 'Medium',
    status: 'Pending',
    progress: 0,
  },

  {
    id: 'JFX-009',
    title: 'Publikasi konten edukasi',
    projectId: 'PRJ-005',
    picId: 'nathan',
    deadline: getJakartaDate(0),
    priority: 'Medium',
    status: 'Completed',
    progress: 100,
  },

  {
    id: 'JFX-010',
    title: 'Produksi konten trading bersama',
    projectId: 'PRJ-005',
    picId: 'nathan',
    deadline: getJakartaDate(3),
    priority: 'High',
    status: 'In Progress',
    progress: 80,
  },

  {
    id: 'JFX-011',
    title: 'Review anggaran kegiatan',
    projectId: 'PRJ-006',
    picId: 'zuzu',
    deadline: getJakartaDate(-3),
    priority: 'High',
    status: 'In Progress',
    progress: 60,
  },

  {
    id: 'JFX-012',
    title: 'Penyusunan laporan biaya',
    projectId: 'PRJ-006',
    picId: 'zuzu',
    deadline: getJakartaDate(0),
    priority: 'Medium',
    status: 'Completed',
    progress: 100,
  },

];


// ==================================================
// 06. TEAM AGENDA
// ==================================================

export const DEMO_AGENDA: Agenda[] = [

  {
    id: 'AG-001',
    title: 'Management Weekly Meeting',
    date: getJakartaDate(1),
    time: '19:00 WIB',
    location: 'Online Meeting',
    picId: 'jimmy',
  },

  {
    id: 'AG-002',
    title: 'Webinar Edukasi Forex',
    date: getJakartaDate(3),
    time: '20:00 WIB',
    location: 'Online Webinar',
    picId: 'kus',
  },

  {
    id: 'AG-003',
    title: 'Trading Together',
    date: getJakartaDate(4),
    time: '19:30 WIB',
    location: 'Community Session',
    picId: 'nathan',
  },

  {
    id: 'AG-004',
    title: 'JourneyFX Coffee Gathering',
    date: getJakartaDate(6),
    time: '18:30 WIB',
    location: 'Sidoarjo',
    picId: 'kus',
  },

];


// ==================================================
// 07. SHARED UTILITIES
// ==================================================

export function getMember(picId: string) {
  return TEAM_MEMBERS.find(
    (member) => member.id === picId
  );
}

export function isOverdue(
  task: Task
): boolean {

  return (
    task.status !== 'Completed' &&
    task.status !== 'Cancelled' &&
    task.deadline < getJakartaDate()
  );
}

export function getDisplayStatus(
  task: Task
): string {

  return isOverdue(task)
    ? 'Overdue'
    : task.status;
}

export function getStatusClass(
  status: string
): string {

  switch (status) {

    case 'Pending':
      return 'status-pending';

    case 'In Progress':
      return 'status-progress';

    case 'In Review':
      return 'status-review';

    case 'Completed':
      return 'status-completed';

    case 'Overdue':
      return 'status-overdue';

    case 'Cancelled':
      return 'status-cancelled';

    default:
      return 'status-pending';

  }
}

export function getProjectProgress(
  projectId: string,
  tasks: Task[]
): number {

  const projectTasks = tasks.filter(
    (task) =>
      task.projectId === projectId &&
      task.status !== 'Cancelled'
  );

  if (projectTasks.length === 0) {
    return 0;
  }

  const totalProgress = projectTasks.reduce(
    (total, task) =>
      total + Math.min(
        100,
        Math.max(0, task.progress)
      ),
    0
  );

  return Math.round(
    totalProgress / projectTasks.length
  );
}


// ==================================================
// 08. REUSABLE STAT CARD
// ==================================================

interface StatCardProps {
  label: string;
  value: number | string;
  description: string;
  icon: typeof ClipboardList;
  color?: string;
}

function StatCard({
  label,
  value,
  description,
  icon: Icon,
  color = '#D1D5DB',
}: StatCardProps) {

  return (

    <div className="stat-card">

      <div className="
        flex items-center
        justify-between gap-3
      ">

        <span className="stat-label">
          {label}
        </span>

        <div
          className="stat-icon"
          style={{ color }}
        >
          <Icon size={21} />
        </div>

      </div>

      <div
        className="stat-value"
        style={{ color }}
      >
        {value}
      </div>

      <p className="stat-description">
        {description}
      </p>

    </div>

  );
}


// ==================================================
// 09. REUSABLE PROGRESS BAR
// ==================================================

function ProgressBar({
  value,
}: {
  value: number;
}) {

  const progress = Math.min(
    100,
    Math.max(0, value)
  );

  return (

    <div
      className="progress-track"
      role="progressbar"
      aria-label="Progres pekerjaan"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progress}
    >

      <div
        className={`
          progress-fill
          ${progress === 100 ? 'completed' : ''}
        `}
        style={{
          width: `${progress}%`,
        }}
      />

    </div>

  );
}


// ==================================================
// 10. MAIN DASHBOARD
// ==================================================

export default function Dashboard() {

  // Single demonstration data source.
  // Replace with shared database data later.

  const tasks = useWorkspaceTasks(DEMO_TASKS);

  const validTasks = tasks.filter(
    (task) => task.status !== 'Cancelled'
  );

  const totalTasks = validTasks.length;

  const completedTasks = validTasks.filter(
    (task) => task.status === 'Completed'
  ).length;

  const overdueTasks = validTasks.filter(
    isOverdue
  ).length;

  const activeTasks = validTasks.filter(
    (task) =>
      task.status !== 'Completed' &&
      !isOverdue(task)
  ).length;

  const completionRate =
    totalTasks > 0
      ? Math.round(
          completedTasks / totalTasks * 100
        )
      : 0;

  const priorityOrder: Record<
    TaskPriority,
    number
  > = {
    Urgent: 0,
    High: 1,
    Medium: 2,
    Low: 3,
  };

  const priorityTasks = validTasks
    .filter(
      (task) => task.status !== 'Completed'
    )
    .sort(
      (a, b) =>
        Number(isOverdue(b)) -
        Number(isOverdue(a)) ||
        priorityOrder[a.priority] -
        priorityOrder[b.priority] ||
        a.deadline.localeCompare(b.deadline)
    )
    .slice(0, 5);

  const upcomingAgenda = [...DEMO_AGENDA]
    .filter(
      (agenda) =>
        agenda.date >= getJakartaDate()
    )
    .sort(
      (a, b) =>
        a.date.localeCompare(b.date)
    );

  const today = new Intl.DateTimeFormat(
    'id-ID',
    {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'Asia/Jakarta',
    }
  ).format(new Date());

  return (

    <div className="
      workspace-container
      section-stack
    ">

      {/* ==========================================
          DASHBOARD HEADER
          ========================================== */}

      <div className="page-header">

        <div>

          <p className="eyebrow mb-2">
            Executive Management
          </p>

          <h2 className="page-title">
            Management Dashboard
          </h2>

          <p className="page-description">
            Monitoring operasional, pekerjaan,
            proyek, dan kinerja tim JourneyFX.
          </p>

          <div className="
            mt-3 flex items-center gap-2
            text-xs text-workspace-muted
          ">
            <CalendarDays size={15} />
            {today} · WIB
          </div>

        </div>

        <div className="page-actions">

          <Link
            to="/report"
            className="btn-secondary"
          >
            <BarChart3 size={17} />
            View Report
          </Link>

          <Link
            to="/jobs-project"
            className="btn-primary"
          >
            <ClipboardList size={17} />
            Manage Tasks
          </Link>

        </div>

      </div>


      {/* ==========================================
          WELCOME BANNER
          ========================================== */}

      <section className="
        relative overflow-hidden
        rounded-panel
        border border-workspace-border
        bg-premium-card
        p-6 sm:p-8
      ">

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute -right-12 -top-16
            h-64 w-64 rounded-full
            bg-white/5 blur-3xl
          "
        />

        <div className="
          relative flex flex-col
          gap-6 lg:flex-row
          lg:items-center
          lg:justify-between
        ">

          <div>

            <p className="eyebrow">
              JourneyFX Internal Workspace
            </p>

            <h2 className="
              mt-3 text-2xl
              font-bold tracking-tight
              sm:text-3xl
            ">
              Welcome to JourneyFX Workspace
            </h2>

            <p className="
              mt-3 max-w-xl
              text-sm leading-relaxed
              text-workspace-muted
            ">
              Kelola setiap pekerjaan dengan
              terstruktur, pantau tanggung jawab
              tim, dan tingkatkan kualitas
              operasional secara berkelanjutan.
            </p>

            <p className="
              mt-5 text-sm
              font-medium text-metallic
            ">
              One Team. One Workspace.
              One Direction.
            </p>

          </div>

          <div className="
            flex h-24 w-24 shrink-0
            items-center justify-center
            rounded-premium
            border border-workspace-border
            bg-workspace-background
            shadow-metallic
          ">

            <span className="
              text-6xl font-black
              italic text-metallic
            ">
              J.
            </span>

          </div>

        </div>

      </section>


      {/* ==========================================
          KEY PERFORMANCE INDICATORS
          ========================================== */}

      <section className="dashboard-grid">

        <StatCard
          label="Total Tasks"
          value={totalTasks}
          description="Seluruh tugas selain dibatalkan"
          icon={ClipboardList}
        />

        <StatCard
          label="Completed"
          value={completedTasks}
          description="Pekerjaan telah diselesaikan"
          icon={CheckCircle2}
          color="#34D399"
        />

        <StatCard
          label="Active Tasks"
          value={activeTasks}
          description="Tugas aktif belum terlambat"
          icon={Clock3}
          color="#60A5FA"
        />

        <StatCard
          label="Overdue"
          value={overdueTasks}
          description="Pekerjaan melewati deadline"
          icon={AlertCircle}
          color="#F87171"
        />

      </section>


      {/* ==========================================
          PERFORMANCE OVERVIEW
          ========================================== */}

      <section className="
        grid grid-cols-1 gap-5
        xl:grid-cols-3
      ">

        <div className="workspace-card">

          <div className="panel-header">

            <div>
              <h3 className="section-title">
                Task Completion
              </h3>

              <p className="section-description">
                Tingkat penyelesaian pekerjaan
              </p>
            </div>

            <CheckCircle2
              size={20}
              className="text-workspace-muted"
            />

          </div>

          <div className="
            flex flex-col items-center
            justify-center py-5
          ">

            <div className="
              relative h-40 w-40
            ">

              <svg
                viewBox="0 0 120 120"
                className="h-full w-full"
                aria-hidden="true"
              >

                <circle
                  cx="60"
                  cy="60"
                  r="48"
                  fill="none"
                  stroke="#30353C"
                  strokeWidth="10"
                />

                <circle
                  cx="60"
                  cy="60"
                  r="48"
                  fill="none"
                  stroke="#D1D5DB"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={
                    `${completionRate * 3.01593} 301.593`
                  }
                  transform="rotate(-90 60 60)"
                />

              </svg>

              <div className="
                absolute inset-0
                flex flex-col items-center
                justify-center
              ">

                <span className="
                  text-3xl font-bold
                  numeric-value
                ">
                  {completionRate}%
                </span>

                <span className="
                  text-xs text-workspace-muted
                ">
                  Completion
                </span>

              </div>

            </div>

            <p className="
              mt-5 text-center text-sm
              text-workspace-muted
            ">
              {completedTasks} dari {totalTasks}
              {' '}pekerjaan diselesaikan
            </p>

          </div>

        </div>


        {/* TASK DISTRIBUTION */}

        <div className="
          workspace-card xl:col-span-2
        ">

          <div className="panel-header">

            <div>

              <h3 className="section-title">
                Task Distribution
              </h3>

              <p className="section-description">
                Distribusi status seluruh pekerjaan
              </p>

            </div>

            <BarChart3
              size={20}
              className="text-workspace-muted"
            />

          </div>

          <div className="space-y-5 py-2">

            {[
              {
                name: 'Completed',
                value: completedTasks,
                color: '#34D399',
              },
              {
                name: 'Active Tasks',
                value: activeTasks,
                color: '#60A5FA',
              },
              {
                name: 'Overdue',
                value: overdueTasks,
                color: '#F87171',
              },
            ].map((item) => {

              const percentage =
                totalTasks > 0
                  ? Math.round(
                      item.value /
                      totalTasks * 100
                    )
                  : 0;

              return (

                <div key={item.name}>

                  <div className="
                    mb-2 flex items-center
                    justify-between gap-3
                    text-sm
                  ">

                    <div className="
                      flex items-center gap-2
                    ">

                      <span
                        className="
                          h-2 w-2 rounded-full
                        "
                        style={{
                          background: item.color,
                        }}
                      />

                      <span>{item.name}</span>

                    </div>

                    <span className="
                      numeric-value
                      text-workspace-muted
                    ">
                      {item.value} Tasks
                      {' · '}
                      {percentage}%
                    </span>

                  </div>

                  <div className="progress-track">

                    <div
                      className="progress-fill"
                      style={{
                        width: `${percentage}%`,
                        background: item.color,
                      }}
                    />

                  </div>

                </div>

              );

            })}

          </div>

          <div className="
            mt-5 border-t
            border-workspace-border pt-4
          ">

            <Link
              to="/report"
              className="
                flex items-center gap-2
                text-xs font-medium
                text-workspace-silver
                hover:text-white
              "
            >
              View detailed report
              <ArrowUpRight size={14} />
            </Link>

          </div>

        </div>

      </section>


      {/* ==========================================
          PRIORITY TASKS
          ========================================== */}

      <section className="workspace-card">

        <div className="panel-header">

          <div>

            <div className="
              flex items-center gap-2
            ">

              <ListChecks
                size={20}
                className="text-workspace-silver"
              />

              <h3 className="section-title">
                Priority Tasks
              </h3>

            </div>

            <p className="
              section-description mt-1
            ">
              Pekerjaan yang memerlukan
              perhatian management.
            </p>

          </div>

          <Link
            to="/jobs-project"
            className="btn-ghost"
          >
            View All Tasks
            <ChevronRight size={16} />
          </Link>

        </div>

        {priorityTasks.length === 0 ? (

          <div className="empty-state">

            <CheckCircle2
              size={36}
              className="mb-4 text-status-completed"
            />

            <p className="empty-state-title">
              No Pending Tasks
            </p>

            <p className="empty-state-description">
              Tidak ada pekerjaan aktif
              yang memerlukan perhatian.
            </p>

          </div>

        ) : (

          <div className="table-container">

            <table className="management-table">

              <thead>

                <tr>
                  <th>Task Name</th>
                  <th>PIC</th>
                  <th>Deadline</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Progress</th>
                </tr>

              </thead>

              <tbody>

                {priorityTasks.map((task) => {

                  const member = getMember(
                    task.picId
                  );

                  const displayStatus =
                    getDisplayStatus(task);

                  return (

                    <tr key={task.id}>

                      <td>

                        <p className="
                          font-semibold
                          text-workspace-text
                        ">
                          {task.title}
                        </p>

                        <p className="
                          mt-1 text-2xs
                          text-workspace-muted
                        ">
                          {task.id}
                        </p>

                      </td>

                      <td>

                        <div className="
                          flex items-center gap-2
                          whitespace-nowrap
                        ">

                          <div className="
                            avatar avatar-sm
                          ">
                            {member?.initials ?? '?'}
                          </div>

                          {member?.name ?? 'Unassigned'}

                        </div>

                      </td>

                      <td className="whitespace-nowrap">

                        <span className={
                          isOverdue(task)
                            ? 'text-status-overdue'
                            : 'text-workspace-muted'
                        }>
                          {formatDate(task.deadline)}
                        </span>

                      </td>

                      <td>

                        <span className={`
                          priority-badge
                          priority-${task.priority.toLowerCase()}
                        `}>
                          {task.priority}
                        </span>

                      </td>

                      <td>

                        <span className={`
                          status-badge
                          ${getStatusClass(displayStatus)}
                        `}>
                          {displayStatus}
                        </span>

                      </td>

                      <td>

                        <div className="min-w-[90px]">

                          <div className="
                            mb-1 text-right
                            text-xs numeric-value
                          ">
                            {task.progress}%
                          </div>

                          <ProgressBar
                            value={task.progress}
                          />

                        </div>

                      </td>

                    </tr>

                  );

                })}

              </tbody>

            </table>

          </div>

        )}

      </section>


      {/* ==========================================
          PROJECT MONITORING & AGENDA
          ========================================== */}

      <section className="content-grid">


        {/* PROJECT MONITORING */}

        <div className="workspace-card">

          <div className="panel-header">

            <div>

              <div className="
                flex items-center gap-2
              ">

                <Layers3
                  size={19}
                  className="text-workspace-silver"
                />

                <h3 className="section-title">
                  Project Progress
                </h3>

              </div>

              <p className="
                section-description mt-1
              ">
                Monitoring proyek setiap divisi
              </p>

            </div>

            <span className="
              text-xs text-workspace-muted
            ">
              {DEMO_PROJECTS.length} Projects
            </span>

          </div>

          <div className="space-y-4">

            {DEMO_PROJECTS.map((project) => {

              const progress =
                getProjectProgress(
                  project.id,
                  tasks
                );

              const member =
                getMember(project.picId);

              return (

                <div
                  key={project.id}
                  className="project-card"
                >

                  <div className="
                    flex items-start
                    justify-between gap-3
                  ">

                    <div>

                      <p className="
                        text-sm font-semibold
                        text-workspace-text
                      ">
                        {project.name}
                      </p>

                      <p className="
                        mt-1 text-xs
                        text-workspace-muted
                      ">
                        PIC: {member?.name ?? '-'}
                      </p>

                    </div>

                    <span className="
                      text-lg font-semibold
                      numeric-value
                      text-workspace-silver
                    ">
                      {progress}%
                    </span>

                  </div>

                  <p className="
                    my-3 text-xs leading-relaxed
                    text-workspace-muted
                  ">
                    {project.description}
                  </p>

                  <ProgressBar value={progress} />

                </div>

              );

            })}

          </div>

        </div>


        {/* TEAM AGENDA */}

        <div className="workspace-card">

          <div className="panel-header">

            <div>

              <div className="
                flex items-center gap-2
              ">

                <CalendarDays
                  size={19}
                  className="text-workspace-silver"
                />

                <h3 className="section-title">
                  Upcoming Agenda
                </h3>

              </div>

              <p className="
                section-description mt-1
              ">
                Jadwal kegiatan tim JourneyFX
              </p>

            </div>

            <span className="
              text-xs text-workspace-muted
            ">
              {upcomingAgenda.length} Events
            </span>

          </div>

          {upcomingAgenda.length === 0 ? (

            <div className="empty-state">

              <CalendarDays
                size={32}
                className="mb-4"
              />

              <p>Belum ada agenda mendatang.</p>

            </div>

          ) : (

            upcomingAgenda.map((agenda) => {

              const date = new Date(
                `${agenda.date}T00:00:00+07:00`
              );

              const day =
                new Intl.DateTimeFormat(
                  'id-ID',
                  {
                    day: '2-digit',
                    timeZone: 'Asia/Jakarta',
                  }
                ).format(date);

              const month =
                new Intl.DateTimeFormat(
                  'id-ID',
                  {
                    month: 'short',
                    timeZone: 'Asia/Jakarta',
                  }
                ).format(date);

              return (

                <div
                  key={agenda.id}
                  className="agenda-item"
                >

                  <div className="agenda-date">

                    <span className="agenda-day">
                      {day}
                    </span>

                    <span className="agenda-month">
                      {month}
                    </span>

                  </div>

                  <div className="min-w-0 flex-1">

                    <p className="
                      text-sm font-semibold
                      text-workspace-text
                    ">
                      {agenda.title}
                    </p>

                    <p className="
                      mt-1 text-xs
                      text-workspace-muted
                    ">
                      {agenda.time}
                      {' · '}
                      {agenda.location}
                    </p>

                    <p className="
                      mt-1 text-2xs
                      text-workspace-muted
                    ">
                      PIC: {
                        getMember(
                          agenda.picId
                        )?.name ?? '-'
                      }
                    </p>

                  </div>

                </div>

              );

            })

          )}

          <div className="
            mt-6 rounded-card
            border border-workspace-border
            bg-workspace-background
            p-4
          ">

            <p className="eyebrow">
              Management Reminder
            </p>

            <p className="
              mt-2 text-xs leading-relaxed
              text-workspace-muted
            ">
              Setiap PIC bertanggung jawab
              memperbarui progres pekerjaan,
              memastikan kesiapan agenda,
              dan menyampaikan kendala kepada
              management sebelum deadline.
            </p>

          </div>

        </div>

      </section>


      {/* ==========================================
          PIC PERFORMANCE
          ========================================== */}

      <section className="workspace-card">

        <div className="panel-header">

          <div>

            <div className="
              flex items-center gap-2
            ">

              <Users
                size={20}
                className="text-workspace-silver"
              />

              <h3 className="section-title">
                PIC Performance
              </h3>

            </div>

            <p className="
              section-description mt-1
            ">
              Monitoring tanggung jawab
              dan penyelesaian tugas setiap PIC.
            </p>

          </div>

          <Link
            to="/report"
            className="btn-ghost"
          >
            Performance Report
            <ChevronRight size={16} />
          </Link>

        </div>

        <div className="
          grid grid-cols-1 gap-4
          md:grid-cols-2
          2xl:grid-cols-3
        ">

          {TEAM_MEMBERS.map((member) => {

            const memberTasks =
              validTasks.filter(
                (task) => task.picId === member.id
              );

            const completed =
              memberTasks.filter(
                (task) =>
                  task.status === 'Completed'
              ).length;

            const overdue =
              memberTasks.filter(
                isOverdue
              ).length;

            const percentage =
              memberTasks.length > 0
                ? Math.round(
                    completed /
                    memberTasks.length * 100
                  )
                : 0;

            return (

              <div
                key={member.id}
                className="
                  rounded-card
                  border border-workspace-border
                  bg-workspace-background
                  p-4
                "
              >

                <div className="
                  flex items-center gap-3
                ">

                  <div className="avatar avatar-lg">
                    {member.initials}
                  </div>

                  <div className="min-w-0">

                    <p className="pic-name">
                      {member.name}
                    </p>

                    <p className="pic-role">
                      {member.division}
                    </p>

                  </div>

                </div>

                <div className="
                  my-4 grid grid-cols-3
                  gap-2 text-center
                ">

                  <div className="
                    rounded-lg
                    bg-workspace-surface p-2
                  ">

                    <p className="
                      text-lg font-semibold
                      numeric-value
                    ">
                      {memberTasks.length}
                    </p>

                    <p className="
                      text-2xs
                      text-workspace-muted
                    ">
                      Total
                    </p>

                  </div>

                  <div className="
                    rounded-lg
                    bg-workspace-surface p-2
                  ">

                    <p className="
                      text-lg font-semibold
                      text-status-completed
                      numeric-value
                    ">
                      {completed}
                    </p>

                    <p className="
                      text-2xs
                      text-workspace-muted
                    ">
                      Completed
                    </p>

                  </div>

                  <div className="
                    rounded-lg
                    bg-workspace-surface p-2
                  ">

                    <p className="
                      text-lg font-semibold
                      text-status-overdue
                      numeric-value
                    ">
                      {overdue}
                    </p>

                    <p className="
                      text-2xs
                      text-workspace-muted
                    ">
                      Overdue
                    </p>

                  </div>

                </div>

                <div className="progress-label">

                  <span className="
                    text-workspace-muted
                  ">
                    Completion Rate
                  </span>

                  <span className="
                    font-semibold numeric-value
                  ">
                    {memberTasks.length > 0
                      ? `${percentage}%`
                      : 'N/A'}
                  </span>

                </div>

                <ProgressBar value={percentage} />

              </div>

            );

          })}

        </div>

      </section>


      {/* ==========================================
          DASHBOARD FOOTER
          ========================================== */}

      <div className="
        rounded-card
        border border-workspace-border
        bg-workspace-surface
        p-4
      ">

        <div className="
          flex flex-col gap-2
          sm:flex-row
          sm:items-center
          sm:justify-between
        ">

          <div>

            <p className="
              text-sm font-semibold
              text-workspace-silver
            ">
              JourneyFX Workspace
            </p>

            <p className="
              text-xs text-workspace-muted
            ">
              Professional Management.
              Structured Execution.
              Sustainable Growth.
            </p>

          </div>

          <p className="
            text-2xs text-workspace-muted
          ">
            Demo Data · Version 1.0.0
          </p>

        </div>

      </div>

    </div>

  );

}

// ==================================================
// END OF DASHBOARD
// JourneyFX Workspace
// One Team. One Workspace. One Direction.
// ==================================================
