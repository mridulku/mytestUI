// Sample7.jsx — Product Dashboard with Workflow Feedback + Overall FTS Feedback
import { useMemo, useState } from "react";

/* ----------------------------- Stub Data ----------------------------- */

const WORKFLOWS = [
  {
    id: "wf_chem_maker",
    project: "TextbookQnAProject",
    workflow: "Chemistry",
    entries: [
      {
        id: "chem-1",
        user: "A-1023",
        score: 4,
        aspects: { instructions: "down", reviewer: "up", tool: "up", ui: "up" },
        comment: "Shortcuts are great; occasional upload lag.",
        device: "Chrome • Win",
        updatedAt: "2h ago",
      },
      {
        id: "chem-2",
        user: "A-1044",
        score: 5,
        aspects: { instructions: "up", reviewer: "up", tool: "up", ui: "up" },
        comment: "Examples very clear.",
        device: "Safari • iOS",
        updatedAt: "yesterday",
      },
      {
        id: "chem-3",
        user: "B-2099",
        score: 3,
        aspects: { instructions: "down", reviewer: "up", tool: "down", ui: "down" },
        comment: "Guidelines conflict with edge cases.",
        device: "Edge • Win",
        updatedAt: "3d ago",
      },
    ],
  },
  {
    id: "wf_text_rater_review",
    project: "Text Rater EN",
    workflow: "Step 2 • Review",
    entries: [
      {
        id: "tr-1",
        user: "C-6677",
        score: 4,
        aspects: { instructions: "up", reviewer: "down", tool: "up", ui: "up" },
        comment: "Reviewer notes feel inconsistent.",
        device: "Chrome • Mac",
        updatedAt: "5h ago",
      },
    ],
  },
  {
    id: "wf_vision_qc1",
    project: "Vision QA",
    workflow: "QC • Step 1",
    entries: [
      {
        id: "vis-1",
        user: "D-3001",
        score: 2,
        aspects: { instructions: "down", reviewer: "down", tool: "down", ui: "down" },
        comment: "Tool lag + unclear rejection reasons.",
        device: "Firefox • Linux",
        updatedAt: "1h ago",
      },
      {
        id: "vis-2",
        user: "D-3002",
        score: 3,
        aspects: { instructions: "down", reviewer: "up", tool: "down", ui: "up" },
        comment: "Review helpful, but editor freezes.",
        device: "Chrome • Win",
        updatedAt: "today",
      },
    ],
  },
];

const PLATFORM_ANSWERS = [
  {
    id: "fts-1",
    user: "A-1023",
    score: 4,
    aspects: { instructions: "up", reviewer: "up", tool: "up", ui: "up" },
    comment: "Good speed this week.",
    device: "Chrome • Win",
    updatedAt: "2h ago",
  },
  {
    id: "fts-2",
    user: "B-2099",
    score: 3,
    aspects: { instructions: "down", reviewer: "up", tool: "down", ui: "down" },
    comment: "Uploads flaky on hotel Wi-Fi.",
    device: "Edge • Win",
    updatedAt: "yesterday",
  },
  {
    id: "fts-3",
    user: "C-6677",
    score: 5,
    aspects: { instructions: "up", reviewer: "up", tool: "up", ui: "up" },
    comment: "Everything feels smooth.",
    device: "Chrome • Mac",
    updatedAt: "3d ago",
  },
  {
    id: "fts-4",
    user: "D-3001",
    score: 2,
    aspects: { instructions: "down", reviewer: "down", tool: "down", ui: "down" },
    comment: "Review loop confusing; editor lags.",
    device: "Firefox • Linux",
    updatedAt: "5h ago",
  },
];

/* ----------------------------- Helpers ----------------------------- */

const ASPECT_LABELS = {
  instructions: "Instructions",
  reviewer: "Reviewer",
  tool: "Tool performance",
  ui: "UI / Layout",
};

