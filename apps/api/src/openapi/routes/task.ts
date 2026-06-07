import { createRoute, z } from "@hono/zod-openapi";
import { bookmarkSelectSchema } from "@/db/schema/bookmark.schema";
import {
  bookmarkTaskInsertSchema,
  bookmarkTaskSelectSchema,
} from "@/db/schema/task.schema";
import { ERROR_DEFINITIONS } from "@/errors/codes";
import {
  type ContentCategoryType,
  contentCategoryTypes as cat,
  TaskStatus,
} from "@/types/schema.types";
import { paginationQuerySchema } from "../common/schema";
import {
  createErrorObject,
  createIdParamSchema,
  createSources,
  createSuccessObject,
  jsonContentRequired,
} from "../helpers";

const tags = ["Task"];
const sources = createSources("tasks");
const InsertSchema = bookmarkTaskInsertSchema.extend({
  type: z.enum(
    Object.values(cat) as [ContentCategoryType, ...ContentCategoryType[]],
  ),
});
const SelectSchema = bookmarkTaskSelectSchema.extend({
  type: InsertSchema.shape.type,
});

const TaskContentSelectSchema = bookmarkSelectSchema.pick({
  title: true,
  description: true,
  url: true,
  faviconUrl: true,
});

// -----------------------------------------
// INSERT TASK
// -----------------------------------------
export const createTask = createRoute({
  method: "post",
  path: "/{id}",
  summary: "Create",
  tags,
  operationId: "tasks_post",
  request: {
    params: createIdParamSchema("id"),
    body: jsonContentRequired(InsertSchema),
  },
  responses: {
    200: createSuccessObject({
      data: SelectSchema,
      message: "Successfully added task",
    }),
    [ERROR_DEFINITIONS.CONFLICT.status]: createErrorObject({
      message: "Task already exists",
      code: "CONFLICT",
      source: sources.post,
    }),
    [ERROR_DEFINITIONS.INTERNAL_ERROR.status]: createErrorObject({
      message: "Failed to add task",
      code: "INTERNAL_ERROR",
      source: sources.post,
    }),
  },
});

// -----------------------------------------
// GET ALL TASKS
// -----------------------------------------
export const getAllTasks = createRoute({
  method: "get",
  path: "/",
  summary: "Fetch All",
  tags,
  operationId: "tasks_all_get",
  request: {
    query: paginationQuerySchema,
  },
  responses: {
    200: createSuccessObject({
      data: z.array(
        SelectSchema.extend({
          content: TaskContentSelectSchema.optional().nullable(),
        }),
      ),
      message: "Successfully fetched tasks",
      isPagination: true,
    }),
    [ERROR_DEFINITIONS.NOT_FOUND.status]: createErrorObject({
      message: "Tasks not found",
      code: "NOT_FOUND",
      source: sources.get,
    }),
  },
});

// -----------------------------------------
// UPDATE TASK
// -----------------------------------------
export const updateTask = createRoute({
  method: "put",
  path: "/{id}",
  summary: "Update",
  tags,
  operationId: "tasks_put",
  request: {
    params: createIdParamSchema("id"),
    body: jsonContentRequired(bookmarkTaskInsertSchema),
  },
  responses: {
    200: createSuccessObject({
      data: bookmarkTaskSelectSchema,
      message: "Successfully updated task",
    }),
    [ERROR_DEFINITIONS.REQUIRED_FIELD.status]: createErrorObject({
      message: "id is required/remindAt is a invalid date string",
      code: "REQUIRED_FIELD",
      source: sources.put,
    }),
    [ERROR_DEFINITIONS.INTERNAL_ERROR.status]: createErrorObject({
      message: "Failed to update task with id <public_id>",
      code: "INTERNAL_ERROR",
      source: sources.put,
    }),
  },
});

// -----------------------------------------
// SET TASK STATUS
// -----------------------------------------
export const setTaskStatus = createRoute({
  method: "patch",
  path: "/{id}",
  summary: "Change Status",
  tags,
  operationId: "tasks_status_patch",
  request: {
    params: createIdParamSchema("id"),
    query: z.object({ status: z.string() }),
  },
  responses: {
    200: createSuccessObject({
      data: SelectSchema.pick({ id: true, status: true }),
      message: `Successfully set task status to <${Object.values(TaskStatus).join(" | ")}>`,
    }),
    [ERROR_DEFINITIONS.INVALID_PARAMETER.status]: createErrorObject({
      message: `Only [ ${Object.values(TaskStatus).join(" | ")} ] are valid TaskStatus values.`,
      code: "INVALID_PARAMETER",
      source: sources.patch,
    }),
    [ERROR_DEFINITIONS.INTERNAL_ERROR.status]: createErrorObject({
      message: "Failed to set status of task",
      code: "INTERNAL_ERROR",
      source: sources.patch,
    }),
  },
});

// -----------------------------------------
// DELETE TASK
// -----------------------------------------
export const deleteTask = createRoute({
  method: "delete",
  path: "/{id}",
  summary: "Remove Task",
  tags,
  operationId: "tasks_delete",
  request: { params: createIdParamSchema("id") },
  responses: {
    200: createSuccessObject({
      // NOTE: This is unnecessary, remove if frontend not using this
      data: z.object({ deletedId: SelectSchema.pick({ id: true }).shape.id }),
      message: `Successfully deleted task with id <task_id>`,
    }),
    [ERROR_DEFINITIONS.REQUIRED_FIELD.status]: createErrorObject({
      message: "id is required",
      code: "REQUIRED_FIELD",
      source: sources.delete,
    }),
    [ERROR_DEFINITIONS.INTERNAL_ERROR.status]: createErrorObject({
      message: "Failed to delete task with id <task_id>",
      code: "INTERNAL_ERROR",
      source: sources.delete,
    }),
  },
});
