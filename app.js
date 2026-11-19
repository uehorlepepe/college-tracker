/* Essay Tracker — 34 schools. Minimal black-and-white accordion UI. */
const LS = "essayTrackerV1";
const today = new Date(); today.setHours(0, 0, 0, 0);

function s(name, cat, deadline, essays) {
  return {
    id: Math.random().toString(36).slice(2, 9), name, cat, deadline,
    status: "Not started",
    offerDate: "",
    major: "",
    coop: "",
    honours: "",
    essays: essays.map(t => ({ id: Math.random().toString(36).slice(2, 9), title: t, done: false }))
  };
}

function buildSeed() {
  return [
    // US RD (12) — now incl. Columbia + JHU
    s("UPenn", "US-RD", "2027-01-05", ["Why Penn — community & program fit (400w)", "Thank-You Note / Community (150w)", "Major & intellectual curiosity (200w)"]),
    s("Princeton", "US-RD", "2027-01-01", [
      "Your voice — a moment or person that shaped you (500w)",
      "Lived experience + Princeton community (250w)",
      "Service and civic engagement (250w)",
      "Academic interests + why Princeton (250w)",
      "Short answers — book, website, phrase (50c each)"
    ]),
    s("MIT", "US-RD", "2027-01-01", ["Why Major + community (225w)", "Challenge / failure (225w)", "World you come from (225w)", "Something you make/build (225w)", "Short takes (100c)"]),
    s("Stanford University", "US-RD", "2027-01-05", ["What matters + why (250w)", "Intellectual vitality (250w)", "Roommate note (250c)", "Meaningful experience / idea (50w x5)"]),
    s("Rice University", "US-RD", "2027-01-04", ["Why Rice + residential colleges (500w)", "Major / perspective (500w)"]),
    s("Northwestern", "US-RD", "2027-01-04", ["Why Northwestern (300w)"]),
    s("New York University", "US-RD", "2027-01-05", ["Why NYU — school & campus (400w)"]),
    s("Carnegie Mellon", "US-RD", "2027-01-04", ["Why CMU + college fit (300w)", "Collaboration / creativity (300w)", "Consideration / background (300w)"]),
    s("Boston University", "US-RD", "2027-01-06", ["Why BU (250w)"]),
    s("UT Austin", "US-RD", "2026-12-01", ["Tell us your story (650w)", "Why Major (250w)", "Leadership / impact short (250w)"]),
    s("Columbia University", "US-RD", "2027-01-01", [
      "List — texts/resources that shaped you (100w)",
      "Lived experience + Columbia community (150w)",
      "Disagreement — how you engaged (150w)",
      "Adversity navigated + how you changed (150w)",
      "Why Columbia (150w)",
      "Why major at Columbia (150w)"
    ]),
    s("Johns Hopkins University", "US-RD", "2027-01-02", ["Bridge builders — engaging across differences (350w)"]),
    s("USC", "US-RD", "2027-01-15", ["Why USC + major (250w)", "Describe yourself / puzzle (250c)", "Dornsife / major short (250w)"]),
    s("University of Michigan", "US-RD", "2027-02-01", ["Why Michigan (550w)", "Community essay (300w)"]),
    // Early (6)
    s("Cornell University", "US-EA", "2026-11-01", [
      "Why engineering (200w)",
      "Why Cornell Engineering (200w)",
      "What brings you joy (100w)",
      "Contribution / unique voice (100w)",
      "Meaningful activity (100w)",
      "Proudest award / achievement (100w)"
    ]),
    s("Georgia Tech", "US-EA", "2026-11-02", ["Why Major at GT (300w)", "Community / impact (300w)"]),
    s("UIUC", "US-EA", "2026-11-01", ["Why Major + Why UIUC (300w)", "Experience / perspective (300w)"]),
    s("UC Boulder", "US-EA", "2026-11-15", ["Why CU Boulder + major (650w)"]),
    s("Purdue University", "US-EA", "2026-11-01", ["Why Major (250w)", "Why Purdue (250w)", "Community / leadership (250w)"]),
    s("Northeastern", "US-EA", "2026-11-01", ["Why Northeastern + co-op (200w)"]),
    // UC (8) — same 4 PIQs submitted once for every campus
    ...["UC Berkeley", "UCLA", "UC San Diego", "UC Santa Barbara", "UC Irvine", "UC Davis", "UC Santa Cruz", "UC Riverside"].map(name =>
      s(name, "CA-US", "2026-11-27", ["PIQ 1 — Leadership (350w)", "PIQ 2 — Creativity (350w)", "PIQ 3 — Talent / challenge (350w)", "PIQ 4 — Community (350w) *shared UC*"])
    ),
    // Canada (11)
    s("UofT", "Canada", "2027-01-15", ["OUAC application + supplemental (if req'd)"]),
    s("McMaster", "Canada", "2027-01-15", ["Supp app / Kira + essays (if req'd)"]),
    s("Waterloo", "Canada", "2027-01-15", ["AIF — experiences + reasons (900c)", "Program essays (x2)"]),
    s("Queens", "Canada", "2027-01-15", ["PSE — experiences + Why Queens"]),
    s("Carleton", "Canada", "2027-01-15", ["OUAC + scholarship essays"]),
    s("OTU", "Canada", "2027-01-15", ["OUAC application"]),
    s("TMU", "Canada", "2027-01-15", ["OUAC + program supp (if req'd)"]),
    s("Western", "Canada", "2027-01-15", ["OUAC + supp (Ivey AEO essays x3)"]),
    s("York", "Canada", "2027-01-15", ["OUAC application"]),
    s("UBC", "Canada", "2027-12-01", ["Personal profile (4 x 200w)", "Activities + references"]),
    s("McGill", "Canada", "2027-01-15", ["Minerva app + personal statement (if req'd)"]),
    // Intl (1)
    s("NTU (Singapore)", "Intl", "2027-02-01", ["Personal statement + achievements"]),
  ];
}

