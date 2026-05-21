import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/drizzle/schema";

let client: ReturnType<typeof postgres> | null = null;
let database: ReturnType<typeof drizzle<typeof schema>> | null = null;

/** db.[ref].supabase.co often fails DNS on Vercel — use session pooler (5432) instead. */
const LEGACY_DIRECT_HOST = /db\.[^/]+\.supabase\.co/i;

function sessionPoolerFromTransactionUrl(url: string): string {
  try {
    const normalized = url.replace(/^postgresql:\/\//, "http://");
    const parsed = new URL(normalized);
    parsed.port = "5432";
    parsed.search = "";
    const user = decodeURIComponent(parsed.username);
    const pass = decodeURIComponent(parsed.password);
    const auth = `${encodeURIComponent(user)}:${encodeURIComponent(pass)}`;
    return `postgresql://${auth}@${parsed.hostname}:${parsed.port}${parsed.pathname}`;
  } catch {
    return url.replace(":6543", ":5432").replace(/\?pgbouncer=true/, "");
  }
}

function getConnectionString() {
  const direct = process.env.DIRECT_URL?.trim();
  const pooled = process.env.DATABASE_URL?.trim();

  if (direct && !LEGACY_DIRECT_HOST.test(direct)) {
    return direct;
  }

  if (pooled) {
    return sessionPoolerFromTransactionUrl(pooled);
  }

  return direct;
}

function getClient() {
  if (!client) {
    const connectionString = getConnectionString();
    if (!connectionString) {
      throw new Error("DATABASE_URL or DIRECT_URL is not set");
    }
    client = postgres(connectionString, {
      prepare: false,
      max: process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME ? 1 : 6,
      idle_timeout: 20,
      connect_timeout: 60,
      max_lifetime: 60 * 30,
    });
  }
  return client;
}

export function dbErrorMessage(err: unknown): string {
  if (err instanceof Error) {
    if (err.message.includes("ENOTFOUND")) {
      return "Database host not found. In Vercel, set DATABASE_URL (pooler) from Supabase — remove DIRECT_URL if it uses db.*.supabase.co.";
    }
    if (err.message.includes("CONNECT_TIMEOUT") || err.message.includes("EAUTHTIMEOUT")) {
      return "Database connection timed out. Check DATABASE_URL in Vercel env vars.";
    }
    return err.message;
  }
  return "Database error";
}

export const db = new Proxy({} as ReturnType<typeof drizzle<typeof schema>>, {
  get(_target, prop) {
    if (!database) {
      database = drizzle(getClient(), { schema });
    }
    const value = database[prop as keyof typeof database];
    return typeof value === "function" ? value.bind(database) : value;
  },
});
