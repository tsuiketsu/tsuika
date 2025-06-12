import UpdateReminder from "@/components/forms/remidner/update-reminder";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type Reminder } from "@/types/reminder";
import { Checkbox } from "@radix-ui/react-checkbox";
import { format } from "date-fns";
import { Edit, Trash, ChevronRight } from "lucide-react";

interface PropsType {
  reminder: Reminder;
}

export default function ReminderListItem({ reminder }: PropsType) {
  return (
    <li className="bg-card space-y-2 rounded-sm border p-1.5">
      <div className="flex items-start gap-2">
        <span className="aspect-square shrink-0 rounded-sm border p-2">
          {reminder.type === "bookmark" ? (
            <img
              src={reminder.content.faviconUrl}
              alt="bookmark favicon"
              className="w-6"
            />
          ) : null}
        </span>
        <div>
          <span className="line-clamp-1 text-sm">{reminder.content.title}</span>
          <p className="text-muted-foreground line-clamp-2 text-xs">
            {reminder.type === "bookmark"
              ? (reminder.note ?? reminder.content.description)
              : reminder.note}
          </p>
        </div>
        <Checkbox className="ml-auto" />
      </div>
      <div className="inline-flex w-full items-center justify-between">
        <Badge
          variant="outline"
          className="text-muted-foreground gap-2 text-xs"
        >
          ⏰ {format(reminder.remindDate, "dd / MM / yyyy")}
        </Badge>
        <div className="space-x-1.5">
          <UpdateReminder
            contentType="bookmark"
            reminder={reminder}
            customTrigger={
              <Button
                variant="outline"
                size="icon"
                className="bg-card size-7 text-xs shadow-none"
              >
                <Edit className="size-3" />
              </Button>
            }
          />
          <Button
            variant="outline"
            size="icon"
            className="bg-card size-7 text-xs shadow-none"
          >
            <Trash className="size-3" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="bg-card size-7 text-xs shadow-none"
            asChild
          >
            {reminder.type === "bookmark" && (
              <a href={reminder.content.url} target="_blank" rel="noreferror">
                <ChevronRight className="size-3" />
              </a>
            )}
          </Button>
        </div>
      </div>
    </li>
  );
}