const GROUPS = [
  ["US-EA", "Early"],
  ["US-RD", "Regular Decision"],
  ["CA-US", "UCs"],
  ["Canada", "Canada"],
  ["Intl", "International"],
];
const STATUSES = ["Not started", "In progress", "Essays done", "Pending approval", "Submitted", "Accepted", "Waitlisted", "Deferred", "Rejected"];
const DECISIONS = ["Accepted", "Waitlisted", "Deferred", "Rejected"];
const OUTCOME_TEXT = { Accepted: "accepted 🎉", Waitlisted: "waitlisted", Deferred: "deferred", Rejected: "rejected" };

function normalize(st) {
  st.schools.forEach(x => {
    if (x.status === "Submitted ✓") x.status = "Submitted";
    if (x.status === "Accepted ✓") x.status = "Accepted";
    if (!STATUSES.includes(x.status)) x.status = "Not started";
    if (typeof x.offerDate !== "string") x.offerDate = "";
    if (typeof x.major !== "string") x.major = "";
    if (x.coop !== "Yes" && x.coop !== "No") x.coop = "";
    if (x.honours !== "Yes" && x.honours !== "No") x.honours = "";
    if (!Array.isArray(x.essays)) x.essays = [];
  });
  if (!Array.isArray(st.open)) st.open = [];
  if (typeof st.deadlinePlan !== "number") st.deadlinePlan = 0;
  // Names you deleted, so a seed school you remove is not added back on reload.
  if (!Array.isArray(st.removed)) st.removed = [];
  st.removed = st.removed
    .filter(n => typeof n === "string")
    .map(n => n.trim().toLowerCase())
    .filter(Boolean);
  if (!st.ps || typeof st.ps !== "object") {
    const old = typeof st.ps === "string" ? st.ps : "Not started";
    st.ps = { title: "Personal Statement (650w)", done: old === "Final ✓" || old === "Final" };
  }
  if (typeof st.ps.done !== "boolean") st.ps.done = false;
  if (typeof st.ps.title !== "string" || !st.ps.title) st.ps.title = "Personal Statement (650w)";
  return st;
}

