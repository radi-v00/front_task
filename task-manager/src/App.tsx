import React from 'react';
import { TaskProvider, useTasks } from './context/TaskContext';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import './App.css';

const AppContent: React.FC = () => {
  const { tasks, addTask, updateTaskStatus, updateTaskDetails } = useTasks();

  return (
    <div className="app">
      <header>
        <h1>📋 Task Manager</h1>
        <p>Manage your work items with full history</p>
      </header>
      <main>
        <section className="create-section">
          <h2>Create new task</h2>
          <TaskForm onAdd={addTask} />
        </section>
        <section className="tasks-section">
          <h2>All tasks</h2>
          <TaskList
            tasks={tasks}
            onStatusChange={updateTaskStatus}
            onUpdateDetails={updateTaskDetails}
          />
        </section>
      </main>
    </div>
  );
};

function App() {
  return (
    <TaskProvider>
      <AppContent />
    </TaskProvider>
  );
}

export default App;