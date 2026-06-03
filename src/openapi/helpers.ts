import { z } from "@hono/zod-openapi";
import { ALLOWED_METHODS } from "@/constants";
import type { ErrorCodeKey } from "@/errors/types";
import { addExamples } from "@/utils/zod-utils";
import { errorSchema, paginationSchema, successSchema } from "./common/schema";

export function createErrorObject({
  desc,
  ...examples
}: { source: string; desc?: string } & Partial<
  Omit<z.infer<typeof errorSchema>, "data" | "code">
> & { code: ErrorCodeKey }) {
  return {
    description: desc ?? examples.message ?? "",
    content: {
      "application/json": {
        schema: addExamples(errorSchema, {
          ...examples,
        }),
      },
    },
  };
}

export function jsonContentRequired<T extends z.ZodTypeAny>(schema: T) {
  return {
    content: {
      "application/json": {
        schema,
      },
    },
  };
}

export function createSuccessObject<T extends z.ZodTypeAny>({
  data,
  message,
  isPagination,
}: {
  data: T;
  message: string;
  isPagination?: boolean;
}) {
  return {
    description: message,
    content: {
      "application/json": {
        schema: addExamples(successSchema, {
          message,
        }).extend({ data, ...(isPagination && paginationSchema.shape) }),
      },
    },
  };
}

export function createUnauthorizedByRoleObject(source: string) {
  return createErrorObject({
    desc: "You have to be either owner or admin",
    message: "Action not permitted: You do not have the necessary permissions",
    code: "UNAUTHORIZED",
    source,
  });
}

export function createIdParamSchema(key: string) {
  return z.object({
    [key]: z.string().openapi({
      param: {
        name: key,
        in: "path",
      },
    }),
  });
}

export function createSources(text: string) {
  return Object.fromEntries(
    ALLOWED_METHODS.map((v) => [v, `${text}/${v.toLowerCase()}`]),
  ) as Record<Lowercase<(typeof ALLOWED_METHODS)[number]>, string>;
}

export function createMeilisearchObject(object: z.ZodObject) {
  return z.object({
    hits: z.array(object),
    query: z.string(),
    processingTimeMs: z.number(),
    limit: z.number(),
    offset: z.number(),
    estimatedTotalHits: z.number(),
  });
}
