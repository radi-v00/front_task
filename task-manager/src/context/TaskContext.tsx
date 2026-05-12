import{ createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

import { v4 as uuidv4 } from "uuid";

export type TaskStatus =
  | "ToDo"
  | "InProgress"
  | "InQA"
  | "Done";

export interface TaskHistoryItem {
  id: string;
  field: string;
  previousValue: string;
  nextValue: string;
  changedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  history: TaskHistoryItem[];
  createdAt: string;
}

interface UpdateTaskPayload {
  title?: string;
  description?: string;
}

interface CreateTaskPayload {
  title: string;
  description: string;
}

interface UpdateTaskPayload {
  title?: string;
  description?: string;
}

interface TaskContextType {
  tasks: Task[];

  createTask: (payload: CreateTaskPayload) => void;

  updateTask: (
    taskId: string,
    payload: UpdateTaskPayload
  ) => void;

  changeTaskStatus: (
    taskId: string,
    newStatus: TaskStatus
  ) => void;
}

const TaskContext = createContext<TaskContextType | null>(
  null
);

export const allowedTransitions: Record<
  TaskStatus,
  TaskStatus[]
> = {
  ToDo: ["InProgress"],
  InProgress: ["InQA"],
  InQA: ["Done", "ToDo"],
  Done: [],
};

export const TaskProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  /*
    LOAD TASKS FROM LOCAL STORAGE
  */
  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");

    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  /*
    SAVE TASKS TO LOCAL STORAGE
  */
  useEffect(() => {
    localStorage.setItem(
      "tasks",
      JSON.stringify(tasks)
    );
  }, [tasks]);

  /*
    CREATE TASK
  */
  const createTask = ({
    title,
    description,
  }: CreateTaskPayload) => {
    const newTask: Task = {
      id: uuidv4(),
      title,
      description,
      status: "ToDo",
      history: [],
      createdAt: new Date().toISOString(),
    };

    setTasks((prev) => [...prev, newTask]);
  };

  /*
    UPDATE TASK
  */
  const updateTask = (
    taskId: string,
    payload: UpdateTaskPayload
  ) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== taskId) return task;

        const history: TaskHistoryItem[] = [
          ...task.history,
        ];

        if (
          payload.title &&
          payload.title !== task.title
        ) {
          history.push({
            id: uuidv4(),
            field: "title",
            previousValue: task.title,
            nextValue: payload.title,
            changedAt: new Date().toISOString(),
          });
        }

        if (
          payload.description &&
          payload.description !==
            task.description
        ) {
          history.push({
            id: uuidv4(),
            field: "description",
            previousValue: task.description,
            nextValue: payload.description,
            changedAt: new Date().toISOString(),
          });
        }

        return {
          ...task,
          ...payload,
          history,
        };
      })
    );
  };

  /*
    CHANGE STATUS
  */
  const changeTaskStatus = (
    taskId: string,
    newStatus: TaskStatus
  ) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== taskId) return task;

        const allowed =
          allowedTransitions[
            task.status
          ].includes(newStatus);

        if (!allowed) {
          return task;
        }

        return {
          ...task,
          status: newStatus,
          history: [
            ...task.history,
            {
              id: uuidv4(),
              field: "status",
              previousValue: task.status,
              nextValue: newStatus,
              changedAt:
                new Date().toISOString(),
            },
          ],
        };
      })
    );
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        createTask,
        updateTask,
        changeTaskStatus,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);

  if (!context) {
    throw new Error(
      "useTasks must be used inside TaskProvider"
    );
  }

  return context;
};