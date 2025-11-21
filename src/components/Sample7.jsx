// Sample7.jsx — Unified Contributor Feedback Dashboard with Filters + CSAT 0–10
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
        score: 8, // CSAT 0–10
        aspects: {
          instructions: "down",
          reviewer: "up",
          tool: "up",
          ui: "up",
          payment: "up",
        },
        comment: "Shortcuts are great; occasional upload lag.",
        device: "Chrome • Win",
        updatedAt: "2h ago",
      },
      {
        id: "chem-2",
        user: "A-1044",
        score: 10,
        aspects: {
          instructions: "up",
          reviewer: "up",
          tool: "up",
          ui: "up",
          payment: "up",
        },
        comment: "Examples very clear.",
        device: "Safari • iOS",
        updatedAt: "yesterday",
      },
      {
        id: "chem-3",
        user: "B-2099",
        score: 6,
        aspects: {
          instructions: "down",
          reviewer: "up",
          tool: "down",
          ui: "down",
          payment: "down",
        },
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
        score: 8,
        aspects: {
          instructions: "up",
          reviewer: "down",
          tool: "up",
          ui: "up",
          payment: "up",
        },
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
        score: 4,
        aspects: {
          instructions: "down",
          reviewer: "down",
          tool: "down",
          ui: "down",
          payment: "down",
        },
        comment: "Tool lag + unclear rejection reasons.",
        device: "Firefox • Linux",
        updatedAt: "1h ago",
      },
      {
        id: "vis-2",
        user: "D-3002",
        score: 6,
        aspects: {
          instructions: "down",
          reviewer: "up",
          tool: "down",
          ui: "up",
          payment: "down",
        },
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
    score: 8,
    aspects: {
      instructions: "up",
      reviewer: "up",
      tool: "up",
      ui: "up",
      payment: "up",
    },
    comment: "Good speed this week.",
    device: "Chrome • Win",
    updatedAt: "2h ago",
  },
  {
    id: "fts-2",
    user: "B-2099",
    score: 6,
    aspects: {
      instructions: "down",
      reviewer: "up",
      tool: "down",
      ui: "down",
      payment: "down",
    },
    comment: "Uploads flaky on hotel Wi-Fi.",
    device: "Edge • Win",
    updatedAt: "yesterday",
  },
  {
    id: "fts-3",
    user: "C-6677",
    score: 10,
    aspects: {
      instructions: "up",
      reviewer: "up",
      tool: "up",
      ui: "up",
      payment: "up",
    },
    comment: "Everything feels smooth.",
    device: "Chrome • Mac",
    updatedAt: "3d ago",
  },
  {
    id: "fts-4",
    user: "D-3001",
    score: 4,
    aspects: {
      instructions: "down",
      reviewer: "down",
      tool: "down",
      ui: "down",
      payment: "down",
    },
    comment: "Review loop confusing; editor lags.",
    device: "Firefox • Linux",
    updatedAt: "5h ago",
  },
];

/* ----------------------------- Helpers ----------------------------- */

const ASPECT_LABELS = {
  instructions: "Guidelines",
  reviewer: "Reviewer decisions",
  tool: "User Interface",
  ui: "Workload per task",
  payment: "Payment",
};

const ALL_ASPECT_NAMES = [
  "Guidelines",
  "Reviewer decisions",
  "User Interface",
  "Workload per task",
  "Payment",
];

function mapEntryToViewer(entry, projectName, workflowName, sourceType) {
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
    project: projectName,
    workflow: workflowName,
    source: sourceType, // 'workflow' | 'platform'
  };
}

function toneForScore(v) {
  // CSAT 0–10 scale
  if (v >= 8) return "good";
  if (v >= 6) return "ok";
  return "poor";
}

const DEFAULT_FILTERS = {
  scores: [], // e.g. [6,7,8]
  comments: "all", // 'all' | 'with' | 'without'
  aspects: ALL_ASPECT_NAMES.reduce((acc, name) => {
    acc[name] = { up: false, down: false };
    return acc;
  }, {}),
  timePreset: "all", // 'all' | '7d' | '30d' | '90d'
};

