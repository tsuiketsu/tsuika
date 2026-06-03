import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { bookmark } from "@/db/schema/bookmark.schema";
import { bookmarkTask } from "@/db/schema/task.schema";
import { throwError } from "@/errors/handlers";
import { createRouter } from "@/lib/create-app";
import {
  createTask,
  deleteTask,
  getAllTasks,
  setTaskStatus,
  updateTask,
} from "@/openapi/routes/task";
import {
  type ContentCategoryType,
  contentCategoryTypes as cat,
  contentCategoryTypes,
  TaskStatus,
} from "@/types/schema.types";
import { getPagination, getUserId, pick } from "@/utils";
import { generatePublicId } from "@/utils/nanoid";
import { bookmarkPublicFields } from "./bookmark.routes";

const router = createRouter();

const getContentRowId = async (
  userId: string,
  publicId: string,
  type: ContentCategoryType,
): Promise<number> => {
  let data: { id: number } | undefined;

  if (type === cat.BOOKMARK) {
    data = await db.query.bookmark.findFirst({
      where: (b, { and, eq }) =>
        and(eq(b.userId, userId), eq(b.publicId, publicId)),
      columns: { id: true },
    });
  }

  if (!data || !data.id) {
    throwError(
      "NOT_FOUND",
      `Bookmark with id ${publicId} not found`,
      "tasks.bookmarks.get",
    );
  }

  return data.id;
};

const whereUserId = (userId: string) => eq(bookmarkTask.userId, userId);
const wherePublicId = (id: string) => eq(bookmarkTask.publicId, id);

const selectPublicFields = {
  id: bookmarkTask.publicId,
  note: bookmarkTask.note,
  status: bookmarkTask.status,
  priority: bookmarkTask.priority,
  isDone: bookmarkTask.isDone,
  remindAt: bookmarkTask.remindAt,
  createdAt: bookmarkTask.createdAt,
  updatedAt: bookmarkTask.updatedAt,
} satisfies {
  [key in keyof typeof bookmarkTask]?: unknown;
};

export const contentPublicFields = {
  bookmark: pick(bookmarkPublicFields, [
    "title",
    "description",
    "url",
    "faviconUrl",
  ]),
} satisfies Partial<Record<ContentCategoryType, unknown>>;

// -----------------------------------------
// INSERT TASK
// -----------------------------------------
router.openapi(createTask, async (c) => {
  const { priority, note, remindAt: reminderDate, type } = c.req.valid("json");

  const contentPublicId = c.req.param("id");

  const userId = await getUserId(c);

  const contentId = await getContentRowId(userId, contentPublicId, type);
  const publicId = generatePublicId();
  const remindAt = new Date(reminderDate);

  const taskRow = await db.query.bookmarkTask.findFirst({
    where: (r, { and, eq }) =>
      and(eq(r.userId, userId), eq(r.contentId, contentId)),
    columns: { id: true },
  });

  if (typeof taskRow !== "undefined") {
    throwError("CONFLICT", "Task already exists", "tasks.post");
  }

  const data = await db
    .insert(bookmarkTask)
    .values({
      publicId,
      userId,
      note,
      remindAt,
      // biome-ignore lint/suspicious/noExplicitAny: false
      priority: priority as any,
      contentId,
    })
    .returning(selectPublicFields);

  if (!data || data[0] == null) {
    throwError("INTERNAL_ERROR", "Failed to add task", "tasks.post");
  }

  return c.json(
    {
      success: true,
      data: { ...data[0], type },
      message: "Successfully added task",
    },
    200,
  );
});

