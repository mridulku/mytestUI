import { useState } from "react";

/**
 * Sample8 — Configure Workflow Survey (Submit/Skip Modal)
 * - Single card: "Workflow Survey"
 * - No on/off toggle, no cadence/after-N-tasks, no allow-skip
 * - Settings modal lets PM:
 *    • See fixed questions: NPS-style recommendation + Open comment
 *    • Configure quick reactions (thumbs up/down) on specific aspects
 *      - Core aspects: cannot be deleted, only enabled/disabled
 *      - Extra aspects: can be added, renamed, enabled/disabled, deleted
 */

const DEFAULT_WORKFLOW_CONF = {
  questions: {
    // fixed, always true
    recommend: true,
    openText: true,
  },
  quickReactions: [
    { id: "instr", label: "Guidelines", core: true, enabled: true },
    { id: "reviewer", label: "Reviewer decisions", core: true, enabled: true },
    { id: "tool", label: "User Interface", core: true, enabled: true },
    { id: "ui", label: "Workload per task", core: true, enabled: true },
  ],
};

export default function Sample2() {
  const [workflow, setWorkflow] = useState(DEFAULT_WORKFLOW_CONF);
  const [active, setActive] = useState(false); // false | "workflow"

  const open = () => setActive(true);
  const close = () => setActive(false);

  const patchWorkflow = (patch) =>
    setWorkflow((w) => ({ ...w, ...patch }));

  return (
    <section style={sx.page}>
      <div style={sx.headerRow}>
        <h2 style={sx.h2}>Configure Feedback</h2>
        <div style={{ flex: 1 }} />
        <button
          style={sx.secondaryBtn}
          onClick={() => console.log("SAVE_WORKFLOW_CONF", workflow)}
        >
          Save
        </button>
      </div>

      <div style={sx.note}>
        Configure the workflow survey that appears when contributors{" "}
        <b>submit or skip a task</b> in this workflow.
      </div>

      <div style={sx.cardsCol}>
        <Card>
          <div style={sx.cardHeader}>
            <div>
              <div style={sx.cardTitle}>Workflow Survey</div>
              <div style={sx.cardDesc}>
                Enable contributors to provide workflow-level feedback{" "}
                <b>inside the Submit / Skip modal.</b>
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
            </div>
          </div>

          <div style={sx.summaryBox}>
            <div style={sx.summaryTitle}>Included questions</div>
            <ul style={sx.summaryList}>
              <li>Recommendation (NPS-style)</li>
              <li>Quick reactions (thumbs up / down) on key aspects</li>
              <li>Open comment</li>
            </ul>
          </div>
        </Card>
      </div>

      {active && (
        <Modal title="Settings — Workflow Survey" onClose={close}>
          <WorkflowSettings
            value={workflow}
            onChange={patchWorkflow}
            onClose={close}
          />
        </Modal>
      )}
    </section>
  );
}

/* -------------------- Workflow Settings -------------------- */

function WorkflowSettings({ value, onChange, onClose }) {
  const [local, setLocal] = useState(value);

  const updateQuickReaction = (id, patch) =>
    setLocal((curr) => ({
      ...curr,
      quickReactions: curr.quickReactions.map((r) =>
        r.id === id ? { ...r, ...patch } : r
      ),
    }));

  const removeQuickReaction = (id) =>
    setLocal((curr) => ({
      ...curr,
      quickReactions: curr.quickReactions.filter((r) => r.id !== id),
    }));

  const addQuickReaction = () => {
    const id = "q_" + Math.random().toString(36).slice(2, 8);
    setLocal((curr) => ({
      ...curr,
      quickReactions: [
        ...curr.quickReactions,
        { id, label: "", core: false, enabled: true },
      ],
    }));
  };

  const apply = () => {
    onChange(local);
    onClose();
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1.4fr", gap: 16 }}>
      {/* Fixed questions */}
      <div style={sx.fieldGroup}>
        <div style={sx.groupTitle}>Fixed questions</div>
        <div style={sx.fixedItem}>
          <div style={sx.fixedLabel}>Recommendation (NPS-style)</div>
          <div style={sx.fixedDesc}>
            “How likely are you to recommend this workflow to another annotator?”
            <br />
            Scale: 0–10 (Not at all likely → Extremely likely)
          </div>
          <div style={sx.fixedTag}>Always included</div>
        </div>

        <div style={sx.fixedItem}>
          <div style={sx.fixedLabel}>Open comment</div>
          <div style={sx.fixedDesc}>
            Free-text comment field to capture any additional context or suggestions.
          </div>
          <div style={sx.fixedTag}>Always included</div>
        </div>
      </div>

      {/* Quick reactions */}
      <div style={sx.fieldGroup}>
        <div style={sx.groupTitle}>Quick reactions (thumbs up / thumbs down)</div>
        <div style={sx.subtext}>
          Configure the aspects for which contributors can give quick reactions.
        </div>

        <div style={{ display: "grid", gap: 8, marginTop: 8 }}>
          {local.quickReactions.map((r) => (
            <QuickReactionRow
              key={r.id}
              reaction={r}
              onChange={(patch) => updateQuickReaction(r.id, patch)}
              onRemove={() => removeQuickReaction(r.id)}
            />
          ))}
        </div>

        <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between" }}>
          <button style={sx.smallBtn} onClick={addQuickReaction}>
            Add reaction
          </button>
          <div style={{ fontSize: 11, color: "#6b7280", maxWidth: 260, textAlign: "right" }}>
            Core aspects (like “Instruction clarity”) cannot be removed,
            only toggled on/off. Additional aspects can be edited or deleted.
          </div>
        </div>
      </div>

      <div style={{ gridColumn: "1 / -1", ...sx.modalActionsRow }}>
        <button style={sx.tertiaryBtn} onClick={onClose}>
          Cancel
        </button>
        <button style={sx.primaryBtn} onClick={apply}>
          Apply
        </button>
      </div>
    </div>
  );
}

