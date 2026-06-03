import type { Context, Next } from "hono";
import { ApiError } from "@/errors/api-error";
import { INVALID_CHARS } from "../constants";

interface ValidationRules {
  fieldName: string;
  maxLength?: number;
  errorMessages?: { maxLength?: string };
  errorCodes?: { maxLength?: string };
}

const createFieldValidator =
  (rules: ValidationRules) => async (c: Context, next: Next) => {
    const json = await c.req.json();
    const value: string = json[rules.fieldName];

    if (INVALID_CHARS.test(value)) {
      throw new ApiError(
        400,
        "Field contains invalid characters",
        "FIELD_INVALID_CHARS",
      );
    }

    if (value.length > (rules.maxLength ?? 50)) {
      throw new ApiError(
        400,
        rules.errorMessages?.maxLength ||
          `${rules.fieldName} exceeds maximum length of ${rules.maxLength} characters.`,
        rules.errorCodes?.maxLength || "FIELD_TOO_LONG",
      );
    }

    return next();
  };

export default createFieldValidator;
