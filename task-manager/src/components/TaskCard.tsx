import React, { useState } from 'react';
import type { Task, TaskStatus} from '../types';
import {allowedTransitions } from '../types';
import EditTaskModal from './EditTaskModal';
import HistoryModal from './HistoryModal';
// import type { Form } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onStatusChange: (id: string, newStatus: TaskStatus) => void;
  onUpdateDetails: (id: string, title: string, description: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onStatusChange, onUpdateDetails }) => {
  const [showEdit, setShowEdit] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const nextStatuses = allowedTransitions[task.status];

  return (
    <>
      <div className="task-card">
        <div className="task-header">
          <h3>{task.title}</h3>
          <span className={`status status-${task.status.toLowerCase()}`}>{task.status}</span>
        </div>
        <p className="task-description">{task.description}</p>
        <div className="task-actions">
          <div className="status-buttons">
            {nextStatuses.map(status => (
              <button key={status} onClick={() => onStatusChange(task.id, status)}>
                Move to {status}
              </button>
            ))}
          </div>
          <div className="icon-buttons">
            <button onClick={() => setShowEdit(true)} aria-label="Edit task">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 3l4 4-7 7H10v-4l7-7z" />
                <path d="M4 20h16" />
              </svg>
            </button>
            <button onClick={() => setShowHistory(true)} aria-label="View history">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
                <line x1="4" y1="4" x2="20" y2="20" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {showEdit && (
        <EditTaskModal
          task={task}
          onSave={(title, desc) => onUpdateDetails(task.id, title, desc)}
          onClose={() => setShowEdit(false)}
        />
      )}
      {showHistory && (
        <HistoryModal
          taskId={task.id}
          onClose={() => setShowHistory(false)}
        />
      )}
    </>
  );
};

export default TaskCard;