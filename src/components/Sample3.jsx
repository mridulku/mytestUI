import { useMemo, useState } from "react";

/**
 * FT Studio App — Tasks list + sticky "Give Feedback" button.
 * Modal shows a compact, friendly CSAT form (Likert + quick diagnostics).
 * No external CSS/libs; neutral console look.
 */

const PROJECTS = [
  { id: "p1", name: "Testing_Project", tags: ["wf1"], blurb: "Sample project for testing QC flow." },
  { id: "p2", name: "TextbookQnAProject", tags: ["Chemistry"], blurb: "Create Q–A pairs from academic diagrams." },
  { id: "p3", name: "TextbookQnAProject", tags: ["Custom"], blurb: "Create Q–A pairs from custom sources." }
];

export default function Sample3() {
  const [activeTab, setActiveTab] = useState("Tasks");
  const [open, setOpen] = useState(false);

  const [currentStep, setCurrentStep] = useState(1); // 1: Scope, 2: Target, 3: Questions
const [scope, setScope] = useState("");           // "project" | "platform"


 const [form, setForm] = useState({
  // target
  targetProject: "",
  targetWorkflow: "",
  // project/workflow feedback
  csat: 0,
  clarity: 0,
  friction: [],
  // platform feedback
  platformCsat: 0,
  liked: [],
  needs: [],
  // misc
  comment: "",
  device: "Desktop",
  allowFollowup: true,
});

  const tasksCount = useMemo(() => PROJECTS.length, []);

  const submit = (e) => {
    e.preventDefault();
    // Hook: send to API
    console.log("SUBMIT_FEEDBACK", form);
    setOpen(false);
    setForm({ csat: 0, clarity: 0, friction: [], comment: "", device: "Desktop", allowFollowup: true });
  };

  

  return (
    <section style={sx.page}>
      {/* Top bar */}
      <header style={sx.topbar}>
        <div style={sx.brand}>
          <span style={sx.brandMark} />
          <span style={sx.brandText}>FT Studio App</span>
        </div>
        <div style={{ flex: 1 }} />
        <div style={sx.user}>Mridul Kumar Pant ▾</div>
      </header>

      {/* Tabs */}
      <nav style={sx.tabs}>
        {["Tasks Queues", "Exams", "Timesheet"].map(t => (
          <button
            key={t}
            onClick={() => setActiveTab(t.split(" ")[0])}
            style={{ ...sx.tab, ...(activeTab === t.split(" ")[0] ? sx.tabActive : null) }}
          >
            {t}
          </button>
        ))}
      </nav>

      {/* Sub-tabs */}
      <div style={sx.subtabs}>
        <button style={{ ...sx.pill, ...sx.pillActive }}>Available Tasks</button>
        <button style={sx.pill}>Feedback</button>
        <button style={sx.pill}>Tasks Saved For Later</button>
        <div style={{ flex: 1 }} />
        <div style={{ color: "#6b7280", fontSize: 12 }}>Total: {tasksCount}</div>
      </div>

      {/* Task cards */}
      <main style={sx.cards}>
        {PROJECTS.map(p => (
          <article key={p.id} style={sx.card}>
            <div style={sx.cardHead}>
              <div style={sx.cardTitleRow}>
                <h3 style={sx.cardTitle}>{p.name}</h3>
                <div style={sx.badges}>
                  {p.tags.map((t, i) => (<span key={i} style={sx.badge}>{t}</span>))}
                </div>
              </div>
              <button aria-label="copy link" title="Copy project link" style={sx.iconBtn}>
                <CopyIcon />
              </button>
            </div>
            <p style={sx.blurb}>{p.blurb}</p>
            <div style={sx.cardFoot}>
              <span style={sx.stat}><SparkIcon /> Task Stats</span>
              <button style={sx.disclosure}>▼</button>
            </div>
          </article>
        ))}
      </main>

      {/* Sticky Give Feedback */}
<button style={sx.fab} onClick={() => { setScope(""); setCurrentStep(1); setOpen(true); }}>
  Give Feedback
</button>

   {open && (
  <div style={sx.modalOverlay} role="dialog" aria-modal="true" aria-labelledby="fb-title">
    <div style={{ ...sx.modal, maxHeight: "90vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ ...sx.modalHeader, flex: "0 0 auto" }}>
        <div id="fb-title" style={{ fontWeight: 600, color: "#111827" }}>Give Feedback</div>
        <button aria-label="Close" onClick={() => setOpen(false)} style={sx.iconBtn}><CloseIcon /></button>
      </div>

      {/* Body (scrollable) */}
      <form
        onSubmit={submit}
        style={{ ...sx.modalBody, flex: "1 1 auto", overflowY: "auto", minHeight: 0 }}
      >
        {/* Stepper */}
        <ol style={stepper.sxTrack}>
          {["Scope", "Target", "Questions"].map((label, i) => (
            <li key={label} style={{ ...stepper.sxStep, ...(currentStep === i+1 ? stepper.sxStepActive : (currentStep > i+1 ? stepper.sxStepDone : null)) }}>
              <span style={stepper.sxBullet}>{i+1}</span>
              <span style={stepper.sxLabel}>{label}</span>
            </li>
          ))}
        </ol>

        {/* STEP 1: SCOPE */}
        {currentStep === 1 && (
          <div style={{ display: "grid", gap: 12 }}>
            <div style={sx.sectionHeaderCompact}>
              What do you want to give feedback on?
              <span style={sx.sectionSub}>Choose one</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <button
                type="button"
                onClick={() => { setScope("project"); setCurrentStep(2); }}
                style={{ ...choice.sxCard, ...(scope === "project" ? choice.sxActive : null) }}
              >
                <div style={choice.sxTitle}>A Specific Project</div>
                <div style={choice.sxDesc}>Tell about your experience particular to a specific project.</div>
              </button>
              <button
                type="button"
                onClick={() => { setScope("platform"); setCurrentStep(3); }}
                style={{ ...choice.sxCard, ...(scope === "platform" ? choice.sxActive : null) }}
              >
                <div style={choice.sxTitle}>Fine Tune Studio Platform</div>
                <div style={choice.sxDesc}>Tell us about your experience working on Fine Tune Studio.</div>
              </button>
            </div>
          </div>
        )}

       {/* STEP 2: TARGET (only for project scope) */}
{currentStep === 2 && scope === "project" && (
  <div style={{ display: "grid", gap: 12 }}>
    <div style={sx.sectionHeaderCompact}>
      Select Target Project
    </div>

    <label style={sx.field}>
      <span style={sx.label}>Project</span>
      <select
        value={form.targetCombo ?? ""}
        onChange={e => {
          const [projectId, workflow] = e.target.value.split("||");
          setForm(f => ({
            ...f,
            targetCombo: e.target.value,
            targetProject: projectId,
            targetWorkflow: workflow,
          }));
        }}
        style={sx.select}
        required
      >
        <option value="" disabled>Choose Project</option>
        {PROJECTS.flatMap(p =>
          p.tags.map(tag => (
            <option key={`${p.id}-${tag}`} value={`${p.id}||${tag}`}>
              {p.name} • {tag}
            </option>
          ))
        )}
      </select>
    </label>
  </div>
)}

  {/* STEP 3: QUESTIONS — PLATFORM */}
{currentStep === 3 && scope === "platform" && (
  <>
    <div style={{ ...sx.sectionHeaderCompact, marginTop: 4 }}>
      Platform feedback
      <span style={sx.sectionSub}>High-level signal about FT Studio overall</span>
    </div>

    {/* NPS-style likelihood to recommend */}
    <fieldset style={sx.group}>
      <legend style={sx.legend}>How likely are you to recommend FT Studio to another annotator?</legend>
      <NpsPicker
        value={form.platformNps ?? -1}
        onChange={(v) => setForm(f => ({ ...f, platformNps: v }))}
      />
    
    </fieldset>

    {/* Feature thumbs with optional notes */}
    <fieldset style={sx.group}>
      <legend style={sx.legend}>Quick reactions to key features</legend>
      <div style={{ display: "grid", gap: 8 }}>
        {["Editor","Shortcuts","Uploads","Latency/Responsiveness","Reviewer panel","Keyboard navigation","Dark mode"].map(feat => (
          <FeatureRow
            key={feat}
            label={feat}
            rating={(form.featureRatings ?? {})[feat] ?? null}
            note={(form.featureNotes ?? {})[feat] ?? ""}
            onRate={(val) => setForm(f => ({
              ...f,
              featureRatings: { ...(f.featureRatings ?? {}), [feat]: val }
            }))}
            onNote={(val) => setForm(f => ({
              ...f,
              featureNotes: { ...(f.featureNotes ?? {}), [feat]: val.slice(0, 120) }
            }))}
          />
        ))}
      </div>
    </fieldset>

    {/* Overall free-text */}
    <label style={sx.field}>
      <span style={sx.label}>Anything else you’d like us to know? (optional)</span>
      <textarea
        rows={4}
        value={form.comment ?? ""}
        onChange={e => setForm(f => ({ ...f, comment: e.target.value.slice(0, 400) }))}
        placeholder="Be specific: which step, which panel, any error text…"
        style={sx.textarea}
      />
      <div style={sx.hint}>{(form.comment ?? "").length}/400</div>
    </label>
  </>
)}

{/* STEP 3: QUESTIONS — PROJECT */}
{currentStep === 3 && scope === "project" && (
  <>
    <div style={{ ...sx.sectionHeaderCompact, marginTop: 4 }}>
      Project feedback
      <span style={sx.sectionSub}>
        About your experience on this project • {form.targetProject && form.targetWorkflow
          ? `${form.targetProject} • ${form.targetWorkflow}`
          : ""}
      </span>
    </div>

    {/* 1️⃣ NPS-style “Would you recommend” */}
    <fieldset style={sx.group}>
      <legend style={sx.legend}>How likely are you to recommend this project to another annotator?</legend>
      <NpsPicker
        value={form.projectNps ?? -1}
        onChange={(v) => setForm(f => ({ ...f, projectNps: v }))}
      />
   
    </fieldset>

    {/* 2️⃣ Task-specific reactions */}
    <fieldset style={sx.group}>
      <legend style={sx.legend}>Quick reactions to key aspects</legend>
      <div style={{ display: "grid", gap: 8 }}>
        {[
          "Clarity of instructions",
          "Quality of examples",
          "Feedback from reviewers",
          "Task difficulty",
          "Interface responsiveness",
          "Availability of support material"
        ].map(q => (
          <FeatureRow
            key={q}
            label={q}
            rating={(form.taskRatings ?? {})[q] ?? null}
            note={(form.taskNotes ?? {})[q] ?? ""}
            onRate={(val) =>
              setForm(f => ({
                ...f,
                taskRatings: { ...(f.taskRatings ?? {}), [q]: val }
              }))
            }
            onNote={(val) =>
              setForm(f => ({
                ...f,
                taskNotes: { ...(f.taskNotes ?? {}), [q]: val.slice(0, 120) }
              }))
            }
          />
        ))}
      </div>
    </fieldset>

    {/* 3️⃣ Friction tags */}
    <fieldset style={sx.group}>
      <legend style={sx.legend}>What slowed you down? (select all that apply)</legend>
      <Chips
        options={[
          "Ambiguous guidelines",
          "Too many edge cases",
          "Tool bugs / lag",
          "Reviewer disagreement",
          "Poor asset quality",
          "Time constraints"
        ]}
        value={form.friction ?? []}
        onChange={(arr) => setForm(f => ({ ...f, friction: arr }))}
      />
    </fieldset>

    {/* 4️⃣ Overall comment */}
    <label style={sx.field}>
      <span style={sx.label}>Anything else you'd like to share? (optional)</span>
      <textarea
        rows={4}
        value={form.comment ?? ""}
        onChange={e => setForm(f => ({ ...f, comment: e.target.value.slice(0, 400) }))}
        placeholder="Be specific: instruction mismatch, unclear review, or interface issue…"
        style={sx.textarea}
      />
      <div style={sx.hint}>{(form.comment ?? "").length}/400</div>
    </label>
  </>
)}





        {/* Actions */}
        <div style={sx.modalActions}>
          <button type="button" onClick={() => setOpen(false)} style={sx.tertiaryBtn}>Cancel</button>
          {currentStep > 1 && (
            <button
              type="button"
              style={sx.tertiaryBtn}
              onClick={() => setCurrentStep(s => Math.max(1, s - 1))}
            >
              Back
            </button>
          )}
          {currentStep < 3 ? (
            <button
              type="button"
              style={sx.primaryBtn}
              onClick={() => {
                if (currentStep === 1 && scope) setCurrentStep( scope === "platform" ? 3 : 2 );
                else if (currentStep === 2 && form.targetProject && form.targetWorkflow) setCurrentStep(3);
              }}
              disabled={
                (currentStep === 1 && !scope) ||
                (currentStep === 2 && (!form.targetProject || !form.targetWorkflow))
              }
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              style={sx.primaryBtn}
              // inside the final Submit button
disabled={
  scope === "project"
    ? ((form.projectNps ?? -1) === -1 || !form.targetProject || !form.targetWorkflow)
    : ((form.platformNps ?? -1) === -1)
}
            >
              Submit
            </button>
          )}
        </div>
      </form>
    </div>
  </div>
)}


    </section>
  );
}

/* ---------------- UI primitives ---------------- */

function Likert({ value, onChange, labels }) {
  return (
    <div style={sx.likertRow}>
      {[1,2,3,4,5].map((n, i) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          style={{ ...sx.likertBtn, ...(value === n ? sx.likertBtnActive : null) }}
          aria-pressed={value === n}
        >
          {n}
          <span style={sx.likertLabel}>{labels?.[i]}</span>
        </button>
      ))}
    </div>
  );
}

// Replace your existing NpsPicker with this 1–5 version
function NpsPicker({ value = -1, onChange }) {
  const labels = ["Not at all likely", "", "", "", "Extremely likely"];
  return (
    <div style={sx.npsRow}>  {/* <- use npsRow (you already defined it) */}
      {[1, 2, 3, 4, 5].map((n, i) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          aria-pressed={value === n}
          style={{ ...sx.npsBtn, ...(value === n ? sx.npsBtnActive : null) }}
        >
          {n}
          <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 2, height: 14 }}>
            {labels[i]}
          </div>
        </button>
      ))}
    </div>
  );
}

