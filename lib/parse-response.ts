/** Parse a fetch Response body without throwing on HTML/plain-text error pages. */
export async function parseResponseBody(res: Response): Promise<{
  json: unknown;
  error: string | null;
}> {
  const text = await res.text();
  if (!text) {
    return { json: null, error: res.ok ? null : `Request failed (${res.status})` };
  }

  try {
    return { json: JSON.parse(text) as unknown, error: null };
  } catch {
    const isServerCrash =
      text.startsWith("Internal Server Error") ||
      text.startsWith("<!DOCTYPE") ||
      text.startsWith("<html");
    if (isServerCrash) {
      return {
        json: null,
        error: `Server error (${res.status}). Check the terminal or Vercel logs, set DIRECT_URL (db.*.supabase.co:5432), then restart or redeploy.`,
      };
    }
    const snippet = text.length > 80 ? `${text.slice(0, 80)}…` : text;
    return {
      json: null,
      error: res.ok
        ? `Invalid server response: ${snippet}`
        : `Request failed (${res.status}): ${snippet}`,
    };
  }
}
