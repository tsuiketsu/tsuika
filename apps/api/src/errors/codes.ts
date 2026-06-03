import type { ErrorDefinition } from "./types";

export const ERROR_DEFINITIONS = {
  ALREADY_EXISTS: {
    code: "ALREADY_EXISTS",
    status: 409,
  },
  CONFLICT: {
    code: "CONFLICT",
    status: 409,
  },

  // AUTHENTICATION & AUTHORIZATION
  UNAUTHORIZED: {
    code: "UNAUTHORIZED",
    status: 401,
  },

  // VALIDATION ERRORS
  REQUIRED_FIELD: {
    code: "REQUIRED_FIELD",
    status: 400,
  },

  // INPUT/OUTPUT ERRORS
  INVALID_INPUT: {
    code: "INVALID_INPUT",
    status: 400,
  },
  MISSING_PARAMETER: {
    code: "MISSING_PARAMETER",
    status: 400,
  },
  INVALID_PARAMETER: {
    code: "INVALID_PARAMETER",
    status: 400,
  },

  // FILE/DATA ERRORS
  FORBIDDEN: {
    code: "FORBIDDEN",
    status: 403,
  },
  NOT_FOUND: {
    code: "NOT_FOUND",
    status: 404,
  },
  GONE: {
    code: "GONE",
    status: 410,
  },
  TOO_LARGE: {
    code: "TOO_LARGE",
    status: 413,
  },
  UNSUPPORTED_FORMAT: {
    code: "UNSUPPORTED_FORMAT",
    status: 415,
  },

  // GENERIC FALLBACKS
  INTERNAL_ERROR: {
    status: 500,
    code: "INTERNAL_ERROR",
  },
  DATABASE_ERROR: {
    status: 500,
    code: "DATABASE_ERROR",
  },
  UNKNOWN_ERROR: {
    code: "UNKNOWN_ERROR",
    status: 500,
  },
  NOT_IMPLEMENTED: {
    code: "NOT_IMPLEMENTED",
    status: 501,
  },
  THIRD_PARTY_SERVICE_FAILED: {
    code: "THIRD_PARTY_SERVICE_FAILED",
    status: 502,
  },
  SERVICE_UNAVAILABLE: {
    status: 503,
    code: "SERVICE_UNAVAILABLE",
  },
} as const satisfies { [key: string]: ErrorDefinition };