function hasActiveFilters(filters) {
  if (filters.scores.length > 0) return true;
  if (filters.comments !== "all") return true;
  if (filters.timePreset !== "all") return true;
  for (const val of Object.values(filters.aspects)) {
    if (val.up || val.down) return true;
  }
  return false;
}

// ultra-rough parsing of "2h ago", "3d ago", "yesterday", "today"
function hoursFromNowLabel(label) {
  if (!label) return Infinity;
  const s = String(label).toLowerCase().trim();
  if (s.endsWith("h ago")) {
    const n = parseInt(s, 10);
    return Number.isNaN(n) ? Infinity : n;
  }
  if (s.endsWith("d ago")) {
    const n = parseInt(s, 10);
    return Number.isNaN(n) ? Infinity : n * 24;
  }
  if (s === "today") return 12;
  if (s === "yesterday") return 36;
  return Infinity;
}

function withinTimePreset(entry, preset) {
  if (preset === "all") return true;
  const h = hoursFromNowLabel(entry.updatedAt);
  if (!Number.isFinite(h)) return true; // stub data fallback
  if (preset === "7d") return h <= 7 * 24;
  if (preset === "30d") return h <= 30 * 24;
  if (preset === "90d") return h <= 90 * 24;
  return true;
}

function applyFilters(entries, filters) {
  return entries.filter((r) => {
    // score filter
    if (filters.scores.length > 0) {
      const s = Math.round(r.score);
      if (!filters.scores.includes(s)) return false;
    }

    // comment filter
    const hasComment = !!(r.comment && r.comment.trim().length);
    if (filters.comments === "with" && !hasComment) return false;
    if (filters.comments === "without" && hasComment) return false;

    // aspects (reactions) filter
    for (const [aspect, conf] of Object.entries(filters.aspects)) {
      if (!conf.up && !conf.down) continue; // not constraining
      const val = r.reactions?.[aspect];
      if (conf.up && conf.down) {
        // need some reaction present
        if (val !== "up" && val !== "down") return false;
      } else if (conf.up) {
        if (val !== "up") return false;
      } else if (conf.down) {
        if (val !== "down") return false;
      }
    }

    // time filter (rough)
    if (!withinTimePreset(r, filters.timePreset)) return false;

    return true;
  });
}

/* ----------------------------- Main Component ----------------------------- */

