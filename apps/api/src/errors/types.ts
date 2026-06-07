import type { ContentfulStatusCode } from "hono/utils/http-status";
import type { ERROR_DEFINITIONS } from "./codes";

export type ErrorDefinition = {
  status: ContentfulStatusCode;
  code: string;
};

export type ErrorCodeKey = keyof typeof ERROR_DEFINITIONS;
