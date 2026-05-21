/**
 * Updates project image_url from catalog + cover resolver (fixes favicon/GitHub OG thumbnails).
 * Run: npm run db:sync-covers
 */
import { drizzle } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import postgres from "postgres";
import * as schema from "../drizzle/schema";
import { resolveProjectImageUrl } from "../lib/project-covers";
import { projectsCatalog } from "./projects-catalog";

const catalogByName = Object.fromEntries(projectsCatalog.map((p) => [p.name, p.imageUrl]));

const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
if (!connectionString) {
  console.error("Set DATABASE_URL or DIRECT_URL");
  process.exit(1);
}

const client = postgres(connectionString, { max: 1, prepare: false });
const db = drizzle(client, { schema });

async function main() {
  const rows = await db.select().from(schema.projects);
  let updated = 0;
  for (const row of rows) {
    const seedUrl = catalogByName[row.name];
    const next = resolveProjectImageUrl(row.name, seedUrl ?? row.imageUrl);
    if (next && next !== row.imageUrl) {
      await db
        .update(schema.projects)
        .set({ imageUrl: next })
        .where(eq(schema.projects.id, row.id));
      updated++;
      console.log(`  ${row.name}`);
    }
  }
  console.log(`Updated ${updated} project cover(s).`);
  await client.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
