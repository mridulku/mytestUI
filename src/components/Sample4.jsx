import { useEffect, useState } from "react";

/**
 * Task Execution Screen (prototype)
 * - Three-pane layout: Instructions (left), Work Area (center), Supplementary (right)
 * - Top bar with Submit / Exit
 * - Floating "Give Feedback" button -> opens scoped modal:
 *   Step 1: Choose scope (This task / This project / FT Studio Platform)
 *   Step 2: Scope-appropriate questions
 * Pure React + inline styles; no external CSS/libs.
 */

const CURRENT_TASK = { id: "t42", title: "Water cycle Q→A" };
const CURRENT_PROJECT = { id: "p2", name: "TextbookQnAProject", workflow: "Chemistry" };

// Define scoped question sets
const TASK_FEATURES = [
  "Instruction clarity",
  "Tool stability",
  "Response latency",
  "Media playback quality",
  "Example relevance",
];

const PROJECT_FEATURES = [
  "Guideline clarity",
  "Review fairness",
  "Payment clarity",
  "Feedback turnaround",
  "Difficulty balance",
];

const PLATFORM_FEATURES = [
  "Overall navigation",
  "Dashboard speed",
  "Notification system",
  "Design and accessibility",
  "Bug frequency",
];

export default function Sample4() {
  const [open, setOpen] = useState(false);

  // Page scroll lock while modal is open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  // Stepper state
  const [step, setStep] = useState(1); // 1: scope, 2: questions
  const [scope, setScope] = useState(""); // "task" | "project" | "platform"

  // Task-level form


  // Project & Platform forms share the same structure
  const FEATURE_LIST = ["Editor", "Shortcuts", "Uploads", "Latency/Responsiveness", "Reviewer panel", "Keyboard navigation", "Dark mode"];

const [taskForm, setTaskForm] = useState({ csat:0, clarity:0, friction:[], comment:"", featureRatings:{}, featureNotes:{} });
const [projectForm, setProjectForm] = useState({ nps:-1, comment:"", featureRatings:{}, featureNotes:{} });
const [platformForm, setPlatformForm] = useState({ nps:-1, comment:"", featureRatings:{}, featureNotes:{} });

  const resetAndOpen = () => {
    setScope("");
    setStep(1);
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
  };

  const submit = (e) => {
    e.preventDefault();
    const payload =
      scope === "task"
        ? { scope, taskId: CURRENT_TASK.id, ...taskForm }
        : scope === "project"
        ? { scope, projectId: CURRENT_PROJECT.id, workflow: CURRENT_PROJECT.workflow, ...projectForm }
        : { scope, ...platformForm };

    console.log("FEEDBACK_SUBMIT", payload);
    // hook: call API here
    setOpen(false);
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
        <div style={{ display: "flex", gap: 8 }}>
          <button style={sx.secondaryBtn}>Submit</button>
          <button style={sx.tertiaryBtn}>Exit</button>
        </div>
      </header>

      {/* Body grid */}
      <div style={sx.body}>
        {/* Left: Instructions */}
        <aside style={sx.panel}>
          <div style={sx.panelHeader}>TASK INSTRUCTIONS</div>
          <div style={sx.panelBody}>
            <ol style={sx.ol}>
              <li><b>Read Carefully:</b> review the provided text.</li>
              <li><b>Listen to Audio:</b> gather auditory cues.</li>
              <li><b>Watch the Video:</b> confirm visual details.</li>
              <li><b>Cross-Reference:</b> answer using all sources.</li>
            </ol>
            <div style={sx.caption}>Guidelines</div>
            <ul style={sx.ul}>
              <li>Quiet environment; good headphones.</li>
              <li>Follow style & formatting rules.</li>
              <li>Flag ambiguous cases via feedback.</li>
            </ul>
          </div>
        </aside>

        {/* Center: Work Area */}
        <main style={sx.work}>
          <div style={sx.metaBar}>
            <span>⏱️ 03:21</span>
            <span>•</span>
            <span>❗ 2</span>
            <span>•</span>
            <span>✔ 2</span>
          </div>

          <Section title="INPUT">
            <Field label="Using">
              <div style={sx.readonlyBox}>“Using”</div>
            </Field>
            <Field label="Video">
              <div style={sx.videoBox}>No compatible source was found for this media.</div>
            </Field>
          </Section>

          <Section title="OUTPUT">
            <RichEditor />
          </Section>
        </main>

        {/* Right: Supplementary Details */}
        <aside style={{ ...sx.panel, width: 320 }}>
          <div style={sx.panelHeader}>SUPPLEMENTARY DETAILS</div>
          <div style={sx.panelBody}>
            <Attr
              required
              label="Which stage of water cycle is described in the Video?"
              hint="Pick the stage described in the given Video."
            >
              <Select options={["condensation", "evaporation", "precipitation", "collection"]} value="condensation" />
            </Attr>

            <Attr
              required
              label="Which stage of water cycle is described in the Audio?"
              hint="Pick the stage described in the given Audio."
            >
              <Select options={["1", "2", "3", "4"]} value="1" />
            </Attr>
          </div>
        </aside>
      </div>

      {/* Floating Give Feedback */}
      <button style={sx.fab} onClick={resetAndOpen}>Give Feedback</button>

      {/* Scoped Feedback Modal */}
      {open && (
        <div style={sx.modalOverlay} role="dialog" aria-modal="true" aria-labelledby="task-fb-title">
          <div style={sx.modal}>
            <div style={sx.modalHeader}>
              <div id="task-fb-title" style={{ fontWeight: 600, color: "#111827" }}>Give Feedback</div>
              <button aria-label="Close" onClick={closeModal} style={sx.iconBtn}><CloseIcon /></button>
            </div>

            <form onSubmit={submit} style={sx.modalBody}>
              {/* Stepper */}
              <ol style={stepper.sxTrack}>
                {["Scope", "Questions"].map((label, i) => (
                  <li
                    key={label}
                    style={{
                      ...stepper.sxStep,
                      ...(step === i + 1 ? stepper.sxStepActive : step > i + 1 ? stepper.sxStepDone : null),
                    }}
                  >
                    <span style={stepper.sxBullet}>{i + 1}</span>
                    <span style={stepper.sxLabel}>{label}</span>
                  </li>
                ))}
              </ol>

              {/* STEP 1: SCOPE */}
              {step === 1 && (
                <div style={{ display: "grid", gap: 12 }}>
                  <div style={sx.sectionHeaderCompact}>
                    What do you want to give feedback on?
                    <span style={sx.sectionSub}>Choose one</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                    <button
                      type="button"
                      onClick={() => { setScope("task"); setStep(2); }}
                      style={{ ...choice.sxCard, ...(scope === "task" ? choice.sxActive : null) }}
                    >
                      <div style={choice.sxTitle}>This task</div>
                      <div style={choice.sxDesc}>Feedback about the task you’re doing now.</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => { setScope("project"); setStep(2); }}
                      style={{ ...choice.sxCard, ...(scope === "project" ? choice.sxActive : null) }}
                    >
                      <div style={choice.sxTitle}>This project</div>
                      <div style={choice.sxDesc}>
                        {CURRENT_PROJECT.name} • {CURRENT_PROJECT.workflow}
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => { setScope("platform"); setStep(2); }}
                      style={{ ...choice.sxCard, ...(scope === "platform" ? choice.sxActive : null) }}
                    >
                      <div style={choice.sxTitle}>FT Studio Platform</div>
                      <div style={choice.sxDesc}>Overall product experience.</div>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: QUESTIONS */}
              
              {/* STEP 2: QUESTIONS — TASK */}
{step === 2 && scope === "task" && (
  <>
    <div style={sx.sectionHeaderCompact}>
      Task-specific feedback
      <span style={sx.sectionSub}>Help us understand this particular task</span>
    </div>

    <fieldset style={sx.group}>
      <legend style={sx.legend}>Overall satisfaction</legend>
      <Likert
        value={taskForm.csat}
        onChange={(v) => setTaskForm(f => ({ ...f, csat: v }))}
        labels={["Very poor", "Poor", "Okay", "Good", "Excellent"]}
      />
    </fieldset>

    {/* Quick reactions to task aspects (thumbs + short note) */}
    <fieldset style={sx.group}>
      <legend style={sx.legend}>Quick reactions to this task</legend>
      <div style={{ display: "grid", gap: 8 }}>
        {TASK_FEATURES.map(feat => (
          <FeatureRow
            key={feat}
            label={feat}
            rating={(taskForm.featureRatings ?? {})[feat] ?? null}
            note={(taskForm.featureNotes ?? {})[feat] ?? ""}
            onRate={(val) =>
              setTaskForm(f => ({
                ...f,
                featureRatings: { ...(f.featureRatings ?? {}), [feat]: val }
              }))
            }
            onNote={(val) =>
              setTaskForm(f => ({
                ...f,
                featureNotes: { ...(f.featureNotes ?? {}), [feat]: val.slice(0, 120) }
              }))
            }
          />
        ))}
      </div>
    </fieldset>

    <fieldset style={sx.group}>
      <legend style={sx.legend}>What slowed you down? (select all)</legend>
      <Chips
        options={["Ambiguous examples", "Tool bug", "Upload lag", "Conflicting feedback", "Edge cases"]}
        value={taskForm.friction ?? []}
        onChange={(arr) => setTaskForm(f => ({ ...f, friction: arr }))}
      />
    </fieldset>

    <label style={sx.field}>
      <span style={sx.label}>Anything else? (optional)</span>
      <textarea
        rows={4}
        value={taskForm.comment ?? ""}
        onChange={e => setTaskForm(f => ({ ...f, comment: e.target.value.slice(0, 280) }))}
        placeholder="Be specific: step, action, error message…"
        style={sx.textarea}
      />
      <div style={sx.hint}>{(taskForm.comment ?? "").length}/280</div>
    </label>
  </>
)}


{/* STEP 2: QUESTIONS — PROJECT */}
{step === 2 && scope === "project" && (
  <>
    <div style={sx.sectionHeaderCompact}>
      Project feedback
      <span style={sx.sectionSub}>{CURRENT_PROJECT.name} • {CURRENT_PROJECT.workflow}</span>
    </div>

    <fieldset style={sx.group}>
      <legend style={sx.legend}>Would you recommend this project to another annotator?</legend>
      <NpsPicker
        value={projectForm.nps ?? -1}
        onChange={(v) => setProjectForm(f => ({ ...f, nps: v }))}
      />
      <div style={sx.npsHintRow}>
        <span style={sx.npsHintLeft}>Not at all likely</span>
        <span style={sx.npsHintRight}>Extremely likely</span>
      </div>
    </fieldset>

    <fieldset style={sx.group}>
      <legend style={sx.legend}>Quick reactions to project aspects</legend>
      <div style={{ display: "grid", gap: 8 }}>
        {PROJECT_FEATURES.map(feat => (
          <FeatureRow
            key={feat}
            label={feat}
            rating={(projectForm.featureRatings ?? {})[feat] ?? null}
            note={(projectForm.featureNotes ?? {})[feat] ?? ""}
            onRate={(val) =>
              setProjectForm(f => ({
                ...f,
                featureRatings: { ...(f.featureRatings ?? {}), [feat]: val }
              }))
            }
            onNote={(val) =>
              setProjectForm(f => ({
                ...f,
                featureNotes: { ...(f.featureNotes ?? {}), [feat]: val.slice(0, 120) }
              }))
            }
          />
        ))}
      </div>
    </fieldset>

    <label style={sx.field}>
      <span style={sx.label}>Anything else about this project? (optional)</span>
      <textarea
        rows={4}
        value={projectForm.comment ?? ""}
        onChange={e => setProjectForm(f => ({ ...f, comment: e.target.value.slice(0, 400) }))}
        placeholder="Instruction pain points, review practices, edge cases…"
        style={sx.textarea}
      />
      <div style={sx.hint}>{(projectForm.comment ?? "").length}/400</div>
    </label>
  </>
)}


{/* STEP 2: QUESTIONS — PLATFORM */}
{step === 2 && scope === "platform" && (
  <>
    <div style={sx.sectionHeaderCompact}>
      Platform feedback
      <span style={sx.sectionSub}>High-level signal about FT Studio overall</span>
    </div>

    <fieldset style={sx.group}>
      <legend style={sx.legend}>How likely are you to recommend FT Studio to another annotator?</legend>
      <NpsPicker
        value={platformForm.nps ?? -1}
        onChange={(v) => setPlatformForm(f => ({ ...f, nps: v }))}
      />
      <div style={sx.npsHintRow}>
        <span style={sx.npsHintLeft}>Not at all likely</span>
        <span style={sx.npsHintRight}>Extremely likely</span>
      </div>
    </fieldset>

    <fieldset style={sx.group}>
      <legend style={sx.legend}>Quick reactions to key features</legend>
      <div style={{ display: "grid", gap: 8 }}>
        {PLATFORM_FEATURES.map(feat => (
          <FeatureRow
            key={feat}
            label={feat}
            rating={(platformForm.featureRatings ?? {})[feat] ?? null}
            note={(platformForm.featureNotes ?? {})[feat] ?? ""}
            onRate={(val) =>
              setPlatformForm(f => ({
                ...f,
                featureRatings: { ...(f.featureRatings ?? {}), [feat]: val }
              }))
            }
            onNote={(val) =>
              setPlatformForm(f => ({
                ...f,
                featureNotes: { ...(f.featureNotes ?? {}), [feat]: val.slice(0, 120) }
              }))
            }
          />
        ))}
      </div>
    </fieldset>

    <label style={sx.field}>
      <span style={sx.label}>Anything else about the platform? (optional)</span>
      <textarea
        rows={4}
        value={platformForm.comment ?? ""}
        onChange={e => setPlatformForm(f => ({ ...f, comment: e.target.value.slice(0, 400) }))}
        placeholder="Which panel, which step, any error text…"
        style={sx.textarea}
      />
      <div style={sx.hint}>{(platformForm.comment ?? "").length}/400</div>
    </label>
  </>
)}



              {/* Actions */}
              <div style={sx.modalActions}>
                <button type="button" onClick={closeModal} style={sx.tertiaryBtn}>Cancel</button>
                {step === 2 ? (
                  <button
                    type="submit"
                    style={sx.primaryBtn}
                    disabled={
                      (scope === "task" && taskForm.csat === 0) ||
                      (scope === "project" && projectForm.nps < 0) ||
                      (scope === "platform" && platformForm.nps < 0)
                    }
                  >
                    Submit
                  </button>
                ) : (
                  <button
                    type="button"
                    style={sx.primaryBtn}
                    onClick={() => scope && setStep(2)}
                    disabled={!scope}
                  >
                    Next
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

/* ---------------- Layout primitives ---------------- */

function Section({ title, children }) {
  return (
    <section style={sx.section}>
      <div style={sx.sectionHeader}>{title}</div>
      <div>{children}</div>
    </section>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={sx.fieldLabel}>{label}</div>
      {children}
    </div>
  );
}

function Attr({ label, hint, required, children }) {
  return (
    <div style={sx.attr}>
      <div style={sx.attrLabel}>
        {label} {required && <span style={{ color: "#7c3aed" }}>*</span>}
      </div>
      {hint && <div style={sx.attrHint}>{hint}</div>}
      <div>{children}</div>
    </div>
  );
}

function Select({ options, value }) {
  return (
    <select defaultValue={value} style={sx.select}>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

function RichEditor() {
  return (
    <div>
      <div style={sx.toolbar}>
        <span style={sx.tool}>File</span>
        <span style={sx.tool}>Edit</span>
        <span style={sx.tool}>View</span>
        <span style={sx.tool}>Insert</span>
        <span style={sx.tool}>Format</span>
        <span style={sx.tool}>Tools</span>
        <span style={sx.tool}>Table</span>
        <div style={{ flex: 1 }} />
        <span style={sx.tool}>B</span>
        <span style={sx.tool}>I</span>
        <span style={sx.tool}>•</span>
        <span style={sx.tool}>1.</span>
      </div>
      <textarea rows={8} defaultValue="Type your answer here…" style={sx.editor} />
    </div>
  );
}

/* ---------------- Modal widgets ---------------- */

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

function NpsPicker({ value = -1, onChange }) {
  return (
    <div style={sx.npsRow}>
      {Array.from({ length: 11 }, (_, n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          aria-pressed={value === n}
          style={{ ...sx.npsBtn, ...(value === n ? sx.npsBtnActive : null) }}
        >
          {n}
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

/* ---------------- Icons ---------------- */

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

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
      <path d="M5 5l10 10M15 5L5 15" stroke="#6b7280" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  );
}

/* ---------------- Styles ---------------- */

const sx = {
  page: { background: "#f7f7fb", minHeight: "100vh" },

  topbar: {
    height: 48, display: "flex", alignItems: "center", padding: "0 12px",
    borderBottom: "1px solid #e5e7eb", background: "white", position: "sticky", top: 0, zIndex: 5
  },
  brand: { display: "flex", alignItems: "center", gap: 8 },
  brandMark: { width: 14, height: 14, borderRadius: 3, background: "#34d399" },
  brandText: { fontWeight: 600, color: "#111827" },

  secondaryBtn: { border: "1px solid #6d28d9", background: "#6d28d9", color: "white", borderRadius: 8, padding: "8px 12px" },
  tertiaryBtn: { border: "1px solid #e5e7eb", background: "white", color: "#374151", borderRadius: 8, padding: "8px 12px" },

  body: {
    display: "grid",
    gridTemplateColumns: "280px 1fr 320px",
    gap: 16,
    padding: 16,
    maxWidth: 1400,
    margin: "0 auto"
  },

  panel: { background: "white", border: "1px solid #e5e7eb", borderRadius: 8, overflow: "hidden" },
  panelHeader: { padding: "10px 12px", fontSize: 12, fontWeight: 700, color: "#6b7280", borderBottom: "1px solid #e5e7eb", background: "#fafafa" },
  panelBody: { padding: 12 },

  ol: { margin: "6px 0 12px 16px", color: "#374151", fontSize: 13, lineHeight: 1.5 },
  ul: { margin: "6px 0 0 16px", color: "#374151", fontSize: 13, lineHeight: 1.5 },
  caption: { marginTop: 8, color: "#6b7280", fontSize: 12, fontWeight: 600 },

  work: { background: "white", border: "1px solid #e5e7eb", borderRadius: 8, padding: 12, minHeight: 520 },
  metaBar: { display: "flex", gap: 8, alignItems: "center", color: "#6b7280", fontSize: 12, marginBottom: 8 },

  section: { border: "1px solid #e5e7eb", borderRadius: 8, marginBottom: 12, overflow: "hidden" },
  sectionHeader: { padding: "10px 12px", background: "#f9fafb", borderBottom: "1px solid #e5e7eb", fontWeight: 600, color: "#374151" },

  fieldLabel: { fontSize: 12, color: "#6b7280", marginBottom: 6 },
  readonlyBox: { padding: 10, border: "1px solid #e5e7eb", borderRadius: 8, background: "white", color: "#111827", fontSize: 13 },
  videoBox: {
    height: 220, display: "grid", placeItems: "center",
    border: "1px solid #e5e7eb", borderRadius: 8, background: "black", color: "white", fontSize: 13
  },

  toolbar: {
    display: "flex", alignItems: "center", gap: 12, padding: "8px 10px",
    border: "1px solid #e5e7eb", borderBottom: "none", borderTopLeftRadius: 8, borderTopRightRadius: 8, background: "#fafafa"
  },
  tool: { color: "#4b5563", fontSize: 12 },
  editor: {
    width: "100%", border: "1px solid #e5e7eb", borderBottomLeftRadius: 8, borderBottomRightRadius: 8,
    padding: 10, fontSize: 13, minHeight: 160
  },

  attr: { borderBottom: "1px solid #f1f5f9", padding: "10px 0" },
  attrLabel: { fontWeight: 600, color: "#111827" },
  attrHint: { fontSize: 12, color: "#6b7280", marginBottom: 6 },
  select: { height: 34, border: "1px solid #d1d5db", borderRadius: 6, padding: "0 10px", fontSize: 13, background: "white" },

  /* Floating action button */
  fab: {
    position: "fixed", right: 20, bottom: 20, zIndex: 10,
    background: "#34d399", color: "#064e3b", border: "1px solid #10b981",
    borderRadius: 10, padding: "10px 14px", fontWeight: 600, boxShadow: "0 6px 16px rgba(0,0,0,0.15)"
  },

  /* Modal shell */
  modalOverlay: {
    position: "fixed", inset: 0, background: "rgba(17,24,39,0.35)",
    display: "grid", placeItems: "center", padding: 16, zIndex: 50
  },
  modal: {
    width: 820,
    maxWidth: "96vw",
    maxHeight: "90vh",
    background: "white",
    borderRadius: 10,
    boxShadow: "0 16px 40px rgba(0,0,0,0.25)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column"
  },
  modalHeader: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "12px 16px", borderBottom: "1px solid #e5e7eb", background: "#f9fafb",
    flex: "0 0 auto"
  },
  modalBody: {
    padding: 16,
    overflowY: "auto",
    flex: "1 1 auto",
    minHeight: 0,
    WebkitOverflowScrolling: "touch"
  },

  group: { border: "1px solid #e5e7eb", borderRadius: 8, padding: 12, marginBottom: 12, background: "#fafafa" },
  legend: { fontSize: 12, color: "#6b7280", padding: "0 6px" },

  likertRow: { display: "flex", gap: 8, flexWrap: "wrap" },
  likertBtn: { display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 4, minWidth: 56, padding: "8px 10px", borderRadius: 8, border: "1px solid #e5e7eb", background: "white", color: "#111827", fontWeight: 600 },
  likertBtnActive: { borderColor: "#6d28d9", boxShadow: "0 0 0 2px #ede9fe inset", color: "#6d28d9" },
  likertLabel: { fontSize: 11, color: "#6b7280", fontWeight: 500 },

  chips: { display: "flex", gap: 8, flexWrap: "wrap" },
  chip: { border: "1px solid #e5e7eb", background: "white", borderRadius: 999, padding: "6px 10px", fontSize: 12, color: "#374151" },
  chipActive: { borderColor: "#6d28d9", color: "#6d28d9", background: "#f5f3ff" },

  field: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontSize: 12, color: "#6b7280" },
  textarea: { border: "1px solid #d1d5db", borderRadius: 8, padding: 10, fontSize: 13, resize: "vertical" },
  hint: { textAlign: "right", fontSize: 11, color: "#9ca3af", marginTop: 4 },

  modalActions: { display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 10 },
  primaryBtn: { height: 34, border: "1px solid #6d28d9", borderRadius: 8, background: "#6d28d9", color: "white", padding: "0 14px", fontSize: 13 },
  tertiaryBtn: { height: 34, border: "1px solid #e5e7eb", borderRadius: 8, background: "#f9fafb", padding: "0 12px", fontSize: 13 },
  iconBtn: { height: 30, width: 30, border: "1px solid #e5e7eb", borderRadius: 6, background: "white", display: "grid", placeItems: "center" },

  sectionHeaderCompact: {
    fontWeight: 600,
    color: "#111827",
    fontSize: 14,
    display: "flex",
    flexDirection: "column",
    marginBottom: 6,
  },
  sectionSub: {
    fontWeight: 400,
    color: "#6b7280",
    fontSize: 12,
  },

  /* NPS and feature rows */
  npsRow: { display: "grid", gridTemplateColumns: "repeat(11, 1fr)", gap: 6 },
  npsBtn: { height: 34, border: "1px solid #e5e7eb", borderRadius: 8, background: "white", fontSize: 13, color: "#374151" },
  npsBtnActive: { borderColor: "#6d28d9", boxShadow: "0 0 0 2px #ede9fe inset", color: "#6d28d9", fontWeight: 700 },
  npsHintRow: { display: "flex", justifyContent: "space-between", marginTop: 6 },
  npsHintLeft: { fontSize: 11, color: "#9ca3af" },
  npsHintRight: { fontSize: 11, color: "#9ca3af" },

  featureRow: { display: "grid", gridTemplateColumns: "1fr auto", alignItems: "center", gap: 8 },
  featureLabel: { fontSize: 13, color: "#111827", fontWeight: 600 },
  thumbs: { display: "inline-flex", gap: 6 },
  thumbBtn: { height: 30, minWidth: 42, border: "1px solid #e5e7eb", borderRadius: 8, background: "white", fontSize: 14, lineHeight: "28px", cursor: "pointer" },
  thumbActiveUp: { borderColor: "#10b981", boxShadow: "0 0 0 2px #d1fae5 inset", color: "#065f46", fontWeight: 700 },
  thumbActiveDown: { borderColor: "#ef4444", boxShadow: "0 0 0 2px #fee2e2 inset", color: "#7f1d1d", fontWeight: 700 },
  featureNote: { gridColumn: "1 / -1", height: 32, border: "1px solid #e5e7eb", borderRadius: 8, padding: "0 10px", fontSize: 13, color: "#111827", background: "white" },
};

const stepper = {
  sxTrack: { display: "flex", gap: 12, margin: "0 0 12px 0", padding: 0, listStyle: "none" },
  sxStep: { display: "flex", alignItems: "center", gap: 8, color: "#9ca3af", fontSize: 13 },
  sxStepActive: { color: "#6d28d9", fontWeight: 600 },
  sxStepDone: { color: "#10b981", fontWeight: 600 },
  sxBullet: { height: 22, width: 22, borderRadius: 999, display: "grid", placeItems: "center", border: "1px solid #e5e7eb", background: "white" },
  sxLabel: { lineHeight: 1 },
};

const choice = {
  sxCard: { border: "1px solid #e5e7eb", background: "white", borderRadius: 10, padding: 12, textAlign: "left" },
  sxActive: { outline: "2px solid #6d28d9", outlineOffset: 0, background: "#f5f3ff" },
  sxTitle: { fontWeight: 600, color: "#111827", marginBottom: 4 },
  sxDesc: { fontSize: 12, color: "#6b7280" },
};