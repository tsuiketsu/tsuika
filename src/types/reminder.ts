import type { Bookmark } from "./bookmark";

export const reminderPriorities = {
  LOW: "low",
  NORMAL: "normal",
  HIGH: "high",
} as const;

export type ReminderPriority =
  (typeof reminderPriorities)[keyof typeof reminderPriorities];

export const reminderTypes = {
  BOOKMARK: "bookmark",
  NOTE: "note",
} as const;

export type ReminderType = (typeof reminderTypes)[keyof typeof reminderTypes];

export const reminderStatus = {
  PENDING: "pending",
  DISMISSED: "dismissed",
  DONE: "done",
} as const;

export type ReminderStatus =
  (typeof reminderStatus)[keyof typeof reminderStatus];

interface ReminderCommon {
  id: string;
  note: string;
  status: ReminderStatus;
  priority: ReminderPriority;
  remindDate: string;
  content: {
    title: string;
  };
}

export type Reminder =
  | (ReminderCommon & {
      type: "bookmark";
      content: Pick<Bookmark, "title" | "description" | "url" | "faviconUrl">;
    })
  | (ReminderCommon & {
      type: "note";
      contnet: { title: string };
    });

export interface ReminderInsertSchema
  extends Omit<ReminderCommon, "id" | "content"> {
  type: ReminderType;
}
