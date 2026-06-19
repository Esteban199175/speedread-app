import { existsSync } from "node:fs";
import path from "node:path";
import EmbeddedPostgres from "embedded-postgres";

process.loadEnvFile(".env.local");

const dataDir = path.join(process.cwd(), ".pgdata");
const port = Number(process.env.PGPORT || 5433);
const isFirstRun = !existsSync(dataDir);

const pg = new EmbeddedPostgres({
  databaseDir: dataDir,
  port,
  user: "postgres",
  password: "password",
  persistent: true,
});

if (isFirstRun) {
  console.log("Initializing embedded Postgres cluster...");
  await pg.initialise();
}

await pg.start();

if (isFirstRun) {
  console.log("Creating 'speedread' database...");
  await pg.createDatabase("speedread");
}

console.log(
  `Postgres ready at postgresql://postgres:password@localhost:${port}/speedread`
);

// Keep the process alive so the cluster keeps running. embedded-postgres
// registers an exit hook that shuts the cluster down gracefully on SIGINT/exit.
await new Promise(() => {});
