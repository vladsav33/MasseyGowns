import React, { useMemo, useRef, useState, useEffect } from "react";
import { Search, Plus, Minus } from "lucide-react";
import PropTypes from "prop-types";
import Navbar from "../components/Navbar";
import { fetchFAQs } from "../api/FAQApi";
import { Link } from "react-router-dom";

// ---------- helpers ----------

const slug = (s) =>
  String(s || "uncategorized")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

function Highlighter({ children, query, exclude = ["code", "pre"] }) {
  if (!query || !String(query).trim()) return <>{children}</>;

  const raw = String(query).trim();
  const escaped = raw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`(${escaped})`, "ig");

  const visit = (node) => {
    if (node == null || typeof node === "boolean") return node;

    if (typeof node === "string") {
      return node.split(re).map((part, i) =>
        part.toLowerCase() === raw.toLowerCase() ? (
          <mark key={i} className="rounded bg-yellow-100 px-0.5">
            {part}
          </mark>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        )
      );
    }

    if (Array.isArray(node)) {
      return node.map((n, i) => (
        <React.Fragment key={i}>{visit(n)}</React.Fragment>
      ));
    }

    if (React.isValidElement(node)) {
      const tag = typeof node.type === "string" ? node.type.toLowerCase() : "";
      if (exclude.includes(tag)) return node;
      const nextChildren = React.Children.map(node.props.children, visit);
      return React.cloneElement(node, node.props, nextChildren);
    }
    return node;
  };

  return <>{visit(children)}</>;
}
Highlighter.propTypes = {
  query: PropTypes.string,
  children: PropTypes.node,
  exclude: PropTypes.arrayOf(PropTypes.string),
};
Highlighter.defaultProps = { query: "", exclude: ["code", "pre"] };

// Turn “Hire Regalia / Buy Regalia” inside plain text into internal links
const renderTextWithLinks = (text, query) => {
  const parts = String(text || "").split(/(Hire Regalia|Buy Regalia)/);

  return parts.map((part, i) => {
    if (part === "Hire Regalia") {
      return (
        <Link
          key={i}
          to="/hireregalia"
          className="text-sky-700 underline font-semibold hover:text-sky-900"
        >
          <Highlighter query={query}>Hire Regalia</Highlighter>
        </Link>
      );
    }

    if (part === "Buy Regalia") {
      return (
        <Link
          key={i}
          to="/buyregalia"
          className="text-sky-700 underline font-semibold hover:text-sky-900"
        >
          <Highlighter query={query}>Buy Regalia</Highlighter>
        </Link>
      );
    }

    // Normal text – just apply highlighting
    return (
      <React.Fragment key={i}>
        <Highlighter query={query}>{part}</Highlighter>
      </React.Fragment>
    );
  });
};

// Split text into paragraphs (separated by blank lines)
const renderParagraphs = (text, query) => {
  return String(text || "")
    .split(/\n\s*\n/)
    .map((para, i) => (
      <p key={i} className="leading-relaxed">
        {renderTextWithLinks(para, query)}
      </p>
    ));
};

// Intro-style text that should not become a clickable “question”
const isIntroItem = (item) => {
  const label = (item?.label || "").toLowerCase();
  return item?.type === "text" && (label === "intro" || label === "linkintro");
};

// Items that behave like “question + answer” blocks
const isQuestionItem = (item) => {
  if (item?.type !== "text") return false;
  if (isIntroItem(item)) return false;

  const label = (item.label || "").trim();
  // Text items without a label are treated as extra content only
  return label.length > 0;
};

// Extract a baseKey, e.g.
// "Ordering and Payment.How to order.intro" -> "Ordering and Payment.How to order"
const getBaseKey = (key) => (key || "").split(".").slice(0, -1).join(".");

