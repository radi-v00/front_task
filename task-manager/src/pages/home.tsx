import { useTasks } from "../context/TaskContext";
import TaskCard from "../components/TaskCard/TaskCard";
const Home = () => {
  const { tasks } = useTasks();

  const todo = tasks.filter(
    (t) => t.status === "ToDo"
  );

  const inProgress = tasks.filter(
    (t) => t.status === "InProgress"
  );

  const inQA = tasks.filter(
    (t) => t.status === "InQA"
  );

  const done = tasks.filter(
    (t) => t.status === "Done"
  );

 return (
  <div className="board">
    <div className="column">
      <h2>To Do</h2>
      {todo.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>

    <div className="column">
      <h2>In Progress</h2>
      {inProgress.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>

    <div className="column">
      <h2>In QA</h2>
      {inQA.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>

    <div className="column">
      <h2>Done</h2>
      {done.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  </div>
);
};

export default Home;