let state = null;
try { state = JSON.parse(localStorage.getItem(LS)) || null; } catch (e) { state = null; }
if (!state || !state.schools) {
  state = normalize({ schools: buildSeed(), open: [] });
  applyDeadlines(state);
} else {
  state = normalize(state);
  if (applyDeadlines(state)) save();
  // User removed TU Delft and Caltech: drop them from saved lists too.
  if (dropRemovedSchools(state)) save();
  const names = new Set(state.schools.map(x => x.name.toLowerCase()));
  let added = addNewSeedSchools(state);
  const fresh = buildSeed();
  ["columbia university", "johns hopkins university"].forEach(w => {
    const has = [...names].some(n => n.includes(w.split(" ")[0]));
    if (!has) {
      const f = fresh.find(x => x.name.toLowerCase().includes(w.split(" ")[0]));
      if (f) { state.schools.push(f); added = true; }
    }
  });
  if (added) save();
  // Fix saved Cornell entry: Engineering requires 2 long + 4 short essays.
  // Adds anything missing without touching existing ticks; drops the old
  // generic prompt if it was never started.
  const cornell = state.schools.find(x => x.name.toLowerCase().includes("cornell"));
  if (cornell) {
    const wantCornell = buildSeed().find(x => x.name === "Cornell University").essays.map(e => e.title);
    const legacy = cornell.essays.find(e => e.title === "College interest / Why Cornell (650w)");
    if (legacy && !legacy.done) cornell.essays = cornell.essays.filter(e => e !== legacy);
    let fixed = false;
    wantCornell.forEach(t => {
      if (!cornell.essays.some(e => e.title === t)) {
        cornell.essays.push({ id: uid(), title: t, done: false });
        fixed = true;
      }
    });
    if (fixed) { autoStatus(cornell); save(); }
  }
  // Move USC and Michigan into Regular Decision group.
  const usc = state.schools.find(x => x.name.toLowerCase() === "usc");
  if (usc) {
    let changed = false;
    if (usc.cat !== "US-RD") { usc.cat = "US-RD"; changed = true; }
    if (usc.deadline === "2026-11-01") { usc.deadline = "2027-01-15"; changed = true; }
    if (changed) save();
  }
  const mich = state.schools.find(x => x.name.toLowerCase().includes("michigan"));
  if (mich) {
    let changed = false;
    if (mich.cat !== "US-RD") { mich.cat = "US-RD"; changed = true; }
    if (mich.deadline === "2026-11-01") { mich.deadline = "2027-02-01"; changed = true; }
    if (changed) save();
  }
  // Drop the old "(Ontario Tech)" suffix from saved lists.
  const otu = state.schools.find(x => x.name === "OTU (Ontario Tech)");
  if (otu) { otu.name = "OTU"; save(); }
}

// Schools added to the seed after the first version shipped. Applied to saved
// and synced copies alike, so an existing list picks them up once.
function addNewSeedSchools(st) {
  const later = ["UC San Diego", "UC Santa Barbara", "UC Irvine", "UC Davis", "UC Santa Cruz", "UC Riverside", "Princeton"];
  const fresh = buildSeed();
  let added = false;
  later.forEach(n => {
    if (st.removed.includes(n.toLowerCase())) return;
    if (st.schools.some(x => x.name.toLowerCase() === n.toLowerCase())) return;
    const f = fresh.find(x => x.name === n);
    if (f) { st.schools.push(f); added = true; }
  });
  return added;
}

// Your plan: every school is due Dec 18, except UT Austin (Dec 1) and the UCs
// (left as they are). Runs once per saved list; deadlinePlan records that.
// Kept inside the function: this runs during load, before later consts exist.
function applyDeadlines(st) {
  const override = "2026-12-18";
  const exempt = ["UT Austin"];
  const nov30 = ["UofT", "Waterloo", "McMaster"];
  if (st.deadlinePlan === 3) return false;
  st.schools.forEach(x => {
    if (x.cat === "CA-US" || exempt.includes(x.name) || x.deadlineSet) return;
    x.deadline = nov30.includes(x.name) ? "2026-11-30" : override;
  });
  st.deadlinePlan = 3;
  return true;
}

function rememberRemoved(name) {
  const n = String(name || "").trim().toLowerCase();
  if (!n || state.removed.includes(n)) return;
  state.removed.push(n);
}

function forgetRemoved(name) {
  const n = String(name || "").trim().toLowerCase();
  state.removed = (state.removed || []).filter(x => x !== n);
}

// Schools the user asked to delete; applied to saved and synced copies alike.
function dropRemovedSchools(st) {
  const kept = st.schools.filter(x => {
    const n = x.name.toLowerCase();
    return !n.includes("delft") && !n.includes("caltech");
  });
  if (kept.length === st.schools.length) return false;
  st.schools = kept;
  st.open = (st.open || []).filter(id => kept.some(x => x.id === id));
  return true;
}

function save() {
  localStorage.setItem(LS, JSON.stringify(state));
  queueCloudSave();
}

// --- Sync -------------------------------------------------------------------
// No accounts. This browser owns a random key and the address bar carries it
// (#k=...), so opening that exact link on another computer shows the same list.
// Without the link (plain static file, offline) everything still works locally.
// var, not let: save() runs during the load-time migrations further up.
var syncKey = "";
var syncTimer = null;
var syncLive = false;

