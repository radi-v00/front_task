import React, { useEffect, useState } from 'react';
import { useTasks } from '../context/TaskContext';
import type { HistoryEntry } from '../types';

interface HistoryModalProps {
  taskId: string;
  onClose: () => void;
}

const HistoryModal: React.FC<HistoryModalProps> = ({ taskId, onClose }) => {
  const { getTaskHistory } = useTasks();
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    setHistory(getTaskHistory(taskId));
  }, [taskId, getTaskHistory]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content history-modal" onClick={e => e.stopPropagation()}>
        <h2>Task History</h2>
        {history.length === 0 ? (
          <p>No changes recorded yet.</p>
        ) : (
          <ul className="history-list">
            {history.map((entry, idx) => (
              <li key={idx}>
                <strong>{entry.field}</strong> changed from "{entry.previousValue}" to "{entry.newValue}"
                <br />
                <small>{new Date(entry.timestamp).toLocaleString()}</small>
              </li>
            ))}
          </ul>
        )}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default HistoryModal;