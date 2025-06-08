import ReminderListItem from "./item";
import { reminders } from "./reminders";

export default function Reminders() {
  return (
    <ul className="grid gap-2 @2xl:grid-cols-2 @6xl:grid-cols-1">
      {reminders.map((reminder, idx) => (
        <ReminderListItem {...reminder} key={idx} />
      ))}
    </ul>
  );
}
