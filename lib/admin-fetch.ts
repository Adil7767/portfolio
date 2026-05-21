export async function fetchAdminJson<T>(url: string): Promise<{
  data: T | null;
  error: string | null;
}> {
  try {
    const res = await fetch(url, {
      credentials: "include",
      cache: "no-store",
    });
    const json = await res.json();
    if (!res.ok) {
      const err =
        typeof json?.error === "string"
          ? json.error
          : `Request failed (${res.status})`;
      return { data: null, error: err };
    }
    return { data: json as T, error: null };
  } catch (e) {
    return {
      data: null,
      error: e instanceof Error ? e.message : "Network error",
    };
  }
}
