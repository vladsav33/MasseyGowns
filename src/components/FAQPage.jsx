import React, { useMemo, useRef, useState } from "react";
import { Search, Plus, Minus } from "lucide-react";
import PropTypes from "prop-types";
import Navbar from "../components/Navbar";

import { fetchFAQs } from "../api/FAQApi";

/* ---------- Transform node to text ---------- */
const nodeToText = (node) => {
  if (node == null || typeof node === "boolean") return ""; //首层是空
  if (typeof node === "string" || typeof node === "number") return String(node); //节点的类型，不是节点里type的类型；首层是字符串

  if (Array.isArray(node)) return node.map(nodeToText).join(" "); //首层是数组

  if (React.isValidElement(node)) {
    //
    const t = node.type;

    // 原生标签：递归 children
    if (typeof t === "string") return nodeToText(node.props?.children); //首层是嵌套原生标签；如果节点的type是字符串的话，就取里面的元素

    // 函数组件：既取 searchText，又尝试渲染抓真实文本；首层是函数
    if (typeof t === "function") {
      let out = "";
      if (t.searchText) out += " " + String(t.searchText);

      try {
        // 不改原 props；给 Highlighter 不传 query，它会原样返回 children
        const rendered = t(node.props || {});
        out += " " + nodeToText(rendered);
      } catch {
        // 如果组件使用了 hooks/上下文渲染失败，就只用 searchText
      }
      return out.trim();
    }

    // 其它类型（Fragment/memo/forwardRef 等）：继续下钻 children
    return nodeToText(node.props?.children);
  }

  return "";
};

