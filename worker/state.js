// Static tracker + a tiny JSON store keyed by a private link.
// No accounts: the key in the URL is the only credential.
const MAX_BYTES = 512 * 1024;

let schema;

export function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "private, no-store" }
  });
}

// One table, one row per private link; created once per isolate.
export function ensureSchema(env) {
  schema ??= env.DB.prepare(
    "CREATE TABLE IF NOT EXISTS tracker_docs (doc_key TEXT PRIMARY KEY, body TEXT NOT NULL, updated_at INTEGER NOT NULL)"
  )
    .run()
    .catch(err => {
      schema = undefined;
      throw err;
    });
  return schema;
}

const KEY_RE = /^[A-Za-z0-9_-]{22,64}$/;

export async function handleState(request, env) {
  const url = new URL(request.url);
  const key = url.searchParams.get("k") || "";
  if (!KEY_RE.test(key)) return json({ error: "Missing or invalid sync key" }, 400);

  if (request.method === "GET") {
    await ensureSchema(env);
    const row = await env.DB.prepare("SELECT body, updated_at FROM tracker_docs WHERE doc_key = ?")
      .bind(key)
      .first();
    if (!row) return json({ state: null, updatedAt: 0 });
    let state = null;
    try { state = JSON.parse(row.body); } catch (e) { state = null; }
    return json({ state, updatedAt: row.updated_at });
  }

  if (request.method === "PUT") {
    const text = await request.text();
    if (text.length > MAX_BYTES) return json({ error: "State too large" }, 413);
    let parsed;
    try { parsed = JSON.parse(text); } catch (e) { return json({ error: "Invalid JSON" }, 400); }
    if (!parsed || !Array.isArray(parsed.schools)) return json({ error: "Invalid state" }, 400);
    await ensureSchema(env);
    const at = Date.now();
    await env.DB.prepare(
      "INSERT INTO tracker_docs (doc_key, body, updated_at) VALUES (?, ?, ?) " +
        "ON CONFLICT(doc_key) DO UPDATE SET body = excluded.body, updated_at = excluded.updated_at"
    )
      .bind(key, JSON.stringify(parsed), at)
      .run();
    return json({ ok: true, updatedAt: at });
  }

  return new Response(null, { status: 405, headers: { allow: "GET, PUT" } });
}
