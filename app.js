/* Essay Tracker — 35 schools. Minimal black-and-white accordion UI. */
const LS = "essayTrackerV1";
const today = new Date(); today.setHours(0, 0, 0, 0);

function s(name, cat, deadline, essays) {
  return {
    id: Math.random().toString(36).slice(2, 9), name, cat, deadline,
    status: "Not started",
    essays: essays.map(t => ({ id: Math.random().toString(36).slice(2, 9), title: t, done: false }))
  };
}

function buildSeed() {
  return [
    // US RD (12) — now incl. Columbia + JHU
    s("UPenn", "US-RD", "2027-01-05", ["Why Penn — community & program fit (400w)", "Thank-You Note / Community (150w)", "Major & intellectual curiosity (200w)"]),
    s("MIT", "US-RD", "2027-01-01", ["Why Major + community (225w)", "Challenge / failure (225w)", "World you come from (225w)", "Something you make/build (225w)", "Short takes (100c)"]),
    s("Stanford University", "US-RD", "2027-01-05", ["What matters + why (250w)", "Intellectual vitality (250w)", "Roommate note (250c)", "Meaningful experience / idea (50w x5)"]),
    s("Rice University", "US-RD", "2027-01-04", ["Why Rice + residential colleges (500w)", "Major / perspective (500w)"]),
    s("Northwestern", "US-RD", "2027-01-04", ["Why Northwestern (300w)"]),
    s("New York University", "US-RD", "2027-01-05", ["Why NYU — school & campus (400w)"]),
    s("Carnegie Mellon", "US-RD", "2027-01-04", ["Why CMU + college fit (300w)", "Collaboration / creativity (300w)", "Consideration / background (300w)"]),
    s("Boston University", "US-RD", "2027-01-06", ["Why BU (250w)"]),
    s("UT Austin", "US-RD", "2026-12-01", ["Tell us your story (650w)", "Why Major (250w)", "Leadership / impact short (250w)"]),
    s("Caltech", "US-RD", "2027-01-02", ["Why STEM + Caltech (400w)", "Creativity / curiosity (250w)", "Collaboration (250w)", "Challenge short (150w)"]),
    s("Columbia University", "US-RD", "2027-01-01", [
      "List — texts/resources that shaped you (100w)",
      "Lived experience + Columbia community (150w)",
      "Disagreement — how you engaged (150w)",
      "Adversity navigated + how you changed (150w)",
      "Why Columbia (150w)",
      "Why major at Columbia (150w)"
    ]),
    s("Johns Hopkins University", "US-RD", "2027-01-02", ["Bridge builders — engaging across differences (350w)"]),
    // Early (7)
    s("Cornell University", "US-EA", "2026-11-01", [
      "Why engineering (200w)",
      "Why Cornell Engineering (200w)",
      "What brings you joy (100w)",
      "Contribution / unique voice (100w)",
      "Meaningful activity (100w)",
      "Proudest award / achievement (100w)"
    ]),
    s("Georgia Tech", "US-EA", "2026-11-02", ["Why Major at GT (300w)", "Community / impact (300w)"]),
    s("University of Michigan", "US-EA", "2026-11-01", ["Why Michigan (550w)", "Community essay (300w)"]),
    s("UIUC", "US-EA", "2026-11-01", ["Why Major + Why UIUC (300w)", "Experience / perspective (300w)"]),
    s("UC Boulder", "US-EA", "2026-11-15", ["Why CU Boulder + major (650w)"]),
    s("Purdue University", "US-EA", "2026-11-01", ["Why Major (250w)", "Why Purdue (250w)", "Community / leadership (250w)"]),
    s("Northeastern", "US-EA", "2026-11-01", ["Why Northeastern + co-op (200w)"]),
    // UC + USC (3)
    s("UC Berkeley", "CA-US", "2026-11-27", ["PIQ 1 — Leadership (350w)", "PIQ 2 — Creativity (350w)", "PIQ 3 — Talent / challenge (350w)", "PIQ 4 — Community (350w) *shared UC*"]),
    s("UCLA", "CA-US", "2026-11-27", ["PIQ 1 — Leadership (350w)", "PIQ 2 — Creativity (350w)", "PIQ 3 — Talent / challenge (350w)", "PIQ 4 — Community (350w) *shared UC*"]),
    s("USC", "CA-US", "2026-11-01", ["Why USC + major (250w)", "Describe yourself / puzzle (250c)", "Dornsife / major short (250w)"]),
    // Canada (11)
    s("UofT", "Canada", "2027-01-15", ["OUAC application + supplemental (if req'd)"]),
    s("McMaster", "Canada", "2027-01-15", ["Supp app / Kira + essays (if req'd)"]),
    s("Waterloo", "Canada", "2027-01-15", ["AIF — experiences + reasons (900c)", "Program essays (x2)"]),
    s("Queens", "Canada", "2027-01-15", ["PSE — experiences + Why Queens"]),
    s("Carleton", "Canada", "2027-01-15", ["OUAC + scholarship essays"]),
    s("OTU (Ontario Tech)", "Canada", "2027-01-15", ["OUAC application"]),
    s("TMU", "Canada", "2027-01-15", ["OUAC + program supp (if req'd)"]),
    s("Western", "Canada", "2027-01-15", ["OUAC + supp (Ivey AEO essays x3)"]),
    s("York", "Canada", "2027-01-15", ["OUAC application"]),
    s("UBC", "Canada", "2027-12-01", ["Personal profile (4 x 200w)", "Activities + references"]),
    s("McGill", "Canada", "2027-01-15", ["Minerva app + personal statement (if req'd)"]),
    // Intl (2)
    s("NTU (Singapore)", "Intl", "2027-02-01", ["Personal statement + achievements"]),
    s("TU Delft", "Intl", "2027-04-01", ["Motivation letter + CV upload"]),
  ];
}