// -----------------------------------------
// GET ALL TASKS
// -----------------------------------------
router.openapi(getAllTasks, async (c) => {
  const { page, limit, offset } = getPagination(c.req.query());
  const userId = await getUserId(c);

  const data = await db
    .select({
      ...selectPublicFields,
      content: contentPublicFields.bookmark,
    })
    .from(bookmarkTask)
    .where(eq(bookmarkTask.userId, userId))
    .leftJoin(bookmark, eq(bookmark.id, bookmarkTask.contentId))
    .offset(offset)
    .limit(limit);

  if (!data || data[0] == null) {
    throwError("NOT_FOUND", "Tasks not found", "tasks.get");
  }

  return c.json(
    {
      success: true,
      message: "Successfully fetched tasks",
      data: data.map((item) => ({
        ...item,
        type: contentCategoryTypes.BOOKMARK,
      })),
      pagination: {
        page,
        limit,
        hasMore: data.length === limit,
        total: data.length,
      },
    },
    200,
  );
});

// -----------------------------------------
// UPDATE TASK
// -----------------------------------------
router.openapi(updateTask, async (c) => {
  const { note, remindAt: remindAtStr, priority } = c.req.valid("json");
  const userId = await getUserId(c);

  const publicId = c.req.param("id");

  if (!publicId) {
    throwError("REQUIRED_FIELD", "id is required", "tasks.put");
  }

  const remindAt = new Date(remindAtStr);

  if (Number.isNaN(remindAt.getTime())) {
    throwError(
      "INVALID_PARAMETER",
      "remindAt is a invalid date string",
      "tasks.put",
    );
  }

  const data = await db
    .update(bookmarkTask)
    // biome-ignore lint/suspicious/noExplicitAny: false
    .set({ note, remindAt, priority: priority as any })
    .where(and(whereUserId(userId), wherePublicId(publicId)))
    .returning(selectPublicFields);

  if (!data || data[0] == null) {
    throwError(
      "INTERNAL_ERROR",
      `Failed to update task with id "${publicId}"`,
      "tasks.put",
    );
  }

  return c.json(
    {
      success: true,
      data: data[0],
      message: "Successfully updated task",
    },
    200,
  );
});

// -----------------------------------------
// SET TASK STATUS
// -----------------------------------------
router.openapi(setTaskStatus, async (c) => {
  const publicId = c.req.param("id");

  if (!publicId) {
    throwError("REQUIRED_FIELD", "id is required", "tasks.put");
  }

  const status = c.req.query("status");

  if (!status || !Object.values(TaskStatus).includes(status as TaskStatus)) {
    throwError(
      "INVALID_PARAMETER",
      `Only [ ${Object.values(TaskStatus).join(" | ")} ] are valid TaskStatus values.`,
      "tasks.patch",
    );
  }

  const userId = await getUserId(c);

  const data = await db
    .update(bookmarkTask)
    .set({
      status: status as TaskStatus,
    })
    .where(and(whereUserId(userId), eq(bookmarkTask.publicId, publicId)))
    .returning({ id: bookmarkTask.publicId, status: bookmarkTask.status });

  if (!data || data[0] == null) {
    throwError("INTERNAL_ERROR", "Failed to set status of task", "tasks.patch");
  }

  return c.json(
    {
      success: true,
      data: data[0],
      message: `Successfully set task status to ${status}`,
    },
    200,
  );
});

// -----------------------------------------
// DELETE TASK
// -----------------------------------------
router.openapi(deleteTask, async (c) => {
  const publicId = c.req.param("id");

  if (!publicId) {
    throwError("REQUIRED_FIELD", "id is required", "tasks.put");
  }

  const userId = await getUserId(c);

  const data = await db
    .delete(bookmarkTask)
    .where(and(whereUserId(userId), eq(bookmarkTask.publicId, publicId)))
    .returning({
      deletedId: bookmarkTask.publicId,
    });

  if (!data || data[0] == null) {
    throwError(
      "INTERNAL_ERROR",
      `Failed to delete task with id "${publicId}"`,
      "tasks.delete",
    );
  }

  return c.json(
    {
      success: true,
      // NOTE: This is unnecessary, remove if frontend not using this
      data: data[0],
      message: `Successfully deleted task with id "${publicId}"`,
    },
    200,
  );
});

export default router;
