import React, { createContext, useContext, useState } from 'react'; 
import type { ReactNode } from 'react';
import type { Task, TaskStatus, HistoryEntry,} from '../types/index';
import { allowedTransitions } from '../types/index';

interface TaskContextType {
  tasks: Task[];
  addTask: (title: string, description: string) => void;
  updateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
  updateTaskDetails: (taskId: string, title: string, description: string) => void;
  getTaskHistory: (taskId: string) => HistoryEntry[];
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const stored = localStorage.getItem('tasks');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        return parsed.map((task: any) => ({
          ...task,
          history: task.history.map((entry: any) => ({
            ...entry,
            timestamp: new Date(entry.timestamp)
          }))
        }));
      } catch {
        return [];
      }
    }
    return [];
  });

  // Persist to localStorage
  React.useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (title: string, description: string) => {
    const newTask: Task = {
        id: crypto.randomUUID(),
        title,
        description,
        status: 'ToDo',
        history: [],
        deadline: undefined
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const updateTaskStatus = (taskId: string, newStatus: TaskStatus) => {
    setTasks(prev =>
      prev.map(task => {
        if (task.id !== taskId) return task;
        const oldStatus = task.status;
        // Validate transition
        if (!allowedTransitions[oldStatus].includes(newStatus)) {
          console.warn(`Invalid transition from ${oldStatus} to ${newStatus}`);
          return task;
        }
        const historyEntry: HistoryEntry = {
          field: 'status',
          previousValue: oldStatus,
          newValue: newStatus,
          timestamp: new Date()
        };
        return {
          ...task,
          status: newStatus,
          history: [historyEntry, ...task.history]
        };
      })
    );
  };

  const updateTaskDetails = (taskId: string, title: string, description: string) => {
    setTasks(prev =>
      prev.map(task => {
        if (task.id !== taskId) return task;
        const newHistory: HistoryEntry[] = [];
        if (task.title !== title) {
          newHistory.push({
            field: 'title',
            previousValue: task.title,
            newValue: title,
            timestamp: new Date()
          });
        }
        if (task.description !== description) {
          newHistory.push({
            field: 'description',
            previousValue: task.description,
            newValue: description,
            timestamp: new Date()
          });
        }
        return {
          ...task,
          title,
          description,
          history: [...newHistory, ...task.history]
        };
      })
    );
  };

  const getTaskHistory = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    return task ? task.history : [];
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTaskStatus, updateTaskDetails, getTaskHistory }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error('useTasks must be used within TaskProvider');
  return context;
};