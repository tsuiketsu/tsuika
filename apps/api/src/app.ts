import { serveStatic } from "hono/bun";
import { cors } from "hono/cors";
import { csrf } from "hono/csrf";
import { logger } from "hono/logger";
import kebabCase from "lodash.kebabcase";
import { ALLOWED_METHODS, trustedOrigins, UPLOADS_DIR } from "./constants";
import createApp from "./lib/create-app";
import blockDemoHostMiddleware from "./middlewares/block-demo-host.middleware";
import requireAuth from "./middlewares/require-auth.middleware";
import addSession from "./middlewares/session.middleware";
import * as allRoutes from "./routes";

const app = createApp();

// Middlewares
app.use(logger());
app.use("*", addSession);
app.use(csrf({ origin: trustedOrigins }));
app.use(
  "*",
  cors({
    origin: trustedOrigins,
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ALLOWED_METHODS.map((s) => s), // converts readonly[] to string[]
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  }),
);
app.use("*", blockDemoHostMiddleware);
app.use("*", requireAuth);
app.use(`${UPLOADS_DIR.replace(".", "")}/*`, serveStatic({ root: "./" }));

// ROUTES
const { auth, authData, share, ...routes } = allRoutes;

app.route("/api", auth);
app.route("/api", authData);
app.route("/api/public", share);

for (const [key, value] of Object.entries(routes)) {
  app.route(`/api/v1/${kebabCase(key)}s`, value);
}

app.doc("/openapi.json", {
  openapi: "3.1.0",
  info: {
    version: "1.0.0",
    title: "Tsuika",
  },
  servers: [
    {
      url: "http://localhost:8000",
      description: "Local development",
    },
  ],
});

export { app };
