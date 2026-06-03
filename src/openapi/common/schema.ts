import { z } from "@hono/zod-openapi";
import type { ErrorCodeKey } from "@/errors/types";

export const errorSchema = z.object({
  success: z.boolean().default(false),
  message: z.string().openapi({ example: "No bookmarks found" }),
  code: z.string().openapi({
    example: "NOT_FOUND",
  } satisfies {
    example: ErrorCodeKey;
  }),
  data: z.null(),
  errors: z.array(z.any()),
  source: z.string(),
  timestamp: z.date().openapi({ example: new Date().toISOString() }),
});

export const paginationSchema = z.object({
  page: z.number().openapi({ example: 2 }),
  limit: z.number().openapi({ example: 10 }),
  total: z.number().openapi({ example: 11 }),
  hasMore: z.boolean().openapi({ example: false }),
});

export const paginationQuerySchema = z.object({
  page: z.string().optional().openapi({ example: 1 }),
  limit: z.string().optional().openapi({ example: 1 }),
});

export const successSchema = z.object({
  success: z.boolean().default(true),
  message: z.string().openapi({
    example: "Successfully fetched urls",
  }),
});

export const sessionSchema = z.object({
  id: z.string(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
  userId: z.coerce.string(),
  expiresAt: z.date(),
  token: z.string(),
  ipAddress: z.string().nullable().optional(),
  userAgent: z.string().nullable().optional(),
});

export const userSchema = z.object({
  id: z.string(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
  email: z.string().transform((val) => val.toLowerCase().trim()),
  emailVerified: z.boolean().default(false),
  name: z.string(),
  username: z.string().optional().nullable(),
  image: z.string().nullable().optional(),
});
