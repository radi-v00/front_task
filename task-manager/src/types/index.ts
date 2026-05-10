export type TaskStatus = 'ToDo' | 'InProgress' | 'InQA' | 'Done';

export interface HistoryEntry {
  field: 'title' | 'description' | 'status';
  previousValue: string;
  newValue: string;
  timestamp: Date;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
//   deadline: Date;
  history: HistoryEntry[];
}

// Allowed status transitions
export const allowedTransitions: Record<TaskStatus, TaskStatus[]> = {
  ToDo: ['InProgress'],
  InProgress: ['InQA'],
  InQA: ['ToDo', 'Done'],
  Done: [] // terminal state
};
