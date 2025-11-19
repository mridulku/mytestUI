// Sample8.jsx
import { useState } from "react";

/**
 * Sample8 — Configure Workflow Survey (Minimal)
 * - Single card: "Workflow Survey"
 * - Subtext: enable contributors to provide a workflow survey when submitting or skipping a task
 * - Toggle to enable/disable
 * - Settings modal:
 *     • Shows fixed included questions (NPS, quick reactions, open comment)
 *     • Allows adding custom questions (with optional options + required flag)
 */

const DEFAULTS = {
  workflow: {
    enabled: true,
    custom: [], // [{ id, text, options: ["a","b"], required: false }]
  },
};

export default function Sample8() {
  const [conf, setConf] = useState(DEFAULTS);
  const [active, setActive] = useState(false); // false | true

  const toggle = () =>
    setConf((c) => ({ ...c, workflow: { ...c.workflow, enabled: !c.workflow.enabled } }));

  const open = () => setActive(true);
  const close = () => setActive(false);

  const patchWorkflow = (patch) =>
    setConf((c) => ({ ...c, workflow: { ...c.workflow, ...patch } }));

  return (
    <section style={sx.page}>
      <div style={sx.headerRow}>
        <h2 style={sx.h2}>Configure Feedback</h2>
        <div style={{ flex: 1 }} />
        <button
          style={sx.secondaryBtn}
          onClick={() => console.log("SAVE_WORKFLOW_CONF", conf)}
        >
          Save
        </button>
      </div>

      <div style={sx.note}>
        Enable or disable the workflow survey for this workflow. Contributors will see it when
        they <b>submit</b> or <b>skip</b> a task.
      </div>

      <div style={sx.cardsCol}>
        <Card>
          <div style={sx.cardHeader}>
            <div>
              <div style={sx.cardTitle}>Workflow Survey</div>
              <div style={sx.cardDesc}>
                Enable contributors to provide a workflow-level survey when they are{" "}
                submitting or skipping a task.
              </div>
            </div>
            <div style={sx.headerControls}>
              <button
                aria-label="settings"
                onClick={open}
                style={sx.iconBtn}
              >
                <GearIcon />
              </button>
              <Toggle checked={conf.workflow.enabled} onChange={toggle} />
            </div>
          </div>

          <div style={sx.quickRow}>
           
          </div>
        </Card>
      </div>

      {active && (
        <Modal title="Settings — Workflow Survey" onClose={close}>
          <WorkflowSettings
            value={conf.workflow}
            onChange={patchWorkflow}
            onClose={close}
          />
        </Modal>
      )}
    </section>
  );
}

/* -------------------- Settings Panel -------------------- */

