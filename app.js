/* Essay Tracker — 35 schools (Class of 2031). Static, Vercel-ready. */
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
    s("Cornell University", "US-EA", "2026-11-01", ["College interest / Why Cornell (650w)"]),
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

let state = null;
try { state = JSON.parse(localStorage.getItem(LS)) || null; } catch (e) { state = null; }
if (!state || !state.schools) {
  state = { schools: buildSeed(), ps: "Not started", theme: "dark" };
} else {
  // Migrate old 33-school saves: add Columbia + JHU without wiping ticks
  const names = new Set(state.schools.map(x => x.name.toLowerCase()));
  let added = false;
  const fresh = buildSeed();
  const want = ["columbia university", "johns hopkins university"];
  want.forEach(w => {
    const has = [...names].some(n => n.includes(w.split(" ")[0]));
    if (!has) {
      const f = fresh.find(x => x.name.toLowerCase().includes(w.split(" ")[0]));
      if (f) { state.schools.push(f); added = true; }
    }
  });
  if (added) save();
}
document.documentElement.dataset.theme = state.theme === "light" ? "light" : "";

function save() { localStorage.setItem(LS, JSON.stringify(state)); }
function daysLeft(d) { const x = new Date(d + "T12:00:00"); x.setHours(0, 0, 0, 0); return Math.round((x - today) / 86400000); }
function fmt(d) { return new Date(d + "T12:00:00").toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }); }
function catLabel(c) { return { "US-RD": "🇺🇸 RD", "US-EA": "⚡ Early", "CA-US": "☀️ UC/CA", "Canada": "🍁 Canada", "Intl": "🌍 Intl" }[c] || c; }
function catClass(c) { return { "US-RD": "rd", "US-EA": "ea", "CA-US": "uc", "Canada": "ca", "Intl": "int" }[c] || ""; }

function totals() {
  let eT = 0, eD = 0, sD = 0;
  state.schools.forEach(x => { x.essays.forEach(e => { eT++; if (e.done) eD++; }); if (x.status === "Submitted ✓") sD++; });
  return { eT, eD, sD, sT: state.schools.length };
}

const $ = id => document.getElementById(id);
const schoolsEl = $("schools");

function prog(x) { return x.essays.length ? Math.round(x.essays.filter(e => e.done).length / x.essays.length * 100) : (x.status === "Submitted ✓" ? 100 : 0); }
function autoStatus(x) {
  if (x.status === "Submitted ✓") return;
  if (!x.essays.length) return;
  const p = prog(x);
  x.status = p === 100 ? "Essays done" : p > 0 ? "In progress" : "Not started";
}
function esc(s) { const d = document.createElement("div"); d.textContent = s; return d.innerHTML; }
function uid() { return Math.random().toString(36).slice(2, 9); }