function QuickReactionRow({ reaction, onChange, onRemove }) {
  const { label, core, enabled } = reaction;
  const canDelete = !core;

  return (
    <div style={sx.qrRow}>
      <input
        style={{
          ...sx.input,
          flex: 1,
          backgroundColor: core ? "#f9fafb" : "white",
        }}
        value={label}
        onChange={(e) => onChange({ label: e.target.value })}
        placeholder={core ? "" : "New aspect (e.g. 'Support responsiveness')"}
        disabled={core}
      />
      <label style={sx.check} title="Include in survey">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => onChange({ enabled: e.target.checked })}
        />
        <span style={{ fontSize: 12 }}>Include</span>
      </label>
      {canDelete && (
        <button
          type="button"
          style={sx.iconOnlyBtn}
          onClick={onRemove}
          title="Remove reaction"
        >
          ×
        </button>
      )}
      {core && (
        <span style={sx.coreBadge} title="Required aspect; cannot be deleted">
          Core
        </span>
      )}
    </div>
  );
}

/* -------------------- UI Primitives -------------------- */

function Card({ children }) {
  return <div style={sx.card}>{children}</div>;
}

function Modal({ title, children, onClose }) {
  return (
    <div style={sx.modalOverlay} role="dialog" aria-modal="true">
      <div style={sx.modal}>
        <div style={sx.modalHeader}>
          <div style={{ fontWeight: 600, color: "#111827" }}>{title}</div>
          <button onClick={onClose} style={sx.iconBtn} aria-label="close">
            <CloseIcon />
          </button>
        </div>
        <div style={{ padding: 12 }}>{children}</div>
      </div>
    </div>
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

  summaryBox: {
    marginTop: 8,
    borderRadius: 8,
    border: "1px dashed #e5e7eb",
    background: "#f9fafb",
    padding: 10,
    fontSize: 12,
    color: "#374151",
  },
  summaryTitle: { fontWeight: 600, marginBottom: 4 },
  summaryList: { margin: 0, paddingLeft: 18 },

  fieldGroup: {
    background: "#fafafa",
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    padding: 12,
  },
  groupTitle: { fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 8 },

  field: { display: "flex", flexDirection: "column", gap: 6, marginBottom: 10 },
  label: { fontSize: 12, color: "#6b7280" },
  input: {
    height: 32,
    border: "1px solid #d1d5db",
    borderRadius: 6,
    padding: "0 10px",
    fontSize: 13,
    background: "white",
  },

  check: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 12,
    color: "#111827",
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

  fixedItem: {
    borderRadius: 8,
    border: "1px solid #e5e7eb",
    background: "#fff",
    padding: 8,
    marginBottom: 8,
  },
  fixedLabel: { fontSize: 13, fontWeight: 600, color: "#111827", marginBottom: 4 },
  fixedDesc: { fontSize: 12, color: "#4b5563", marginBottom: 4 },
  fixedTag: {
    display: "inline-flex",
    alignItems: "center",
    padding: "2px 6px",
    borderRadius: 999,
    background: "#ecfeff",
    color: "#0e7490",
    fontSize: 11,
    border: "1px solid #bae6fd",
  },

  subtext: { fontSize: 12, color: "#6b7280" },

  qrRow: {
    display: "grid",
    gridTemplateColumns: "minmax(0,1fr) auto auto auto",
    alignItems: "center",
    gap: 8,
  },
  coreBadge: {
    fontSize: 11,
    padding: "2px 6px",
    borderRadius: 999,
    background: "#eef2ff",
    color: "#4f46e5",
    border: "1px solid #c7d2fe",
    justifySelf: "flex-start",
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
};