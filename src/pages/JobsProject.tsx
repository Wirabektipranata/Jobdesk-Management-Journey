// ==================================================
// JOURNEYFX WORKSPACE
// Internal Jobdesk & Project Management System
// Version 1.0.0
// Jobs & Project Management
// ==================================================

import { useState } from 'react';
import type { FormEvent } from 'react';

import {
  Plus,
  Search,
  Pencil,
  Trash2,
  ClipboardList,
  CheckCircle2,
  Clock3,
  AlertCircle,
  LayoutList,
  Kanban,
  Layers3,
  CalendarDays,
  Users,
  X,
  Save,
  RotateCcw,
} from 'lucide-react';

import toast from 'react-hot-toast';

import {
  TEAM_MEMBERS,
  DEMO_PROJECTS,
  DEMO_TASKS,
  getMember,
  getJakartaDate,
  formatDate,
  isOverdue,
  getDisplayStatus,
  getStatusClass,
  getProjectProgress,
} from './Dashboard';

import type {
  Task,
  TaskStatus,
  TaskPriority,
} from './Dashboard';

import {
  useWorkspaceTasks,
  saveWorkspaceTasks,
  resetWorkspaceTasks,
} from '../services/taskStore';


// ==================================================
// 01. CONFIGURATION
// ==================================================

const TASK_STATUSES: TaskStatus[] = [
  'Pending',
  'In Progress',
  'In Review',
  'Completed',
  'Cancelled',
];

const DISPLAY_STATUSES = [
  'Pending',
  'In Progress',
  'In Review',
  'Completed',
  'Overdue',
  'Cancelled',
];

const PRIORITIES: TaskPriority[] = [
  'Urgent',
  'High',
  'Medium',
  'Low',
];

const PRIORITY_ORDER: Record<TaskPriority, number> = {
  Urgent: 0,
  High: 1,
  Medium: 2,
  Low: 3,
};

type TaskDraft = Omit<Task, 'id'>;

type ViewMode = 'list' | 'kanban';


// ==================================================
// 02. DEFAULT FORM DATA
// ==================================================

function createDefaultDraft(): TaskDraft {

  return {
    title: '',
    projectId: DEMO_PROJECTS[0]?.id ?? '',
    picId: TEAM_MEMBERS[0]?.id ?? '',
    deadline: getJakartaDate(1),
    priority: 'Medium',
    status: 'Pending',
    progress: 0,
  };

}


// ==================================================
// 03. PROGRESS NORMALIZATION
// ==================================================

function normalizeDraft(
  draft: TaskDraft
): TaskDraft {

  let progress = Math.min(
    100,
    Math.max(0, Math.round(draft.progress))
  );

  if (draft.status === 'Pending') {
    progress = 0;
  }

  if (draft.status === 'Completed') {
    progress = 100;
  }

  if (
    draft.status === 'In Progress' ||
    draft.status === 'In Review'
  ) {
    progress = Math.min(99, progress);
  }

  return {
    ...draft,
    progress,
  };

}


// ==================================================
// 04. REUSABLE PROGRESS BAR
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

    <div>

      <div className="progress-label">

        <span className="text-workspace-muted">
          Progress
        </span>

        <span className="numeric-value font-semibold">
          {progress}%
        </span>

      </div>

      <div
        className="progress-track"
        role="progressbar"
        aria-label="Task progress"
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

    </div>

  );

}


// ==================================================
// 05. STATUS COMPONENT
// ==================================================

function StatusBadge({
  task,
}: {
  task: Task;
}) {

  const status = getDisplayStatus(task);

  return (

    <span
      className={`
        status-badge
        ${getStatusClass(status)}
      `}
    >
      {status}
    </span>

  );

}


// ==================================================
// 06. PRIORITY COMPONENT
// ==================================================

function PriorityBadge({
  priority,
}: {
  priority: TaskPriority;
}) {

  return (

    <span
      className={`
        priority-badge
        priority-${priority.toLowerCase()}
      `}
    >
      {priority}
    </span>

  );

}


// ==================================================
// 07. MAIN JOBS & PROJECT PAGE
// ==================================================

