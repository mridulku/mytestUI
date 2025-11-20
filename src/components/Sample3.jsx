import { useMemo, useState } from "react";

/**
 * FT Studio App — Tasks list with per-project "Give feedback" button.
 * - Each project card has a small "Give feedback" button in the top-right
 *   (visible on hover, with tooltip).
 * - Clicking opens a modal that looks like the "Additional project feedback"
 *   section from the task-submit flow:
 *     • 1–5 likelihood to recommend
 *     • Quick 👍 / 👎 reactions to a few aspects
 *     • Free-text box for overall project feedback
 * - Modal shows the project + workflow name at the top.
 */

const PROJECTS = [
  {
    id: "p1",
    name: "Testing_Project",
    workflow: "Maker",
    tags: ["wf1", "Maker"],
    blurb: "Sample project for testing QC flow."
  },
  {
    id: "p2",
    name: "TextbookQnAProject",
    workflow: "Chemistry",
    tags: ["Chemistry", "Maker"],
    blurb: "Create Q–A pairs from academic diagrams."
  },
  {
    id: "p3",
    name: "TextbookQnAProject",
    workflow: "Custom",
    tags: ["Custom", "Maker"],
    blurb: "Create Q–A pairs from custom sources."
  }
];

// Simple, clear project-level aspects
const PROJECT_ASPECTS = [
  {
    key: "instructions",
    emoji: "📖",
    label: "Instructions",
    help: "How clear and easy to follow the written guidelines are for this project."
  },
  {
    key: "reviewer",
    emoji: "🧑‍⚖️",
    label: "Reviewer decisions",
    help: "How fair and consistent the reviewers’ decisions feel for this project."
  },
  {
    key: "tool",
    emoji: "⚙️",
    label: "Tool performance",
    help: "How reliable and responsive the editor/tools are while doing this project."
  },
  {
    key: "workload",
    emoji: "⏱️",
    label: "Workload per task",
    help: "Whether the effort and time needed per task feel reasonable."
  },
  {
    key: "payment",
    emoji: "💰",
    label: "Payment",
    help: "Whether the payment for this project feels fair for the work required."
  }
];

