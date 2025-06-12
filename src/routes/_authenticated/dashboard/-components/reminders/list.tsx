import ReminderListItem from "./item";
import type { Reminder } from "@/types/reminder";

interface PropsType {
  reminders: Reminder[];
}

export default function RemindersList({ reminders }: PropsType) {
  return (
    <ul className="grid gap-2 @2xl:grid-cols-2 @6xl:grid-cols-1">
      {reminders.map((reminder, idx) => (
        <ReminderListItem reminder={reminder} key={idx} />
      ))}
    </ul>
  );
}