function mapEntryToViewer(entry) {
  const reactions = {};
  for (const [k, v] of Object.entries(entry.aspects || {})) {
    const label = ASPECT_LABELS[k] || k;
    reactions[label] = v;
  }
  return {
    id: entry.id,
    user: entry.user,
    score: entry.score,
    reactions,
    comment: entry.comment,
    device: entry.device,
    updatedAt: entry.updatedAt,
  };
}

function avg(arr) {
  return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : NaN;
}

function toneForScore(v) {
  if (v >= 4.3) return "good";
  if (v >= 3.5) return "ok";
  return "poor";
}

/* ----------------------------- Main Component ----------------------------- */

export default function Sample7() {
  const [tab, setTab] = useState("workflow"); // 'workflow' | 'platform'

  // Projects from workflow data
  const projects = useMemo(() => {
    const set = new Set(WORKFLOWS.map((w) => w.project));
    return Array.from(set);
  }, []);

  const [project, setProject] = useState(projects[0] ?? "");

  const workflowsForProject = useMemo(
    () => WORKFLOWS.filter((w) => w.project === project),
    [project]
  );

  const [workflowId, setWorkflowId] = useState(
    workflowsForProject[0]?.id ?? ""
  );

  // Keep workflowId in sync if project changes
  const selectedWorkflow = useMemo(() => {
    if (!workflowsForProject.length) return null;
    const found =
      workflowsForProject.find((w) => w.id === workflowId) ||
      workflowsForProject[0];
    return found;
  }, [workflowsForProject, workflowId]);

  const workflowEntries = useMemo(() => {
    if (!selectedWorkflow) return [];
    return selectedWorkflow.entries.map(mapEntryToViewer);
  }, [selectedWorkflow]);

  const platformEntries = useMemo(
    () => PLATFORM_ANSWERS.map(mapEntryToViewer),
    []
  );

  const workflowTitle = selectedWorkflow
    ? `${selectedWorkflow.project} • ${selectedWorkflow.workflow}`
    : "No workflow selected";

  return (
    <section style={sx.page}>
      {/* Header */}
      <header style={sx.header}>
        <div style={sx.brand}>
          <span style={sx.brandMark} />
          <span style={sx.brandText}>FT Studio — Contributor Feedback</span>
        </div>
        <div style={{ flex: 1 }} />
        <nav style={sx.tabs}>
          <button
            style={{ ...sx.tab, ...(tab === "workflow" ? sx.tabActive : null) }}
            onClick={() => setTab("workflow")}
          >
            Workflow Feedback
          </button>
          <button
            style={{ ...sx.tab, ...(tab === "platform" ? sx.tabActive : null) }}
            onClick={() => setTab("platform")}
          >
            Overall FTS Feedback
          </button>
        </nav>
      </header>

      {/* Workflow Feedback Tab */}
      {tab === "workflow" && (
        <div style={sx.body}>
          <div style={sx.controlsRow}>
            <label style={sx.field}>
              <span style={sx.label}>Project Nickname</span>
              <select
                value={project}
                onChange={(e) => {
                  setProject(e.target.value);
                  // workflowId will be realigned by selectedWorkflow memo
                }}
                style={sx.select}
              >
                {projects.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </label>

            <label style={sx.field}>
              <span style={sx.label}>Workflow</span>
              <select
                value={selectedWorkflow?.id || ""}
                onChange={(e) => setWorkflowId(e.target.value)}
                style={sx.select}
              >
                {workflowsForProject.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.workflow}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div style={sx.sectionHeader}>
            <span style={sx.sectionTitle}>Workflow Feedback</span>
            <span style={sx.sectionSubtitle}>{workflowTitle}</span>
          </div>

          {workflowEntries.length === 0 ? (
            <div style={sx.emptyCard}>No answered feedback for this workflow yet.</div>
          ) : (
            <FeedbackViewer entries={workflowEntries} />
          )}
        </div>
      )}

      {/* Overall Platform Feedback Tab */}
      {tab === "platform" && (
        <div style={sx.body}>
          <div style={sx.sectionHeader}>
            <span style={sx.sectionTitle}>Overall FTS Feedback</span>
            <span style={sx.sectionSubtitle}>
              Aggregated feedback across all projects/workflows
            </span>
          </div>

          {platformEntries.length === 0 ? (
            <div style={sx.emptyCard}>No platform feedback recorded yet.</div>
          ) : (
            <FeedbackViewer entries={platformEntries} />
          )}
        </div>
      )}
    </section>
  );
}

/* ----------------------------- Shared Feedback Viewer ----------------------------- */

function FeedbackViewer({ entries }) {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const answeredRows = useMemo(() => {
    return entries.filter((r) =>
      r.user.toLowerCase().includes(query.toLowerCase())
    );
  }, [entries, query]);

  const sel = useMemo(() => {
    const byId = answeredRows.find((r) => r.id === selectedId);
    return byId ?? answeredRows[0] ?? null;
  }, [answeredRows, selectedId]);

  const metrics = useMemo(() => {
    const totalAnswered = entries.length;
    const scores = entries
      .filter((r) => typeof r.score === "number")
      .map((r) => r.score);
    const avgScore = scores.length
      ? `${(scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2)} / 5`
      : "—";
    return { totalAnswered, avgScore };
  }, [entries]);

  const aspectSummary = useMemo(() => {
    const counts = {}; // { aspect: { up, down } }
    for (const r of entries) {
      if (!r.reactions) continue;
      for (const [aspect, val] of Object.entries(r.reactions)) {
        if (!counts[aspect]) counts[aspect] = { up: 0, down: 0 };
        if (val === "up") counts[aspect].up += 1;
        if (val === "down") counts[aspect].down += 1;
      }
    }
    const order = [
      "Instructions",
      "Reviewer",
      "Tool performance",
      "UI / Layout",
    ];
    const keys = Array.from(new Set([...order, ...Object.keys(counts)]));
    return keys
      .map((k) => {
        const up = counts[k]?.up ?? 0;
        const down = counts[k]?.down ?? 0;
        const total = up + down;
        const upPct = total ? Math.round((up / total) * 100) : 0;
        const downPct = total ? 100 - upPct : 0;
        return { aspect: k, up, down, total, upPct, downPct };
      })
      .filter((row) => row.total > 0);
  }, [entries]);

  return (
    <section style={sx.viewer}>
      {/* Top tiles */}
      <div style={sx.tilesRow}>
        <Tile label="Total Answered" value={metrics.totalAnswered} />
        <Tile label="Avg Score" value={metrics.avgScore} />
      </div>

      {/* Aspect summary (one line per aspect) */}
      <div style={sx.aspectCard}>
        <div style={sx.aspectHeader}>Aspect reactions (answered only)</div>
        <div style={sx.aspectList}>
          {aspectSummary.map(({ aspect, total, up, down, upPct, downPct }) => (
            <div key={aspect} style={sx.aspectRowLine}>
              <div style={sx.aspectLabel}>{aspect}</div>
              <div style={sx.aspectLineMetrics}>
                <span style={sx.aspectMetricChunk}>
                  Answered: <b>{total}</b>
                </span>
                <span style={sx.dot}>•</span>
                <span style={sx.aspectMetricChunk}>
                  <ThumbUp /> {upPct}% ({up})
                </span>
                <span style={sx.dot}>•</span>
                <span style={sx.aspectMetricChunk}>
                  <ThumbDown /> {downPct}% ({down})
                </span>
              </div>
            </div>
          ))}
          {aspectSummary.length === 0 && (
            <div style={{ padding: 10, fontSize: 12, color: "#6b7280" }}>
              No reactions recorded yet.
            </div>
          )}
        </div>
        <div style={sx.aspectFootNote}>
          Based on contributors who answered the survey and provided quick reactions for each aspect.
        </div>
      </div>

      {/* Body: two-column viewer */}
      <div style={sx.bodyGrid}>
        {/* Left list */}
        <aside style={sx.left}>
          <div style={sx.searchRow}>
            <input
              placeholder="Search contributor…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={sx.input}
            />
          </div>

          <div style={sx.list}>
            {answeredRows.map((r) => {
              const active = r.id === sel?.id;
              return (
                <button
                  key={r.id}
                  onClick={() => setSelectedId(r.id)}
                  style={{
                    ...sx.rowBtnList,
                    ...(active ? sx.rowBtnActive : null),
                  }}
                >
                  <div style={sx.userLine}>
                    <span style={sx.userName}>{r.user}</span>
                    <Badge tone={toneForScore(r.score)}>
                      {Number(r.score).toFixed(1)}
                    </Badge>
                  </div>
                  <div style={sx.subtle}>
                    {r.device || "—"} {r.updatedAt ? `• ${r.updatedAt}` : ""}
                  </div>
                </button>
              );
            })}
            {answeredRows.length === 0 && (
              <div style={sx.empty}>No answered surveys match your search.</div>
            )}
          </div>
        </aside>

        {/* Right detail */}
        <main style={sx.right}>
          {!sel ? (
            <div style={sx.placeholder}>
              Select a contributor to view their feedback.
            </div>
          ) : (
            <div style={sx.detailCard}>
              <div style={sx.detailHeader}>
                <div>
                  <div style={sx.detailTitle}>{sel.user}</div>
                  <div style={sx.detailMeta}>
                    {sel.device || "—"}
                    {sel.updatedAt ? <> • {sel.updatedAt}</> : null}
                  </div>
                </div>
                <Tag tone="ok">Answered</Tag>
              </div>

              <div style={sx.section}>
                <div style={sx.sectionLabel}>Recommendation score</div>
                <ScoreBar value={sel.score} max={5} />
              </div>

              <div style={sx.section}>
                <div style={sx.sectionLabel}>Quick reactions</div>
                <ReactionsGrid reactions={sel.reactions} />
              </div>

              <div style={sx.section}>
                <div style={sx.sectionLabel}>Comment</div>
                <div style={sx.commentBox}>
                  {(sel.comment || "").trim().length ? (
                    sel.comment
                  ) : (
                    <span style={sx.subtle}>—</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </section>
  );
}

/* ----------------------------- Small Components ----------------------------- */

function Tile({ label, value }) {
  return (
    <div style={sx.tile}>
      <div style={sx.tileLabel}>{label}</div>
      <div style={sx.tileValue}>{value}</div>
    </div>
  );
}

function Tag({ children, tone = "muted" }) {
  const styles = {
    base: {
      padding: "2px 8px",
      borderRadius: 999,
      fontSize: 12,
      border: "1px solid #e5e7eb",
      background: "#fff",
      color: "#374151",
      whiteSpace: "nowrap",
    },
    ok: {
      borderColor: "#a7f3d0",
      background: "#ecfdf5",
      color: "#065f46",
    },
    warn: {
      borderColor: "#fde68a",
      background: "#fffbeb",
      color: "#92400e",
    },
    muted: {
      borderColor: "#e5e7eb",
      background: "#fafafa",
      color: "#6b7280",
    },
  };
  return <span style={{ ...styles.base, ...(styles[tone] || {}) }}>{children}</span>;
}

function Badge({ tone, children }) {
  const tones = {
    good: { bg: "#ecfdf5", text: "#065f46", border: "#a7f3d0" },
    ok: { bg: "#eff6ff", text: "#1e40af", border: "#bfdbfe" },
    poor: { bg: "#fef2f2", text: "#991b1b", border: "#fecaca" },
  }[tone];
  return (
    <span
      style={{
        background: tones.bg,
        color: tones.text,
        border: `1px solid ${tones.border}`,
        borderRadius: 12,
        padding: "2px 8px",
        fontSize: 12,
        fontWeight: 600,
      }}
    >
      {children}
    </span>
  );
}

function ScoreBar({ value, max = 5 }) {
  if (typeof value !== "number") return <span style={sx.subtle}>No response</span>;
  const pct = Math.max(0, Math.min(1, value / max));
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={sx.barOuter}>
        <div style={{ ...sx.barInner, width: `${pct * 100}%` }} />
      </div>
      <span style={sx.scoreText}>
        {value} / {max}
      </span>
    </div>
  );
}

function ReactionsGrid({ reactions }) {
  if (!reactions) return <span style={sx.subtle}>No reactions</span>;
  const entries = Object.entries(reactions);
  return (
    <div style={sx.reactGrid}>
      {entries.map(([k, v]) => (
        <div key={k} style={sx.reactRow}>
          <div style={{ color: "#374151" }}>{k}</div>
          <div>{v === "up" ? <ThumbUp /> : <ThumbDown />}</div>
        </div>
      ))}
    </div>
  );
}

function ThumbUp() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-label="thumbs up">
      <path
        d="M7 9l3-6 1 1c.8.8 1.2 1.2 1.2 2.2V7h3c1.1 0 2 .9 2 2 0 .3-.1.6-.2.8l-2 5c-.3.8-1 1.2-1.8 1.2H8c-1.1 0-2-.9-2-2V9h1z"
        fill="#059669"
        opacity="0.9"
      />
    </svg>
  );
}

function ThumbDown() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-label="thumbs down">
      <path
        d="M13 11l-3 6-1-1c-.8-.8-1.2-1.2-1.2-2.2V13H4c-1.1 0-2-.9-2-2 0-.3.1-.6.2-.8l2-5C4.5 4.4 5.2 4 6 4h6c1.1 0 2 .9 2 2v5h-1z"
        fill="#b91c1c"
        opacity="0.9"
      />
    </svg>
  );
}

