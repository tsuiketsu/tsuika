import TaskListItem from "./item";
import type { Task } from "@/types/task";

interface PropsType {
  tasks: Task[];
}

export default function TasksList({ tasks }: PropsType) {
  return (
    <ul className="grid gap-2 @2xl:grid-cols-2 @6xl:grid-cols-1">
      {tasks.map((task, idx) => (
        <TaskListItem task={task} key={idx} />
      ))}
    </ul>
  );
}