// Render a single content block (no title, no BACK TO TOP)
const renderFaqContent = (item, query) => {
  const value = String(item.value || "");

  if (item.type === "text") {
    if (!value) return null;
    return <div className="space-y-3">{renderParagraphs(value, query)}</div>;
  }

  if (item.type === "list") {
    if (!value) return null;
    const parts = value.split(/\n\s*\n/).filter(Boolean);
    return (
      <ul className="list-disc pl-6 space-y-1">
        {parts.map((t, i) => (
          <li key={i}>{renderTextWithLinks(t, query)}</li>
        ))}
      </ul>
    );
  }

  if (item.type === "link") {
    const link = item.parsedLink;
    if (!link || !link.url) return null;
    const label = link.name || item.label || "More information";
    return (
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-sky-700 hover:underline"
      >
        <Highlighter query={query}>{label}</Highlighter>
      </a>
    );
  }

  // Table type – backend sends { columns, rows } parsed from Excel
  if (item.type === "table") {
    const t = item.parsedTable;
    if (!t || !Array.isArray(t.columns) || !Array.isArray(t.rows)) {
      return null;
    }

    return (
      <div className="overflow-x-auto mt-3">
        <table className="w-full table-auto border-collapse overflow-hidden rounded-xl">
          <thead>
            <tr className="bg-slate-50 text-left">
              {t.columns.map((col, i) => (
                <th key={i} className="px-4 py-3 text-slate-600 font-semibold">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {t.rows.map((row, i) => (
              <tr key={i} className="hover:bg-slate-50">
                {row.map((cell, j) => (
                  <td key={j} className="px-4 py-3">
                    {renderTextWithLinks(cell, query)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // File attachment (Excel etc.) – keeping this for later if needed
  /*
  if (item.type === "file") {
    if (!item.value) return null;
    const displayLabel =
      (item.label || "").replace(/\.file$/i, "") || "Download file";
    return (
      <a
        href={item.value}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-sky-700 hover:underline"
      >
        <Highlighter query={query}>{displayLabel}</Highlighter>
      </a>
    );
  }
  */

  return null;
};

// ---------- FAQ Page ----------

export default function FAQPage() {
  const [query, setQuery] = useState("");
  const [openSections, setOpenSections] = useState(new Set());
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const inputRef = useRef(null);
  const itemRefs = useRef({});
  const getItemRef = (id) => {
    if (!itemRefs.current[id]) itemRefs.current[id] = React.createRef();
    return itemRefs.current[id];
  };
  const anchorId = (id) => `faq-q-${id}`;

  // Load /faq data
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError("");

        const data = await fetchFAQs();
        const array = Array.isArray(data) ? data : [];

        const normalized = array.map((x) => {
          let parsedLink = null;
          if (x.type === "link" && typeof x.value === "string") {
            try {
              parsedLink = JSON.parse(x.value);
            } catch (e) {
              console.error("Failed to parse FAQ link JSON:", e);
            }
          }

          // Try to parse table JSON
          let parsedTable = null;
          if (x.type === "table" && typeof x.value === "string") {
            try {
              parsedTable = JSON.parse(x.value);
            } catch (e) {
              console.error("Failed to parse FAQ table JSON:", e);
            }
          }

          return {
            id: x.id,
            page: x.page,
            section: x.section || "Other",
            key: x.key || "",
            type: x.type || "text",
            label: x.label || "",
            value: x.value || "",
            parsedLink,
            parsedTable,
          };
        });

        const grouped = Object.values(
          normalized.reduce((acc, item) => {
            const sec = item.section || "Other";
            if (!acc[sec]) {
              acc[sec] = { section: sec, items: [] };
            }
            acc[sec].items.push(item);
            return acc;
          }, {})
        );

        if (!cancelled) {
          setGroups(grouped);
          // Start with everything collapsed
          setOpenSections(new Set());
        }
      } catch (e) {
        console.error("Failed to load FAQs:", e);
        if (!cancelled) setError("Failed to load FAQs.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Build search index
  const indexedGroups = useMemo(
    () =>
      groups.map((g) => ({
        section: g.section,
        items: g.items.map((item) => {
          const valText = String(item.value || "");
          const linkName = item.parsedLink?.name || "";
          const linkUrl = item.parsedLink?.url || "";

          // For tables, just fold the JSON into the search string
          const tableText =
            item.type === "table" && item.parsedTable
              ? JSON.stringify(item.parsedTable)
              : "";

          const searchText = [
            g.section,
            item.label,
            valText,
            linkName,
            linkUrl,
            tableText,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();
          return { ...item, __search: searchText };
        }),
      })),
    [groups]
  );

  const filteredGroups = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return indexedGroups;
    return indexedGroups
      .map((g) => ({
        section: g.section,
        items: g.items.filter((it) => it.__search.includes(q)),
      }))
      .filter((g) => g.items.length > 0);
  }, [indexedGroups, query]);

  const resultsCount = useMemo(
    () => filteredGroups.reduce((n, g) => n + g.items.length, 0),
    [filteredGroups]
  );

  const toggleSection = (sec) =>
    setOpenSections((prev) => {
      const next = new Set(prev);
      next.has(sec) ? next.delete(sec) : next.add(sec);
      return next;
    });

  const expandAll = () =>
    setOpenSections(new Set(filteredGroups.map((g) => g.section)));

  const collapseAll = () => setOpenSections(new Set());

  const jumpToItem = (section, id) => {
    if (!openSections.has(section)) {
      setOpenSections((prev) => new Set([...prev, section]));
      setTimeout(() => {
        itemRefs.current[id]?.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 0);
    } else {
      itemRefs.current[id]?.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div className="bg-white">
      <Navbar />

      <div id="faq-top" className="mx-auto w-full max-w-4xl px-6 pt-10" />
      <div className="mx-auto w-full max-w-4xl px-6 pb-12">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
          Frequently Asked Questions
        </h1>
        <p className="mt-2 text-slate-500">
          Browse by section, search, and click a question to see the answer.
        </p>

        {/* Search */}
        <div className="mt-6">
          <div className="relative">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400"
            />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search FAQs"
              className="block !w-full max-w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-16 text-slate-900 placeholder-slate-400 shadow-inner focus:outline-none focus:ring-4 focus:ring-sky-100"
            />
            {query && (
              <button
                onClick={() => {
                  setQuery("");
                  inputRef.current?.focus();
                }}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full px-3 py-1 text-sm text-slate-600 hover:bg-slate-200/60"
              >
                Clear
              </button>
            )}
          </div>
          <div className="mt-3 flex items-center gap-3 text-sm">
            <button
              onClick={expandAll}
              className="rounded-full border border-slate-200 px-3 py-1 hover:bg-slate-50"
            >
              Expand all
            </button>
            <button
              onClick={collapseAll}
              className="rounded-full border border-slate-200 px-3 py-1 hover:bg-slate-50"
            >
              Collapse all
            </button>
            <span className="ml-auto text-slate-500">
              {loading
                ? "Loading..."
                : `${resultsCount} item${resultsCount === 1 ? "" : "s"} found`}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="mt-6 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
          {error && <div className="p-6 text-sm text-red-600">{error}</div>}

          {!loading && !error && resultsCount === 0 && (
            <div className="p-6 text-slate-500">
              No matching FAQs. Try a different search term.
            </div>
          )}

          {!loading &&
            !error &&
            filteredGroups.map((group) => {
              const isOpen = openSections.has(group.section);
              const contentId = `faq-panel-${slug(group.section)}`;
              const buttonId = `faq-button-${slug(group.section)}`;

              // Merge items with the same baseKey into one “question block”
              const questions = [];
              const loose = [];
              let currentQuestion = null;

              group.items.forEach((item) => {
                const baseKey = getBaseKey(item.key);

                if (isQuestionItem(item)) {
                  currentQuestion = {
                    id: item.id,
                    baseKey,
                    title: item.label,
                    items: [item],
                  };
                  questions.push(currentQuestion);
                } else if (
                  currentQuestion &&
                  baseKey &&
                  baseKey === currentQuestion.baseKey
                ) {
                  // Extra content belonging to the current question (list/link/file/table etc.)
                  currentQuestion.items.push(item);
                } else {
                  // Standalone content for this section, such as section-level intro
                  loose.push(item);
                }
              });

              const tocQuestions = questions;

              return (
                <div key={group.section} className="group">
                  <button
                    id={buttonId}
                    aria-controls={contentId}
                    aria-expanded={isOpen}
                    onClick={() => toggleSection(group.section)}
                    className="flex w-full items-center justify-between gap-4 p-5 text-left focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-100"
                  >
                    <span className="text-lg font-semibold text-slate-900">
                      <Highlighter query={query}>
                        {group.section || "Other"}
                      </Highlighter>
                    </span>
                    {isOpen ? (
                      <Minus
                        aria-hidden="true"
                        className="h-5 w-5 text-slate-400"
                      />
                    ) : (
                      <Plus
                        aria-hidden="true"
                        className="h-5 w-5 text-slate-400"
                      />
                    )}
                  </button>

                  {isOpen && (
                    <div
                      id={contentId}
                      role="region"
                      aria-labelledby={buttonId}
                    >
                      <div className="px-5 pb-5 text-slate-600 space-y-6">
                        {/* Mini table of contents – show only question titles */}
                        {tocQuestions.length > 0 && (
                          <div className="rounded-xl bg-yellow-50/50 p-4">
                            <ul className="list-disc pl-6 space-y-1">
                              {tocQuestions.map((q) => (
                                <li key={`toc-${q.id}`}>
                                  <a
                                    href={`#${anchorId(q.id)}`}
                                    className="text-sky-700 hover:underline"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      jumpToItem(group.section, q.id);
                                    }}
                                  >
                                    <Highlighter query={query}>
                                      {q.title}
                                    </Highlighter>
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Standalone content in this section (no question title) */}
                        {loose.map((it) => (
                          <div key={it.id} className="py-2">
                            {renderFaqContent(it, query)}
                          </div>
                        ))}

                        {/* Question blocks: title + all related content + BACK TO TOP */}
                        {questions.map((q) => (
                          <div
                            key={q.id}
                            id={anchorId(q.id)}
                            ref={getItemRef(q.id)}
                            className="py-2 scroll-mt-24"
                          >
                            <div className="text-xl font-semibold text-slate-900">
                              <Highlighter query={query}>{q.title}</Highlighter>
                            </div>

                            <div className="mt-2 space-y-3">
                              {q.items.map((block) => (
                                <div key={block.id}>
                                  {renderFaqContent(block, query)}
                                </div>
                              ))}
                            </div>

                            <div className="mt-3">
                              <a
                                href="#faq-top"
                                className="text-sky-700 text-sm font-medium uppercase tracking-wide hover:underline"
                              >
                                BACK TO TOP »
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
