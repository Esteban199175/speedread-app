import pg from "pg";
const { Client } = pg;

// NEON_DATABASE_URL, not DATABASE_URL: this script inspects the remote Neon
// database, which is a different target from the local dev postgres.
if (!process.env.NEON_DATABASE_URL) {
  process.loadEnvFile(".env.local");
}

const client = new Client({
  connectionString: process.env.NEON_DATABASE_URL,
});

await client.connect();
const res = await client.query(
  "SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename"
);
console.log("Tables in Neon:");
res.rows.forEach((r) => console.log(" -", r.tablename));
await client.end();