export default function JobsProject() {

  // Shared task storage
  const tasks = useWorkspaceTasks(DEMO_TASKS);

  // Search and filter states
  const [search, setSearch] = useState('');
  const [picFilter, setPicFilter] = useState('all');
  const [projectFilter, setProjectFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  // View configuration
  const [view, setView] = useState<ViewMode>('list');

  // Task form configuration
  const [draft, setDraft] = useState<TaskDraft | null>(null);

  const [editingId, setEditingId] =
    useState<string | null>(null);


  // ==================================================
  // 08. TASK STATISTICS
  // ==================================================

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


  // ==================================================
  // 09. SEARCH AND FILTER
  // ==================================================

  const filteredTasks = tasks
    .filter((task) => {

      const keyword = search.trim().toLowerCase();

      const member = getMember(task.picId);

      const project = DEMO_PROJECTS.find(
        (item) => item.id === task.projectId
      );

      const searchable = [
        task.id,
        task.title,
        member?.name ?? '',
        member?.division ?? '',
        project?.name ?? '',
      ].join(' ').toLowerCase();

      const matchesSearch =
        searchable.includes(keyword);

      const matchesPic =
        picFilter === 'all' ||
        task.picId === picFilter;

      const matchesProject =
        projectFilter === 'all' ||
        task.projectId === projectFilter;

      const matchesStatus =
        statusFilter === 'all' ||
        getDisplayStatus(task) === statusFilter;

      const matchesPriority =
        priorityFilter === 'all' ||
        task.priority === priorityFilter;

      return (
        matchesSearch &&
        matchesPic &&
        matchesProject &&
        matchesStatus &&
        matchesPriority
      );

    })
    .sort(
      (a, b) =>
        Number(isOverdue(b)) -
        Number(isOverdue(a)) ||
        PRIORITY_ORDER[a.priority] -
        PRIORITY_ORDER[b.priority] ||
        a.deadline.localeCompare(b.deadline)
    );


  // ==================================================
  // 10. FORM ACTIONS
  // ==================================================

  function openCreateTask() {

    setEditingId(null);
    setDraft(createDefaultDraft());

  }

  function openEditTask(task: Task) {

    setEditingId(task.id);

    setDraft({
      title: task.title,
      projectId: task.projectId,
      picId: task.picId,
      deadline: task.deadline,
      priority: task.priority,
      status: task.status,
      progress: task.progress,
    });

  }

  function closeForm() {

    setDraft(null);
    setEditingId(null);

  }

  function updateDraft(
    changes: Partial<TaskDraft>
  ) {

    setDraft((previous) => {

      if (!previous) {
        return null;
      }

      return normalizeDraft({
        ...previous,
        ...changes,
      });

    });

  }


  // ==================================================
  // 11. SAVE TASK
  // ==================================================

  function handleSave(
    event: FormEvent<HTMLFormElement>
  ) {

    event.preventDefault();

    if (!draft) {
      return;
    }

    const normalized = normalizeDraft(draft);

    if (!normalized.title.trim()) {

      toast.error('Nama pekerjaan wajib diisi.');
      return;

    }

    if (!normalized.deadline) {

      toast.error('Deadline wajib diisi.');
      return;

    }

    if (
      !DEMO_PROJECTS.some(
        (item) => item.id === normalized.projectId
      )
    ) {

      toast.error('Pilih proyek yang valid.');
      return;

    }

    if (
      !TEAM_MEMBERS.some(
        (item) => item.id === normalized.picId
      )
    ) {

      toast.error('Pilih PIC yang valid.');
      return;

    }

    if (
      editingId &&
      !tasks.some((task) => task.id === editingId)
    ) {

      toast.error(
        'Pekerjaan sudah tidak tersedia.'
      );

      closeForm();
      return;

    }

    try {

      const task: Task = {
        ...normalized,
        title: normalized.title.trim(),
        id: editingId ??
          `JFX-${crypto.randomUUID()}`,
      };

      const updatedTasks = editingId

        ? tasks.map(
            (item) =>
              item.id === editingId
                ? task
                : item
          )

        : [...tasks, task];

      saveWorkspaceTasks(updatedTasks);

      toast.success(
        editingId
          ? 'Pekerjaan berhasil diperbarui.'
          : 'Pekerjaan baru berhasil dibuat.'
      );

      closeForm();

    } catch {

      toast.error(
        'Gagal menyimpan. Periksa penyimpanan browser.'
      );

    }

  }


  // ==================================================
  // 12. DELETE TASK
  // ==================================================

  function handleDelete(task: Task) {

    const confirmed = window.confirm(
      `Hapus pekerjaan "${task.title}"? ` +
      'Tindakan ini tidak dapat dibatalkan.'
    );

    if (!confirmed) {
      return;
    }

    try {

      saveWorkspaceTasks(
        tasks.filter(
          (item) => item.id !== task.id
        )
      );

      if (editingId === task.id) {
        closeForm();
      }

      toast.success(
        'Pekerjaan berhasil dihapus.'
      );

    } catch {

      toast.error(
        'Pekerjaan gagal dihapus.'
      );

    }

  }


  // ==================================================
  // 13. FILTER & RESET ACTIONS
  // ==================================================

  function clearFilters() {

    setSearch('');
    setPicFilter('all');
    setProjectFilter('all');
    setStatusFilter('all');
    setPriorityFilter('all');

  }

  function handleResetDemo() {

    const confirmed = window.confirm(
      'Seluruh perubahan tugas lokal akan dihapus ' +
      'dan data simulasi awal akan dikembalikan. ' +
      'Lanjutkan?'
    );

    if (!confirmed) {
      return;
    }

    try {

      resetWorkspaceTasks();

      closeForm();
      clearFilters();

      toast.success(
        'Data simulasi berhasil dikembalikan.'
      );

    } catch {

      toast.error(
        'Gagal mengembalikan data simulasi.'
      );

    }

  }


  // ==================================================
  // 14. PAGE RENDER
  // ==================================================

  return (

    <div className="
      workspace-container
      section-stack
    ">

      {/* PAGE HEADER */}

      <div className="page-header">

        <div>

          <p className="eyebrow mb-2">
            Operational Management
          </p>

          <h2 className="page-title">
            Jobs & Project
          </h2>

          <p className="page-description">
            Kelola pekerjaan, tanggung jawab PIC,
            deadline, dan progres proyek JourneyFX.
          </p>

        </div>

        <div className="page-actions">

          <button
            type="button"
            className="btn-primary"
            onClick={openCreateTask}
            disabled={draft !== null}
          >
            <Plus size={18} />
            New Task
          </button>

        </div>

      </div>


      {/* TASK STATISTICS */}

      <section className="dashboard-grid">

        {[
          {
            label: 'Total Tasks',
            value: totalTasks,
            icon: ClipboardList,
            color: '#D1D5DB',
          },
          {
            label: 'Completed',
            value: completedTasks,
            icon: CheckCircle2,
            color: '#34D399',
          },
          {
            label: 'Active Tasks',
            value: activeTasks,
            icon: Clock3,
            color: '#60A5FA',
          },
          {
            label: 'Overdue',
            value: overdueTasks,
            icon: AlertCircle,
            color: '#F87171',
          },
        ].map((item) => {

          const Icon = item.icon;

          return (

            <div
              key={item.label}
              className="stat-card"
            >

              <div className="
                flex items-center
                justify-between gap-3
              ">

                <span className="stat-label">
                  {item.label}
                </span>

                <div
                  className="stat-icon"
                  style={{ color: item.color }}
                >
                  <Icon size={20} />
                </div>

              </div>

              <div
                className="stat-value"
                style={{ color: item.color }}
              >
                {item.value}
              </div>

            </div>

          );

        })}

      </section>


      {/* CREATE & EDIT TASK FORM */}

      {draft && (

        <section className="
          workspace-panel
          motion-safe:animate-fade-up
        ">

          <div className="panel-header">

            <div>

              <h3 className="section-title">

                {editingId
                  ? 'Edit Task'
                  : 'Create New Task'}

              </h3>

              <p className="section-description">
                Lengkapi informasi pekerjaan.
              </p>

            </div>

            <button
              type="button"
              className="btn-icon"
              onClick={closeForm}
              aria-label="Close task form"
            >
              <X size={18} />
            </button>

          </div>

          <form onSubmit={handleSave}>

            <div className="
              grid grid-cols-1
              gap-5 md:grid-cols-2
            ">

              {/* TASK NAME */}

              <label className="
                form-group md:col-span-2
              ">

                <span className="form-label">
                  Task Name
                </span>

                <input
                  className="workspace-input"
                  placeholder="Masukkan nama pekerjaan..."
                  value={draft.title}
                  onChange={(event) =>
                    updateDraft({
                      title: event.target.value,
                    })
                  }
                  maxLength={200}
                  required
                />

              </label>


              {/* PROJECT */}

              <label className="form-group">

                <span className="form-label">
                  Project / Division
                </span>

                <select
                  className="workspace-select"
                  value={draft.projectId}
                  onChange={(event) =>
                    updateDraft({
                      projectId: event.target.value,
                    })
                  }
                  required
                >

                  {DEMO_PROJECTS.map((project) => (

                    <option
                      key={project.id}
                      value={project.id}
                    >
                      {project.name}
                    </option>

                  ))}

                </select>

              </label>


              {/* PIC */}

              <label className="form-group">

                <span className="form-label">
                  Person in Charge (PIC)
                </span>

                <select
                  className="workspace-select"
                  value={draft.picId}
                  onChange={(event) =>
                    updateDraft({
                      picId: event.target.value,
                    })
                  }
                  required
                >

                  {TEAM_MEMBERS.map((member) => (

                    <option
                      key={member.id}
                      value={member.id}
                    >
                      {member.name} — {member.division}
                    </option>

                  ))}

                </select>

              </label>


              {/* DEADLINE */}

              <label className="form-group">

                <span className="form-label">
                  Deadline (WIB)
                </span>

                <input
                  type="date"
                  className="workspace-input"
                  value={draft.deadline}
                  onChange={(event) =>
                    updateDraft({
                      deadline: event.target.value,
                    })
                  }
                  required
                />

              </label>


              {/* PRIORITY */}

              <label className="form-group">

                <span className="form-label">
                  Priority Level
                </span>

                <select
                  className="workspace-select"
                  value={draft.priority}
                  onChange={(event) =>
                    updateDraft({
                      priority:
                        event.target.value as TaskPriority,
                    })
                  }
                >

                  {PRIORITIES.map((priority) => (

                    <option
                      key={priority}
                      value={priority}
                    >
                      {priority}
                    </option>

                  ))}

                </select>

              </label>


              {/* STATUS */}

              <label className="form-group">

                <span className="form-label">
                  Task Status
                </span>

                <select
                  className="workspace-select"
                  value={draft.status}
                  onChange={(event) =>
                    updateDraft({
                      status:
                        event.target.value as TaskStatus,
                    })
                  }
                >

                  {TASK_STATUSES.map((status) => (

                    <option
                      key={status}
                      value={status}
                    >
                      {status}
                    </option>

                  ))}

                </select>

                <span className="form-description">
                  Overdue ditentukan otomatis berdasarkan
                  deadline dan status pekerjaan.
                </span>

              </label>


              {/* PROGRESS */}

              <label className="form-group">

                <span className="form-label">
                  Task Progress — {draft.progress}%
                </span>

                <input
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={draft.progress}
                  disabled={
                    draft.status === 'Pending' ||
                    draft.status === 'Completed' ||
                    draft.status === 'Cancelled'
                  }
                  onChange={(event) =>
                    updateDraft({
                      progress: Number(event.target.value),
                    })
                  }
                  className="
                    w-full cursor-pointer
                    accent-journey-300
                    disabled:cursor-not-allowed
                  "
                />

                <ProgressBar value={draft.progress} />

              </label>

            </div>


            {/* FORM BUTTONS */}

            <div className="modal-footer">

              <button
                type="button"
                className="btn-secondary"
                onClick={closeForm}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn-primary"
              >

                <Save size={17} />

                {editingId
                  ? 'Save Changes'
                  : 'Create Task'}

              </button>

            </div>

          </form>

        </section>

      )}


      {/* PROJECT OVERVIEW */}

      <section className="workspace-card">

        <div className="panel-header">

          <div>

            <div className="
              flex items-center gap-2
            ">

              <Layers3
                size={20}
                className="text-workspace-silver"
              />

              <h3 className="section-title">
                Project Overview
              </h3>

            </div>

            <p className="section-description mt-1">
              Monitoring proyek seluruh divisi.
            </p>

          </div>

          <span className="
            text-xs text-workspace-muted
          ">
            {DEMO_PROJECTS.length} Projects
          </span>

        </div>

        <div className="
          grid grid-cols-1 gap-4
          md:grid-cols-2
          2xl:grid-cols-3
        ">

          {DEMO_PROJECTS.map((project) => {

            const progress = getProjectProgress(
              project.id,
              tasks
            );

            const projectTasks = validTasks.filter(
              (task) =>
                task.projectId === project.id
            );

            const completed = projectTasks.filter(
              (task) =>
                task.status === 'Completed'
            ).length;

            const selected =
              projectFilter === project.id;

            return (

              <div
                key={project.id}
                className={`
                  project-card
                  ${selected
                    ? '!border-metallic-silver'
                    : ''}
                `}
              >

                <div className="
                  mb-4 flex items-start gap-3
                ">

                  <div className="stat-icon">
                    <Layers3 size={19} />
                  </div>

                  <div className="min-w-0">

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
                      PIC: {
                        getMember(project.picId)?.name ??
                        '-'
                      }
                    </p>

                  </div>

                </div>

                <p className="
                  mb-4 text-xs
                  text-workspace-muted
                ">
                  {project.description}
                </p>

                <ProgressBar value={progress} />

                <div className="
                  mt-4 flex flex-wrap
                  items-center justify-between
                  gap-2 border-t
                  border-workspace-border pt-3
                ">

                  <span className="
                    text-xs text-workspace-muted
                  ">
                    {completed}/{projectTasks.length}
                    {' '}Tasks Completed
                  </span>

                  <button
                    type="button"
                    className="btn-ghost"
                    onClick={() => {

                      setProjectFilter(
                        selected
                          ? 'all'
                          : project.id
                      );

                      document
                        .getElementById('task-list')
                        ?.scrollIntoView({
                          behavior: 'auto',
                        });

                    }}
                  >
                    {selected
                      ? 'Clear Filter'
                      : 'View Tasks'}
                  </button>

                </div>

              </div>

            );

          })}

        </div>

      </section>


      {/* SEARCH & FILTER */}

      <section
        id="task-list"
        className="workspace-card"
      >

        <div className="panel-header">

          <div>

            <h3 className="section-title">
              Task Management
            </h3>

            <p className="section-description">
              Pengelolaan seluruh pekerjaan management.
            </p>

          </div>

          {/* VIEW SWITCHER */}

          <div className="
            flex items-center gap-1
            rounded-xl border
            border-workspace-border
            bg-workspace-background p-1
          ">

            <button
              type="button"
              aria-pressed={view === 'list'}
              onClick={() => setView('list')}
              className={`
                flex items-center gap-2
                rounded-lg px-3 py-2
                text-xs transition-colors
                ${view === 'list'
                  ? 'bg-workspace-elevated text-white'
                  : 'text-workspace-muted'}
              `}
            >
              <LayoutList size={16} />
              List
            </button>

            <button
              type="button"
              aria-pressed={view === 'kanban'}
              onClick={() => setView('kanban')}
              className={`
                flex items-center gap-2
                rounded-lg px-3 py-2
                text-xs transition-colors
                ${view === 'kanban'
                  ? 'bg-workspace-elevated text-white'
                  : 'text-workspace-muted'}
              `}
            >
              <Kanban size={16} />
              Kanban
            </button>

          </div>

        </div>


        {/* SEARCH FIELD */}

        <div className="search-wrapper mb-4">

          <Search
            size={18}
            className="search-icon"
          />

          <input
            className="workspace-input"
            placeholder="Search tasks, project, or PIC..."
            aria-label="Search tasks"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />

        </div>


        {/* FILTER CONTROLS */}

        <div className="
          grid grid-cols-1 gap-3
          sm:grid-cols-2 xl:grid-cols-4
        ">

          <select
            className="workspace-select"
            aria-label="Filter by PIC"
            value={picFilter}
            onChange={(event) =>
              setPicFilter(event.target.value)
            }
          >

            <option value="all">
              All PIC
            </option>

            {TEAM_MEMBERS.map((member) => (

              <option
                key={member.id}
                value={member.id}
              >
                {member.name}
              </option>

            ))}

          </select>


          <select
            className="workspace-select"
            aria-label="Filter by project"
            value={projectFilter}
            onChange={(event) =>
              setProjectFilter(event.target.value)
            }
          >

            <option value="all">
              All Projects
            </option>

            {DEMO_PROJECTS.map((project) => (

              <option
                key={project.id}
                value={project.id}
              >
                {project.name}
              </option>

            ))}

          </select>


          <select
            className="workspace-select"
            aria-label="Filter by status"
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
          >

            <option value="all">
              All Status
            </option>

            {DISPLAY_STATUSES.map((status) => (

              <option
                key={status}
                value={status}
              >
                {status}
              </option>

            ))}

          </select>


          <select
            className="workspace-select"
            aria-label="Filter by priority"
            value={priorityFilter}
            onChange={(event) =>
              setPriorityFilter(event.target.value)
            }
          >

            <option value="all">
              All Priorities
            </option>

            {PRIORITIES.map((priority) => (

              <option
                key={priority}
                value={priority}
              >
                {priority}
              </option>

            ))}

          </select>

        </div>

        <div className="
          mt-4 flex items-center
          justify-between gap-3
        ">

          <span className="
            text-xs text-workspace-muted
          ">
            Showing {filteredTasks.length}
            {' '}of {tasks.length} tasks
          </span>

          <button
            type="button"
            className="btn-ghost"
            onClick={clearFilters}
          >
            <RotateCcw size={14} />
            Reset Filters
          </button>

        </div>

      </section>


      {/* EMPTY STATE */}

      {filteredTasks.length === 0 ? (

        <section className="workspace-card">

          <div className="empty-state">

            <div className="empty-state-icon">
              <ClipboardList size={28} />
            </div>

            <h3 className="empty-state-title">
              No Tasks Found
            </h3>

            <p className="empty-state-description">
              Tidak ada pekerjaan yang sesuai.
              Buat tugas baru atau ubah filter.
            </p>

            <button
              type="button"
              className="btn-primary mt-5"
              onClick={openCreateTask}
              disabled={draft !== null}
            >
              <Plus size={17} />
              Create Task
            </button>

          </div>

        </section>

      ) : view === 'list' ? (


        /* ==========================================
           LIST VIEW
           ========================================== */

        <section className="table-container">

          <table className="management-table">

            <thead>

              <tr>

                <th>Task Name</th>
                <th>Project</th>
                <th>PIC</th>
                <th>Deadline</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Progress</th>
                <th>Actions</th>

              </tr>

            </thead>

            <tbody>

              {filteredTasks.map((task) => {

                const member = getMember(task.picId);

                const project = DEMO_PROJECTS.find(
                  (item) =>
                    item.id === task.projectId
                );

                return (

                  <tr key={task.id}>

                    <td className="min-w-[200px]">

                      <p className="
                        font-semibold
                        text-workspace-text
                      ">
                        {task.title}
                      </p>

                      <p
                        className="
                          mt-1 text-2xs
                          text-workspace-muted
                        "
                        title={task.id}
                      >
                        {task.id.slice(0, 16)}
                      </p>

                    </td>

                    <td>
                      {project?.name ?? '-'}
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

                      <PriorityBadge
                        priority={task.priority}
                      />

                    </td>

                    <td>
                      <StatusBadge task={task} />
                    </td>

                    <td>

                      <div className="min-w-[110px]">

                        <ProgressBar
                          value={task.progress}
                        />

                      </div>

                    </td>

                    <td>

                      <div className="
                        flex items-center gap-2
                      ">

                        <button
                          type="button"
                          className="btn-icon"
                          title="Edit Task"
                          aria-label={`Edit ${task.title}`}
                          disabled={draft !== null}
                          onClick={() => {

                            openEditTask(task);

                            window.scrollTo({
                              top: 0,
                              behavior: 'auto',
                            });

                          }}
                        >
                          <Pencil size={15} />
                        </button>

                        <button
                          type="button"
                          className="
                            btn-icon
                            hover:text-status-overdue
                          "
                          title="Delete Task"
                          aria-label={`Delete ${task.title}`}
                          onClick={() =>
                            handleDelete(task)
                          }
                        >
                          <Trash2 size={15} />
                        </button>

                      </div>

                    </td>

                  </tr>

                );

              })}

            </tbody>

          </table>

        </section>

      ) : (


        /* ==========================================
           KANBAN VIEW
           ========================================== */

        <section className="
          grid grid-cols-1
          gap-4 md:grid-cols-2
          2xl:grid-cols-3
        ">

          {DISPLAY_STATUSES.map((status) => {

            const columnTasks = filteredTasks.filter(
              (task) =>
                getDisplayStatus(task) === status
            );

            if (
              statusFilter !== 'all' &&
              statusFilter !== status
            ) {
              return null;
            }

            return (

              <div
                key={status}
                className="
                  min-w-0 rounded-panel
                  border border-workspace-border
                  bg-workspace-surface p-4
                "
              >

                <div className="
                  mb-4 flex items-center
                  justify-between gap-2
                ">

                  <span className={`
                    status-badge
                    ${getStatusClass(status)}
                  `}>
                    {status}
                  </span>

                  <span className="
                    rounded-lg
                    bg-workspace-elevated
                    px-2 py-1 text-xs
                    text-workspace-muted
                  ">
                    {columnTasks.length}
                  </span>

                </div>

                <div className="space-y-3">

                  {columnTasks.length === 0 && (

                    <div className="
                      rounded-xl border
                      border-dashed
                      border-workspace-border
                      p-6 text-center text-xs
                      text-workspace-muted
                    ">
                      No tasks
                    </div>

                  )}

                  {columnTasks.map((task) => (

                    <div
                      key={task.id}
                      className="
                        rounded-xl border
                        border-workspace-border
                        bg-workspace-background p-4
                      "
                    >

                      <div className="
                        mb-3 flex flex-wrap
                        items-center gap-2
                      ">

                        <PriorityBadge
                          priority={task.priority}
                        />

                      </div>

                      <h4 className="
                        mb-2 break-words
                        text-sm font-semibold
                      ">
                        {task.title}
                      </h4>

                      <p className="
                        mb-4 text-xs
                        text-workspace-muted
                      ">
                        {
                          DEMO_PROJECTS.find(
                            (project) =>
                              project.id ===
                              task.projectId
                          )?.name ?? '-'
                        }
                      </p>

                      <div className="
                        mb-2 flex items-center
                        gap-2 text-xs
                        text-workspace-muted
                      ">

                        <Users size={14} />

                        {getMember(task.picId)?.name ?? '-'}

                      </div>

                      <div className="
                        mb-4 flex items-center
                        gap-2 text-xs
                        text-workspace-muted
                      ">

                        <CalendarDays size={14} />

                        {formatDate(task.deadline)}

                      </div>

                      <ProgressBar
                        value={task.progress}
                      />

                      <div className="
                        mt-4 flex items-center
                        justify-end gap-2
                        border-t
                        border-workspace-border pt-3
                      ">

                        <button
                          type="button"
                          className="btn-ghost"
                          disabled={draft !== null}
                          onClick={() => {

                            openEditTask(task);

                            window.scrollTo({
                              top: 0,
                              behavior: 'auto',
                            });

                          }}
                        >
                          <Pencil size={14} />
                          Edit
                        </button>

                        <button
                          type="button"
                          className="btn-ghost"
                          aria-label={`Delete ${task.title}`}
                          onClick={() =>
                            handleDelete(task)
                          }
                        >
                          <Trash2
                            size={14}
                            className="text-status-overdue"
                          />
                        </button>

                      </div>

                    </div>

                  ))}

                </div>

              </div>

            );

          })}

        </section>

      )}


      {/* DEMONSTRATION MODE FOOTER */}

      <section className="
        rounded-card border
        border-workspace-border
        bg-workspace-surface p-4
      ">

        <div className="
          flex flex-col gap-3
          sm:flex-row sm:items-center
          sm:justify-between
        ">

          <div>

            <p className="
              text-sm font-semibold
              text-workspace-silver
            ">
              Local Demonstration Mode
            </p>

            <p className="
              mt-1 text-xs
              text-workspace-muted
            ">
              Data disimpan pada browser ini.
              Gunakan data simulasi sampai database
              dan autentikasi tersedia.
            </p>

          </div>

          <button
            type="button"
            className="btn-secondary"
            onClick={handleResetDemo}
          >
            <RotateCcw size={15} />
            Reset Demo Data
          </button>

        </div>

      </section>

    </div>

  );

}

// ==================================================
// END OF JOBS & PROJECT MANAGEMENT
// JourneyFX Workspace
// One Team. One Workspace. One Direction.
// ==================================================