/* ---------- 递归高亮：在任何 JSX 结构中高亮文本 ---------- */
function Highlighter({ children, query, exclude = ["code", "pre"] }) {
  if (!query || !String(query).trim()) return <>{children}</>;

  //构造安全正则
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
      const nextChildren = React.Children.map(node.props.children, visit); //就在这里用node.props.children层层剥开
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

/* ---------- 小工具：把答案渲染成带高亮的 JSX（支持字符串/函数组件） ---------- */
const renderAnswer = (answer, query) => {
  if (typeof answer === "string") {
    return <Highlighter query={query}>{answer}</Highlighter>;
  }
  if (React.isValidElement(answer)) {
    // 把查询词下发给函数组件，由其内部负责高亮
    return React.cloneElement(answer, { highlightQuery: query }); //answer is OrderingAndPaymentAnswer
  }
  return answer;
};

/* ---------- 仅用于“返回顶部”的链接 ---------- */
{
  /*function BackToTopLink() {
  return (
    <a href="#faq-top" className="text-sky-700 hover:underline text-sm">
      BACK TO TOP&raquo;
    </a>
  );
}*/
}

/* ---------- 富文本答案组件（接收 highlightQuery 并在内部高亮） ---------- */
{
  /*
function OrderingAndPaymentAnswer({ highlightQuery }) {
  return (
    <Highlighter query={highlightQuery}>
      <div className="space-y-8">
        <section className="text-sky-700">
          <ul className="list-disc ml-5 space-y-1">
            <li>
              <a href="#how-to-order" className="hover:underline">
                How to order
              </a>
            </li>
            <li>
              <a href="#cost-to-hire" className="hover:underline">
                Cost to hire
              </a>
            </li>
            <li>
              <a href="#cost-to-buy" className="hover:underline">
                Cost to buy
              </a>
            </li>
            <li>
              <a href="#payment-options" className="hover:underline">
                Payment options
              </a>
            </li>
            <li>
              <a href="#bonds" className="hover:underline">
                Bonds
              </a>
            </li>
            <li>
              <a href="#payment-collecting" className="hover:underline">
                Payment when collecting regalia
              </a>
            </li>
            <li>
              <a href="#combine" className="hover:underline">
                Combining hire &amp; purchase of regalia
              </a>
            </li>
          </ul>
        </section>

     
        <section id="how-to-order" className="scroll-mt-24">
          <h3 className="text-lg font-semibold text-slate-900">How to order</h3>
          <p className="mt-2 text-slate-600">
            We recognise that customers have different approaches, so there are
            several ways to order. Please select the one that suits you best.
          </p>
          <ul className="mt-3 space-y-1 text-slate-700">
            <li>
              <span className="font-medium">Online</span> – Preferred method.
              Start on the home page or choose{" "}
              <a className="text-sky-700 hover:underline" href="/hire">
                Hire Regalia
              </a>
              .
            </li>
            <li>
              <span className="font-medium">Email</span> – Download the order
              form and email it back to us.
            </li>
            <li>
              <span className="font-medium">Office</span> – Order in person at
              Academic Dress Hire, Refectory Road, Massey University.
            </li>
            <li>
              <span className="font-medium">Telephone</span> – Call 06 350 4166.
            </li>
          </ul>
          <div className="mt-3">
            <BackToTopLink />
          </div>
        </section>

        
        <section id="cost-to-hire" className="scroll-mt-24">
          <h3 className="text-lg font-semibold text-slate-900">Cost to Hire</h3>
          <p className="mt-2 text-slate-600">
            Prices below are a general guide; each institution has slightly
            different sets and trims.
          </p>
          <div className="mt-3 overflow-x-auto rounded-xl border border-slate-200">
            <table className="min-w-[640px] w-full text-left text-slate-700">
              <thead className="bg-slate-50 text-slate-500 text-sm">
                <tr>
                  <th className="px-4 py-2">Qualification Type</th>
                  <th className="px-4 py-2">Hire Price</th>
                </tr>
              </thead>
              <tbody className="[&_tr:nth-child(even)]:bg-slate-50/60">
                {[
                  ["Certificate (Bachelor Gown)", "$48.00"],
                  ["Diploma (Gown & Stole)", "$68.00"],
                  ["Bachelor Degree (Gown, Hood, Trencher)", "$88.00"],
                  [
                    "Graduate Diploma/Certificate – No Previous Degree (Gown, Stole)",
                    "$68.00",
                  ],
                  [
                    "Graduate Diploma/Certificate – With Previous Degree (Gown, Stole or Hood, Trencher)",
                    "$88.00",
                  ],
                  [
                    "Post Grad Diploma/Certificate – No Previous Degree (Gown, Hood, Trencher)",
                    "$88.00",
                  ],
                  [
                    "Post Grad Diploma/Certificate – With Previous Degree (Gown, Hood, Trencher)",
                    "$88.00",
                  ],
                  ["Masters Degree (Masters Gown, Hood, Trencher)", "$88.00"],
                  [
                    "PhD Degree (PhD Gown, PhD Hood/Stole Facing, Bonnet)",
                    "$88.00",
                  ],
                  ["Doctoral Degree (Doctoral Gown, Hood, Bonnet)", "$88.00"],
                ].map(([name, price]) => (
                  <tr key={name}>
                    <td className="px-4 py-2">{name}</td>
                    <td className="px-4 py-2">{price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3">
            <BackToTopLink />
          </div>
        </section>

    
        <section id="cost-to-buy" className="scroll-mt-24">
          <h3 className="text-lg font-semibold text-slate-900">Cost to Buy</h3>
          <p className="mt-2 text-slate-600">
            We carry a range of new regalia for sale and also sell ex-hire
            robes. Guide only.
          </p>
          <div className="mt-3 overflow-x-auto rounded-xl border border-slate-200">
            <table className="min-w-[640px] w-full text-left text-slate-700">
              <thead className="bg-slate-50 text-slate-500 text-sm">
                <tr>
                  <th className="px-4 py-2">Item</th>
                  <th className="px-4 py-2">Price</th>
                  <th className="px-4 py-2">Availability</th>
                </tr>
              </thead>
              <tbody className="[&_tr:nth-child(even)]:bg-slate-50/60">
                {[
                  ["Bachelor Gown", "$390", "Contact us"],
                  ["Masters Gown", "$390", "Contact us"],
                  ["PhD/Doctoral Gown", "$420", "Contact us"],
                  ["Scarlet Gown", "$420", "Contact us"],
                  ["Bachelor Hood", "$240", "Contact us"],
                  ["Bachelor Hood with Ribbon", "$160", "Contact us"],
                  ["Masters Hood", "$135", "Contact us"],
                  ["PhD Hood/Stole Facings", "$180", "Contact us"],
                  ["Tudor Bonnet", "$220", "Contact us"],
                  ["Trencher", "$220", "Contact us"],
                  ["PhD Set (Hood, Gown, Bonnet)", "$800", "Contact us"],
                ].map(([item, price, avail]) => (
                  <tr key={item}>
                    <td className="px-4 py-2">{item}</td>
                    <td className="px-4 py-2">{price}</td>
                    <td className="px-4 py-2">{avail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3">
            <BackToTopLink />
          </div>
        </section>

 
        <section id="payment-options" className="scroll-mt-24">
          <h3 className="text-lg font-semibold text-slate-900">
            Payment options
          </h3>
          <ul className="mt-2 list-disc ml-5 text-slate-700 space-y-1">
            <li>Visa/MasterCard/Debit Card online at time of ordering</li>
            <li>
              A2A (Account to Account Internet Banking) online at time of
              ordering
            </li>
            <li>Internet Banking</li>
            <li>Eftpos, cash or card in our office on Refectory Road</li>
          </ul>
          <p className="mt-2 text-slate-600">
            All orders are confirmed by email with collection/return details.
          </p>
          <div className="mt-3">
            <BackToTopLink />
          </div>
        </section>


        <section id="bonds" className="scroll-mt-24">
          <h3 className="text-lg font-semibold text-slate-900">Bonds</h3>
          <p className="mt-2 text-slate-700">
            We will not charge a refundable bond this year. A late return fee
            may apply if robes are not returned on time.
          </p>
          <div className="mt-3">
            <BackToTopLink />
          </div>
        </section>

     
        <section id="payment-collecting" className="scroll-mt-24">
          <h3 className="text-lg font-semibold text-slate-900">
            Payment when collecting regalia
          </h3>
          <p className="mt-2 text-slate-700">
            Payment must be made when ordering; we can’t accept payment on
            collection.
          </p>
          <div className="mt-3">
            <BackToTopLink />
          </div>
        </section>

        <section id="combine" className="scroll-mt-24">
          <h3 className="text-lg font-semibold text-slate-900">
            Combining hire &amp; purchase
          </h3>
          <p className="mt-2 text-slate-700">
            If you’re considering buying your regalia, you can hire first and
            discuss purchase at collection.
          </p>
          <div className="mt-3">
            <BackToTopLink />
          </div>
        </section>
      </div>
    </Highlighter>
  );
}

OrderingAndPaymentAnswer.propTypes = {
  highlightQuery: PropTypes.string,
};*/
}

/* 仅用于搜索过滤的摘要（不会展示）OrderingAndPaymentAnswer.searchText = `
How to order: online, email, office, telephone.
Cost to hire: Certificate $48, Diploma $68, Bachelor $88, Masters $88, PhD $88, Doctoral $88.
Cost to buy: Bachelor Gown $390, Masters $390, Doctoral $420, Hood $240, Trencher $220, PhD Set $800...
Payment options: Visa, MasterCard, Debit, A2A, Internet banking, Eftpos, cash.
Bonds: no refundable bond this year; late return fee.
Payment when collecting: prepaid only.
Combining: hire first, discuss purchase at collection.
`; */

/* ---------- 页面主体 ---------- */
export default function FAQPage() {
  const [query, setQuery] = useState("");
  const [openIds, setOpenIds] = useState(new Set());
  const inputRef = useRef(null);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  React.useEffect(() => {
    const abort = new AbortController();

    (async () => {
      try {
        setLoading(true);
        setError("");
        const data = await fetchFAQs();

        // 归一化（防止后端字段缺失导致崩溃）
        const normalized = (Array.isArray(data) ? data : []).map((x, i) => ({
          id: Number.isFinite(x?.id) ? x.id : i + 1,
          question: String(x?.question ?? ""),
          answer: String(x?.answer ?? ""),
          tags: [], // 后端没给就先留空
          searchIndex: "",
        }));

        setFaqs(normalized);
      } catch (e) {
        if (e.name !== "AbortError") setError("❌ Failed to load FAQs.");
      } finally {
        setLoading(false);
      }
    })();

    return () => abort.abort();
  }, []);

  // 数据源：允许字符串或函数组件作为 answer
  {
    /*
    const faqs = useMemo(
    () => [
      {
        id: 1,
        question: "Ordering and Payment",
        answer: <OrderingAndPaymentAnswer />,
        searchIndex:
          "how to order ordering order form in person telephone phone call email office counter pickup pay on ordering prepaid payment options visa mastercard debit a2a internet banking eftpos cash bond late fee return combining hire purchase cost price fees",
        tags: ["company", "profile", "about"],
      },
      {
        id: 2,
        question: "Sizes and Fitting",
        answer:
          "Search your institution, select your qualification, choose sizes, add to cart, then pay online. You will receive a confirmation email with pickup details.",
        searchIndex:
          "size chart sizing fit try on measurements on-site fitting gown hood trencher",
        tags: ["hire", "how to", "guide"],
      },
      {
        id: 3,
        question: "Collection and Return Times",
        answer:
          "We currently accept major credit/debit cards. For group bookings or invoices, please contact Customer Service.",
        searchIndex:
          "collection pickup return dropoff due date late return fee invoice group booking",
        tags: ["payment", "cards", "invoice"],
      },
      {
        id: 4,
        question: "What to Wear",
        answer:
          "Yes, changes are possible before the dispatch/pick-up window. Please reply to your confirmation email with your order number.",
        searchIndex:
          "dress code attire what to wear under gown clothing shoes hat bonnet hood",
        tags: ["order", "change", "cancel"],
      },
    ],
    []
  );*/
  }

  // 生成“可检索索引”
  const indexedFaqs = useMemo(() => {
    return faqs.map((f) => {
      const searchable = [
        f.question,
        f.searchIndex, //
        nodeToText(f.answer), //
        (f.tags || []).join(" "),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return { ...f, __search: searchable };
    });
  }, [faqs]);

  // 过滤（用索引，能命中 JSX 内文本）
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return indexedFaqs;
    return indexedFaqs.filter((f) => f.__search.includes(q));
  }, [indexedFaqs, query]);

  // 展开折叠
  const toggleOne = (id) =>
    setOpenIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  const expandAll = () => setOpenIds(new Set(filtered.map((f) => f.id)));
  const collapseAll = () => setOpenIds(new Set());

  return (
    <div className="bg-white">
      <Navbar />
      <div id="faq-top" className="mx-auto w-full max-w-4xl px-6 py-12"></div>
      <div className="mx-auto w-full max-w-4xl px-6 py-12">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
          Frequently Asked Questions
        </h1>
        <p className="mt-2 text-slate-500">
          Search the knowledge base and click a question to reveal the answer.
        </p>

        {/* 搜索 */}
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
              {filtered.length} result{filtered.length === 1 ? "" : "s"}
            </span>
          </div>
        </div>

        {loading && <div className="mt-6 text-slate-500">Loading FAQs…</div>}
        {!loading && error && <div className="mt-6 text-rose-600">{error}</div>}

        {/* 列表 */}
        <div className="mt-6 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
          {!loading && !error && filtered.length === 0 && (
            <div className="p-6 text-slate-500">No matching questions.</div>
          )}

          {!loading &&
            !error &&
            filtered.map((item) => {
              const isOpen = openIds.has(item.id);
              const contentId = `faq-panel-${item.id}`;
              const buttonId = `faq-button-${item.id}`;

              return (
                <div key={item.id} className="group">
                  <button
                    id={buttonId}
                    aria-controls={contentId}
                    aria-expanded={isOpen}
                    onClick={() => toggleOne(item.id)}
                    className="flex w-full items-center justify-between gap-4 p-5 text-left focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-100"
                  >
                    <span className="text-lg font-semibold text-slate-900">
                      <Highlighter query={query}>{item.question}</Highlighter>
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

                  {/* Answers */}
                  {isOpen && (
                    <div
                      id={contentId}
                      role="region"
                      aria-labelledby={buttonId}
                    >
                      <div className="px-5 pb-5 text-slate-600">
                        {renderAnswer(item.answer, query)}

                        {item.tags?.length ? (
                          <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
                            {item.tags.map((t) => (
                              <span
                                key={t}
                                className="rounded-full border border-slate-200 px-2 py-0.5"
                              >
                                #{t}
                              </span>
                            ))}
                          </div>
                        ) : null}
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
