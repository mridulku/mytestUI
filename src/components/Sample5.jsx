import { useState } from "react";

/**
 * Sample5 — Project Feedback (Mandatory Workflow Feedback)
 * Mirrors the project feedback structure from Sample3 step 3.
 * Clean, segmented questions: NPS → aspects → friction → comment.
 * No "Allow PM contact" checkbox.
 */

export default function Sample5() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    projectNps: -1,
    taskRatings: {},
    taskNotes: {},
    friction: [],
    comment: "",
  });

  const submit = (e) => {
    e.preventDefault();
    console.log("PROJECT_WORKFLOW_FEEDBACK", form);
    setSubmitted(true);
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
        <div style={sx.subtle}>
          Your feedback helps improve workflow instructions and reduce friction.
        </div>
      </header>

      {/* Body grid */}
      <div style={sx.body}>
        {/* Left instructions */}
        <aside style={sx.panel}>
          <div style={sx.panelHeader}>TASK INSTRUCTIONS</div>
          <div style={sx.panelBody}>
            <p style={sx.p}>
              You’ve completed a few tasks in this workflow. Please share your feedback to help us
              improve task design, clarity, and reviewer alignment.
            </p>
            <ol style={sx.ol}>
              <li><b>Be specific.</b> Mention which step or tool behavior you’re referring to.</li>
              <li><b>Be concise.</b> It takes less than a minute.</li>
              <li><b>Be honest.</b> Ratings directly help refine guidelines and reviews.</li>
            </ol>
            <div style={sx.hintBox}>
              Severe or recurring issues are automatically flagged for PM review.
            </div>
          </div>
        </aside>

        {/* Feedback form */}
        <main style={sx.formWrap}>
          <div style={sx.formCard}>
            <div style={sx.formHeader}>
              <div style={sx.formTitle}>Project Feedback</div>
              <span style={sx.badge}>Required</span>
            </div>

            {submitted ? (
              <div style={sx.success}>
                Thank you. Your feedback has been recorded. You can return to your task queue.
              </div>
            ) : (
              <form onSubmit={submit}>
                {/* 1️⃣ NPS question */}
                <fieldset style={sx.group}>
                  <legend style={sx.legend}>
                    How likely are you to recommend this project to another annotator?
                  </legend>
                  <NpsPicker
                    value={form.projectNps}
                    onChange={(v) => setForm(f => ({ ...f, projectNps: v }))}
                  />
                  <div style={sx.npsHintRow}>
                    <span style={sx.npsHintLeft}>Not at all likely</span>
                    <span style={sx.npsHintRight}>Extremely likely</span>
                  </div>
                </fieldset>

                {/* 2️⃣ Quick reactions to aspects */}
                <fieldset style={sx.group}>
                  <legend style={sx.legend}>Quick reactions to key aspects</legend>
                  <div style={{ display: "grid", gap: 8 }}>
                    {[
                      "Clarity of instructions",
                      "Quality of examples",
                      "Feedback from reviewers",
                      "Task difficulty",
                      "Interface responsiveness",
                      "Availability of support material",
                    ].map(q => (
                      <FeatureRow
                        key={q}
                        label={q}
                        rating={(form.taskRatings ?? {})[q] ?? null}
                        note={(form.taskNotes ?? {})[q] ?? ""}
                        onRate={(val) =>
                          setForm(f => ({
                            ...f,
                            taskRatings: { ...(f.taskRatings ?? {}), [q]: val },
                          }))
                        }
                        onNote={(val) =>
                          setForm(f => ({
                            ...f,
                            taskNotes: { ...(f.taskNotes ?? {}), [q]: val.slice(0, 120) },
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
                      "Time constraints",
                    ]}
                    value={form.friction}
                    onChange={(arr) => setForm(f => ({ ...f, friction: arr }))}
                  />
                </fieldset>

                {/* 4️⃣ Open comment */}
                <label style={sx.field}>
                  <span style={sx.label}>Anything else you'd like to share? (optional)</span>
                  <textarea
                    rows={4}
                    value={form.comment}
                    onChange={(e) =>
                      setForm(f => ({ ...f, comment: e.target.value.slice(0, 400) }))
                    }
                    placeholder="Describe any confusion, mismatch, or improvement ideas…"
                    style={sx.textarea}
                  />
                  <div style={sx.hint}>{form.comment.length}/400</div>
                </label>

                {/* Actions */}
                <div style={sx.actions}>
                  <button
                    type="submit"
                    style={sx.primaryBtn}
                    disabled={form.projectNps < 0}
                  >
                    Submit Feedback
                  </button>
                </div>
              </form>
            )}
          </div>
        </main>
      </div>
    </section>
  );
}

/* ---------- Components ---------- */

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
  const showNote =
    rating === "up" || rating === "down" || (note?.length ?? 0) > 0;
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
      {showNote && (
        <input
          type="text"
          value={note}
          placeholder={
            rating === "down" ? "What didn’t work?" : "What worked well?"
          }
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
      {options.map((opt) => (
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

/* ---------- Styles ---------- */

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
  subtle: { fontSize: 12, color: "#6b7280" },

  body: {
    display: "grid",
    gridTemplateColumns: "280px 1fr",
    gap: 16,
    padding: 16,
    maxWidth: 1200,
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
  p: {
    color: "#374151",
    fontSize: 13,
    lineHeight: 1.6,
    margin: "0 0 10px",
  },
  ol: {
    margin: "6px 0 12px 16px",
    color: "#374151",
    fontSize: 13,
    lineHeight: 1.5,
  },
  hintBox: {
    background: "#f5f3ff",
    border: "1px solid #e9d5ff",
    color: "#5b21b6",
    borderRadius: 8,
    padding: 10,
    fontSize: 12,
  },

  formWrap: { display: "grid" },
  formCard: {
    background: "white",
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    padding: 14,
  },
  formHeader: { display: "flex", alignItems: "center", gap: 8, marginBottom: 6 },
  formTitle: { fontWeight: 700, color: "#111827" },
  badge: {
    fontSize: 11,
    padding: "3px 8px",
    borderRadius: 999,
    background: "#fde68a",
    color: "#92400e",
    border: "1px solid #f59e0b",
  },
  success: {
    background: "#ecfdf5",
    border: "1px solid #a7f3d0",
    color: "#065f46",
    padding: 12,
    borderRadius: 8,
  },

  group: {
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    background: "#fafafa",
  },
  legend: { fontSize: 12, color: "#6b7280", padding: "0 6px" },

  field: { display: "flex", flexDirection: "column", gap: 6, marginTop: 6 },
  label: { fontSize: 12, color: "#6b7280" },
  textarea: {
    border: "1px solid #d1d5db",
    borderRadius: 8,
    padding: 10,
    fontSize: 13,
    resize: "vertical",
  },
  hint: { textAlign: "right", fontSize: 11, color: "#9ca3af", marginTop: 4 },

  actions: { display: "flex", justifyContent: "flex-end", marginTop: 8 },
  primaryBtn: {
    height: 36,
    border: "1px solid #6d28d9",
    borderRadius: 8,
    background: "#6d28d9",
    color: "white",
    padding: "0 14px",
    fontSize: 13,
    fontWeight: 600,
  },

  // NPS
  npsRow: { display: "grid", gridTemplateColumns: "repeat(11, 1fr)", gap: 6 },
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
  featureNote: {
    gridColumn: "1 / -1",
    height: 32,
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    padding: "0 10px",
    fontSize: 13,
    color: "#111827",
    background: "white",
  },

  chips: { display: "flex", gap: 8, flexWrap: "wrap" },
  chip: {
    border: "1px solid #e5e7eb",
    background: "white",
    borderRadius: 999,
    padding: "6px 10px",
    fontSize: 12,
    color: "#374151",
  },
  chipActive: {
    borderColor: "#6d28d9",
    color: "#6d28d9",
    background: "#f5f3ff",
  },
};