export default function Sample7() {
  const [feedbackSource, setFeedbackSource] = useState("workflow"); // 'all' | 'workflow'

  // Filters live at the top level
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filtersActive = hasActiveFilters(filters);

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
    return selectedWorkflow.entries.map((entry) =>
      mapEntryToViewer(
        entry,
        selectedWorkflow.project,
        selectedWorkflow.workflow,
        "workflow"
      )
    );
  }, [selectedWorkflow]);

  const platformEntries = useMemo(
    () =>
      PLATFORM_ANSWERS.map((entry) =>
        mapEntryToViewer(entry, "Overall FTS", "Platform", "platform")
      ),
    []
  );

  const combinedEntries = useMemo(() => {
    if (feedbackSource === "workflow") return workflowEntries;
    // "all" = workflow slice + overall FTS slice
    return [...workflowEntries, ...platformEntries];
  }, [feedbackSource, workflowEntries, platformEntries]);

  const subtitle = useMemo(() => {
    if (feedbackSource === "workflow") {
      const wfTitle = selectedWorkflow
        ? `${selectedWorkflow.project} • ${selectedWorkflow.workflow}`
        : "No workflow selected";
      return `Workflow-specific feedback — ${wfTitle}`;
    }
    return "All feedback";
  }, [feedbackSource, selectedWorkflow]);

  return (
    <section style={sx.page}>
      {/* Header */}
      <header style={sx.header}>
        <div style={sx.brand}>
          <span style={sx.brandMark} />
          <span style={sx.brandText}>FT Studio — Contributor Feedback</span>
        </div>
      </header>

      <div style={sx.body}>
        {/* Controls row */}
        <div style={sx.controlsRow}>
          <label style={sx.field}>
            <span style={sx.label}>Feedback source</span>
            <select
              value={feedbackSource}
              onChange={(e) => setFeedbackSource(e.target.value)}
              style={sx.select}
            >
              <option value="all">All feedback</option>
              <option value="workflow">Workflow feedback</option>
            </select>
          </label>

          {feedbackSource === "workflow" && (
            <>
              <label style={sx.field}>
                <span style={sx.label}>Project Nickname</span>
                {/* Searchable + pickable via datalist */}
                <input
                  list="project-options"
                  value={project}
                  onChange={(e) => {
                    const next = e.target.value;
                    setProject(next);
                    const wfForProject = WORKFLOWS.filter(
                      (w) => w.project === next
                    );
                    if (wfForProject.length > 0) {
                      setWorkflowId(wfForProject[0].id);
                    }
                  }}
                  style={sx.input}
                  placeholder="Start typing to search…"
                />
                <datalist id="project-options">
                  {projects.map((p) => (
                    <option key={p} value={p} />
                  ))}
                </datalist>
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
            </>
          )}

          <div style={{ flex: 1 }} />

          <button
            type="button"
            onClick={() => setFiltersOpen(true)}
            style={{
              ...sx.filterBtn,
              ...(filtersActive ? sx.filterBtnActive : null),
            }}
          >
            <FilterIcon />
            <span>Filters</span>
            {filtersActive && <span style={sx.filterDot} />}
          </button>
        </div>

        <div style={sx.sectionHeader}>
          <span style={sx.sectionTitle}>Contributor Feedback</span>
          <span style={sx.sectionSubtitle}>{subtitle}</span>
        </div>

        {combinedEntries.length === 0 ? (
          <div style={sx.emptyCard}>
            No feedback records match the current selection.
          </div>
        ) : (
          <FeedbackViewer
            entries={combinedEntries}
            filters={filters}
            onFiltersChange={setFilters}
            filtersOpen={filtersOpen}
            onCloseFilters={() => setFiltersOpen(false)}
          />
        )}
      </div>
    </section>
  );
}

/* ----------------------------- Shared Feedback Viewer ----------------------------- */