function setSyncText(t) { const el = $("syncText"); if (el) el.textContent = t; }

function makeKey() {
  const b = new Uint8Array(16);
  crypto.getRandomValues(b);
  return Array.from(b, x => x.toString(16).padStart(2, "0")).join("");
}

function loadKey() {
  const m = location.hash.match(/k=([A-Za-z0-9_-]{22,64})/);
  let k = m ? m[1] : "";
  if (!k) { try { k = localStorage.getItem(LS + "Key") || ""; } catch (e) { k = ""; } }
  if (!k) k = makeKey();
  try { localStorage.setItem(LS + "Key", k); } catch (e) { /* private mode */ }
  return k;
}

function syncLink() { return location.origin + location.pathname + "#k=" + syncKey; }

function queueCloudSave() {
  if (!syncLive) return;
  clearTimeout(syncTimer);
  syncTimer = setTimeout(pushCloud, 700);
}

async function pushCloud() {
  clearTimeout(syncTimer);
  if (!syncLive) return;
  try {
    const r = await fetch("/api/state?k=" + encodeURIComponent(syncKey), {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(state)
    });
    if (r.ok) setSyncText("Saved · open your sync link on the other computer");
  } catch (e) { /* offline: the local copy is still saved */ }
}

async function initSync() {
  syncKey = loadKey();
  try {
    const r = await fetch("/api/state?k=" + encodeURIComponent(syncKey), { headers: { accept: "application/json" } });
    if (!r.ok) throw new Error("no sync api");
    const payload = await r.json();
    syncLive = true;
    if (payload && payload.state && Array.isArray(payload.state.schools)) {
      state = normalize(payload.state);
      const pruned = dropRemovedSchools(state);
      const grew = addNewSeedSchools(state);
      const redated = applyDeadlines(state);
      render();
      if (pruned || grew || redated) await pushCloud();
      setSyncText("Synced");
    } else {
      await pushCloud(); // first use of this key: upload what is already here
    }
  } catch (e) {
    setSyncText(""); // local-only: no clue is better than a scary one
  }
}

// Coming back to the tab picks up edits made on the other computer.
async function refreshFromCloud() {
  if (!syncLive || syncTimer) return;
  try {
    const r = await fetch("/api/state?k=" + encodeURIComponent(syncKey), { headers: { accept: "application/json" } });
    if (!r.ok) return;
    const p = await r.json();
    if (!p || !p.state || !Array.isArray(p.state.schools)) return;
    if (JSON.stringify(p.state) === JSON.stringify(state)) return;
    state = normalize(p.state);
    render();
    setSyncText("Synced");
  } catch (e) { /* ignore */ }
}
function daysLeft(d) { const x = new Date(d + "T12:00:00"); x.setHours(0, 0, 0, 0); return Math.round((x - today) / 86400000); }
function fmt(d) { return new Date(d + "T12:00:00").toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }); }
function leftText(left, submitted) {
  if (submitted) return "submitted";
  if (left < 0) return Math.abs(left) + "d late";
  if (left === 0) return "due today";
  return left + "d left";
}

function totals() {
  let eT = 0, eD = 0, sD = 0;
  state.schools.forEach(x => { x.essays.forEach(e => { eT++; if (e.done) eD++; }); if (isSubmitted(x)) sD++; });
  eT += 1;
  if (state.ps && state.ps.done) eD += 1;
  return { eT, eD, sD, sT: state.schools.length };
}

const $ = id => document.getElementById(id);
const schoolsEl = $("schools");

function isSubmitted(x) { return x.status === "Submitted" || DECISIONS.includes(x.status); }
function prog(x) { return x.essays.length ? Math.round(x.essays.filter(e => e.done).length / x.essays.length * 100) : (isSubmitted(x) ? 100 : 0); }
function autoStatus(x) {
  if (isSubmitted(x) || x.status === "Pending approval") return;
  if (!x.essays.length) return;
  const p = prog(x);
  x.status = p === 100 ? "Essays done" : p > 0 ? "In progress" : "Not started";
}
function esc(sText) { const d = document.createElement("div"); d.textContent = sText; return d.innerHTML; }
function uid() { return Math.random().toString(36).slice(2, 9); }
function isOpen(x) { return state.open.includes(x.id); }
function toggle(x) {
  state.open = isOpen(x) ? state.open.filter(id => id !== x.id) : [...state.open, x.id];
  save();
}

