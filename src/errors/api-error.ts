import { HTTPException } from "hono/http-exception";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import type { ErrorCodeKey } from "@/errors/types";

class ApiError extends HTTPException {
  constructor(
    statusCode: ContentfulStatusCode,
    message: string,
    code: ErrorCodeKey | (string & {}),
    source?: string,
    errors: Error[] = [],
  ) {
    super(statusCode, {
      res: new Response(
        JSON.stringify({
          success: false,
          message,
          code,
          source,
          data: null,
          errors: errors.map((e) => ({
            message: e.message,
            stack: e.stack,
          })),
          timestamp: new Date().toISOString(),
        }),
        {
          status: statusCode,
          headers: {
            "Content-Type": "application/json",
          },
        },
      ),
    });
  }
}

export { ApiError };
