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

    const text = await res.text();
    let json: unknown;
    try {
      json = text ? JSON.parse(text) : null;
    } catch {
      return {
        data: null,
        error: res.ok ? "Invalid server response" : `Request failed (${res.status})`,
      };
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
        ? "Could not reach the API. Check that the dev server is running, or on Vercel set DIRECT_URL (db.*.supabase.co:5432, user postgres) and redeploy."
        : msg;
    return { data: null, error: hint };
  }
}
