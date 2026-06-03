import type { Context, Next } from "hono";
import { throwError } from "@/errors/handlers";

const ignoreList = [
  "/api/auth",
  "/api/verification-email",
  "/api/public",
  "/openapi.json",
  "/uploads",
];

const requireAuth = async (c: Context, next: Next) => {
  const path = c.req.path;
  const user = c.get("user");

  if (!user && !ignoreList.some((route) => path.startsWith(route))) {
    throwError("UNAUTHORIZED", "Unauthorized access detected", "sessions.get");
  }

  return next();
};

export default requireAuth;