function FeedbackViewer({
  entries,
  filters,
  onFiltersChange,
  filtersOpen,
  onCloseFilters,
}) {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const filteredEntries = useMemo(
    () => applyFilters(entries, filters),
    [entries, filters]
  );

  const answeredRows = useMemo(() => {
    return filteredEntries.filter((r) =>
      r.user.toLowerCase().includes(query.toLowerCase())
    );
  }, [filteredEntries, query]);

  const sel = useMemo(() => {
    const byId = answeredRows.find((r) => r.id === selectedId);
    return byId ?? answeredRows[0] ?? null;
  }, [answeredRows, selectedId]);

  const metrics = useMemo(() => {
    const totalAnswered = filteredEntries.length;
    const scores = filteredEntries
      .filter((r) => typeof r.score === "number")
      .map((r) => r.score);
    const avgScore = scores.length
      ? `${(scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)} / 10`
      : "—";
    return { totalAnswered, avgScore };
  }, [filteredEntries]);

  const aspectSummary = useMemo(() => {
    const counts = {}; // { aspect: { up, down } }
    for (const r of filteredEntries) {
      if (!r.reactions) continue;
      for (const [aspect, val] of Object.entries(r.reactions)) {
        if (!counts[aspect]) counts[aspect] = { up: 0, down: 0 };
        if (val === "up") counts[aspect].up += 1;
        if (val === "down") counts[aspect].down += 1;
      }
    }
    const order = ALL_ASPECT_NAMES;
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
  }, [filteredEntries]);

  const active = hasActiveFilters(filters);

  return (
    <section style={sx.viewer}>
      {/* Top tiles */}
      <div style={sx.tilesRow}>
        <Tile label="Total Answered" value={metrics.totalAnswered} />
        <Tile label="Avg CSAT" value={metrics.avgScore} />
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
          <div style={sx.leftHeaderRow}>
            <input
              placeholder="Search contributor by ID…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={sx.input}
            />
          </div>

          {active && (
            <div style={sx.filterHint}>
              Filters applied – {metrics.totalAnswered} records in view
            </div>
          )}

          <div style={sx.list}>
            {answeredRows.map((r) => {
              const activeRow = r.id === sel?.id;
              return (
                <button
                  key={r.id}
                  onClick={() => setSelectedId(r.id)}
                  style={{
                    ...sx.rowBtnList,
                    ...(activeRow ? sx.rowBtnActive : null),
                  }}
                >
                  <div style={sx.userLine}>
                    <span style={sx.userName}>{r.user}</span>
                    <Badge tone={toneForScore(r.score)}>
                      {Number(r.score).toFixed(1)}
                    </Badge>
                  </div>
                  <div style={sx.subtle}>
                    {r.project && r.workflow
                      ? `${r.project} • ${r.workflow}`
                      : "Overall FTS"}
                    {r.updatedAt ? ` • ${r.updatedAt}` : ""}
                  </div>
                </button>
              );
            })}
            {answeredRows.length === 0 && (
              <div style={sx.empty}>
                No answered surveys match your search and filters.
              </div>
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
                    {sel.project && sel.workflow
                      ? `${sel.project} • ${sel.workflow}`
                      : "Overall FTS"}
                    {sel.updatedAt ? ` • ${sel.updatedAt}` : ""}
                  </div>
                </div>
              </div>

              <div style={sx.section}>
                <div style={sx.sectionLabel}>CSAT score (0–10)</div>
                <ScoreBar value={sel.score} />
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

      {filtersOpen && (
        <FiltersModal
          value={filters}
          onChange={onFiltersChange}
          onClose={onCloseFilters}
        />
      )}
    </section>
  );
}

/* ----------------------------- Filter Modal ----------------------------- */

function FiltersModal({ value, onChange, onClose }) {
  const [local, setLocal] = useState(value);

  const toggleScore = (score) => {
    setLocal((prev) => {
      const has = prev.scores.includes(score);
      return {
        ...prev,
        scores: has
          ? prev.scores.filter((s) => s !== score)
          : [...prev.scores, score],
      };
    });
  };

  const toggleAspect = (aspect, field) => {
    setLocal((prev) => ({
      ...prev,
      aspects: {
        ...prev.aspects,
        [aspect]: {
          ...prev.aspects[aspect],
          [field]: !prev.aspects[aspect][field],
        },
      },
    }));
  };

  const apply = () => {
    onChange(local);
    onClose();
  };

  const reset = () => {
    setLocal(DEFAULT_FILTERS);
  };

  return (
    <div style={sx.modalOverlay} role="dialog" aria-modal="true">
      <div style={sx.modal}>
        <div style={sx.modalHeader}>
          <div style={{ fontWeight: 600, color: "#111827" }}>
            Filter feedback
          </div>
          <button onClick={onClose} style={sx.iconBtn} aria-label="close">
            <CloseIcon />
          </button>
        </div>

        <div style={sx.modalBody}>
          <div style={sx.filterGrid}>
            {/* Scores */}
            <div style={sx.filterSection}>
              <div style={sx.filterTitle}>CSAT scores</div>
              <div style={sx.filterSub}>
                Choose one or more overall CSAT scores (0–10).
              </div>
              <div style={sx.scoreChipsRow}>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((s) => {
                  const active = local.scores.includes(s);
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleScore(s)}
                      style={{
                        ...sx.scoreChip,
                        ...(active ? sx.scoreChipActive : null),
                      }}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Comments */}
            <div style={sx.filterSection}>
              <div style={sx.filterTitle}>Comments</div>
              <div style={sx.filterSub}>
                Filter by presence of free-text comments.
              </div>
              <div style={sx.radioCol}>
                <label style={sx.radioRow}>
                  <input
                    type="radio"
                    name="comments"
                    value="all"
                    checked={local.comments === "all"}
                    onChange={(e) =>
                      setLocal((prev) => ({ ...prev, comments: e.target.value }))
                    }
                  />
                  <span>All responses</span>
                </label>
                <label style={sx.radioRow}>
                  <input
                    type="radio"
                    name="comments"
                    value="with"
                    checked={local.comments === "with"}
                    onChange={(e) =>
                      setLocal((prev) => ({ ...prev, comments: e.target.value }))
                    }
                  />
                  <span>With comments only</span>
                </label>
                <label style={sx.radioRow}>
                  <input
                    type="radio"
                    name="comments"
                    value="without"
                    checked={local.comments === "without"}
                    onChange={(e) =>
                      setLocal((prev) => ({ ...prev, comments: e.target.value }))
                    }
                  />
                  <span>Without comments only</span>
                </label>
              </div>
            </div>

            {/* Aspects */}
            <div style={sx.filterSection}>
              <div style={sx.filterTitle}>Quick reactions</div>
              <div style={sx.filterSub}>
                Filter by thumbs up / down on specific aspects.
              </div>
              <div style={sx.aspectFilterGrid}>
                {ALL_ASPECT_NAMES.map((aspect) => {
                  const conf = local.aspects[aspect] || {
                    up: false,
                    down: false,
                  };
                  return (
                    <div key={aspect} style={sx.aspectFilterRow}>
                      <div style={sx.aspectFilterLabel}>{aspect}</div>
                      <div style={sx.aspectFilterControls}>
                        <button
                          type="button"
                          onClick={() => toggleAspect(aspect, "up")}
                          style={{
                            ...sx.aspectChip,
                            ...(conf.up ? sx.aspectChipActiveUp : null),
                          }}
                        >
                          👍
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleAspect(aspect, "down")}
                          style={{
                            ...sx.aspectChip,
                            ...(conf.down ? sx.aspectChipActiveDown : null),
                          }}
                        >
                          👎
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Time window (stubbed against labels) */}
            <div style={sx.filterSection}>
              <div style={sx.filterTitle}>Time window</div>
              <div style={sx.filterSub}>
                Approximate filters based on “2h ago”, “3d ago”, “yesterday”, etc.
              </div>
              <div style={sx.radioCol}>
                <label style={sx.radioRow}>
                  <input
                    type="radio"
                    name="timePreset"
                    value="all"
                    checked={local.timePreset === "all"}
                    onChange={(e) =>
                      setLocal((prev) => ({
                        ...prev,
                        timePreset: e.target.value,
                      }))
                    }
                  />
                  <span>All time</span>
                </label>
                <label style={sx.radioRow}>
                  <input
                    type="radio"
                    name="timePreset"
                    value="7d"
                    checked={local.timePreset === "7d"}
                    onChange={(e) =>
                      setLocal((prev) => ({
                        ...prev,
                        timePreset: e.target.value,
                      }))
                    }
                  />
                  <span>Last 7 days</span>
                </label>
                <label style={sx.radioRow}>
                  <input
                    type="radio"
                    name="timePreset"
                    value="30d"
                    checked={local.timePreset === "30d"}
                    onChange={(e) =>
                      setLocal((prev) => ({
                        ...prev,
                        timePreset: e.target.value,
                      }))
                    }
                  />
                  <span>Last 30 days</span>
                </label>
                <label style={sx.radioRow}>
                  <input
                    type="radio"
                    name="timePreset"
                    value="90d"
                    checked={local.timePreset === "90d"}
                    onChange={(e) =>
                      setLocal((prev) => ({
                        ...prev,
                        timePreset: e.target.value,
                      }))
                    }
                  />
                  <span>Last 90 days</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div style={sx.modalActionsRow}>
          <button style={sx.tertiaryBtn} onClick={reset}>
            Reset
          </button>
          <div style={{ flex: 1 }} />
          <button style={sx.tertiaryBtn} onClick={onClose}>
            Cancel
          </button>
          <button style={sx.primaryBtn} onClick={apply}>
            Apply filters
          </button>
        </div>
      </div>
    </div>
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
  return (
    <span style={{ ...styles.base, ...(styles[tone] || {}) }}>{children}</span>
  );
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

function ScoreBar({ value, max = 10 }) {
  if (typeof value !== "number")
    return <span style={sx.subtle}>No response</span>;
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

function FilterIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3 4h14l-5.5 6.3v3.7l-3 2v-5.7L3 4z"
        stroke="#4b5563"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
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
        strokeWidth="1.5"
        strokeLinecap="round"
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
    fontSize: 13,
  },
  input: {
    height: 34,
    border: "1px solid #d1d5db",
    borderRadius: 8,
    padding: "0 10px",
    background: "#fff",
    color: "#111827",
    fontSize: 13,
  },

  filterBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    borderRadius: 999,
    border: "1px solid #d1d5db",
    background: "#fff",
    padding: "4px 10px",
    fontSize: 11,
    color: "#4b5563",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  filterBtnActive: {
    borderColor: "#6d28d9",
    background: "#f5f3ff",
    color: "#4c1d95",
  },
  filterDot: {
    width: 6,
    height: 6,
    borderRadius: "999px",
    background: "#10b981",
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
  leftHeaderRow: {
    padding: 10,
    borderBottom: "1px solid #e5e7eb",
  },
  filterHint: {
    padding: "4px 12px",
    fontSize: 11,
    color: "#4b5563",
    borderBottom: "1px solid #e5e7eb",
    background: "#f9fafb",
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

  /* Filter modal */

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
    width: 880,
    maxWidth: "96vw",
    maxHeight: "90vh",
    background: "white",
    borderRadius: 10,
    boxShadow: "0 12px 30px rgba(0,0,0,0.2)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  modalHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 12px",
    borderBottom: "1px solid #e5e7eb",
    background: "#f9fafb",
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
  modalBody: {
    padding: 12,
    overflowY: "auto",
    flex: "1 1 auto",
  },
  modalActionsRow: {
    padding: "8px 12px 10px",
    borderTop: "1px solid #e5e7eb",
    display: "flex",
    alignItems: "center",
    gap: 8,
  },

  filterGrid: {
    display: "grid",
    gridTemplateColumns: "minmax(0,1.2fr) minmax(0,1fr)",
    gap: 16,
  },
  filterSection: {
    borderRadius: 8,
    border: "1px solid #e5e7eb",
    background: "#f9fafb",
    padding: 10,
    fontSize: 12,
  },
  filterTitle: { fontWeight: 600, color: "#111827", marginBottom: 4 },
  filterSub: { color: "#6b7280", marginBottom: 8, fontSize: 11 },

  scoreChipsRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 6,
  },
  scoreChip: {
    minWidth: 28,
    height: 26,
    borderRadius: 999,
    border: "1px solid #d1d5db",
    background: "#fff",
    fontSize: 12,
    cursor: "pointer",
  },
  scoreChipActive: {
    borderColor: "#6d28d9",
    background: "#f5f3ff",
    color: "#4c1d95",
    fontWeight: 600,
  },

  radioCol: {
    display: "grid",
    gap: 4,
  },
  radioRow: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 12,
    color: "#111827",
  },

  aspectFilterGrid: {
    display: "grid",
    gap: 6,
  },
  aspectFilterRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  aspectFilterLabel: { fontSize: 12, color: "#111827" },
  aspectFilterControls: {
    display: "flex",
    gap: 6,
  },
  aspectChip: {
    width: 28,
    height: 26,
    borderRadius: 999,
    border: "1px solid #d1d5db",
    background: "#fff",
    cursor: "pointer",
  },
  aspectChipActiveUp: {
    borderColor: "#10b981",
    background: "#ecfdf5",
  },
  aspectChipActiveDown: {
    borderColor: "#ef4444",
    background: "#fef2f2",
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