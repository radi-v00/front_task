import React from 'react';
import type { Task, TaskStatus } from '../types';
import TaskCard from './TaskCard';

interface TaskListProps {
  tasks: Task[];
  onStatusChange: (id: string, newStatus: TaskStatus) => void;
  onUpdateDetails: (id: string, title: string, description: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onStatusChange, onUpdateDetails }) => {
  if (tasks.length === 0) {
    return <div className="empty-state">No tasks yet. Create one above!</div>;
  }

  return (
    <div className="task-list">
      {tasks.map(task => (
        <TaskCard
          key={task.id}
          task={task}
          onStatusChange={onStatusChange}
          onUpdateDetails={onUpdateDetails}
        />
      ))}
    </div>
  );
};

export default TaskList;