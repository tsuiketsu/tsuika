import TaskListItem from "./item";
import TaskItemSkeletion from "./skeleton";
import type { Task } from "@/types/task";

interface PropsType {
  tasks: Task[];
  isFetching: boolean;
}

export default function TasksList({ tasks, isFetching }: PropsType) {
  return (
    <ul className="grid gap-2 @2xl:grid-cols-2 @6xl:grid-cols-1">
      {tasks.map((task, idx) => (
        <TaskListItem task={task} key={idx} />
      ))}
      {isFetching &&
        Array.from({ length: 5 }).map((_, idx) => (
          <TaskItemSkeletion key={`task-ske-${idx}`} />
        ))}
    </ul>
  );
}