export default function Sample3() {
  const [activeTab, setActiveTab] = useState("Tasks");
  const tasksCount = useMemo(() => PROJECTS.length, []);

  const [hoverCard, setHoverCard] = useState(null);

  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackTarget, setFeedbackTarget] = useState(null);

  const [projectForm, setProjectForm] = useState({
    nps: -1, // 1–5, -1 = unset
    aspects: {}, // { [key]: 'up' | 'down' | null }
    comment: ""
  });

  const openFeedback = (project) => {
    setFeedbackTarget({
      id: project.id,
      name: project.name,
      workflow: project.workflow
    });
    // reset form each time
    setProjectForm({ nps: -1, aspects: {}, comment: "" });
    setFeedbackOpen(true);
  };

  const closeFeedback = () => {
    setFeedbackOpen(false);
    setFeedbackTarget(null);
  };

  const submitFeedback = (e) => {
    e.preventDefault();
    const payload = {
      projectId: feedbackTarget?.id,
      projectName: feedbackTarget?.name,
      workflow: feedbackTarget?.workflow,
      nps: projectForm.nps,
      aspects: projectForm.aspects,
      comment: projectForm.comment
    };
    console.log("PROJECT_FEEDBACK_SUBMIT", payload);
    closeFeedback();
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
        {["Tasks Queues", "Exams", "Timesheet"].map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t.split(" ")[0])}
            style={{
              ...sx.tab,
              ...(activeTab === t.split(" ")[0] ? sx.tabActive : null)
            }}
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
        {PROJECTS.map((p) => (
          <article
            key={p.id}
            style={sx.card}
            onMouseEnter={() => setHoverCard(p.id)}
            onMouseLeave={() => setHoverCard(null)}
          >
            <div style={sx.cardHead}>
              <div style={sx.cardTitleRow}>
                <h3 style={sx.cardTitle}>{p.name}</h3>
                <div style={sx.badges}>
                  {p.tags.map((t, i) => (
                    <span key={i} style={sx.badge}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {hoverCard === p.id && (
                  <button
                    type="button"
                    title="Give feedback for this project"
                    style={sx.feedbackBtnCard}
                    onClick={() => openFeedback(p)}
                  >
                    Feedback
                  </button>
                )}
                <button
                  aria-label="copy link"
                  title="Copy project link"
                  style={sx.iconBtn}
                  type="button"
                >
                  <CopyIcon />
                </button>
              </div>
            </div>

            <p style={sx.blurb}>{p.blurb}</p>
            <div style={sx.cardFoot}>
              <span style={sx.stat}>
                <SparkIcon /> Task Stats
              </span>
              <button style={sx.disclosure}>▼</button>
            </div>
          </article>
        ))}
      </main>

      {/* Project feedback modal */}
      {feedbackOpen && feedbackTarget && (
        <div
          style={sx.modalOverlay}
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-fb-title"
        >
          <div style={sx.modal}>
            {/* Header */}
            <div style={sx.modalHeader}>
              <div>
                <div
                  id="project-fb-title"
                  style={{ fontWeight: 600, color: "#111827" }}
                >
                  Project Feedback
                </div>
                <div style={sx.contextLine}>
                  {feedbackTarget.name}{" "}
                  {feedbackTarget.workflow && (
                    <>
                      • <span>{feedbackTarget.workflow}</span>
                    </>
                  )}
                </div>
              </div>
              <button
                aria-label="Close"
                onClick={closeFeedback}
                style={sx.iconBtn}
                type="button"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Body */}
            <form onSubmit={submitFeedback} style={sx.modalBody}>
              {/* NPS-style question */}
              <fieldset style={sx.group}>
                <legend style={sx.legend}>
                  How likely are you to recommend this project to another
                  annotator?
                </legend>
                <NpsPicker
                  value={projectForm.nps}
                  onChange={(v) =>
                    setProjectForm((f) => ({ ...f, nps: v }))
                  }
                />
              </fieldset>

              {/* Quick reactions */}
              <fieldset style={sx.group}>
                <legend style={sx.legend}>Quick reactions to key aspects</legend>
                <div style={sx.helperText}>
                  Use 👍 / 👎 to rate a few simple parts of this project. Hover on
                  the ⓘ icon if you’re unsure what an item means.
                </div>
                <div style={{ display: "grid", gap: 8 }}>
                  {PROJECT_ASPECTS.map((item) => (
                    <AspectRow
                      key={item.key}
                      item={item}
                      rating={projectForm.aspects[item.key] ?? null}
                      onRate={(val) =>
                        setProjectForm((f) => ({
                          ...f,
                          aspects: { ...f.aspects, [item.key]: val }
                        }))
                      }
                    />
                  ))}
                </div>
              </fieldset>

              {/* Overall project comment */}
              <label style={sx.field}>
                <span style={sx.label}>
                  Anything else about this project? (optional)
                </span>
                <span style={sx.helperText}>
                  Use this space for overall project feedback. If you want to
                  flag something about a specific task, please use the
                  in-task&nbsp;comments box instead.
                </span>
                <textarea
                  rows={4}
                  value={projectForm.comment}
                  onChange={(e) =>
                    setProjectForm((f) => ({
                      ...f,
                      comment: e.target.value.slice(0, 400)
                    }))
                  }
                  placeholder="Instruction gaps, review practices, edge cases, payment concerns…"
                  style={sx.textarea}
                />
                <div style={sx.hint}>
                  {(projectForm.comment ?? "").length}/400
                </div>
              </label>

              {/* Actions */}
              <div style={sx.modalActions}>
                <button
                  type="button"
                  onClick={closeFeedback}
                  style={sx.tertiaryBtn}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={sx.primaryBtn}
                  disabled={projectForm.nps === -1}
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

/* ---------------- Small components ---------------- */

function NpsPicker({ value = -1, onChange }) {
  const labels = [
    "Not at all likely",
    "",
    "Neutral",
    "",
    "Extremely likely"
  ];
  return (
    <div style={sx.npsRow}>
      {[1, 2, 3, 4, 5].map((n, i) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          aria-pressed={value === n}
          style={{ ...sx.npsBtn, ...(value === n ? sx.npsBtnActive : null) }}
        >
          <div>{n}</div>
          <div style={sx.npsTinyLabel}>{labels[i]}</div>
        </button>
      ))}
    </div>
  );
}

function AspectRow({ item, rating, onRate }) {
  const { emoji, label, help } = item;
  return (
    <div style={sx.aspectRow}>
      <div style={sx.aspectLeft}>
        <span style={sx.aspectEmoji}>{emoji}</span>
        <span style={sx.aspectLabel}>{label}</span>
        <span style={sx.aspectInfo} title={help}>
          ⓘ
        </span>
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
          style={{
            ...sx.thumbBtn,
            ...(rating === "down" ? sx.thumbActiveDown : null)
          }}
        >
          👎
        </button>
      </div>
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
      <path
        d="M10 2l1.7 4.2L16 8l-4.3 1.8L10 14l-1.7-4.2L4 8l4.3-1.8L10 2z"
        fill="#7c3aed"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
      <path
        d="M5 5l10 10M15 5L5 15"
        stroke="#6b7280"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ---------------- Styles ---------------- */

const sx = {
  page: { background: "#f7f7fb", minHeight: "100vh" },

  topbar: {
    height: 48,
    display: "flex",
    alignItems: "center",
    padding: "0 16px",
    borderBottom: "1px solid #e5e7eb",
    background: "white",
    position: "sticky",
    top: 0,
    zIndex: 5
  },
  brand: { display: "flex", alignItems: "center", gap: 8 },
  brandMark: { width: 14, height: 14, borderRadius: 3, background: "#34d399" },
  brandText: { fontWeight: 600, color: "#111827" },
  user: { fontSize: 13, color: "#374151" },

  tabs: { display: "flex", gap: 18, padding: "10px 16px 0" },
  tab: {
    padding: "8px 2px",
    fontSize: 14,
    color: "#4b5563",
    border: "none",
    background: "transparent",
    borderBottom: "2px solid transparent",
    cursor: "pointer"
  },
  tabActive: { color: "#111827", borderBottomColor: "#6d28d9", fontWeight: 600 },

  subtabs: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 16px 12px",
    borderBottom: "1px solid #e5e7eb",
    background: "white"
  },
  pill: {
    border: "1px solid #e5e7eb",
    background: "white",
    borderRadius: 999,
    padding: "6px 10px",
    fontSize: 12,
    color: "#4b5563"
  },
  pillActive: { borderColor: "#6d28d9", color: "#6d28d9" },

  cards: {
    padding: 16,
    display: "grid",
    gap: 12,
    maxWidth: 920,
    margin: "0 auto"
  },
  card: {
    background: "white",
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    padding: 14
  },
  cardHead: { display: "flex", alignItems: "center" },
  cardTitleRow: { display: "flex", alignItems: "center", gap: 8, flex: 1 },
  cardTitle: { margin: 0, fontSize: 16, color: "#111827" },
  badges: { display: "flex", gap: 6 },
  badge: {
    fontSize: 11,
    color: "#111827",
    background: "#e5e7eb",
    borderRadius: 6,
    padding: "2px 8px"
  },
  blurb: { color: "#6b7280", fontSize: 13, margin: "8px 0 12px" },
  cardFoot: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
  },
  stat: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    color: "#6b7280",
    fontSize: 13
  },
  disclosure: {
    border: "1px solid #e5e7eb",
    background: "white",
    borderRadius: 6,
    padding: "4px 8px"
  },
  iconBtn: {
    height: 30,
    width: 30,
    border: "1px solid #e5e7eb",
    borderRadius: 6,
    background: "white",
    display: "grid",
    placeItems: "center"
  },
  feedbackBtnCard: {
    border: "1px solid #d1d5db",
    background: "#f9fafb",
    borderRadius: 999,
    padding: "4px 10px",
    fontSize: 11,
    color: "#374151",
    cursor: "pointer"
  },

  /* Modal */
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(17,24,39,0.35)",
    display: "grid",
    placeItems: "center",
    padding: 16,
    zIndex: 20
  },
  modal: {
    width: 720,
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
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 16px",
    borderBottom: "1px solid #e5e7eb",
    background: "#f9fafb"
  },
  contextLine: {
    marginTop: 2,
    fontSize: 12,
    color: "#6b7280"
  },
  modalBody: {
    padding: 16,
    overflowY: "auto",
    flex: "1 1 auto",
    minHeight: 0
  },

  group: {
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    background: "#fafafa"
  },
  legend: { fontSize: 12, color: "#6b7280", padding: "0 6px" },

  helperText: { fontSize: 12, color: "#6b7280", marginBottom: 8 },
  helperTextSmall: { fontSize: 11, color: "#9ca3af" },

  field: { display: "flex", flexDirection: "column", gap: 4 },
  label: { fontSize: 12, color: "#6b7280" },
  textarea: {
    border: "1px solid #d1d5db",
    borderRadius: 8,
    padding: 10,
    fontSize: 13,
    resize: "vertical"
  },
  hint: {
    textAlign: "right",
    fontSize: 11,
    color: "#9ca3af",
    marginTop: 4
  },

  modalActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 10
  },
  tertiaryBtn: {
    height: 34,
    border: "1px solid #e5e7eb",
    borderRadius: 6,
    background: "#f9fafb",
    padding: "0 12px",
    fontSize: 13
  },
  primaryBtn: {
    height: 34,
    border: "1px solid #6d28d9",
    borderRadius: 6,
    background: "#6d28d9",
    color: "white",
    padding: "0 14px",
    fontSize: 13
  },

  /* NPS */
  npsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: 6
  },
  npsBtn: {
    height: 48,
    minWidth: 60,
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
  npsBtnActive: {
    borderColor: "#6d28d9",
    boxShadow: "0 0 0 2px #ede9fe inset",
    color: "#6d28d9",
    fontWeight: 700
  },
  npsTinyLabel: {
    fontSize: 10,
    color: "#9ca3af",
    marginTop: 2,
    height: 14,
    textAlign: "center"
  },

  /* Aspect row */
  aspectRow: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) auto",
    alignItems: "center",
    gap: 8
  },
  aspectLeft: { display: "flex", alignItems: "center", gap: 6 },
  aspectEmoji: { fontSize: 16 },
  aspectLabel: { fontSize: 13, color: "#111827", fontWeight: 600 },
  aspectInfo: {
    fontSize: 11,
    color: "#6b7280",
    borderRadius: "999px",
    border: "1px solid #e5e7eb",
    padding: "0 5px",
    cursor: "default",
    background: "#f9fafb"
  },

  thumbs: { display: "inline-flex", gap: 6 },
  thumbBtn: {
    height: 30,
    minWidth: 42,
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    background: "white",
    fontSize: 14,
    lineHeight: "28px",
    cursor: "pointer"
  },
  thumbActiveUp: {
    borderColor: "#10b981",
    boxShadow: "0 0 0 2px #d1fae5 inset",
    color: "#065f46",
    fontWeight: 700
  },
  thumbActiveDown: {
    borderColor: "#ef4444",
    boxShadow: "0 0 0 2px #fee2e2 inset",
    color: "#7f1d1d",
    fontWeight: 700
  }
};