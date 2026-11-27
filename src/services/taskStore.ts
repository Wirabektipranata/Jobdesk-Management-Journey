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

// Validate stored task data
function isValidTask(value: unknown): value is Task {

  if (!value || typeof value !== 'object') {
    return false;
  }

  const task = value as Partial<Task>;

  return (
    typeof task.id === 'string' &&
    typeof task.title === 'string' &&
    typeof task.projectId === 'string' &&
    typeof task.picId === 'string' &&
    typeof task.deadline === 'string' &&
    /^\d{4}-\d{2}-\d{2}$/.test(task.deadline) &&
    Number.isFinite(Date.parse(task.deadline)) &&
    typeof task.status === 'string' &&
    VALID_STATUSES.includes(task.status) &&
    typeof task.priority === 'string' &&
    VALID_PRIORITIES.includes(task.priority) &&
    typeof task.progress === 'number' &&
    Number.isFinite(task.progress) &&
    task.progress >= 0 &&
    task.progress <= 100
  );

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
        Array.isArray(parsed) &&
        parsed.every(isValidTask)
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

  if (!tasks.every(isValidTask)) {
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