function render() {
  save();
  const { eT, eD, sD, sT } = totals();
  const ep = eT ? Math.round(eD / eT * 100) : 0, ap = Math.round(sD / sT * 100);
  $("essBar").style.width = ep + "%"; $("essPct").textContent = ep + "%";
  $("appBar").style.width = ap + "%"; $("appPct").textContent = ap + "%";
  $("stEssays").textContent = `${eD}/${eT}`;
  $("stEssaysSub").textContent = `${ep}% done · ${eT - eD} to go`;
  $("stSchools").textContent = `${sD}/${sT}`;
  $("stSchoolsSub").textContent = `${ap}% applied`;
  $("essHint").textContent = eD === eT && eT
    ? "🎉 All essays checked! Now submit + breathe."
    : `${eT - eD} essays left · do 2/day and you're done in ${Math.ceil((eT - eD) / 2)} days.`;
  $("todayLine").textContent =
    new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" }) +
    ` · ${sT} schools · autosaves locally · tick boxes to move the bars`;
  $("psState").value = state.ps || "Not started";

  const open = state.schools.filter(x => x.status !== "Submitted ✓").map(x => ({ ...x, left: daysLeft(x.deadline) })).sort((a, b) => a.left - b.left);
  const urg = open.filter(x => x.left <= 14);
  $("stUrgent").textContent = urg.length;
  if (open.length) {
    $("stNext").textContent = open[0].left < 0 ? Math.abs(open[0].left) + "d late" : open[0].left + "d";
    $("stNextSub").textContent = open[0].name + " · " + fmt(open[0].deadline);
  }
  $("urgentText").innerHTML = open.length
    ? `<b>${esc(open[0].name)}</b> — ${fmt(open[0].deadline)} (${open[0].left < 0 ? Math.abs(open[0].left) + " days OVERDUE" : open[0].left === 0 ? "due TODAY" : open[0].left + " days left"})` +
      (open[1] ? ` · then <b>${esc(open[1].name)}</b> (${open[1].left}d)` : "") : "All submitted! 🎉";
  $("queue").innerHTML = open.slice(0, 5).map((x, i) => {
    const pct = x.essays.length ? Math.round(x.essays.filter(e => e.done).length / x.essays.length * 100) : 100;
    return `<div class="row" style="justify-content:space-between"><span>${i + 1}. <b>${esc(x.name)}</b> <span class="hint">· ${fmt(x.deadline)} · ${x.left < 0 ? Math.abs(x.left) + "d late" : x.left + "d left"}</span></span><span class="hint">${pct}%</span></div>`;
  }).join("") || "<span class='hint'>Nothing left — go celebrate.</span>";

  let list = [...state.schools];
  const qv = $("q").value.trim().toLowerCase(), fc = $("fCat").value, fs = $("fStatus").value, so = $("fSort").value;
  if (qv) list = list.filter(x => x.name.toLowerCase().includes(qv) || x.essays.some(e => e.title.toLowerCase().includes(qv)));
  if (fc) list = list.filter(x => x.cat === fc);
  if (fs) list = list.filter(x => x.status === fs);
  if ($("hideDone").checked) list = list.filter(x => x.status !== "Submitted ✓");
  list.sort((a, b) => so === "name" ? a.name.localeCompare(b.name) : so === "progress" ? (prog(a) - prog(b)) : (a.deadline.localeCompare(b.deadline)));
  schoolsEl.innerHTML = "";
  list.forEach(x => {
    const left = daysLeft(x.deadline), p = prog(x);
    const dueCls = x.status === "Submitted ✓" ? "ok" : left < 0 ? "late" : left === 0 || left <= 3 ? "now" : left <= 14 ? "soon" : "ok";
    const dueTxt = x.status === "Submitted ✓" ? "✓ Submitted" : left < 0 ? `${Math.abs(left)}d OVERDUE` : left === 0 ? "due TODAY" : `${left}d left`;
    const card = document.createElement("div");
    card.className = "card" + (x.status === "Submitted ✓" ? " submitted" : "") + (left < 0 && x.status !== "Submitted ✓" ? " overdue" : "");
    card.innerHTML = `
      <div class="hd"><h3>${esc(x.name)}</h3><span class="pill ${catClass(x.cat)}">${catLabel(x.cat)}</span></div>
      <div class="meta"><span class="due ${dueCls}">${dueTxt}</span><span>📅 ${fmt(x.deadline)}</span><span>${x.essays.filter(e => e.done).length}/${x.essays.length} essays · ${p}%</span></div>
      <div class="row">
        <input type="date" value="${x.deadline}" data-dl style="flex:1;min-width:130px" title="Edit deadline" />
        <select class="status" data-st title="Status">
          ${["Not started", "In progress", "Essays done", "Submitted ✓"].map(o => `<option ${o === x.status ? "selected" : ""}>${o}</option>`).join("")}
        </select>
      </div>
      <div class="sprog"><i style="width:${p}%"></i></div>
      <div class="ess"></div>
      <div class="addess"><input placeholder="＋ essay, e.g. Why Us (250w)" data-new /><button class="btn small" data-add>＋</button></div>
      <div class="foot">
        <button class="btn small" data-doneall>Check all</button>
        <button class="btn small" data-submit>✓ Submit</button>
        <button class="btn small danger" data-del>Delete</button>
      </div>`;
    const essBox = card.querySelector(".ess");
    x.essays.forEach(e => {
      const d = document.createElement("div"); d.className = "eitem" + (e.done ? " done" : "");
      d.innerHTML = `<input type="checkbox" ${e.done ? "checked" : ""} /><div class="t"><b></b><span>${e.done ? "Done ✓" : "To do"}</span></div><button class="x" title="Delete essay">×</button>`;
      d.querySelector("b").textContent = e.title;
      d.querySelector("input").onchange = ev => { e.done = ev.target.checked; if (e.done && x.status === "Not started") x.status = "In progress"; autoStatus(x); render(); };
      d.querySelector(".x").onclick = () => { x.essays = x.essays.filter(y => y.id !== e.id); autoStatus(x); render(); };
      d.querySelector("b").ondblclick = () => { const v = prompt("Edit essay:", e.title); if (v) { e.title = v; render(); } };
      essBox.appendChild(d);
    });
    if (!x.essays.length) essBox.innerHTML = `<span class="hint">No essays — app-only or add one above.</span>`;
    const dl = card.querySelector("[data-dl]"); dl.onchange = () => { x.deadline = dl.value || x.deadline; render(); };
    card.querySelector("[data-st]").onchange = ev => { x.status = ev.target.value; if (x.status === "Submitted ✓") x.essays.forEach(e => e.done = true); render(); };
    const nin = card.querySelector("[data-new]");
    const add = () => { const v = nin.value.trim(); if (!v) return; x.essays.push({ id: uid(), title: v, done: false }); if (x.status === "Not started") x.status = "In progress"; render(); };
    card.querySelector("[data-add]").onclick = add; nin.onkeydown = e => { if (e.key === "Enter") add(); };
    card.querySelector("[data-doneall]").onclick = () => { const all = x.essays.every(e => e.done); x.essays.forEach(e => e.done = !all); autoStatus(x); render(); };
    card.querySelector("[data-submit]").onclick = () => { x.status = "Submitted ✓"; x.essays.forEach(e => e.done = true); render(); };
    card.querySelector("[data-del]").onclick = () => { if (confirm("Delete " + x.name + "?")) { state.schools = state.schools.filter(y => y.id !== x.id); render(); } };
    schoolsEl.appendChild(card);
  });
}

