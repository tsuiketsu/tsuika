import { OpenAPIHono } from "@hono/zod-openapi";
import type { auth } from "./auth";

export type AuthType = {
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
};

export function createRouter() {
  return new OpenAPIHono<AuthType>({
    strict: false,
  });
}

export default function createApp() {
  const app = createRouter();
  return app;
}
