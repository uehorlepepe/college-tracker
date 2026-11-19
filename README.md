# College Essay Tracker — Class of 2031

40 schools (incl. all 8 UC campuses), deadlines, essay checklists, major / co-op /
honours per school, overall progress bars.

## Data and sync

- **This browser** — `localStorage`, always on, works offline.
- **Private link** — the **Sync** button copies an address ending in `#k=<random>`.
  Open that link on another computer and it shows the same list. Saving on either
  one updates the copy behind that link; returning to the tab picks up changes
  made elsewhere. No account, no sign-in; the key in the link is the only thing
  that grants access, so don't post it publicly.

## Run locally

```bash
cd college-tracker
npm install          # first time
npm run dev          # build + wrangler dev on http://localhost:8787
```

`npm run dev` runs the real Worker (API + static files) against a local D1
database, so the Sync link works there too.

Static-only preview (localStorage only, no sync):

```bash
python3 -m http.server 8123
```

## Deploy

Hosted on Freebuff Sites:

```bash
npm run build                 # writes dist/ (worker.js + public/)
# deploy dist/manifest.json to the site's preview/production environment
```

The `DB` binding is supplied at deploy time. `vercel.json` still serves the
static files, but a Vercel deploy has no `/api`, so it behaves like the
static-only mode above.

## Files

- `index.html` — layout and toolbar
- `styles.css` — theme
- `app.js` — seed data, logic, `localStorage` and private-link sync
- `worker/index.js` — routes `/api/state`, otherwise serves the static files
- `worker/state.js` — D1 read/write for one sync key
- `worker/test-entry.js` + `wrangler.test.jsonc` — local harness for the storage
  layer (not deployed)
- `manifest.json` — Freebuff Sites deploy manifest (built into `dist/`)