["q", "fCat", "fStatus", "fSort", "hideDone"].forEach(id => $(id).addEventListener("input", render));
$("psState").onchange = () => { state.ps = $("psState").value; save(); };
$("themeBtn").onclick = () => { state.theme = state.theme === "light" ? "dark" : "light"; document.documentElement.dataset.theme = state.theme === "light" ? "light" : ""; save(); };
$("exportBtn").onclick = () => { const b = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" }); const a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = "essay-tracker-backup.json"; a.click(); };
$("importBtn").onclick = () => $("fileIn").click();
$("fileIn").onchange = () => {
  const f = $("fileIn").files[0]; if (!f) return;
  const r = new FileReader();
  r.onload = () => { try { const d = JSON.parse(r.result); if (d.schools) { state = d; document.documentElement.dataset.theme = state.theme === "light" ? "light" : ""; render(); } else alert("Bad file"); } catch (e) { alert("Bad file"); } };
  r.readAsText(f);
};
$("csvBtn").onclick = () => {
  const rows = [["School", "Region", "Deadline", "Status", "Essays total", "Essays done", "Progress %"]];
  state.schools.forEach(x => rows.push([x.name, x.cat, x.deadline, x.status, x.essays.length, x.essays.filter(e => e.done).length, prog(x)]));
  const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
  const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" })); a.download = "essay-tracker.csv"; a.click();
};
$("resetBtn").onclick = () => { if (confirm("Reset to the original 35-school list? Your ticks will be lost.")) { localStorage.removeItem(LS); state = { schools: buildSeed(), ps: "Not started", theme: "dark" }; document.documentElement.dataset.theme = ""; render(); } };
$("addSchoolBtn").onclick = () => $("dlg").showModal();
$("dlgCancel").onclick = () => $("dlg").close();
$("dlgSave").onclick = () => {
  const nm = $("nName").value.trim(); if (!nm) { alert("Give the school a name"); return; }
  const es = $("nEssays").value.split(",").map(s => s.trim()).filter(Boolean);
  state.schools.push({ id: uid(), name: nm, cat: $("nCat").value, deadline: $("nDate").value || "2027-01-01", status: "Not started", essays: es.map(t => ({ id: uid(), title: t, done: false })) });
  $("nName").value = ""; $("nEssays").value = ""; $("dlg").close(); render();
};
$("addEssayAllBtn").onclick = () => {
  const v = prompt("Essay title to add to all US-RD schools:", "Why Us — fit & program (300w)"); if (!v) return;
  state.schools.forEach(x => { if (x.cat === "US-RD" && !x.essays.some(e => e.title === v)) x.essays.push({ id: uid(), title: v, done: false }); });
  render();
};
render();
