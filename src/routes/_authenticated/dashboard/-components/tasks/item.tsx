import TaskCheckbox from "./checkbox";
import DeleteTask from "@/components/forms/task/delete-task";
import UpdateTask from "@/components/forms/task/update-task";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type Task } from "@/types/task";
import { format } from "date-fns";
import { Edit, ChevronRight } from "lucide-react";

interface PropsType {
  task: Task;
}

export default function TaskListItem({ task: task }: PropsType) {
  return (
    <li className="bg-card space-y-2 rounded-sm border p-1.5">
      <div className="flex items-start gap-2">
        <span className="aspect-square shrink-0 rounded-sm border p-2">
          {task.type === "bookmark" ? (
            <img
              src={task.content.faviconUrl}
              alt="bookmark favicon"
              className="aspect-square size-6"
            />
          ) : null}
        </span>
        <div>
          <span className="line-clamp-1 text-sm">{task.content.title}</span>
          <p className="text-muted-foreground line-clamp-2 text-xs">
            {task.type === "bookmark"
              ? task.note || task.content.description
              : task.note}
          </p>
        </div>
        <TaskCheckbox task={task} />
      </div>
      <div className="inline-flex w-full items-end justify-between">
        <Badge
          variant="outline"
          className="text-muted-foreground gap-2 text-xs"
        >
          ⏰ {format(task.remindAt, "dd / MM / yyyy")}
        </Badge>
        <div className="space-x-1.5">
          <UpdateTask
            contentType="bookmark"
            task={task}
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
          <DeleteTask taskId={task.id} />
          <Button
            variant="outline"
            size="icon"
            className="bg-card size-7 text-xs shadow-none"
            asChild
          >
            {task.type === "bookmark" && (
              <a href={task.content.url} target="_blank" rel="noreferror">
                <ChevronRight className="size-3" />
              </a>
            )}
          </Button>
        </div>
      </div>
    </li>
  );
}
