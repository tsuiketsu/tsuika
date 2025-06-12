import TasksList from "./list";
import { fetchTasks } from "@/queries/task.queries";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export default function Tasks() {
  const { data } = useInfiniteQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const tasks = useMemo(() => {
    return data?.pages.flatMap((page) => page.data);
  }, [data]);

  if (!tasks || tasks.length === 0) {
    return null;
  }

  return <TasksList tasks={tasks} />;
}
