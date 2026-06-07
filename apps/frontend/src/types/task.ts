import type { Bookmark } from "./bookmark";

export const taskPriorities = {
  LOW: "low",
  NORMAL: "normal",
  HIGH: "high",
} as const;

export type TaskPriority = (typeof taskPriorities)[keyof typeof taskPriorities];

export const taskTypes = {
  BOOKMARK: "bookmark",
  NOTE: "note",
} as const;

export type TaskType = (typeof taskTypes)[keyof typeof taskTypes];

export const taskStatus = {
  PENDING: "pending",
  DISMISSED: "dismissed",
  DONE: "done",
} as const;

export type TaskStatus = (typeof taskStatus)[keyof typeof taskStatus];

interface TaskCommon {
  id: string;
  note: string;
  status: TaskStatus;
  priority: TaskPriority;
  remindAt: string;
  content: {
    title: string;
  };
}

export type Task =
  | (TaskCommon & {
      type: "bookmark";
      content: Pick<Bookmark, "title" | "description" | "url" | "faviconUrl">;
    })
  | (TaskCommon & {
      type: "note";
      content: { title: string; description: string };
    });

export interface TaskInsertSchema extends Omit<TaskCommon, "id" | "content"> {
  type: TaskType;
}
