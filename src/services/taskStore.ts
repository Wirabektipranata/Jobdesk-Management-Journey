// ==================================================
// JOURNEYFX WORKSPACE
// Shared Task Storage
// Version 1.0.0
// Local Demonstration Mode
// ==================================================

import {
  useMemo,
  useSyncExternalStore,
} from 'react';

import type { Task } from '../pages/Dashboard';

const STORAGE_KEY = 'journeyfx.workspace.tasks.v1';
const UPDATE_EVENT = 'journeyfx:tasks-updated';

const VALID_STATUSES = [
  'Pending',
  'In Progress',
  'In Review',
  'Completed',
  'Cancelled',
];

const VALID_PRIORITIES = [
  'Urgent',
  'High',
  'Medium',
  'Low',
];

// Reject impossible calendar dates (Date.parse alone normalizes them).
function isCalendarDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(date.getTime()) &&
    date.toISOString().slice(0, 10) === value;
}

// Validate stored task data
function isValidTask(value: unknown): value is Task {

  if (!value || typeof value !== 'object') {
    return false;
  }

  const task = value as Partial<Task>;

  return (
    typeof task.id === 'string' &&
    task.id.trim().length > 0 &&
    typeof task.title === 'string' &&
    task.title.trim().length > 0 &&
    typeof task.projectId === 'string' &&
    typeof task.picId === 'string' &&
    typeof task.deadline === 'string' &&
    isCalendarDate(task.deadline) &&
    typeof task.status === 'string' &&
    VALID_STATUSES.includes(task.status) &&
    typeof task.priority === 'string' &&
    VALID_PRIORITIES.includes(task.priority) &&
    typeof task.progress === 'number' &&
    Number.isInteger(task.progress) &&
    task.progress >= 0 &&
    task.progress <= 100 &&
    (task.status === 'Cancelled' ||
      (task.status === 'Pending' && task.progress === 0) ||
      (task.status === 'Completed' && task.progress === 100) ||
      (['In Progress', 'In Review'].includes(task.status) && task.progress <= 99))
  );

}

function isValidTaskList(value: unknown): value is Task[] {
  return Array.isArray(value) && value.every(isValidTask) &&
    new Set(value.map(task => task.id)).size === value.length;
}

// Read local storage snapshot
function getSnapshot(): string | null {

  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }

}

function getServerSnapshot(): null {
  return null;
}

// Subscribe to data changes
function subscribe(callback: () => void) {

  window.addEventListener('storage', callback);

  window.addEventListener(
    UPDATE_EVENT,
    callback
  );

  return () => {

    window.removeEventListener(
      'storage',
      callback
    );

    window.removeEventListener(
      UPDATE_EVENT,
      callback
    );

  };

}

// Shared task hook
export function useWorkspaceTasks(
  initialTasks: Task[]
): Task[] {

  const snapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  return useMemo(() => {

    if (snapshot === null) {
      return initialTasks;
    }

    try {

      const parsed: unknown = JSON.parse(snapshot);

      if (
        isValidTaskList(parsed)
      ) {
        return parsed;
      }

    } catch {
      // Return demonstration data if storage is invalid.
    }

    return initialTasks;

  }, [snapshot, initialTasks]);

}

// Save tasks and notify all connected pages
export function saveWorkspaceTasks(
  tasks: Task[]
): void {

  if (!isValidTaskList(tasks)) {
    throw new Error('Invalid task data.');
  }

  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(tasks)
  );

  window.dispatchEvent(
    new Event(UPDATE_EVENT)
  );

}

// Restore initial demonstration data
export function resetWorkspaceTasks(): void {

  window.localStorage.removeItem(STORAGE_KEY);

  window.dispatchEvent(
    new Event(UPDATE_EVENT)
  );

}

// ==================================================
// JourneyFX Workspace
// Shared Task Storage
// ==================================================
