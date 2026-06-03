import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

async function runMigration() {
  console.log("Migration started...");

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  const client = postgres(dbUrl, { max: 1 });
  const db = drizzle(client);

  try {
    await migrate(db, { migrationsFolder: "./drizzle" });
    console.log("Migration completed successfully ✅");
  } catch (error) {
    console.error("Migration failed ❌:", error);
    process.exit(1);
  } finally {
    await client.end();
    console.log("Database connection closed");
  }
}

runMigration().catch((error) => {
  console.error("Error in migration process 🚨:", error);
  process.exit(1);
});
