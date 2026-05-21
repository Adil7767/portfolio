import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/drizzle/schema";

let client: ReturnType<typeof postgres> | null = null;
let database: ReturnType<typeof drizzle<typeof schema>> | null = null;

function getConnectionString() {
  // Direct connection (port 5432) is more reliable for Next.js server than pooler under load
  return process.env.DIRECT_URL ?? process.env.DATABASE_URL;
}

function getClient() {
  if (!client) {
    const connectionString = getConnectionString();
    if (!connectionString) {
      throw new Error("DATABASE_URL or DIRECT_URL is not set");
    }
    // One connection per serverless instance — avoids Supabase pooler max-client errors
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
    if (err.message.includes("CONNECT_TIMEOUT") || err.message.includes("EAUTHTIMEOUT")) {
      return "Database connection timed out. Check DIRECT_URL in .env and your Supabase project status, then click Retry.";
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