function FeatureRow({ label, rating, note, onRate, onNote }) {
  const showNote = rating === "up" || rating === "down" || (note?.length ?? 0) > 0;
  return (
    <div style={sx.featureRow}>
      <div style={sx.featureLabel}>{label}</div>
      <div style={sx.thumbs}>
        <button
          type="button"
          onClick={() => onRate(rating === "up" ? null : "up")}
          aria-pressed={rating === "up"}
          title="Thumbs up"
          style={{ ...sx.thumbBtn, ...(rating === "up" ? sx.thumbActiveUp : null) }}
        >👍</button>
        <button
          type="button"
          onClick={() => onRate(rating === "down" ? null : "down")}
          aria-pressed={rating === "down"}
          title="Thumbs down"
          style={{ ...sx.thumbBtn, ...(rating === "down" ? sx.thumbActiveDown : null) }}
        >👎</button>
      </div>
      {showNote && (
        <input
          type="text"
          value={note}
          placeholder={rating === "down" ? "What didn’t work?" : "What worked well?"}
          onChange={(e) => onNote(e.target.value)}
          style={sx.featureNote}
        />
      )}
    </div>
  );
}

function Chips({ options, value = [], onChange }) {
  const toggle = (opt) => {
    const set = new Set(value);
    set.has(opt) ? set.delete(opt) : set.add(opt);
    onChange(Array.from(set));
  };
  return (
    <div style={sx.chips}>
      {options.map(opt => (
        <button
          key={opt}
          type="button"
          onClick={() => toggle(opt)}
          style={{ ...sx.chip, ...(value.includes(opt) ? sx.chipActive : null) }}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

/* ---------------- Icons ---------------- */

function CopyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
      <rect x="6" y="6" width="10" height="12" rx="2" stroke="#6b7280" />
      <rect x="4" y="2" width="10" height="12" rx="2" stroke="#9ca3af" />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
      <path d="M10 2l1.7 4.2L16 8l-4.3 1.8L10 14l-1.7-4.2L4 8l4.3-1.8L10 2z" fill="#7c3aed"/>
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
      <path d="M5 5l10 10M15 5L5 15" stroke="#6b7280" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  );
}

/* ---------------- Styles ---------------- */



const sx = {
  

  npsRow:{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 6 },
npsBtn: {
  height: 48,               // a bit taller to fit the tiny label
  minWidth: 60,             // prevents narrow wrapping
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  border: "1px solid #e5e7eb",
  borderRadius: 8,
  background: "white",
  fontSize: 13,
  color: "#374151"
},
npsBtnActive: { borderColor: "#6d28d9", boxShadow: "0 0 0 2px #ede9fe inset", color: "#6d28d9", fontWeight: 700 },
npsHintRow: { display: "flex", justifyContent: "space-between", marginTop: 6 },
npsHintLeft: { fontSize: 11, color: "#9ca3af" },
npsHintRight: { fontSize: 11, color: "#9ca3af" },

featureRow: { display: "grid", gridTemplateColumns: "1fr auto", alignItems: "center", gap: 8 },
featureLabel: { fontSize: 13, color: "#111827", fontWeight: 600 },
thumbs: { display: "inline-flex", gap: 6 },
thumbBtn: {
  height: 30, minWidth: 42, border: "1px solid #e5e7eb", borderRadius: 8,
  background: "white", fontSize: 14, lineHeight: "28px", cursor: "pointer"
},
thumbActiveUp: { borderColor: "#10b981", boxShadow: "0 0 0 2px #d1fae5 inset", color: "#065f46", fontWeight: 700 },
thumbActiveDown: { borderColor: "#ef4444", boxShadow: "0 0 0 2px #fee2e2 inset", color: "#7f1d1d", fontWeight: 700 },
featureNote: {
  gridColumn: "1 / -1",
  height: 32, border: "1px solid #e5e7eb", borderRadius: 8, padding: "0 10px",
  fontSize: 13, color: "#111827", background: "white"
},

sectionHeaderCompact: { padding: "2px 0", fontWeight: 700, color: "#374151" },
sectionSub: { marginLeft: 8, fontSize: 12, color: "#6b7280", fontWeight: 400 },


  page: { background: "#f7f7fb", minHeight: "100vh" },

  

  topbar: {
    height: 48, display: "flex", alignItems: "center", padding: "0 16px",
    borderBottom: "1px solid #e5e7eb", background: "white", position: "sticky", top: 0, zIndex: 5
  },
  brand: { display: "flex", alignItems: "center", gap: 8 },
  brandMark: { width: 14, height: 14, borderRadius: 3, background: "#34d399" },
  brandText: { fontWeight: 600, color: "#111827" },
  user: { fontSize: 13, color: "#374151" },

  tabs: { display: "flex", gap: 18, padding: "10px 16px 0" },
  tab: {
    padding: "8px 2px", fontSize: 14, color: "#4b5563", border: "none",
    background: "transparent", borderBottom: "2px solid transparent", cursor: "pointer"
  },
  tabActive: { color: "#111827", borderBottomColor: "#6d28d9", fontWeight: 600 },

  subtabs: {
    display: "flex", alignItems: "center", gap: 8, padding: "10px 16px 12px",
    borderBottom: "1px solid #e5e7eb", background: "white"
  },
  pill: {
    border: "1px solid #e5e7eb", background: "white", borderRadius: 999, padding: "6px 10px",
    fontSize: 12, color: "#4b5563"
  },
  pillActive: { borderColor: "#6d28d9", color: "#6d28d9" },

  cards: { padding: 16, display: "grid", gap: 12, maxWidth: 920, margin: "0 auto" },
  card: { background: "white", border: "1px solid #e5e7eb", borderRadius: 8, padding: 14 },
  cardHead: { display: "flex", alignItems: "center" },
  cardTitleRow: { display: "flex", alignItems: "center", gap: 8, flex: 1 },
  cardTitle: { margin: 0, fontSize: 16, color: "#111827" },
  badges: { display: "flex", gap: 6 },
  badge: { fontSize: 11, color: "#111827", background: "#e5e7eb", borderRadius: 6, padding: "2px 8px" },
  blurb: { color: "#6b7280", fontSize: 13, margin: "8px 0 12px" },
  cardFoot: { display: "flex", alignItems: "center", justifyContent: "space-between" },
  stat: { display: "inline-flex", alignItems: "center", gap: 6, color: "#6b7280", fontSize: 13 },
  disclosure: { border: "1px solid #e5e7eb", background: "white", borderRadius: 6, padding: "4px 8px" },
  iconBtn: { height: 30, width: 30, border: "1px solid #e5e7eb", borderRadius: 6, background: "white", display: "grid", placeItems: "center" },

sectionHeaderCompact: {
  fontWeight: 600,
  color: "#111827",
  fontSize: 14,
  display: "flex",
  flexDirection: "column",
  margin: "2px 0 6px",
},
sectionSub: {
  fontWeight: 400,
  color: "#6b7280",
  fontSize: 12,
},

  fab: {
    position: "fixed", right: 20, bottom: 20, zIndex: 10,
    background: "#34d399", color: "#064e3b", border: "1px solid #10b981",
    borderRadius: 10, padding: "10px 14px", fontWeight: 600, boxShadow: "0 6px 16px rgba(0,0,0,0.15)"
  },

  modalOverlay: {
    position: "fixed", inset: 0, background: "rgba(17,24,39,0.35)",
    display: "grid", placeItems: "center", padding: 16, zIndex: 20
  },
  modal: {
    width: 820, maxWidth: "96vw", background: "white", borderRadius: 10,
    boxShadow: "0 16px 40px rgba(0,0,0,0.25)", overflow: "hidden",
    maxHeight: "90vh",
  display: "flex",
  flexDirection: "column",
  },
  modalHeader: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "12px 16px", borderBottom: "1px solid #e5e7eb", background: "#f9fafb"
  },
  modalBody: { padding: 16 ,  overflowY: "auto",
  flex: "1 1 auto",
  minHeight: 0,},

  group: { border: "1px solid #e5e7eb", borderRadius: 8, padding: 12, marginBottom: 12, background: "#fafafa" },
  legend: { fontSize: 12, color: "#6b7280", padding: "0 6px" },

  likertRow: { display: "flex", gap: 8, flexWrap: "wrap" },
  likertBtn: {
    display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 4,
    minWidth: 56, padding: "8px 10px", borderRadius: 8, border: "1px solid #e5e7eb",
    background: "white", color: "#111827", fontWeight: 600
  },
  likertBtnActive: { borderColor: "#6d28d9", boxShadow: "0 0 0 2px #ede9fe inset", color: "#6d28d9" },
  likertLabel: { fontSize: 11, color: "#6b7280", fontWeight: 500 },

  chips: { display: "flex", gap: 8, flexWrap: "wrap" },
  chip: { border: "1px solid #e5e7eb", background: "white", borderRadius: 999, padding: "6px 10px", fontSize: 12, color: "#374151" },
  chipActive: { borderColor: "#6d28d9", color: "#6d28d9", background: "#f5f3ff" },

  twoCol: { display: "grid", gridTemplateColumns: "240px 1fr", gap: 16, marginTop: 4 },
  field: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontSize: 12, color: "#6b7280" },
  select: { height: 36, border: "1px solid #d1d5db", borderRadius: 6, padding: "0 10px", fontSize: 13, background: "white" },
  textarea: { border: "1px solid #d1d5db", borderRadius: 8, padding: 10, fontSize: 13, resize: "vertical" },
  hint: { textAlign: "right", fontSize: 11, color: "#9ca3af", marginTop: 4 },

  checkRow: { display: "flex", alignItems: "center", gap: 8, color: "#374151", fontSize: 13 },

  modalActions: { display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 10 },
  tertiaryBtn: { height: 34, border: "1px solid #e5e7eb", borderRadius: 6, background: "#f9fafb", padding: "0 12px", fontSize: 13 },
  primaryBtn: { height: 34, border: "1px solid #6d28d9", borderRadius: 6, background: "#6d28d9", color: "white", padding: "0 14px", fontSize: 13 },
};

const stepper = {
  sxTrack: { display: "flex", gap: 12, margin: "0 0 12px 0", padding: 0, listStyle: "none" },
  sxStep:   { display: "flex", alignItems: "center", gap: 8, color: "#9ca3af", fontSize: 13 },
  sxStepActive: { color: "#6d28d9", fontWeight: 600 },
  sxStepDone: { color: "#10b981", fontWeight: 600 },
  sxBullet: { height: 22, width: 22, borderRadius: 999, display: "grid", placeItems: "center", border: "1px solid #e5e7eb", background: "white" },
  sxLabel: { lineHeight: 1 }
};

const choice = {
  sxCard: { border: "1px solid #e5e7eb", background: "white", borderRadius: 10, padding: 12, textAlign: "left" },
  sxActive: { outline: "2px solid #6d28d9", outlineOffset: 0, background: "#f5f3ff" },
  sxTitle: { fontWeight: 600, color: "#111827", marginBottom: 4 },
  sxDesc: { fontSize: 12, color: "#6b7280" }
};