import { ApiError } from "./api-error";
import { ERROR_DEFINITIONS } from "./codes";
import type { ErrorCodeKey } from "./types";

export function throwError(
  key: ErrorCodeKey,
  message: string,
  source: string,
): never {
  const def = ERROR_DEFINITIONS[key];
  throw new ApiError(def.status, message, def.code, source);
}