function render() {
  save();
  const { eT, eD, sD, sT } = totals();
  const ep = eT ? Math.round(eD / eT * 100) : 0;
  $("progBar").style.width = ep + "%";
  $("progPct").textContent = ep + "%";
  $("progText").textContent = eD + "/" + eT + " essays · " + sD + "/" + sT + " submitted";
  $("todayLine").textContent =
    new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" }) +
    " · " + sT + " schools";

  const pending = state.schools
    .filter(x => !isSubmitted(x))
    .map(x => ({ ref: x, left: daysLeft(x.deadline) }))
    .sort((a, b) => a.left - b.left);
  $("nextLine").innerHTML = pending.length
    ? "Next: <strong>" + esc(pending[0].ref.name) + "</strong> — " + fmt(pending[0].ref.deadline) +
      " (" + leftText(pending[0].left, false) + ")" +
      (pending[1] ? " · Then: <strong>" + esc(pending[1].ref.name) + "</strong> (" + leftText(pending[1].left, false) + ")" : "")
    : "All submitted.";

  const qv = $("q").value.trim().toLowerCase(), fc = $("fCat").value, fs = $("fStatus").value, so = $("fSort").value;
  const hide = $("hideDone").checked;
  let match = [...state.schools];
  if (qv) match = match.filter(x => x.name.toLowerCase().includes(qv) || x.essays.some(e => e.title.toLowerCase().includes(qv)));
  if (fc) match = match.filter(x => x.cat === fc);
  if (fs) match = match.filter(x => x.status === fs);
  if (hide) match = match.filter(x => !isSubmitted(x));

  schoolsEl.innerHTML = "";
  if (!match.length && !(state.ps && (!qv || state.ps.title.toLowerCase().includes(qv)))) {
    schoolsEl.innerHTML = '<div class="empty">No schools match.</div>';
    return;
  }

  if (state.ps && (!qv || state.ps.title.toLowerCase().includes(qv))) {
    const g = document.createElement("div");
    g.className = "group";
    g.textContent = "Personal Statement";
    schoolsEl.appendChild(g);
    const row = document.createElement("div");
    row.className = "essay" + (state.ps.done ? " done" : "");
    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.checked = !!state.ps.done;
    cb.setAttribute("aria-label", "Done: personal statement");
    cb.onchange = () => { state.ps.done = cb.checked; render(); };
    const t = document.createElement("span");
    t.textContent = state.ps.title;
    t.ondblclick = () => { const v = prompt("Edit:", state.ps.title); if (v) { state.ps.title = v; render(); } };
    row.appendChild(cb);
    row.appendChild(t);
    schoolsEl.appendChild(row);
  }

  GROUPS.forEach(([cat, label]) => {
    if (fc && fc !== cat) return;
    let group = match.filter(x => x.cat === cat);
    if (!group.length) return;
    group.sort((a, b) => so === "name" ? a.name.localeCompare(b.name) : so === "progress" ? (prog(a) - prog(b)) : (a.deadline.localeCompare(b.deadline)));
    const g = document.createElement("div");
    g.className = "group";
    g.textContent = label + " (" + group.length + ")";
    schoolsEl.appendChild(g);
    group.forEach(x => schoolsEl.appendChild(schoolEl(x)));
  });
}

