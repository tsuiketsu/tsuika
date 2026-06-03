/** biome-ignore-all lint/suspicious/noExplicitAny: false */
import type { z } from "@hono/zod-openapi";

export function addExamples<T extends z.ZodObject<z.ZodRawShape, any>>(
  schema: T,
  examples: Partial<Record<keyof T["shape"], any>>,
) {
  const shape = { ...schema.shape };
  for (const key in examples) {
    if (shape[key]) {
      shape[key] = (shape[key] as any).openapi({ example: examples[key] });
    }
  }

  return schema.extend(shape) as T;
}
