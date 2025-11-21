import { useState, useEffect } from "react";

/**
 * Sample6 — Task screen with functional Submit modal
 * - Layout unchanged
 * - Submit modal has a collapsible "Project & platform feedback" section
 * - Inside that section: project/platform feedback (no project name row, clearer copy)
 */

export default function Sample6() {
  const [submitOpen, setSubmitOpen] = useState(false);

  // Prevent background scroll while modal is open
  useEffect(() => {
    if (submitOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [submitOpen]);

  // Top-of-modal state (task-level)
  const [confidence, setConfidence] = useState("yes");
  const [comments, setComments] = useState("");

  // Advanced feedback (collapsed by default)
  const [advOpen, setAdvOpen] = useState(false);

  // Project/platform feedback
  const [projectForm, setProjectForm] = useState({
    nps: -1,                // 0–10, -1 = unset
    featureRatings: {},     // { [label]: 'up' | 'down' | null }
    comment: "",            // project / platform-level free text
  });

  const confirmSubmit = () => {
    const payload = {
      confidence,
      comments, // task-level
      extraFeedback: advOpen ? { project: projectForm } : null,
    };
    console.log("SUBMIT_TASK_PAYLOAD", payload);

    // reset minimal UI state
    setSubmitOpen(false);
    setComments("");
    setConfidence("yes");
    setAdvOpen(false);

    // clear feedback form
    setProjectForm({ nps: -1, featureRatings: {}, comment: "" });
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
        <button
          title="Give Feedback (disabled in this sample)"
          style={{ ...sx.fbBtn, opacity: 0.6, cursor: "not-allowed" }}
          disabled
          onClick={() => {}}
        >
          Give Feedback
        </button>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={sx.primaryBtn} onClick={() => setSubmitOpen(true)}>
            Submit
          </button>
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
              <li><b>Read Carefully:</b> review provided text.</li>
              <li><b>Listen:</b> gather auditory cues.</li>
              <li><b>Watch:</b> confirm visual details.</li>
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

      {/* Submit Modal */}
      {submitOpen && (
        <div style={sx.modalOverlay} role="dialog" aria-modal="true" aria-labelledby="submit-title">
          <div style={sx.modal}>
            <div style={sx.modalHeader}>
              <div id="submit-title" style={{ fontWeight: 600, color: "#111827" }}>Submit Task</div>
              <button aria-label="Close" onClick={() => setSubmitOpen(false)} style={sx.iconBtn}><CloseIcon /></button>
            </div>

            <div style={sx.modalBody}>
              {/* Confidence prompt */}
              <fieldset style={sx.group}>
                <legend style={sx.legend}>Are you confident about your response?</legend>
                <div style={sx.radioCol}>
                  <label style={sx.radioRow}>
                    <input
                      type="radio"
                      name="confidence"
                      value="yes"
                      checked={confidence === "yes"}
                      onChange={(e) => setConfidence(e.target.value)}
                    />
                    <span>Yes, I am confident</span>
                  </label>
                  <label style={sx.radioRow}>
                    <input
                      type="radio"
                      name="confidence"
                      value="review"
                      checked={confidence === "review"}
                      onChange={(e) => setConfidence(e.target.value)}
                    />
                    <span>No, my response needs a review</span>
                  </label>
                </div>
              </fieldset>

              {/* Additional comments (task-level) */}
              <label style={sx.field}>
                <textarea
                  rows={4}
                  value={comments}
                  onChange={(e) => setComments(e.target.value.slice(0, 500))}
                  placeholder="Additional Comments"
                  style={sx.textarea}
                />
                <div style={sx.hint}>{comments.length}/500</div>
              </label>

              {/* Collapsible: Project & platform feedback */}
              <div style={sx.collapse}>
                <button
                  type="button"
                  onClick={() => setAdvOpen((o) => !o)}
                  style={sx.collapseBtn}
                  aria-expanded={advOpen}
                >
                  <span>Share Additional Feedback about the Project</span>
                  <span>{advOpen ? "▲" : "▼"}</span>
                </button>

                {advOpen && (
                  <div style={sx.collapseBody}>
                    
                    <fieldset style={sx.group}>
                      <legend style={sx.legend}>
                        Overall, how satisfied were you with your experience contributing to this project?
                      </legend>
                      <NpsPicker
                        value={projectForm.nps}
                        onChange={(v) => setProjectForm((f) => ({ ...f, nps: v }))}
                      />
                      <div style={sx.npsHintRow}>
                        <span style={sx.npsHintLeft}>0 = Not at all satisfied</span>
                        <span style={sx.npsHintRight}>10 = Extremely satisfied</span>
                      </div>
                    </fieldset>

                    <fieldset style={sx.group}>
  <legend style={sx.legend}>Quick reactions to key aspects</legend>
  <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 8 }}>
    Use 👍 / 👎 to rate different parts of this project. Hover on the <span title="More details">ℹ️</span> icon
    if you’re unsure what an item means.
  </div>
  <div style={{ display: "grid", gap: 8 }}>
    {QUICK_ASPECTS.map((aspect) => (
      <FeatureRow
        key={aspect.key}
        emoji={aspect.emoji}
        label={aspect.label}
        tooltip={aspect.help}
        rating={projectForm.featureRatings[aspect.key] ?? null}
        onRate={(val) =>
          setProjectForm((f) => ({
            ...f,
            featureRatings: { ...f.featureRatings, [aspect.key]: val },
          }))
        }
      />
    ))}
  </div>
</fieldset>

                    <label style={sx.field}>
                      <span style={sx.label}>Anything else you want to share? (optional)</span>
                      <textarea
                        rows={4}
                        value={projectForm.comment}
                        onChange={(e) =>
                          setProjectForm((f) => ({
                            ...f,
                            comment: e.target.value.slice(0, 400),
                          }))
                        }
                        placeholder="Use this for overall project feedback."
                        style={sx.textarea}
                      />
                      <div style={sx.hint}>
                        {(projectForm.comment ?? "").length}/400
                      </div>
                    </label>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div style={sx.modalActions}>
                <button type="button" onClick={() => setSubmitOpen(false)} style={sx.tertiaryBtn}>
                  Cancel
                </button>
                <button type="button" onClick={confirmSubmit} style={sx.primaryBtn}>
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/* ---------------- Constants ---------------- */

const PROJECT_FEATURES = [
  "Instruction clarity & examples",
  "Coverage of edge cases",
  "Reviewer fairness & transparency",
  "Tool reliability & speed",
  "Task complexity & time per task",
  "Payment and incentive clarity",
];

const QUICK_ASPECTS = [
  {
    key: "instructions",
    emoji: "📖",
    label: "Guidelines",
    help: "How clear and easy-to-follow the written guidelines and examples for this project were.",
  },
  {
    key: "reviewer",
    emoji: "🧑‍⚖️",
    label: "Reviewer decisions",
    help: "How fair and consistent reviewer feedback and accept/reject decisions felt.",
  },
  {
    key: "tool",
    emoji: "⚙️",
    label: "User Interface",
    help: "How stable and responsive the FTS tool felt while working on this project.",
  },
  {
    key: "workload",
    emoji: "⏱️",
    label: "Workload per task",
    help: "How reasonable the time and effort per task felt for this project.",
  },
  {
    key: "payment",
    emoji: "💰",
    label: "Payment",
    help: "How clear and fair the payment for this project felt to you.",
  },
];

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
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
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

/* ---------------- Small widgets ---------------- */

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

function FeatureRow({ emoji, label, tooltip, rating, onRate }) {
  return (
    <div style={sx.featureRow}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ fontSize: 16 }}>{emoji}</span>
        <span style={sx.featureLabel}>{label}</span>

        {tooltip && (
          <span
            title={tooltip}
            style={{
              marginLeft: 4,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              height: 16,
              width: 16,
              borderRadius: "999px",
              border: "1px solid #d1d5db",
              background: "#f9fafb",
              fontSize: 10,
              fontWeight: 600,
              color: "#6b7280",
              cursor: "help",
            }}
          >
            i
          </span>
        )}
      </div>

      <div style={sx.thumbs}>
        <button
          type="button"
          onClick={() => onRate(rating === "up" ? null : "up")}
          aria-pressed={rating === "up"}
          title="Thumbs up"
          style={{ ...sx.thumbBtn, ...(rating === "up" ? sx.thumbActiveUp : null) }}
        >
          👍
        </button>
        <button
          type="button"
          onClick={() => onRate(rating === "down" ? null : "down")}
          aria-pressed={rating === "down"}
          title="Thumbs down"
          style={{ ...sx.thumbBtn, ...(rating === "down" ? sx.thumbActiveDown : null) }}
        >
          👎
        </button>
      </div>
    </div>
  );
}

/* ---------------- Styles ---------------- */

const sx = {
  page: { background: "#f7f7fb", minHeight: "100vh" },

  topbar: {
    height: 48,
    display: "flex",
    alignItems: "center",
    padding: "0 12px",
    borderBottom: "1px solid #e5e7eb",
    background: "white",
    position: "sticky",
    top: 0,
    zIndex: 5,
  },
  brand: { display: "flex", alignItems: "center", gap: 8 },
  brandMark: { width: 14, height: 14, borderRadius: 3, background: "#34d399" },
  brandText: { fontWeight: 600, color: "#111827" },

  fbBtn: {
    marginRight: 12,
    background: "#34d399",
    color: "#064e3b",
    border: "1px solid #10b981",
    borderRadius: 8,
    padding: "8px 12px",
    fontWeight: 600,
  },
  primaryBtn: {
    border: "1px solid #6d28d9",
    background: "#6d28d9",
    color: "white",
    borderRadius: 8,
    padding: "8px 12px",
  },
  tertiaryBtn: {
    border: "1px solid #e5e7eb",
    background: "white",
    color: "#374151",
    borderRadius: 8,
    padding: "8px 12px",
  },

  body: {
    display: "grid",
    gridTemplateColumns: "280px 1fr 320px",
    gap: 16,
    padding: 16,
    maxWidth: 1400,
    margin: "0 auto",
  },

  panel: {
    background: "white",
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    overflow: "hidden",
  },
  panelHeader: {
    padding: "10px 12px",
    fontSize: 12,
    fontWeight: 700,
    color: "#6b7280",
    borderBottom: "1px solid #e5e7eb",
    background: "#fafafa",
  },
  panelBody: { padding: 12 },

  ol: {
    margin: "6px 0 12px 16px",
    color: "#374151",
    fontSize: 13,
    lineHeight: 1.5,
  },
  ul: {
    margin: "6px 0 0 16px",
    color: "#374151",
    fontSize: 13,
    lineHeight: 1.5,
  },
  caption: { marginTop: 8, color: "#6b7280", fontSize: 12, fontWeight: 600 },

  work: {
    background: "white",
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    padding: 12,
    minHeight: 520,
  },
  metaBar: {
    display: "flex",
    gap: 8,
    alignItems: "center",
    color: "#6b7280",
    fontSize: 12,
    marginBottom: 8,
  },

  section: {
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    marginBottom: 12,
    overflow: "hidden",
  },
  sectionHeader: {
    padding: "10px 12px",
    background: "#f9fafb",
    borderBottom: "1px solid #e5e7eb",
    fontWeight: 600,
    color: "#374151",
  },

  fieldLabel: { fontSize: 12, color: "#6b7280", marginBottom: 6 },
  readonlyBox: {
    padding: 10,
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    background: "white",
    color: "#111827",
    fontSize: 13,
  },
  videoBox: {
    height: 220,
    display: "grid",
    placeItems: "center",
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    background: "black",
    color: "white",
    fontSize: 13,
  },

  toolbar: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "8px 10px",
    border: "1px solid #e5e7eb",
    borderBottom: "none",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    background: "#fafafa",
  },
  tool: { color: "#4b5563", fontSize: 12 },
  editor: {
    width: "100%",
    border: "1px solid #e5e7eb",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    padding: 10,
    fontSize: 13,
    minHeight: 160,
  },

  attr: { borderBottom: "1px solid #f1f5f9", padding: "10px 0" },
  attrLabel: { fontWeight: 600, color: "#111827" },
  attrHint: { fontSize: 12, color: "#6b7280", marginBottom: 6 },
  select: {
    height: 34,
    border: "1px solid #d1d5db",
    borderRadius: 6,
    padding: "0 10px",
    fontSize: 13,
    background: "white",
  },

  /* Modal */
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(17,24,39,0.35)",
    display: "grid",
    placeItems: "center",
    padding: 16,
    zIndex: 50,
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
    flexDirection: "column",
  },

  modalHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 16px",
    borderBottom: "1px solid #e5e7eb",
    background: "#f9fafb",
    flex: "0 0 auto",
  },

  modalBody: {
    padding: 16,
    overflowY: "auto",
    flex: "1 1 auto",
    minHeight: 0,
    WebkitOverflowScrolling: "touch",
  },

collapse: {
  border: "1px solid #e5e7eb",
  borderRadius: 6,
  overflow: "hidden",
  marginTop: 8,
},
  collapseBtn: {
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  background: "#ffffff",            // plain white (no highlight)
  border: "none",
  padding: "6px 4px",               // smaller = less visual weight
  fontSize: 13,                     // smaller
  fontWeight: 500,                  // medium, not bold
  color: "#6b7280",                 // softer grey
  cursor: "pointer",
},
  collapseBody: { padding: 12, background: "white" },

  group: {
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    background: "#fafafa",
  },
  legend: { fontSize: 12, color: "#6b7280", padding: "0 6px" },

  radioCol: { display: "grid", gap: 8 },
  radioRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    color: "#374151",
    fontSize: 13,
  },

  field: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontSize: 12, color: "#6b7280" },
  textarea: {
    border: "1px solid #d1d5db",
    borderRadius: 8,
    padding: 10,
    fontSize: 13,
    resize: "vertical",
  },
  hint: { textAlign: "right", fontSize: 11, color: "#9ca3af", marginTop: 4 },

  modalActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 12,
  },
  iconBtn: {
    height: 30,
    width: 30,
    border: "1px solid #e5e7eb",
    borderRadius: 6,
    background: "white",
    display: "grid",
    placeItems: "center",
  },

  /* NPS + feature rows */
  npsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(11, 1fr)",
    gap: 6,
  },
  npsBtn: {
    height: 34,
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    background: "white",
    fontSize: 13,
    color: "#374151",
  },
  npsBtnActive: {
    borderColor: "#6d28d9",
    boxShadow: "0 0 0 2px #ede9fe inset",
    color: "#6d28d9",
    fontWeight: 700,
  },
  npsHintRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 6,
  },
  npsHintLeft: { fontSize: 11, color: "#9ca3af" },
  npsHintRight: { fontSize: 11, color: "#9ca3af" },

  featureRow: {
    display: "grid",
    gridTemplateColumns: "1fr auto",
    alignItems: "center",
    gap: 8,
  },
  featureLabel: { fontSize: 13, color: "#111827", fontWeight: 600 },
  thumbs: { display: "inline-flex", gap: 6 },
  thumbBtn: {
    height: 30,
    minWidth: 42,
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    background: "white",
    fontSize: 14,
    lineHeight: "28px",
    cursor: "pointer",
  },
  thumbActiveUp: {
    borderColor: "#10b981",
    boxShadow: "0 0 0 2px #d1fae5 inset",
    color: "#065f46",
    fontWeight: 700,
  },
  thumbActiveDown: {
    borderColor: "#ef4444",
    boxShadow: "0 0 0 2px #fee2e2 inset",
    color: "#7f1d1d",
    fontWeight: 700,
  },

  sectionHeaderCompact: {
    fontWeight: 600,
    fontSize: 13,
    color: "#111827",
    marginBottom: 8,
  },
  sectionSub: { fontSize: 12, color: "#6b7280", marginTop: 2 },
};

/* ---------------- Icons ---------------- */

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
      <path d="M5 5l10 10M15 5L5 15" stroke="#6b7280" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}