/* ----------------------------- Styles ----------------------------- */

const sx = {
  page: { background: "#f7f7fb", minHeight: "100vh" },

  header: {
    height: 56,
    display: "flex",
    alignItems: "center",
    padding: "0 16px",
    borderBottom: "1px solid #e5e7eb",
    background: "#fff",
    gap: 12,
    position: "sticky",
    top: 0,
    zIndex: 5,
  },
  brand: { display: "flex", alignItems: "center", gap: 8 },
  brandMark: { width: 14, height: 14, borderRadius: 3, background: "#34d399" },
  brandText: { fontWeight: 700, color: "#111827" },
  tabs: { display: "flex", gap: 8 },
  tab: {
    border: "1px solid #e5e7eb",
    background: "#fff",
    borderRadius: 8,
    padding: "6px 10px",
    fontSize: 12,
    color: "#374151",
  },
  tabActive: {
    borderColor: "#6d28d9",
    color: "#6d28d9",
    background: "#f5f3ff",
  },

  body: {
    maxWidth: 1100,
    margin: "12px auto",
    padding: "0 16px 20px",
    display: "grid",
    gap: 12,
  },

  controlsRow: {
    display: "flex",
    gap: 12,
    alignItems: "flex-end",
    flexWrap: "wrap",
  },
  field: { display: "grid", gap: 6, minWidth: 220 },
  label: { fontSize: 12, color: "#6b7280" },
  select: {
    height: 34,
    border: "1px solid #d1d5db",
    borderRadius: 8,
    padding: "0 10px",
    background: "#fff",
    color: "#111827",
  },

  sectionHeader: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
    marginTop: 4,
    marginBottom: 4,
  },
  sectionTitle: { fontSize: 14, fontWeight: 600, color: "#111827" },
  sectionSubtitle: { fontSize: 12, color: "#6b7280" },

  emptyCard: {
    background: "#fff",
    border: "1px dashed #d1d5db",
    borderRadius: 10,
    padding: 16,
    fontSize: 13,
    color: "#6b7280",
  },

  /* Viewer-level */

  viewer: { display: "grid", gap: 12 },

  tilesRow: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 12,
    marginBottom: 4,
  },
  tile: {
    background: "white",
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    boxShadow: "0 1px 2px rgba(16,24,40,0.04)",
    padding: "12px 14px",
  },
  tileLabel: { fontSize: 12, color: "#6b7280" },
  tileValue: { marginTop: 4, fontSize: 20, fontWeight: 700, color: "#111827" },

  aspectCard: {
    background: "white",
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    marginBottom: 4,
    overflow: "hidden",
  },
  aspectHeader: {
    padding: "10px 12px",
    background: "#f3f4f6",
    borderBottom: "1px solid #e5e7eb",
    fontSize: 13,
    fontWeight: 600,
    color: "#374151",
  },
  aspectList: {
    padding: 10,
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  aspectRowLine: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    padding: "4px 4px",
  },
  aspectLabel: { fontSize: 12, color: "#374151", fontWeight: 600 },
  aspectLineMetrics: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 12,
    color: "#4b5563",
    flexWrap: "wrap",
  },
  aspectMetricChunk: {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
  },
  aspectFootNote: {
    padding: "0 12px 12px 12px",
    fontSize: 12,
    color: "#6b7280",
  },

  bodyGrid: {
    display: "grid",
    gridTemplateColumns: "minmax(320px, 420px) 1fr",
    gap: 16,
    alignItems: "start",
  },

  /* Left list */

  left: {
    background: "white",
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    minHeight: 360,
  },
  searchRow: { padding: 10, borderBottom: "1px solid #e5e7eb" },
  input: {
    width: "100%",
    height: 34,
    border: "1px solid #d1d5db",
    borderRadius: 6,
    padding: "0 10px",
    background: "white",
    color: "#111827",
    fontSize: 13,
  },
  list: { display: "grid" },
  rowBtnList: {
    display: "grid",
    gap: 4,
    textAlign: "left",
    background: "white",
    border: "none",
    borderBottom: "1px solid #f1f5f9",
    padding: "10px 12px",
    cursor: "pointer",
  },
  rowBtnActive: { background: "#f9fafb" },
  userLine: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  userName: { fontWeight: 600, color: "#111827" },
  subtle: { fontSize: 12, color: "#6b7280" },
  empty: { padding: 12, color: "#6b7280", fontSize: 13 },

  /* Right detail */

  right: { minHeight: 360 },
  placeholder: {
    background: "white",
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    padding: 16,
    color: "#6b7280",
    fontSize: 13,
  },
  detailCard: {
    background: "white",
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    overflow: "hidden",
  },
  detailHeader: {
    padding: "12px 14px",
    borderBottom: "1px solid #e5e7eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "#fafafa",
  },
  detailTitle: { fontWeight: 700, color: "#111827" },
  detailMeta: { fontSize: 12, color: "#4b5563", marginTop: 2 },

  section: { padding: 12, borderTop: "1px solid #f3f4f6" },
  sectionLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 6,
    fontWeight: 600,
  },

  barOuter: {
    height: 10,
    width: 180,
    background: "#f3f4f6",
    borderRadius: 999,
    overflow: "hidden",
    border: "1px solid #e5e7eb",
  },
  barInner: { height: "100%", background: "#6d28d9" },
  scoreText: { fontSize: 12, color: "#374151" },

  reactGrid: { display: "grid", gap: 8 },
  reactRow: {
    display: "grid",
    gridTemplateColumns: "1fr auto",
    alignItems: "center",
    padding: "6px 8px",
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    background: "#fff",
  },

  commentBox: {
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    padding: 10,
    background: "#fff",
    color: "#111827",
    minHeight: 48,
  },

  dot: { color: "#9ca3af" },
};