function schoolEl(x) {
  const left = daysLeft(x.deadline);
  const submitted = x.status === "Submitted";
  const pending = x.status === "Pending approval";
  const outcomeCls = { Accepted: " accepted", Waitlisted: " waitlisted", Deferred: " deferred", Rejected: " rejected" }[x.status] || "";
  const done = x.essays.filter(e => e.done).length;
  const wrap = document.createElement("div");
  wrap.className = "school" + (isOpen(x) ? " open" : "") + (submitted ? " done" : pending ? " pending" : outcomeCls);

  const head = document.createElement("button");
  head.className = "school-head";
  head.setAttribute("aria-expanded", isOpen(x) ? "true" : "false");
  const meta = document.createElement("span");
  meta.className = "school-meta" + (!isSubmitted(x) && left < 0 ? " late" : "");
  meta.textContent = fmt(x.deadline) + " · " + done + "/" + x.essays.length + " · " + (OUTCOME_TEXT[x.status] || leftText(left, submitted)) + (x.offerDate ? " · offer " + fmt(x.offerDate) : "");
  head.innerHTML = '<span class="chev">›</span>';
  const nm = document.createElement("span");
  nm.className = "school-name";
  nm.textContent = x.name;
  head.appendChild(nm);
  const majorSlot = document.createElement("span");
  majorSlot.className = "school-major-slot";
  head.appendChild(majorSlot);
  const tagsSlot = document.createElement("span");
  tagsSlot.className = "school-tags";
  head.appendChild(tagsSlot);
  head.appendChild(meta);
  // Keeps the collapsed row in step with edits made in the panel, without a
  // full re-render (which would steal focus mid-typing).
  const syncHead = () => {
    majorSlot.textContent = "";
    if (x.major) {
      const mj = document.createElement("span");
      mj.className = "school-major";
      mj.textContent = x.major;
      mj.title = "Major: " + x.major;
      majorSlot.appendChild(mj);
    }
    tagsSlot.textContent = "";
    // Only a "Yes" gets a badge; "No" (or unset) shows nothing at all.
    [["coop", "Co-op"], ["honours", "Honours"]].forEach(([key, label]) => {
      if (x[key] !== "Yes") return;
      const tag = document.createElement("span");
      tag.className = "school-tag on";
      tag.textContent = label;
      tagsSlot.appendChild(tag);
    });
  };
  syncHead();
  head.onclick = () => { toggle(x); wrap.classList.toggle("open"); head.setAttribute("aria-expanded", isOpen(x) ? "true" : "false"); };
  wrap.appendChild(head);

  const body = document.createElement("div");
  body.className = "school-body";

  x.essays.forEach(e => {
    const row = document.createElement("div");
    row.className = "essay" + (e.done ? " done" : "");
    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.checked = !!e.done;
    cb.setAttribute("aria-label", "Done: " + e.title);
    cb.onchange = () => {
      e.done = cb.checked;
      if (e.done && x.status === "Not started") x.status = "In progress";
      autoStatus(x);
      render();
    };
    const t = document.createElement("span");
    t.textContent = e.title;
    t.ondblclick = () => { const v = prompt("Edit essay:", e.title); if (v) { e.title = v; render(); } };
    const del = document.createElement("button");
    del.className = "x";
    del.textContent = "×";
    del.title = "Delete essay";
    del.onclick = () => { x.essays = x.essays.filter(y => y.id !== e.id); autoStatus(x); render(); };
    row.appendChild(cb);
    row.appendChild(t);
    row.appendChild(del);
    body.appendChild(row);
  });

  const addRow = document.createElement("div");
  addRow.className = "addrow";
  const nin = document.createElement("input");
  nin.placeholder = "Add essay";
  nin.setAttribute("aria-label", "Add essay to " + x.name);
  const addBtn = document.createElement("button");
  addBtn.className = "link";
  addBtn.textContent = "Add";
  const add = () => {
    const v = nin.value.trim();
    if (!v) return;
    x.essays.push({ id: uid(), title: v, done: false });
    if (x.status === "Not started") x.status = "In progress";
    render();
  };
  addBtn.onclick = add;
  nin.onkeydown = ev => { if (ev.key === "Enter") add(); };
  addRow.appendChild(nin);
  addRow.appendChild(addBtn);
  body.appendChild(addRow);

  const detailRow = document.createElement("div");
  detailRow.className = "detailrow";
  const majorLbl = document.createElement("label");
  majorLbl.textContent = "Major";
  const major = document.createElement("input");
  major.type = "text";
  major.placeholder = "e.g. Computer Science";
  major.value = x.major || "";
  major.setAttribute("aria-label", "Major for " + x.name);
  major.oninput = () => { x.major = major.value.trim(); syncHead(); save(); };
  majorLbl.appendChild(major);
  detailRow.appendChild(majorLbl);
  [["coop", "Co-op"], ["honours", "Honours"]].forEach(([key, label]) => {
    const lbl = document.createElement("label");
    lbl.textContent = label;
    const sel = document.createElement("select");
    sel.setAttribute("aria-label", label + " for " + x.name);
    ["", "Yes", "No"].forEach(v => {
      const op = document.createElement("option");
      op.value = v;
      op.textContent = v || "—";
      if ((x[key] || "") === v) op.selected = true;
      sel.appendChild(op);
    });
    sel.onchange = () => { x[key] = sel.value; syncHead(); save(); };
    lbl.appendChild(sel);
    detailRow.appendChild(lbl);
  });
  body.appendChild(detailRow);

  // Editable deadline, saved and synced like the other fields (render → save →
  // cloud push). deadlineSet keeps the one-time date migration off a date you
  // picked by hand.
  const dueRow = document.createElement("div");
  dueRow.className = "offerrow";
  const dueLbl = document.createElement("span");
  dueLbl.textContent = "Deadline";
  const due = document.createElement("input");
  due.type = "date";
  due.value = x.deadline || "";
  due.title = "Due date for " + x.name;
  due.setAttribute("aria-label", "Deadline for " + x.name);
  due.onchange = () => {
    if (!due.value) { due.value = x.deadline || ""; return; } // never leave it blank
    x.deadline = due.value;
    x.deadlineSet = true;
    render();
  };
  dueRow.appendChild(dueLbl);
  dueRow.appendChild(due);
  body.appendChild(dueRow);

  const offerRow = document.createElement("div");
  offerRow.className = "offerrow";
  const offerLbl = document.createElement("span");
  offerLbl.textContent = "Offer received";
  const offer = document.createElement("input");
  offer.type = "date";
  offer.value = x.offerDate || "";
  offer.title = "Date you received an offer";
  offer.onchange = () => { x.offerDate = offer.value || ""; render(); };
  const offerClear = document.createElement("button");
  offerClear.className = "link";
  offerClear.textContent = "Clear";
  offerClear.title = "Clear offer date";
  offerClear.onclick = () => { x.offerDate = ""; render(); };
  offerRow.appendChild(offerLbl);
  offerRow.appendChild(offer);
  offerRow.appendChild(offerClear);
  body.appendChild(offerRow);

  const foot = document.createElement("div");
  foot.className = "school-foot";
  const st = document.createElement("select");
  st.title = "Status";
  STATUSES.forEach(o => {
    const op = document.createElement("option");
    op.textContent = o;
    if (o === x.status) op.selected = true;
    st.appendChild(op);
  });
  st.onchange = () => {
    x.status = st.value;
    if (isSubmitted(x)) x.essays.forEach(e => { e.done = true; });
    if (x.status === "Accepted") fireConfetti();
    render();
  };
  const sub = document.createElement("button");
  sub.className = "link";
  sub.textContent = "Mark submitted";
  sub.onclick = () => { x.status = "Submitted"; x.essays.forEach(e => { e.done = true; }); render(); };
  const delS = document.createElement("button");
  delS.className = "link";
  delS.textContent = "Delete";
  delS.onclick = () => {
    if (!confirm("Delete " + x.name + "?")) return;
    state.schools = state.schools.filter(y => y.id !== x.id);
    rememberRemoved(x.name);
    render();
  };
  foot.appendChild(st);
  foot.appendChild(sub);
  foot.appendChild(delS);
  body.appendChild(foot);

  wrap.appendChild(body);
  return wrap;
}

