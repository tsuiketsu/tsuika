import RemindersList from "./list";
import { fetchReminders } from "@/queries/reminder.queries";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export default function Reminders() {
  const { data } = useInfiniteQuery({
    queryKey: ["reminders"],
    queryFn: fetchReminders,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const reminders = useMemo(() => {
    return data?.pages.flatMap((page) => page.data);
  }, [data]);

  if (!reminders || reminders.length === 0) {
    return null;
  }

  return <RemindersList reminders={reminders} />;
}
