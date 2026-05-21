import { parseResponseBody } from "@/lib/parse-response";

export async function fetchAdminJson<T>(url: string): Promise<{
  data: T | null;
  error: string | null;
}> {
  try {
    const res = await fetch(url, {
      credentials: "include",
      cache: "no-store",
      headers: { Accept: "application/json" },
    });

    const { json, error: parseError } = await parseResponseBody(res);
    if (parseError) {
      return { data: null, error: parseError };
    }

    if (!res.ok) {
      const body = json as { error?: string } | null;
      const err =
        typeof body?.error === "string"
          ? body.error
          : `Request failed (${res.status})`;
      return { data: null, error: err };
    }

    return { data: json as T, error: null };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Network error";
    const hint =
      msg === "Failed to fetch"
        ? "Could not reach the API. Check that the dev server is running, or on Vercel set DATABASE_URL (Supabase pooler) and redeploy."
        : msg;
    return { data: null, error: hint };
  }
}
