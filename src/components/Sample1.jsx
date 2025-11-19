import { useMemo, useState } from "react";

/**
 * Sample1 — Feedback Viewer (Answered-only, with Aspect Summary)
 * - List only answered entries
 * - Top tiles: Total Answered, Avg Score (x.xx / 5)
 * - Aspect summary: one line per aspect with answered count + up/down % and counts
 * - Shown/Not Shown summary as a small line under the list
 * - Right panel: exact answers for the selected contributor
 */

const MOCK = [
  {
    id: "u001",
    user: "User 1",
    tasksDone: 37,
    survey: {
      shown: true,
      askedAtTask: 12,
      answered: true,
      score: 4,
      reactions: { Instructions: "down", Reviewer: "up", "Tool performance": "up", "UI / Layout": "up" },
      comment: "Step 2 example contradicted header; rest smooth."
    },
    device: "Chrome • Win",
    updatedAt: "2h ago"
  },
  {
    id: "u002",
    user: "User 2",
    tasksDone: 9,
    survey: {
      shown: true,
      askedAtTask: 8,
      answered: false,
      score: null,
      reactions: null,
      comment: ""
    },
    device: "Safari • iOS",
    updatedAt: "yesterday"
  },
  {
    id: "u003",
    user: "User 3",
    tasksDone: 64,
    survey: {
      shown: true,
      askedAtTask: 10,
      answered: true,
      score: 5,
      reactions: { Instructions: "up", Reviewer: "up", "Tool performance": "up", "UI / Layout": "up" },
      comment: "Clear rules; reviewer fast."
    },
    device: "Chrome • Mac",
    updatedAt: "3d ago"
  },
  {
    id: "u004",
    user: "User 4",
    tasksDone: 15,
    survey: {
      shown: true,
      askedAtTask: 5,
      answered: true,
      score: 2,
      reactions: { Instructions: "down", Reviewer: "down", "Tool performance": "down", "UI / Layout": "down" },
      comment: "Conflicting guidelines, slow support."
    },
    device: "Edge • Win",
    updatedAt: "1h ago"
  },
  {
    id: "u005",
    user: "User 5",
    tasksDone: 22,
    survey: {
      shown: false,
      askedAtTask: null,
      answered: false,
      score: null,
      reactions: null,
      comment: ""
    },
    device: "Firefox • Linux",
    updatedAt: "5h ago"
  }
];

