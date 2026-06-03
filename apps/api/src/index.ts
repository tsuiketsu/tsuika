import type { Serve } from "bun";
import { app } from "./app";

app.get("/", (c) => {
  return c.text("🔖 Tsuika API up and running");
});

export default {
  port: 8000,
  fetch: app.fetch,
} satisfies Serve;
