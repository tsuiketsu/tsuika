import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@radix-ui/react-checkbox";
import { Edit, Trash, ChevronRight } from "lucide-react";

interface PropsType {
  title: string;
  url: string;
  reminderDate: string | Date;
  notes: string;
  favicon: string;
}

export default function ReminderListItem(reminder: PropsType) {
  return (
    <li className="bg-card space-y-2 rounded-sm border p-1.5">
      <div className="flex items-start gap-2">
        <span className="aspect-square shrink-0 rounded-sm border p-2">
          <img src={reminder.favicon} className="size-6" />
        </span>
        <div>
          <span className="line-clamp-1 text-sm">{reminder.notes}</span>
          <p className="text-muted-foreground line-clamp-1 text-xs">
            {reminder.notes}
          </p>
        </div>
        <Checkbox className="ml-auto" />
      </div>
      <div className="inline-flex w-full items-center justify-between">
        <Badge
          variant="outline"
          className="text-muted-foreground gap-2 text-xs"
        >
          ⏰ 02/12/2024
        </Badge>
        <div className="space-x-1.5">
          <Button
            variant="outline"
            size="icon"
            className="bg-card size-7 text-xs shadow-none"
          >
            <Edit className="size-3" />
          </Button>
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
            <a href={reminder.url} target="_blank" rel="noreferror">
              <ChevronRight className="size-3" />
            </a>
          </Button>
        </div>
      </div>
    </li>
  );
}
