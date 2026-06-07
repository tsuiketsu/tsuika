/** biome-ignore-all lint/suspicious/noConsole: false */

import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { app } from "./app";
import { pool } from "./db";

async function main() {
  console.log("Running migrations...");

  const migrationClient = drizzle({ client: pool });
  await migrate(migrationClient, { migrationsFolder: "./drizzle" });

  console.log("Migrations done");

  app.get("/", (c) => {
    return c.text("🔖 Tsuika API up and running");
  });

  const server = Bun.serve({
    fetch: app.fetch,
    port: 8000,
  });

  console.log(`Server started at ${server.port}`);

  return server;
}

main().catch((err) => {
  console.error("Failed to start:", err);
  process.exit(1);
});
