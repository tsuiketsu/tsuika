import TasksList from "./list";
import { useInfiniteScrollObserver } from "@/hooks/infinite-scroll-observer";
import { fetchTasks } from "@/queries/task.queries";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export default function Tasks() {
  const { data, isFetching, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const fetchNextHandler = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  const sneakyRef = useInfiniteScrollObserver(fetchNextHandler, isFetching);

  const tasks = useMemo(() => {
    return data?.pages.flatMap((page) => page.data);
  }, [data]);

  if (!tasks || tasks.length === 0) {
    return null;
  }

  return (
    <>
      <TasksList tasks={tasks} isFetching={isFetching} />
      <span ref={sneakyRef} className="invisible block h-0.5"></span>
    </>
  );
}
