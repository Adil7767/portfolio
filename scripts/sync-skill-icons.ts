/**
 * Updates skill icon_url in DB from lib/tech-icons.ts (fixes broken CDN links).
 * Run: npm run db:sync-icons
 */
import { drizzle } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import postgres from "postgres";
import * as schema from "../drizzle/schema";
import { skillIconByName } from "../lib/tech-icons";

const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
if (!connectionString) {
  console.error("Set DATABASE_URL or DIRECT_URL");
  process.exit(1);
}

const client = postgres(connectionString, { max: 1, prepare: false });
const db = drizzle(client, { schema });

async function main() {
  const rows = await db.select().from(schema.skills);
  let updated = 0;
  for (const row of rows) {
    const url = skillIconByName[row.name];
    if (url && url !== row.iconUrl) {
      await db.update(schema.skills).set({ iconUrl: url }).where(eq(schema.skills.id, row.id));
      updated++;
      console.log(`  ${row.name}`);
    }
  }
  console.log(`Updated ${updated} skill icon(s).`);
  await client.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