export default function Sample1() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  // Only answered rows in the main list
  const answeredRows = useMemo(() => {
    return MOCK.filter(r => r.survey.answered).filter(r =>
      r.user.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  // Selected
  const sel = useMemo(() => {
    const byId = answeredRows.find(r => r.id === selectedId);
    return byId ?? answeredRows[0] ?? null;
  }, [answeredRows, selectedId]);

  // Header metrics (no "Total Shown" anymore)
  const metrics = useMemo(() => {
    const totalAnswered = MOCK.filter(r => r.survey.answered).length;
    const scores = MOCK.filter(r => r.survey.answered && typeof r.survey.score === "number")
                       .map(r => r.survey.score);
    const avgScore = scores.length
      ? `${(scores.reduce((a,b)=>a+b,0)/scores.length).toFixed(2)} / 5`
      : "—";
    return { totalAnswered, avgScore };
  }, []);

  // Aspect summary (answered + reactions): per aspect line with counts + %
  const aspectSummary = useMemo(() => {
    const counts = {}; // { aspect: { up: n, down: n } }
    for (const r of MOCK) {
      if (!r.survey.answered || !r.survey.reactions) continue;
      for (const [aspect, val] of Object.entries(r.survey.reactions)) {
        if (!counts[aspect]) counts[aspect] = { up: 0, down: 0 };
        if (val === "up") counts[aspect].up += 1;
        if (val === "down") counts[aspect].down += 1;
      }
    }
    const order = ["Instructions", "Reviewer", "Tool performance", "UI / Layout"];
    const keys = Array.from(new Set([...order, ...Object.keys(counts)]));

    return keys.map(k => {
      const up = counts[k]?.up ?? 0;
      const down = counts[k]?.down ?? 0;
      const total = up + down;
      const upPct = total ? Math.round((up / total) * 100) : 0;
      const downPct = total ? 100 - upPct : 0;
      return { aspect: k, up, down, total, upPct, downPct };
    }).filter(row => row.total > 0);
  }, []);

  // Shown vs Not Shown (brief line under the list)
  const shownStats = useMemo(() => {
    const shown = MOCK.filter(r => r.survey.shown).length;
    const notShown = MOCK.length - shown;
    return { shown, notShown };
  }, []);

  return (
    <section style={sx.page}>
      {/* Header */}
      <div style={sx.headerRow}>
        <h2 style={sx.h2}>Feedback Viewer</h2>
        <div style={{ flex: 1 }} />
        <button style={sx.secondaryBtn} onClick={() => console.log("EXPORT_CSV")}>Export CSV</button>
      </div>

      {/* Top tiles — only total answered + avg score */}
      <div style={sx.tilesRow}>
        <Tile label="Total Answered" value={metrics.totalAnswered} />
        <Tile label="Avg Score" value={metrics.avgScore} />
      </div>

      {/* Aspect summary: one line per aspect */}
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

      {/* Body: two-column */}
      <div style={sx.body}>
        {/* Left: answered list + small shown/not shown line */}
        <aside style={sx.left}>
          <div style={sx.searchRow}>
            <input
              placeholder="Search contributor…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              style={sx.input}
            />
          </div>

          <div style={sx.list}>
            {answeredRows.map(r => {
              const active = r.id === sel?.id;
              return (
                <button
                  key={r.id}
                  onClick={() => setSelectedId(r.id)}
                  style={{ ...sx.rowBtn, ...(active ? sx.rowBtnActive : null) }}
                >
                  <div style={sx.userLine}>
                    <span style={sx.userName}>{r.user}</span>
                    <Badge tone={toneForScore(r.survey.score)}>
                      {Number(r.survey.score).toFixed(1)}
                    </Badge>
                  </div>
                  <div style={sx.subLine}>
                    <span>Tasks: <b>{r.tasksDone}</b></span>
                    <span>•</span>
                    <span>Asked at: {r.survey.askedAtTask ? `task ${r.survey.askedAtTask}` : "—"}</span>
                  </div>
                  <div style={sx.subtle}>{r.device} • {r.updatedAt}</div>
                </button>
              );
            })}
            {answeredRows.length === 0 && (
              <div style={sx.empty}>No answered surveys match your search.</div>
            )}
          </div>

          <div style={sx.shownStrip}>
            <span style={sx.subtle}>Shown: <b>{shownStats.shown}</b></span>
            <span style={sx.dot}>•</span>
            <span style={sx.subtle}>Not shown: <b>{shownStats.notShown}</b></span>
          </div>
        </aside>

        {/* Right: exact details */}
        <main style={sx.right}>
          {!sel ? (
            <div style={sx.placeholder}>Select a contributor to view their survey.</div>
          ) : (
            <div style={sx.detailCard}>
              <div style={sx.detailHeader}>
                <div>
                  <div style={sx.detailTitle}>{sel.user}</div>
                  <div style={sx.detailMeta}>
                    Tasks done: <b>{sel.tasksDone}</b>
                    {sel.survey.askedAtTask ? <> • Asked at task <b>{sel.survey.askedAtTask}</b></> : null}
                    <> • {sel.device}</>
                  </div>
                </div>
                <div>
                  <Tag tone="ok">Answered</Tag>
                </div>
              </div>

              <div style={sx.section}>
                <div style={sx.sectionLabel}>Recommendation score</div>
                <ScoreBar value={sel.survey.score} max={5} />
              </div>

              <div style={sx.section}>
                <div style={sx.sectionLabel}>Quick reactions</div>
                <ReactionsGrid reactions={sel.survey.reactions} />
              </div>

              <div style={sx.section}>
                <div style={sx.sectionLabel}>Comment</div>
                <div style={sx.commentBox}>
                  {(sel.survey.comment || "").trim().length
                    ? sel.survey.comment
                    : <span style={sx.subtle}>—</span>}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </section>
  );
}

/* ---------- Small components ---------- */

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
    ok:    { borderColor: "#a7f3d0", background: "#ecfdf5", color: "#065f46" },
    warn:  { borderColor: "#fde68a", background: "#fffbeb", color: "#92400e" },
    muted: { borderColor: "#e5e7eb", background: "#fafafa", color: "#6b7280" },
  };
  return <span style={{ ...styles.base, ...(styles[tone] || {}) }}>{children}</span>;
}

function Badge({ tone, children }) {
  const tones = {
    good: { bg: "#ecfdf5", text: "#065f46", border: "#a7f3d0" },
    ok:   { bg: "#eff6ff", text: "#1e40af", border: "#bfdbfe" },
    poor: { bg: "#fef2f2", text: "#991b1b", border: "#fecaca" },
  }[tone];
  return (
    <span style={{
      background: tones.bg,
      color: tones.text,
      border: `1px solid ${tones.border}`,
      borderRadius: 12,
      padding: "2px 8px",
      fontSize: 12,
      fontWeight: 600,
    }}>
      {children}
    </span>
  );
}

function toneForScore(v) {
  if (v >= 4.3) return "good";
  if (v >= 3.5) return "ok";
  return "poor";
}

function ScoreBar({ value, max = 5 }) {
  if (typeof value !== "number") return <span style={sx.subtle}>No response</span>;
  const pct = Math.max(0, Math.min(1, value / max));
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={sx.barOuter}>
        <div style={{ ...sx.barInner, width: `${pct * 100}%` }} />
      </div>
      <span style={sx.scoreText}>{value} / {max}</span>
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
      <path d="M7 9l3-6 1 1c.8.8 1.2 1.2 1.2 2.2V7h3c1.1 0 2 .9 2 2 0 .3-.1.6-.2.8l-2 5c-.3.8-1 1.2-1.8 1.2H8c-1.1 0-2-.9-2-2V9h1z" fill="#059669" opacity="0.9"/>
    </svg>
  );
}
function ThumbDown() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-label="thumbs down">
      <path d="M13 11l-3 6-1-1c-.8-.8-1.2-1.2-1.2-2.2V13H4c-1.1 0-2-.9-2-2 0-.3.1-.6.2-.8l2-5C4.5 4.4 5.2 4 6 4h6c1.1 0 2 .9 2 2v5h-1z" fill="#b91c1c" opacity="0.9"/>
    </svg>
  );
}

