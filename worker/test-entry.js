// Local-only harness: exercises worker/state.js against D1 with any key.
// Not deployed (the manifest points at dist/worker.js).
import { handleState, json } from "./state.js";

export default {
  fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/state") return handleState(request, env);
    if (url.pathname.startsWith("/api/")) return json({ error: "Not found" }, 404);
    return env.ASSETS.fetch(request);
  }
};