const GROUPS = [
  ["US-EA", "Early"],
  ["US-RD", "Regular Decision"],
  ["CA-US", "UC / USC"],
  ["Canada", "Canada"],
  ["Intl", "International"],
];
const STATUSES = ["Not started", "In progress", "Essays done", "Submitted"];

function normalize(st) {
  st.schools.forEach(x => {
    if (x.status === "Submitted ✓") x.status = "Submitted";
    if (!STATUSES.includes(x.status)) x.status = "Not started";
    if (!Array.isArray(x.essays)) x.essays = [];
  });
  if (!Array.isArray(st.open)) st.open = [];
  return st;
}

let state = null;
try { state = JSON.parse(localStorage.getItem(LS)) || null; } catch (e) { state = null; }
if (!state || !state.schools) {
  state = normalize({ schools: buildSeed(), open: [] });
} else {
  state = normalize(state);
  const names = new Set(state.schools.map(x => x.name.toLowerCase()));
  let added = false;
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
}

function save() { localStorage.setItem(LS, JSON.stringify(state)); }
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
  state.schools.forEach(x => { x.essays.forEach(e => { eT++; if (e.done) eD++; }); if (x.status === "Submitted") sD++; });
  return { eT, eD, sD, sT: state.schools.length };
}

const $ = id => document.getElementById(id);
const schoolsEl = $("schools");

function prog(x) { return x.essays.length ? Math.round(x.essays.filter(e => e.done).length / x.essays.length * 100) : (x.status === "Submitted" ? 100 : 0); }
function autoStatus(x) {
  if (x.status === "Submitted") return;
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
    .filter(x => x.status !== "Submitted")
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
  if (hide) match = match.filter(x => x.status !== "Submitted");

  schoolsEl.innerHTML = "";
  if (!match.length) { schoolsEl.innerHTML = '<div class="empty">No schools match.</div>'; return; }

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
  const done = x.essays.filter(e => e.done).length;
  const wrap = document.createElement("div");
  wrap.className = "school" + (isOpen(x) ? " open" : "") + (submitted ? " done" : "");

  const head = document.createElement("button");
  head.className = "school-head";
  head.setAttribute("aria-expanded", isOpen(x) ? "true" : "false");
  const meta = document.createElement("span");
  meta.className = "school-meta" + (!submitted && left < 0 ? " late" : "");
  meta.textContent = fmt(x.deadline) + " · " + done + "/" + x.essays.length + " · " + leftText(left, submitted);
  head.innerHTML = '<span class="chev">›</span>';
  const nm = document.createElement("span");
  nm.className = "school-name";
  nm.textContent = x.name;
  head.appendChild(nm);
  head.appendChild(meta);
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

  const foot = document.createElement("div");
  foot.className = "school-foot";
  const dl = document.createElement("input");
  dl.type = "date";
  dl.value = x.deadline;
  dl.title = "Deadline";
  dl.onchange = () => { x.deadline = dl.value || x.deadline; render(); };
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
    if (x.status === "Submitted") x.essays.forEach(e => { e.done = true; });
    render();
  };
  const sub = document.createElement("button");
  sub.className = "link";
  sub.textContent = "Mark submitted";
  sub.onclick = () => { x.status = "Submitted"; x.essays.forEach(e => { e.done = true; }); render(); };
  const delS = document.createElement("button");
  delS.className = "link";
  delS.textContent = "Delete";
  delS.onclick = () => { if (confirm("Delete " + x.name + "?")) { state.schools = state.schools.filter(y => y.id !== x.id); render(); } };
  foot.appendChild(dl);
  foot.appendChild(st);
  foot.appendChild(sub);
  foot.appendChild(delS);
  body.appendChild(foot);

  wrap.appendChild(body);
  return wrap;
}

["q", "fCat", "fStatus", "fSort", "hideDone"].forEach(id => $(id).addEventListener("input", render));
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
  const rows = [["School", "Region", "Deadline", "Status", "Essays total", "Essays done", "Progress %"]];
  state.schools.forEach(x => rows.push([x.name, x.cat, x.deadline, x.status, x.essays.length, x.essays.filter(e => e.done).length, prog(x)]));
  const csv = rows.map(r => r.map(c => '"' + String(c).replace(/"/g, '""') + '"').join(",")).join("\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  a.download = "essay-tracker.csv";
  a.click();
};
$("resetBtn").onclick = () => {
  if (confirm("Reset to the original 35-school list? Your ticks will be lost.")) {
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
  const added = { id: uid(), name: n, cat: $("nCat").value, deadline: $("nDate").value || "2027-01-01", status: "Not started", essays: es.map(t => ({ id: uid(), title: t, done: false })) };
  state.schools.push(added);
  state.open = [...state.open, added.id];
  $("nName").value = "";
  $("nEssays").value = "";
  $("dlg").close();
  render();
};
render();
