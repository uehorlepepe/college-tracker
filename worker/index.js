// Serves the static tracker and keeps its state next to a private link.
// No accounts, no sign-in: whoever has the link sees the same list.
import { handleState, json } from "./state.js";

export default {
  fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/state") return handleState(request, env);
    if (url.pathname.startsWith("/api/")) return json({ error: "Not found" }, 404);
    return env.ASSETS.fetch(request);
  }
};