/* Confetti: one persistent canvas and one shared particle pool, so every click
   adds a fresh burst on top of whatever is still falling instead of resetting. */
let confettiParts = [];
let confettiRAF = 0;
let confettiCv = null;
let confettiCtx = null;
let confettiW = 0, confettiH = 0, confettiDpr = 0;
const CONFETTI_COLORS = ["#ff3b30", "#ff9500", "#ffcc00", "#34c759", "#00c7be", "#007aff", "#af52de", "#ff2d55"];

function confettiSetup() {
  if (!confettiCv || !confettiCv.isConnected) {
    confettiCv = document.getElementById("confettiLayer");
    if (!confettiCv) {
      confettiCv = document.createElement("canvas");
      confettiCv.id = "confettiLayer";
      confettiCv.setAttribute("aria-hidden", "true");
      document.body.appendChild(confettiCv);
    }
    confettiCtx = confettiCv.getContext("2d");
    confettiW = confettiH = confettiDpr = 0; // force resize + transform reset
  }
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const W = window.innerWidth, H = window.innerHeight;
  if (W !== confettiW || H !== confettiH || dpr !== confettiDpr) {
    confettiW = W; confettiH = H; confettiDpr = dpr;
    confettiCv.width = W * dpr;
    confettiCv.height = H * dpr;
    confettiCv.style.width = W + "px";
    confettiCv.style.height = H + "px";
    confettiCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
}

function confettiLoop() {
  const ctx = confettiCtx, W = confettiW, H = confettiH;
  ctx.clearRect(0, 0, W, H);
  for (let i = confettiParts.length - 1; i >= 0; i--) {
    const p = confettiParts[i];
    p.vy += 0.12;
    p.vx *= 0.995;
    p.sway += p.swaySpeed;
    p.x += p.vx + Math.sin(p.sway) * 1.4;
    p.y += p.vy;
    p.rot += p.vr;
    if (p.y > H + 60) { confettiParts.splice(i, 1); continue; }
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.globalAlpha = Math.max(0, Math.min(1, (H + 40 - p.y) / (H * 0.3)));
    ctx.fillStyle = p.color;
    if (p.shape === "circle") {
      ctx.beginPath();
      ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    }
    ctx.restore();
  }
  if (confettiParts.length) {
    confettiRAF = requestAnimationFrame(confettiLoop);
  } else {
    confettiRAF = 0;
    ctx.clearRect(0, 0, W, H);
    if (confettiCv) confettiCv.remove();
    confettiCv = confettiCtx = null;
    confettiW = confettiH = confettiDpr = 0;
  }
}

function fireConfetti(count = 160) {
  confettiSetup();
  const W = confettiW, H = confettiH;
  for (let i = 0; i < count; i++) {
    confettiParts.push({
      x: W * (0.15 + Math.random() * 0.7),
      y: -H * 0.12 - Math.random() * H * 0.25,
      vx: (Math.random() - 0.5) * 7,
      vy: 2 + Math.random() * 4,
      w: 6 + Math.random() * 6,
      h: 8 + Math.random() * 10,
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.3,
      color: CONFETTI_COLORS[(Math.random() * CONFETTI_COLORS.length) | 0],
      shape: Math.random() < 0.18 ? "circle" : "rect",
      sway: Math.random() * Math.PI * 2,
      swaySpeed: 0.03 + Math.random() * 0.05
    });
  }
  if (!confettiRAF) confettiRAF = requestAnimationFrame(confettiLoop);
}

["q", "fCat", "fStatus", "fSort", "hideDone"].forEach(id => $(id).addEventListener("input", render));
$("confettiBtn").onclick = () => fireConfetti();
$("exportBtn").onclick = () => {
  const b = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(b);
  a.download = "essay-tracker-backup.json";
  a.click();
};
$("importBtn").onclick = () => $("fileIn").click();
$("fileIn").onchange = () => {
  const f = $("fileIn").files[0];
  if (!f) return;
  const r = new FileReader();
  r.onload = () => {
    try {
      const d = normalize(JSON.parse(r.result));
      if (d.schools) { state = d; render(); } else alert("Bad file");
    } catch (e) { alert("Bad file"); }
  };
  r.readAsText(f);
};
$("csvBtn").onclick = () => {
  const rows = [["School", "Region", "Deadline", "Status", "Offer received", "Major", "Co-op", "Honours", "Essays total", "Essays done", "Progress %"]];
  state.schools.forEach(x => rows.push([x.name, x.cat, x.deadline, x.status, x.offerDate || "", x.major || "", x.coop || "", x.honours || "", x.essays.length, x.essays.filter(e => e.done).length, prog(x)]));
  const csv = rows.map(r => r.map(c => '"' + String(c).replace(/"/g, '""') + '"').join(",")).join("\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  a.download = "essay-tracker.csv";
  a.click();
};
$("resetBtn").onclick = () => {
  if (confirm("Reset to the original school list? Your ticks will be lost.")) {
    localStorage.removeItem(LS);
    state = normalize({ schools: buildSeed(), open: [] });
    render();
  }
};
$("addSchoolBtn").onclick = () => $("dlg").showModal();
$("dlgCancel").onclick = () => $("dlg").close();
$("dlgSave").onclick = () => {
  const n = $("nName").value.trim();
  if (!n) { alert("Give the school a name"); return; }
  const es = $("nEssays").value.split(",").map(st => st.trim()).filter(Boolean);
  const added = { id: uid(), name: n, cat: $("nCat").value, deadline: $("nDate").value || "2027-01-01", status: "Not started", offerDate: "", major: "", coop: "", honours: "", essays: es.map(t => ({ id: uid(), title: t, done: false })) };
  state.schools.push(added);
  forgetRemoved(added.name);
  state.open = [...state.open, added.id];
  $("nName").value = "";
  $("nEssays").value = "";
  $("dlg").close();
  render();
};

$("syncBtn").onclick = async () => {
  const url = syncLink();
  let copied = false;
  try { await navigator.clipboard.writeText(url); copied = true; } catch (e) { copied = false; }
  if (copied) setSyncText("Link copied — open it on your other computer");
  else prompt("Open this link on your other computer:", url);
};
window.addEventListener("focus", refreshFromCloud);

initSync();
render();
