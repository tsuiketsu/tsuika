import TasksList from "./list";
import FallbackScreen from "@/components/fallback";
import { useInfiniteScrollObserver } from "@/hooks/infinite-scroll-observer";
import { fetchTasks } from "@/queries/task.queries";
import { useInfiniteQuery } from "@tanstack/react-query";
import { AlarmClockCheck } from "lucide-react";
import { useMemo } from "react";

export default function Tasks() {
  const { data, isFetching, isFetched, fetchNextPage, hasNextPage, error } =
    useInfiniteQuery({
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

  if ((isFetched && tasks?.length === 0) || !tasks || error) {
    return (
      <div className="bg-card flex min-h-96 w-full items-center rounded-xl shadow-sm">
        <FallbackScreen
          title="No Tasks"
          description="Add a task to view it here"
          iconSize={38}
          icon={AlarmClockCheck}
        />
      </div>
    );
  }

  return (
    <>
      <TasksList tasks={tasks} isFetching={isFetching} />
      <span ref={sneakyRef} className="invisible block h-0.5"></span>
    </>
  );
}