function WorkflowSettings({ value, onChange, onClose }) {
  const builtIns = [
    {
      label: "Recommendation (NPS-style)",
      question: "Would you recommend this workflow to another annotator?",
      details: "0–10 scale, used to track overall workflow sentiment over time.",
    },
    {
      label: "Quick reactions",
      question: "Give quick reactions for key aspects of the workflow.",
      details:
        "Thumbs-up / thumbs-down for: instruction clarity, reviewer fairness, tool performance, UI/layout.",
    },
    {
      label: "Open comment",
      question: "Anything else you’d like to share about this workflow?",
      details: "Free-text field for nuanced feedback and edge-case descriptions.",
    },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1.3fr", gap: 16 }}>
      {/* Included questions (fixed) */}
      <div style={sx.fieldGroup}>
        <div style={sx.groupTitle}>Included Questions (fixed)</div>
        <div style={sx.subtext}>
          These questions are always included in the workflow survey when it appears
          on submit/skip. They cannot be turned off here.
        </div>

        <div style={{ display: "grid", gap: 8, marginTop: 8 }}>
          {builtIns.map((q, i) => (
            <div key={i} style={sx.builtinCard}>
              <div style={sx.builtinTitle}>{q.label}</div>
              <div style={sx.builtinQuestion}>{q.question}</div>
              <div style={sx.builtinDetails}>{q.details}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Questions */}
      <div style={sx.fieldGroup}>
        <CustomQuestionsEditor
          items={value.custom}
          onChange={(items) => onChange({ custom: items })}
        />
      </div>

      <div style={sx.modalActionsRow}>
        <button style={sx.tertiaryBtn} onClick={onClose}>
          Cancel
        </button>
        <button style={sx.primaryBtn} onClick={onClose}>
          Apply
        </button>
      </div>
    </div>
  );
}

/* -------------------- Custom Q Editor -------------------- */

function CustomQuestionsEditor({ items, onChange }) {
  const add = () => {
    const id = "q" + Math.random().toString(36).slice(2, 8);
    onChange([...(items || []), { id, text: "", options: [], required: false }]);
  };

  const update = (id, patch) =>
    onChange(items.map((q) => (q.id === id ? { ...q, ...patch } : q)));

  const remove = (id) => onChange(items.filter((q) => q.id !== id));

  const addOption = (id) => {
    const q = items.find((q) => q.id === id);
    const opts = [...(q.options || []), ""];
    update(id, { options: opts });
  };

  const setOption = (id, idx, val) => {
    const q = items.find((q) => q.id === id);
    const opts = [...(q.options || [])];
    opts[idx] = val;
    update(id, { options: opts });
  };

  const removeOption = (id, idx) => {
    const q = items.find((q) => q.id === id);
    const opts = [...(q.options || [])];
    opts.splice(idx, 1);
    update(id, { options: opts });
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 6,
        }}
      >
        <div style={sx.groupTitle}>Custom Questions</div>
        <button style={sx.smallBtn} onClick={add}>
          Add custom question
        </button>
      </div>

      {(items?.length || 0) === 0 && (
        <div style={sx.emptyBox}>No custom questions configured.</div>
      )}

      <div style={{ display: "grid", gap: 10 }}>
        {items?.map((q, i) => (
          <div key={q.id} style={sx.customQCard}>
            <div style={{ display: "grid", gap: 8 }}>
              <Field label={`Question ${i + 1}`}>
                <input
                  style={sx.input}
                  placeholder="Type the question as the annotator will see it"
                  value={q.text}
                  onChange={(e) => update(q.id, { text: e.target.value })}
                />
              </Field>

              <div style={{ display: "grid", gap: 6 }}>
                <div style={sx.smallLabel}>Options (optional)</div>
                {(q.options || []).map((opt, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr auto",
                      gap: 6,
                    }}
                  >
                    <input
                      style={sx.input}
                      placeholder={`Option ${idx + 1}`}
                      value={opt}
                      onChange={(e) =>
                        setOption(q.id, idx, e.target.value)
                      }
                    />
                    <button
                      style={sx.iconOnlyBtn}
                      onClick={() => removeOption(q.id, idx)}
                      title="Remove option"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    style={sx.smallBtn}
                    onClick={() => addOption(q.id)}
                  >
                    Add option
                  </button>
                  <span style={sx.subtle}>
                    If you don’t add options, this becomes a free-text question.
                  </span>
                </div>
              </div>

              <label style={sx.check}>
                <input
                  type="checkbox"
                  checked={!!q.required}
                  onChange={(e) =>
                    update(q.id, { required: e.target.checked })
                  }
                />
                <span>Required</span>
              </label>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  style={sx.tertiaryBtn}
                  onClick={() => remove(q.id)}
                >
                  Remove question
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------- UI Primitives -------------------- */

function Card({ children }) {
  return <div style={sx.card}>{children}</div>;
}

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={onChange}
      role="switch"
      aria-checked={checked}
      style={{
        height: 22,
        width: 40,
        borderRadius: 999,
        background: checked ? "#6d28d9" : "#e5e7eb",
        border: "1px solid " + (checked ? "#6d28d9" : "#d1d5db"),
        position: "relative",
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 1,
          left: checked ? 20 : 1,
          height: 18,
          width: 18,
          borderRadius: 999,
          background: "white",
          boxShadow: "0 1px 2px rgba(16,24,40,0.2)",
        }}
      />
    </button>
  );
}

function Modal({ title, children, onClose }) {
  return (
    <div style={sx.modalOverlay} role="dialog" aria-modal="true">
      <div style={sx.modal}>
        <div style={sx.modalHeader}>
          <div style={{ fontWeight: 600, color: "#111827" }}>{title}</div>
          <button
            onClick={onClose}
            style={sx.iconBtn}
            aria-label="close"
          >
            <CloseIcon />
          </button>
        </div>
        <div style={{ padding: 12 }}>{children}</div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label style={sx.field}>
      <div style={sx.label}>{label}</div>
      {children}
    </label>
  );
}

function Chip({ children }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "4px 8px",
        fontSize: 12,
        background: "#f3f4f6",
        border: "1px solid #e5e7eb",
        color: "#374151",
        borderRadius: 999,
      }}
    >
      {children}
    </span>
  );
}

/* -------------------- Icons -------------------- */

function GearIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <path
        d="M11.9 1.5l.5 2.1c.3.1.6.2.8.4l2-.8 1.4 2.4-1.6 1.3c.1.3.2.6.2.9l2 .8-.6 2.7-2.1-.1c-.2.2-.5.4-.8.6l.2 2.1-2.7.8-.9-1.9c-.3 0-.6-.1-.9-.2l-1.5 1.5-2.4-1.4.8-2c-.2-.3-.3-.6-.4-.9l-2.1-.5.2-2.8 2 .1c.2-.3.4-.5.6-.8L4.7 4l2-2 1.4 1.6c.3-.1.6-.2.9-.2l.8-1.9 2.1.4z"
        fill="#6b7280"
      />
      <circle cx="10" cy="10" r="3" fill="#6d28d9" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
      <path
        d="M5 5l10 10M15 5L5 15"
        stroke="#6b7280"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* -------------------- Styles -------------------- */

const sx = {
  page: { padding: "20px 24px", background: "#f7f7fb", minHeight: "100%" },

  h2: { margin: 0, fontSize: 20, fontWeight: 600, color: "#111827" },
  headerRow: { display: "flex", alignItems: "center", marginBottom: 8 },

  secondaryBtn: {
    height: 34,
    border: "1px solid #d1d5db",
    borderRadius: 6,
    background: "white",
    padding: "0 12px",
    fontSize: 13,
  },

  note: { fontSize: 12, color: "#6b7280", marginBottom: 12 },

  cardsCol: { display: "flex", flexDirection: "column", gap: 12 },

  card: {
    background: "white",
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    boxShadow: "0 1px 2px rgba(16,24,40,0.04)",
    padding: 12,
  },

  cardHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  cardTitle: { fontWeight: 600, color: "#111827" },
  cardDesc: { fontSize: 13, color: "#6b7280", marginTop: 2 },

  headerControls: { display: "flex", alignItems: "center", gap: 8 },
  iconBtn: {
    height: 30,
    width: 30,
    border: "1px solid #e5e7eb",
    borderRadius: 6,
    background: "white",
    display: "grid",
    placeItems: "center",
  },

  quickRow: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
    fontSize: 12,
    color: "#374151",
    paddingLeft: 2,
  },

  fieldGroup: {
    background: "#fafafa",
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    padding: 12,
  },
  groupTitle: {
    fontSize: 12,
    fontWeight: 600,
    color: "#374151",
    marginBottom: 6,
  },

  field: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    marginBottom: 10,
  },
  label: { fontSize: 12, color: "#6b7280" },
  input: {
    height: 32,
    border: "1px solid #d1d5db",
    borderRadius: 6,
    padding: "0 10px",
    fontSize: 13,
    background: "white",
  },

  emptyBox: {
    border: "1px dashed #d1d5db",
    background: "#fff",
    borderRadius: 8,
    padding: 10,
    color: "#6b7280",
    fontSize: 12,
  },
  customQCard: {
    border: "1px solid #e5e7eb",
    background: "#fff",
    borderRadius: 8,
    padding: 10,
  },
  smallBtn: {
    height: 28,
    border: "1px solid #d1d5db",
    borderRadius: 6,
    background: "#fff",
    padding: "0 10px",
    fontSize: 12,
  },
  iconOnlyBtn: {
    height: 28,
    width: 28,
    border: "1px solid #e5e7eb",
    background: "#fff",
    borderRadius: 6,
    fontSize: 16,
    lineHeight: "26px",
    textAlign: "center",
  },
  smallLabel: { fontSize: 12, color: "#6b7280" },
  subtle: {
    fontSize: 12,
    color: "#6b7280",
    display: "inline-flex",
    alignItems: "center",
  },

  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(17,24,39,0.35)",
    display: "grid",
    placeItems: "center",
    zIndex: 50,
    padding: 16,
  },
  modal: {
    width: 860,
    maxWidth: "96vw",
    background: "white",
    borderRadius: 10,
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
    overflow: "hidden",
  },
  modalHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 12px",
    borderBottom: "1px solid #e5e7eb",
    background: "#f9fafb",
  },
  modalActionsRow: {
    gridColumn: "1 / -1",
    display: "flex",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 8,
  },

  tertiaryBtn: {
    height: 32,
    border: "1px solid #e5e7eb",
    borderRadius: 6,
    background: "#f9fafb",
    padding: "0 10px",
    fontSize: 12,
  },
  primaryBtn: {
    height: 32,
    border: "1px solid #6d28d9",
    borderRadius: 6,
    background: "#6d28d9",
    color: "white",
    padding: "0 12px",
    fontSize: 12,
  },

  subtext: { fontSize: 12, color: "#6b7280", marginTop: 2, marginBottom: 6 },

  builtinCard: {
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    background: "#fff",
    padding: 8,
    fontSize: 12,
  },
  builtinTitle: { fontWeight: 600, color: "#111827", marginBottom: 2 },
  builtinQuestion: { color: "#374151", marginBottom: 2 },
  builtinDetails: { color: "#6b7280" },
};