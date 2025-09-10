import React, { useMemo, useRef, useState } from "react";
import { Search, Plus, Minus } from "lucide-react";
import PropTypes from "prop-types";
import Navbar from "../components/Navbar";
import { fetchFAQs } from "../api/FAQApi";

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

/* Render Answer (support text , list , table) 
/* Split text containing \n\n into multiple <p> elements. */

const renderMultilineText = (text, query) => {
  return String(text || "")
    .split(/\n\s*\n/)
    .map((para, i) => (
      <p key={i} className="leading-relaxed">
        <Highlighter query={query}>{para}</Highlighter>
      </p>
    ));
};

const renderAnswer = (answer, query) => {
  if (!answer || typeof answer !== "object") return null;

  switch (answer.type) {
    case "text":
      return (
        <div className="space-y-3">
          {String(answer.content || "")
            .split(/\n\s*\n/)
            .map((para, i) => (
              <p key={i} className="leading-relaxed">
                <Highlighter query={query}>{para}</Highlighter>
              </p>
            ))}
        </div>
      );

    case "list":
      return (
        <div>
          {answer.top_note && (
            <div className="mb-2 space-y-2">
              {renderMultilineText(answer.top_note, query)}
            </div>
          )}

          {answer.title && (
            <div className="font-semibold mb-2">{answer.title}</div>
          )}

          {answer.items && (
            <ul className="list-disc pl-6 space-y-1">
              {answer.items.map((item, i) => (
                <li key={i}>
                  <Highlighter query={query}>{item}</Highlighter>
                </li>
              ))}
            </ul>
          )}

          {answer.links_note && (
            <p className="mt-4 font-semibold">{answer.links_note}</p>
          )}

          {answer.links && (
            <ul className="list-disc pl-6 space-y-1">
              {answer.links.map((link, i) => (
                <li key={i}>
                  <a
                    href={link.url}
                    className="text-sky-700 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          )}

          {answer.bottom_note && (
            <div className="mt-2 space-y-2">
              {renderMultilineText(answer.bottom_note, query)}
            </div>
          )}
        </div>
      );

    case "table":
      return (
        <div className="overflow-x-auto mt-3">
          {answer.top_note && (
            <div className="mb-2 space-y-2">
              {renderMultilineText(answer.top_note, query)}
            </div>
          )}

          {answer.title && (
            <div className="font-semibold mb-2">{answer.title}</div>
          )}

          <table className="w-full table-auto border-collapse overflow-hidden rounded-xl">
            <thead>
              <tr className="bg-slate-50 text-left">
                {answer.columns?.map((col, i) => (
                  <th
                    key={i}
                    className="px-4 py-3 text-slate-600 font-semibold"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {answer.rows?.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  {row.map((cell, j) => (
                    <td key={j} className="px-4 py-3">
                      <Highlighter query={query}>{cell}</Highlighter>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {answer.bottom_note && (
            <div className="mt-2 space-y-2">
              {renderMultilineText(answer.bottom_note, query)}
            </div>
          )}
        </div>
      );

    default:
      return null;
  }
};

/* FAQ Page */
export default function FAQPage() {
  const [query, setQuery] = useState("");
  const [openCats, setOpenCats] = useState(new Set());
  const inputRef = useRef(null);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const itemRefs = useRef({});
  const getItemRef = (id) => {
    if (!itemRefs.current[id]) itemRefs.current[id] = React.createRef();
    return itemRefs.current[id];
  };

  React.useEffect(() => {
    const abort = new AbortController();
    (async () => {
      try {
        setLoading(true);
        setError("");

        const data = await fetchFAQs();

        const normalized = (Array.isArray(data) ? data : []).map((x, i) => {
          let parsedAnswer = null;
          try {
            parsedAnswer =
              typeof x?.answer === "string" ? JSON.parse(x.answer) : x.answer;
          } catch (e) {
            console.error("❌ Failed to parse FAQ answer:", e);
          }

          return {
            id: Number.isFinite(x?.id) ? x.id : i + 1,
            question: String(x?.question ?? ""),
            answer: parsedAnswer,
            category: String(x?.category ?? ""),
            tags: [],
            searchIndex: "",
          };
        });

        const groupedArray = Object.values(
          normalized.reduce((acc, item) => {
            if (!acc[item.category]) {
              acc[item.category] = { category: item.category, items: [] };
            }
            acc[item.category].items.push(item);
            return acc;
          }, {})
        );

        setFaqs(groupedArray);
      } catch (e) {
        if (e.name !== "AbortError") setError("❌ Failed to load FAQs.");
      } finally {
        setLoading(false);
      }
    })();
    return () => abort.abort();
  }, []);

  const indexedGroups = useMemo(() => {
    return faqs.map((g) => ({
      category: g.category,
      items: g.items.map((it) => {
        let answerText = "";
        if (it.answer?.type === "text") {
          answerText = it.answer.content || "";
        } else if (it.answer?.type === "list") {
          answerText =
            (it.answer.title || "") + " " + (it.answer.items || []).join(" ");
        } else if (it.answer?.type === "table") {
          answerText =
            (it.answer.title || "") +
            " " +
            (it.answer.rows || []).map((r) => r.join(" ")).join(" ");
        }

        return {
          ...it,
          __search: [
            it.question,
            it.searchIndex,
            answerText,
            it.category,
            (it.tags || []).join(" "),
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase(),
        };
      }),
    }));
  }, [faqs]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return indexedGroups;
    return indexedGroups
      .map((g) => ({
        category: g.category,
        items: g.items.filter((it) => it.__search.includes(q)),
      }))
      .filter((g) => g.items.length > 0);
  }, [indexedGroups, query]);

  const resultsCount = useMemo(
    () => filtered.reduce((n, g) => n + g.items.length, 0),
    [filtered]
  );

  const toggleCat = (cat) =>
    setOpenCats((prev) => {
      const next = new Set(prev);
      next.has(cat) ? next.delete(cat) : next.add(cat);
      return next;
    });
  const expandAll = () =>
    setOpenCats(
      new Set((query ? filtered : indexedGroups).map((g) => g.category))
    );
  const collapseAll = () => setOpenCats(new Set());

  const jumpToItem = (cat, id) => {
    if (!openCats.has(cat)) {
      setOpenCats((prev) => new Set([...prev, cat]));
      setTimeout(
        () =>
          itemRefs.current[id]?.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          }),
        0
      );
    } else {
      itemRefs.current[id]?.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const anchorId = (id) => `faq-q-${id}`;

  return (
    <div className="bg-white">
      <Navbar />

      <div id="faq-top" className="mx-auto w-full max-w-4xl px-6 py-12" />
      <div className="mx-auto w-full max-w-4xl px-6 py-12">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
          Frequently Asked Questions
        </h1>
        <p className="mt-2 text-slate-500">
          Search the knowledge base and click a question to reveal the answer.
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
              placeholder="Search question here"
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
              {resultsCount} result{resultsCount === 1 ? "" : "s"}
            </span>
          </div>
        </div>

        {/* List */}
        <div className="mt-6 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
          {!loading && !error && resultsCount === 0 && (
            <div className="p-6 text-slate-500">No matching questions.</div>
          )}

          {!loading &&
            !error &&
            (query ? filtered : indexedGroups).map((group) => {
              const isOpen = openCats.has(group.category);
              const contentId = `faq-panel-${slug(group.category)}`;
              const buttonId = `faq-button-${slug(group.category)}`;

              const tocItems =
                faqs.find((g) => g.category === group.category)?.items ||
                group.items;

              const contentItems = query ? group.items : tocItems;

              return (
                <div key={group.category} className="group">
                  <button
                    id={buttonId}
                    aria-controls={contentId}
                    aria-expanded={isOpen}
                    onClick={() => toggleCat(group.category)}
                    className="flex w-full items-center justify-between gap-4 p-5 text-left focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-100"
                  >
                    <span className="text-lg font-semibold text-slate-900">
                      <Highlighter query={query}>
                        {group.category || "Uncategorized"}
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
                      <div className="px-5 pb-5 text-slate-600 space-y-4">
                        {tocItems.length > 0 && (
                          <div className="rounded-xl bg-yellow-50/50 p-4">
                            <div className="font-semibold text-slate-900 mb-2">
                              <Highlighter query={query}>
                                {group.category || "Uncategorized"}
                              </Highlighter>
                            </div>
                            <ul className="list-disc pl-6 space-y-1">
                              {tocItems.map((it) => (
                                <li key={`toc-${it.id}`}>
                                  <a
                                    href={`#${anchorId(it.id)}`}
                                    className="text-sky-700 hover:underline"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      jumpToItem(group.category, it.id);
                                    }}
                                  >
                                    <Highlighter query={query}>
                                      {it.question}
                                    </Highlighter>
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {contentItems.map((it) => (
                          <div
                            key={it.id}
                            id={anchorId(it.id)}
                            ref={getItemRef(it.id)}
                            className="py-2 scroll-mt-24"
                          >
                            <div className="text-xl font-semibold text-slate-900">
                              <Highlighter query={query}>
                                {it.question}
                              </Highlighter>
                            </div>

                            <div className="mt-2">
                              {renderAnswer(it.answer, query)}
                            </div>

                            <div className="mt-3">
                              <a
                                href="#faq-top"
                                className="text-sky-700 text-sm font-medium uppercase tracking-wide hover:underline"
                              >
                                BACK TO TOP»
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
