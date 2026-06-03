import type { Context, Next } from "hono";
import type { RequestHeader } from "hono/utils/headers";
import { throwError } from "@/errors/handlers";

const errorText = "middleware:block_demo_host";
const ignoreList = ["/api/auth/sign-in", "/api/auth/sign-out"];
const allowedMethods = ["GET", "OPTIONS"];
const allowedAuthMethods = [...allowedMethods, "POST"];

const blockDemoHostMiddleware = async (c: Context, next: Next) => {
  const header = (str: RequestHeader) => c.req.header(str);

  const origin = header("Origin") || header("Referer") || header("Host");
  const path = c.req.path;
  const method = c.req.method;

  const isAuthPath = ignoreList.some((route) => path.includes(route));
  const isOriginDemo = !origin || origin.toLowerCase()?.includes("demo");

  if (isOriginDemo && isAuthPath && !allowedAuthMethods.includes(method)) {
    const message = `Method ${method} is not allowed on demo auth routes.`;
    throwError("FORBIDDEN", message, errorText);
  }

  if (isOriginDemo && !isAuthPath && !allowedMethods.includes(method)) {
    throwError("FORBIDDEN", "Read-only demo: action disabled.", errorText);
  }

  await next();
};

export default blockDemoHostMiddleware;
