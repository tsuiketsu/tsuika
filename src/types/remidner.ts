export const reminderPriorities = {
  LOW: "low",
  NORMAL: "normal",
  HIGH: "high",
} as const;

export type ReminderPriority =
  (typeof reminderPriorities)[keyof typeof reminderPriorities];

export const reminderTypes = {
  BOOKMARK: "bookmark",
} as const;

export type ReminderType = (typeof reminderTypes)[keyof typeof reminderTypes];

export const reminderStatus = {
  PENDING: "pending",
  DISMISSED: "dismissed",
  DONE: "done",
} as const;

export type ReminderStatus =
  (typeof reminderStatus)[keyof typeof reminderStatus];

export interface Reminder {
  id: string;
  note: string;
  status: ReminderStatus;
  priority: ReminderPriority;
  remindDate: string;
}

export interface ReminderInsertSchema extends Omit<Reminder, "id"> {
  type: ReminderType;
}