/* ---------- Styles ---------- */

const sx = {
  page: { padding: "20px 24px", background: "#f7f7fb", minHeight: "100%" },

  h2: { margin: 0, fontSize: 20, fontWeight: 600, color: "#111827" },
  headerRow: { display: "flex", alignItems: "center", marginBottom: 12 },

  secondaryBtn: {
    height: 34,
    border: "1px solid #d1d5db",
    borderRadius: 6,
    background: "white",
    padding: "0 12px",
    fontSize: 13,
  },

  // now only 2 tiles
  tilesRow: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 16,
    marginBottom: 12,
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
    marginBottom: 16,
    overflow: "hidden"
  },
  aspectHeader: {
    padding: "10px 12px",
    background: "#f3f4f6",
    borderBottom: "1px solid #e5e7eb",
    fontSize: 13,
    fontWeight: 600,
    color: "#374151",
  },

  // new single-line layout
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
  aspectFootNote: { padding: "0 12px 12px 12px", fontSize: 12, color: "#6b7280" },

  body: {
    display: "grid",
    gridTemplateColumns: "minmax(320px, 420px) 1fr",
    gap: 16,
    alignItems: "start",
  },

  /* Left */
  left: {
    background: "white",
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    minHeight: 420,
  },
  searchRow: { padding: 10, borderBottom: "1px solid #e5e7eb" },
  input: {
    width: "100%",
    height: 34, border: "1px solid #d1d5db", borderRadius: 6, padding: "0 10px",
    background: "white", color: "#111827", fontSize: 13
  },
  list: { display: "grid" },
  rowBtn: {
    display: "grid", gap: 4, textAlign: "left",
    background: "white", border: "none", borderBottom: "1px solid #f1f5f9",
    padding: "10px 12px", cursor: "pointer"
  },
  rowBtnActive: { background: "#f9fafb" },
  userLine: { display: "flex", alignItems: "center", justifyContent: "space-between" },
  userName: { fontWeight: 600, color: "#111827" },
  subLine: { display: "flex", gap: 8, fontSize: 12, color: "#4b5563" },
  subtle: { fontSize: 12, color: "#6b7280" },
  empty: { padding: 12, color: "#6b7280", fontSize: 13 },

  shownStrip: {
    display: "flex",
    gap: 8,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderTop: "1px solid #e5e7eb",
    background: "#fafafa"
  },
  dot: { color: "#9ca3af" },

  /* Right */
  right: { minHeight: 420 },
  placeholder: {
    background: "white", border: "1px solid #e5e7eb", borderRadius: 8, padding: 16,
    color: "#6b7280", fontSize: 13
  },
  detailCard: {
    background: "white", border: "1px solid #e5e7eb", borderRadius: 8, overflow: "hidden"
  },
  detailHeader: {
    padding: "12px 14px",
    borderBottom: "1px solid #e5e7eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "#fafafa"
  },
  detailTitle: { fontWeight: 700, color: "#111827" },
  detailMeta: { fontSize: 12, color: "#4b5563", marginTop: 2 },

  section: { padding: 12, borderTop: "1px solid #f3f4f6" },
  sectionLabel: { fontSize: 12, color: "#6b7280", marginBottom: 6, fontWeight: 600 },

  barOuter: { height: 10, width: 180, background: "#f3f4f6", borderRadius: 999, overflow: "hidden", border: "1px solid #e5e7eb" },
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
    background: "#fff"
  },

  commentBox: {
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    padding: 10,
    background: "#fff",
    color: "#111827",
    minHeight: 48
  },
};