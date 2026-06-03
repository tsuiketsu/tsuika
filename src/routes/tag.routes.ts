import { and, asc, desc, eq, ilike, sql } from "drizzle-orm";
import type { Context } from "hono";
import kebabCase from "lodash.kebabcase";
import tinycolor from "tinycolor2";
import { throwError } from "@/errors/handlers";
import {
  createTag,
  deleteTag,
  getAllTags,
  getTotalTagsCount,
  searchTag,
  updateTag,
} from "@/openapi/routes/tag";
import { generatePublicId } from "@/utils/nanoid";
import { db } from "../db";
import { tag } from "../db/schema/tag.schema";
import { createRouter } from "../lib/create-app";
import { type OrderDirection, orderDirections } from "../types";
import type { TagType } from "../types/schema.types";
import { getPagination, getUserId } from "../utils";

const router = createRouter();

const getTagId = async (c: Context) => {
  const userId = await getUserId(c);
  const tagId = c.req.param("id");

  if (!tagId) {
    throwError("REQUIRED_FIELD", "Tag ID is required", "tags.get");
  }

  const isTagExists = await db.query.tag.findFirst({
    where: and(eq(tag.userId, userId), eq(tag.publicId, tagId)),
  });

  if (!isTagExists) {
    throwError("NOT_FOUND", `Tag with id ${tagId} not found`, "tags.get");
  }

  return tagId;
};

const tagPublicFields = {
  id: tag.publicId,
  color: tag.color,
  name: tag.name,
  createdAt: tag.createdAt,
  updatedAt: tag.updatedAt,
  useCount: tag.useCount,
};

// -----------------------------------------
// ADD NEW TAG
// -----------------------------------------
router.openapi(createTag, async (c) => {
  const source = "tags.post";
  const userId = await getUserId(c);

  const { name, color } = c.req.valid("json");

  if (!tinycolor(color).isValid()) {
    throwError(
      "INVALID_PARAMETER",
      "Color must be a valid CSS color value",
      source,
    );
  }

  const data: TagType[] = await db
    .insert(tag)
    .values({
      publicId: generatePublicId(),
      userId,
      name: kebabCase(name),
      color,
    })
    .returning(tagPublicFields);

  if (data.length === 0 || data[0] == null) {
    throwError("INTERNAL_ERROR", "Failed to add tag", source);
  }

  return c.json(
    {
      success: true,
      message: "Successfully added tag",
      data: data[0],
    },
    200,
  );
});

// -----------------------------------------
// GET TOTAL TAGS COUNT
// -----------------------------------------
router.openapi(getTotalTagsCount, async (c) => {
  const userId = await getUserId(c);

  const data = await db
    .select({ count: sql<number>`count(*)` })
    .from(tag)
    .where(eq(tag.userId, userId));

  if (!data || data[0] == null) {
    throwError("NOT_FOUND", "No tags found", "tags.get");
  }

  return c.json(
    {
      success: true,
      data: { total: data[0].count },
      message: "Successfully fetched total tags count",
    },
    200,
  );
});

// -----------------------------------------
// GET ALL TAGS
// -----------------------------------------
router.openapi(getAllTags, async (c) => {
  const userId = await getUserId(c);
  const orderBy = c.req.query("orderBy")?.toLowerCase() as OrderDirection;

  if (orderBy && !orderDirections.includes(orderBy)) {
    throwError("INVALID_PARAMETER", "Invalid order direction", "tags.get");
  }

  const { offset, limit, page } = getPagination(c.req.query());

  const data = await db.query.tag.findMany({
    where: eq(tag.userId, userId),
    columns: { id: false, userId: false },
    orderBy: orderBy === "desc" ? desc(tag.updatedAt) : asc(tag.updatedAt),
    with: {
      bookmarkTag: {
        columns: {
          bookmarkId: true,
        },
      },
    },
    offset,
    limit,
  });

  if (data.length === 0) {
    throwError("NOT_FOUND", "No tags found", "tags.get");
  }

  return c.json(
    {
      success: true,
      message: "Successfully fetched all tags",
      data: data.map(({ publicId, bookmarkTag, ...tag }) => ({
        id: publicId,
        ...tag,
        useCount: bookmarkTag.length,
      })),
      pagination: {
        page,
        limit,
        total: data.length,
        hasMore: data.length === limit,
      },
    },
    200,
  );
});

// -----------------------------------------
// SEARCH TAG
// -----------------------------------------
router.openapi(searchTag, async (c) => {
  const userId = await getUserId(c);

  const id = c.req.query("id");
  const name = c.req.query("name")?.toLowerCase().trim();

  if (!(name || id)) {
    throwError(
      "MISSING_PARAMETER",
      "Missing required parameter: either `name` or `id` must be provided. " +
        "If both are provided, `id` will take priority.",
      "tags.get",
    );
  }

  let data: unknown | undefined;

  const rawLimit = c.req.param("limit");
  const queryLimit = Number.parseInt(rawLimit ?? "5", 10);
  const safeLimit = Number.isNaN(queryLimit) ? 5 : queryLimit;

  if (id) {
    const parsedId = Number.parseInt(id);

    if (Number.isNaN(parsedId)) {
      throwError(
        "INVALID_PARAMETER",
        "Tag ID must be a valid number",
        "tags.get",
      );
    }

    data = await db
      .select(tagPublicFields)
      .from(tag)
      .where(and(eq(tag.userId, userId), eq(tag.id, parsedId)))
      .limit(safeLimit);
  } else if (name) {
    data = await db
      .select(tagPublicFields)
      .from(tag)
      .where(and(eq(tag.userId, userId), ilike(tag.name, `%${name}%`)))
      .limit(safeLimit);
  }

  if (!data) {
    throwError("NOT_FOUND", "Tag not found", "tags.get");
  }

  return c.json(
    {
      success: true,
      message: "Successfully fetched tags",
      data: data as TagType[],
    },
    200,
  );
});

// -----------------------------------------
// UPDATE TAG
// -----------------------------------------
router.openapi(updateTag, async (c) => {
  const { name, color } = c.req.valid("json");

  const userId = await getUserId(c);
  const tagId = await getTagId(c);

  const data: TagType[] = await db
    .update(tag)
    .set({
      name: kebabCase(name),
      color,
      updatedAt: sql`NOW()`,
    })
    .where(and(eq(tag.userId, userId), eq(tag.publicId, tagId)))
    .returning(tagPublicFields);

  if (data.length === 0 || data[0] == null) {
    throwError("INTERNAL_ERROR", "Failed to update tag", "tags.put");
  }

  return c.json(
    {
      success: true,
      message: "Successfully updated tag",
      data: data[0],
    },
    200,
  );
});

// -----------------------------------------
// DELETE TAG
// -----------------------------------------
router.openapi(deleteTag, async (c) => {
  const userId = await getUserId(c);
  const tagId = await getTagId(c);

  const result = await db
    .delete(tag)
    .where(and(eq(tag.userId, userId), eq(tag.publicId, tagId)));

  if (result.rowCount === 0) {
    throwError("INTERNAL_ERROR", "Failed to delete tag", "tags.delete");
  }

  return c.json({ success: true, message: "Successfully deleted tag" }, 200);
});

export default router;
