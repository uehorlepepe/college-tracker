# College Essay Tracker — Class of 2031

Static website (no build step). 35 schools, deadlines, essay checklists, overall progress bars. Autosaves to `localStorage`.

## Run locally

```bash
cd college-tracker
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy to Vercel (free)

**Option A — Vercel dashboard (easiest, no CLI):**
1. Go to https://vercel.com/new
2. Drag & drop this `college-tracker` folder (or push it to GitHub and Import it)
3. Framework preset: **Other**. Build command: empty. Output: `.`
4. Deploy. You get `https://your-tracker.vercel.app`

**Option B — Vercel CLI:**
```bash
cd college-tracker
npx vercel        # preview
npx vercel --prod # production
```

## Move your progress to the live site

`localStorage` is per-domain, so ticks on the local file won't auto-appear online:
1. Open your old `essay-tracker.html` → **⬇ Export JSON**
2. Open the Vercel site → **⬆ Import** → pick the file
3. Columbia + JHU auto-add on first load even for old backups.

## Files

- `index.html` — layout
- `styles.css` — theme
- `app.js` — data (35 schools incl. Columbia Jan 1 + JHU Jan 2 with real 2026-27 prompts) + logic
- `vercel.json` — static config
