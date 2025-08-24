import { useMemo, useState } from "react";
import { Search, Plus, Minus } from "lucide-react";
import PropTypes from "prop-types";
import React from "react";

export default function FAQPage() {
  //Save the value modified by users with useState.
  const [query, setQuery] = useState("");
  const [openIds, setOpenIds] = useState(new Set()); //Using set instead of array to ensure ids are not duplicated

  //Use useMemo instead of using array directly,so it doesn't re-render every time.
  const faqs = useMemo(
    () => [
      {
        id: 1,
        question: "Ordering and Payment",
        answer: <OrderingAndPaymentAnswer />,
        tags: ["company", "profile", "about"],
      },
      {
        id: 2,
        question: "Sizes and Fitting",
        answer:
          "Search your institution, select your qualification, choose sizes, add to cart, then pay online. You will receive a confirmation email with pickup details.",
        tags: ["hire", "how to", "guide"],
      },
      {
        id: 3,
        question: "Collection and Return Times",
        answer:
          "We currently accept major credit/debit cards. For group bookings or invoices, please contact Customer Service.",
        tags: ["payment", "cards", "invoice"],
      },
      {
        id: 4,
        question: "What to Wear",
        answer:
          "Yes, changes are possible before the dispatch/pick-up window. Please reply to your confirmation email with your order number.",
        tags: ["order", "change", "cancel"],
      },
    ],
    []
  );

  // Since the list can be changed by when query, we need to define a filter to return updated list.
  const filtered = useMemo(() => {
    //defined with const. Because it is unchangeable from outside unless [faqs, query] has changed
    const q = query.trim().toLowerCase();
    if (!q) return faqs;
    return faqs.filter(
      (f) =>
        `${f.question} ${f.answer} ${(f.tags || []).join(" ")}`
          .toLowerCase()
          .includes(q) //return all the lists that include q
    );
  }, [faqs, query]);

  // Since users can click the plus or minus icon to expand or collapse the content,we need to define a toggle
  const toggleOne = (id) =>
    setOpenIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next; //reset the openIds
    });

  const expandAll = () => setOpenIds(new Set(filtered.map((f) => f.id)));
  const collapseAll = () => setOpenIds(new Set());

  return (
    <div className="bg-white">
      <div id="faq-top" className="mx-auto w-full max-w-4xl px-6 py-12"></div>
      <div className="mx-auto w-full max-w-4xl px-6 py-12">
        {/* Subject */}
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
          Frequently Asked Questions
        </h1>
        <p className="mt-2 text-slate-500">
          Search the knowledge base and click a question to reveal the answer.
        </p>

        {/* Search */}
        <div className="mt-6">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)} //monitor changes on the input
              placeholder="Search question here"
              className="block !w-full max-w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-16 text-slate-900 placeholder-slate-400 shadow-inner focus:outline-none focus:ring-4 focus:ring-sky-100"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
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

        {/* list */}
        <div className="mt-6 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
          {filtered.length === 0 && (
            <div className="p-6 text-slate-500">No matching questions.</div>
          )}

          {filtered.map((item) => {
            const isOpen = openIds.has(item.id); //return a bool value
            const contentId = `faq-panel-${item.id}`;
            const buttonId = `faq-button-${item.id}`;

            return (
              <div key={item.id} className="group">
                {/* Subject Button */}
                <button
                  id={buttonId}
                  aria-controls={contentId}
                  aria-expanded={isOpen}
                  onClick={() => toggleOne(item.id)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-100"
                >
                  <span className="text-lg font-semibold text-slate-900">
                    <Highlighter text={item.question} query={query} />
                  </span>
                  {isOpen ? (
                    <Minus className="h-5 w-5 text-slate-400" />
                  ) : (
                    <Plus className="h-5 w-5 text-slate-400" />
                  )}
                </button>

                {isOpen && (
                  <div id={contentId} role="region" aria-labelledby={buttonId}>
                    <div className="px-5 pb-5 text-slate-600">
                      {typeof item.answer === "string" ? (
                        <Highlighter text={item.answer} query={query} />
                      ) : (
                        item.answer
                      )}
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

/* —— 搜索高亮 —— */
function Highlighter({ text, query }) {
  if (!query) return <>{text}</>;
  const raw = query.trim();
  if (!raw) return <>{text}</>;
  const escaped = raw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`(${escaped})`, "ig");
  const parts = String(text).split(re);
  return (
    <>
      {parts.map((p, i) =>
        p.toLowerCase() === raw.toLowerCase() ? (
          //mark yellow
          <mark key={i} className="rounded bg-yellow-100 px-0.5">
            {p}
          </mark>
        ) : (
          <span key={i}>{p}</span>
        )
      )}
    </>
  );
}

function BackToTopLink() {
  return (
    <a href="#faq-top" className="text-sky-700 hover:underline text-sm">
      BACK TO TOP&raquo;
    </a>
  );
}

function OrderingAndPaymentAnswer() {
  return (
    <div className="space-y-8">
      {/* 目录 */}
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

      {/* How to order */}
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
            <span className="font-medium">Email</span> – Download the order form
            and email it back to us.
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

      {/* Cost to hire */}
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

      {/* Cost to buy */}
      <section id="cost-to-buy" className="scroll-mt-24">
        <h3 className="text-lg font-semibold text-slate-900">Cost to Buy</h3>
        <p className="mt-2 text-slate-600">
          We carry a range of new regalia for sale and also sell ex-hire robes.
          Guide only.
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

      {/* Payment options */}
      <section id="payment-options" className="scroll-mt-24">
        <h3 className="text-lg font-semibold text-slate-900">
          Payment options
        </h3>
        <ul className="mt-2 list-disc ml-5 text-slate-700 space-y-1">
          <li>Visa/MasterCard/Debit Card online at time of ordering</li>
          <li>
            A2A (Account to Account Internet Banking) online at time of ordering
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

      {/* Bonds（& Casual hire 摘要） */}
      <section id="bonds" className="scroll-mt-24">
        <h3 className="text-lg font-semibold text-slate-900">Bonds</h3>
        <p className="mt-2 text-slate-700">
          We will not charge a refundable bond this year. A late return fee may
          apply if robes are not returned on time.
        </p>
        <div className="mt-3">
          <BackToTopLink />
        </div>
      </section>

      {/* 其他小节 */}
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
  );
}

Highlighter.propTypes = {
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  query: PropTypes.string,
};

Highlighter.defaultProps = {
  query: "",
};
