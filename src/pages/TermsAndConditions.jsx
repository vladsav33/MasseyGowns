import React, { useMemo } from "react";
import PropTypes from "prop-types";
import "./TermsAndConditions.css";
import { useCmsContent } from "../api/useCmsContent";

// ---------- helpers ----------
const safeParseJson = (text, fallback) => {
  if (!text) return fallback;
  try {
    const parsed = JSON.parse(text);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
};

// 1) JSON: ["a","b"]  2) multiline: each line one item
const parseList = (text, fallbackArray) => {
  if (!text) return fallbackArray;

  const asJson = safeParseJson(text, null);
  if (Array.isArray(asJson)) return asJson.filter(Boolean);

  const lines = String(text)
    .split(/\r?\n/)
    .map((x) => x.trim())
    .filter(Boolean);

  return lines.length ? lines : fallbackArray;
};

// 1) JSON: [{label,value}]  2) multiline: label|$value
const parseFees = (text, fallbackFees) => {
  if (!text) return fallbackFees;

  const asJson = safeParseJson(text, null);
  if (Array.isArray(asJson)) {
    return asJson
      .map((x) => ({
        label: x?.label ?? "",
        value: x?.value ?? "",
      }))
      .filter((x) => x.label && x.value);
  }

  const lines = String(text)
    .split(/\r?\n/)
    .map((x) => x.trim())
    .filter(Boolean);

  const parsed = lines
    .map((line) => {
      const [label, value] = line.split("|").map((s) => (s ?? "").trim());
      return { label, value };
    })
    .filter((x) => x.label && x.value);

  return parsed.length ? parsed : fallbackFees;
};

function TermsAndConditions({ lastUpdated = "September 2025" }) {
  const { getValue } = useCmsContent();

  const siteEmail =
    getValue("site.email") ||
    getValue("tac.customerService.email") ||
    "info@masseygowns.org.nz";

  const mailHref = useMemo(() => `mailto:${siteEmail}`, [siteEmail]);

  const normalizeEmailText = (text) => {
    if (!text) return "";
    return String(text).replace(
      /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi,
      siteEmail,
    );
  };

  // Turn siteEmail into clickable mailto（orange）
  const renderTextWithEmailLink = (text) => {
    const normalized = normalizeEmailText(text);
    if (!normalized) return null;

    return normalized.split(siteEmail).map((chunk, idx, arr) => (
      <React.Fragment key={idx}>
        {chunk}
        {idx < arr.length - 1 && (
          <a className="tac__email" href={mailHref}>
            {siteEmail}
          </a>
        )}
      </React.Fragment>
    ));
  };

  // CMS content rendering：
  // - blank line => separate paragraph <p>
  // - a bline break within a paragraph => <br/>
  // - email linkify
  const renderRichText = (text) => {
    const normalized = normalizeEmailText(text);
    if (!normalized) return null;

    return normalized
      .trim()
      .split(/\n\s*\n/) // blank lines => paragraphs
      .map((para, idx) => {
        const lines = para.split(/\r?\n/);
        return (
          <p key={idx}>
            {lines.map((line, i) => (
              <React.Fragment key={i}>
                {renderTextWithEmailLink(line)}
                {i < lines.length - 1 && <br />}
              </React.Fragment>
            ))}
          </p>
        );
      });
  };

  // ---------- global ----------
  const tacTitle = getValue("tac.title") || "Terms and Conditions";
  const tacLastUpdated = getValue("tac.lastUpdated") || lastUpdated;

  // ---------- Customer Service ----------
  const csTitle = getValue("tac.customerService.title") || "Customer Service";
  const csText =
    getValue("tac.customerService.text") ||
    `If you have any questions, feedback, or issues with your order, please email Academic Dress Hire (ADH) customer service at ${siteEmail}. Our team will endeavour to respond to your enquiry as soon as possible.`;

  // ---------- Ordering and Paying ----------
  const opTitle = getValue("tac.ordering.title") || "Ordering and Paying";

  const hireTitle = getValue("tac.ordering.hire.title") || "Regalia Hire";
  const hireListDefault = [
    "The hirer who places an order confirms that the wearer is entitled to wear the regalia booked.",
    "Regalia must not be shared with anyone not entitled to wear it.",
    "Once payment is received and confirmed, your order is reserved. All graduation hire stock must be collected during notified periods unless agreed otherwise.",
  ];
  const hireList = parseList(
    getValue("tac.ordering.hire.list"),
    hireListDefault,
  );

  const casualTitle =
    getValue("tac.ordering.casual.title") || "Casual Hire and Sales";
  const casualListDefault = [
    "The hirer who places an order confirms that the wearer is entitled to wear the regalia booked.",
    "After confirmation of payment is made and approved, your Casual Hire or Sales order will ship. No items are considered sold until fully paid for and dispatched.",
  ];
  const casualList = parseList(
    getValue("tac.ordering.casual.list"),
    casualListDefault,
  );

  const overseasTitle =
    getValue("tac.ordering.overseas.title") || "Overseas Hire and Use";
  const overseasText =
    getValue("tac.ordering.overseas.text") ||
    "Hired robes must not be taken out of the country. You must purchase robes if you wish to take them overseas.";

  const payOptionsTitle =
    getValue("tac.ordering.paymentOptions.title") || "Payment Options";
  const payOptionsIntro =
    getValue("tac.ordering.paymentOptions.intro") ||
    "Academic Dress Hire accepts the following payment methods:";
  const payOptionsDefault = [
    "Visa and Mastercard via our secure online payment system",
    "Online bank transfers",
    "Account2Account (A2A)",
    "EFTPOS or cash at our office during business hours (Mon–Thu 9am–3pm outside holiday time; note we do not normally work in January)",
  ];
  const payOptionsList = parseList(
    getValue("tac.ordering.paymentOptions.list"),
    payOptionsDefault,
  );

  const cancelTitle =
    getValue("tac.ordering.cancellation.title") || "Cancellation";
  const cancelText =
    getValue("tac.ordering.cancellation.text") ||
    `We provide a full refund for orders cancelled up to one week prior to graduation. To cancel, email ${siteEmail}.`;

  // ---------- Collection & Returns ----------
  const crTitle =
    getValue("tac.collectionReturns.title") || "Collection & Returns";

  const collectionTitle =
    getValue("tac.collectionReturns.collection.title") || "Collection";
  const collectionText =
    getValue("tac.collectionReturns.collection.text") ||
    "Your order will be available for collection during the 24 hours prior to your ceremony. If your ceremony is on a Monday, there will normally be an uplift opportunity on Saturday.";

  const returnsTitle =
    getValue("tac.collectionReturns.returns.title") || "Returns";
  const returnsDefault = [
    "Regalia must be returned by the deadline on your order receipt email (or as otherwise agreed by ADH). Failure to do so will incur penalty fees.",
    "A casual hire duration is seven days unless an extension is sought and approved.",
    "For graduation hires, the return deadline is normally midday on the day after the last ceremony. If your robes are not returned by the specified deadline, a second hire fee may be invoiced.",
  ];
  const returnsList = parseList(
    getValue("tac.collectionReturns.returns.list"),
    returnsDefault,
  );

  // ---------- Non-Returned & Damaged ----------
  const ndTitle =
    getValue("tac.nonReturned.title") || "Non-Returned and Damaged Regalia";
  const ndIntro =
    getValue("tac.nonReturned.intro") ||
    "If your robes are not returned or are returned damaged, you are liable to pay a replacement fee:";

  const feeDefault = [
    { label: "Gown (Bachelor, Masters & Doctoral)", value: "$255" },
    { label: "Higher Doctoral Gown (Scarlet)", value: "$275" },
    { label: "Trencher", value: "$105" },
    { label: "Bonnet", value: "$115" },
    { label: "Bachelor Hood", value: "$175" },
    { label: "Bachelor Honours Hood with Ribbon", value: "$105" },
    { label: "Masters Hood", value: "$105" },
    { label: "PhD Stole", value: "$120" },
    { label: "Massey Diploma Stole", value: "$110" },
  ];
  const fees = parseFees(getValue("tac.nonReturned.fees"), feeDefault);

  const ndOutro =
    getValue("tac.nonReturned.outro") ||
    "You are also liable for all debt collection charges should the invoice remain unpaid after 30 days.";

  // ---------- Security & Privacy ----------
  const spTitle = getValue("tac.security.title") || "Security & Privacy";
  const spDefault = [
    "Information is collected only as necessary to process your hire or purchase and to contact you regarding your order.",
    "By placing your order, you agree that your details may be shared between your learning institution and Academic Dress Hire to ensure you receive the correct regalia for the correct graduation.",
    "Payments are processed via a secure payment gateway operated by BNZ. Our Windcave payment security system encodes your credit card and contact details to ensure their safe transfer.",
    "We will not divulge or sell your name to third parties other than your learning institution without prior consent and knowledge.",
    "We may contact you by email about promotions. You may unsubscribe at any time.",
  ];
  const spList = parseList(getValue("tac.security.list"), spDefault);

  // ---------- Shipping ----------
  const shipTitle = getValue("tac.shipping.title") || "Shipping Information";

  const shipOverviewTitle =
    getValue("tac.shipping.overview.title") || "Overview";
  const shipOverviewDefault = [
    "All Casual Hire & Sale orders are shipped by courier. We aim to send orders within 3–5 business days of receiving payment.",
    "Delivery to New Zealand addresses typically takes up to 3 business days after dispatch.",
    "During peak seasonal dates (particularly Nov/Dec), delivery time frames are longer. In general, we are closed in January.",
  ];
  const shipOverviewList = parseList(
    getValue("tac.shipping.overview.list"),
    shipOverviewDefault,
  );

  const shipCostsTitle =
    getValue("tac.shipping.costs.title") || "Shipping Costs";
  const shipCostsDefault = [
    "We operate a flat-rate shipping & handling fee shown at checkout. Rural deliveries incur extra charges.",
    "Additional postage charges may apply if your order needs to be split into separate parcels due to size/weight.",
  ];
  const shipCostsList = parseList(
    getValue("tac.shipping.costs.list"),
    shipCostsDefault,
  );

  const shipNewTitle =
    getValue("tac.shipping.newRegalia.title") || "Shipping — New Regalia";
  const shipNewText =
    getValue("tac.shipping.newRegalia.text") ||
    "Once payment is received and confirmed, your order will be picked, packed, and labelled for courier collection.";

  const deliveriesTitle =
    getValue("tac.shipping.deliveries.title") || "Deliveries";
  const deliveriesDefault = [
    "Couriers typically deliver within 1–5 days (2–3 days for major metropolitan areas).",
    "Please provide an address where someone will be available to sign for the parcel on weekdays. We do not deliver at weekends.",
  ];
  const deliveriesList = parseList(
    getValue("tac.shipping.deliveries.list"),
    deliveriesDefault,
  );

  // ---------- Stock Control ----------
  const stockTitle = getValue("tac.stock.title") || "Stock Control";
  const stockText =
    getValue("tac.stock.text") ||
    "We make every effort to ensure that all products ordered are in stock. Some purchases may require regalia to be made; this can take up to four weeks.";

  // ---------- Returns Policy on Purchases ----------
  const rpTitle =
    getValue("tac.returnsPolicy.title") || "Returns Policy on Purchases";

  const rpRaw = getValue("tac.returnsPolicy.list");
  const rpDefault = [
    "Please choose carefully. We provide a full refund, less postage, where the size is wrong or the product is damaged.",
    "Exchanges must be returned and exchanged within 10 working days of the original purchase date.",
    "An administration fee may be applied on returned purchases if you have changed your mind about owning regalia.",
    `If goods are faulty in any way, contact us immediately at ${siteEmail}.`,
    "All other return postage is at the customer’s expense.",
  ];
  const rpList = parseList(rpRaw, rpDefault);

  const addressName =
    getValue("tac.returnsPolicy.address.name") || "Academic Dress Hire";
  const addressLinesDefault = [
    "Refectory Road",
    "Massey University",
    "Tennent Drive",
    "Palmerston North 4474",
  ];
  const addressLines = parseList(
    getValue("tac.returnsPolicy.address.lines"),
    addressLinesDefault,
  );

  // ---------- Colour on the Internet ----------
  const colorTitle = getValue("tac.colour.title") || "Colour on the Internet";
  const colorText =
    getValue("tac.colour.text") ||
    "While we aim to represent product colours as accurately as possible, different screens may show slight variations. If you are unsure about a garment colour, please enquire before purchasing.";

  // ---------- Dispute ----------
  const disputeTitle = getValue("tac.dispute.title") || "Dispute";
  const disputeText =
    getValue("tac.dispute.text") ||
    "Where a dispute arises out of the hire and/or return of regalia, you agree to advise Academic Dress Hire within seven days of it occurring. If we are unable to resolve the dispute together, Academic Dress Hire may refer the matter to the Disputes Tribunal for resolution.";

  // ---------- Loss or Damage to Hirers Clothing ----------
  const ldcTitle =
    getValue("tac.lossDamageClothing.title") ||
    "Loss or Damage to Hirer’s Clothing";
  const ldcText =
    getValue("tac.lossDamageClothing.text") ||
    "While ADH will use best efforts to ensure that hired regalia will not cause loss or damage to the hirer’s clothing, ADH is not liable for any such loss or damage of any kind, whether arising directly or indirectly out of the hire.";

  // ---------- Force Majeure ----------
  const fmTitle = getValue("tac.forceMajeure.title") || "Force Majeure";
  const fmText =
    getValue("tac.forceMajeure.text") ||
    "In any case beyond the control of Academic Dress Hire (including but not limited to any order of government or other authority, strike, lockout, labour dispute, delays in transit, difficulty in procuring components, embargo, accident, emergency, act of God, or other contingency) that interferes with delivery or performance, ADH may, at its sole discretion, suspend performance of any obligation or cancel without liability to the buyer.";

  // ---------- Additional Terms ----------
  const atTitle =
    getValue("tac.additionalTerms.title") || "Additional Terms and Conditions";

  const atIntro =
    getValue("tac.additionalTerms.intro") ||
    "By accepting the regalia, you agree to the Terms and Conditions of ACADEMIC DRESS HIRE and acknowledge that you have inspected the regalia and are satisfied with the condition that the regalia is in.";

  const atLead =
    getValue("tac.additionalTerms.lead") ||
    "ACADEMIC DRESS HIRE agrees to lease the property to the HIRER on the following terms and conditions:";

  const atDefault = [
    "The HIRER acknowledges that in any case of default of these terms and conditions ACADEMIC DRESS HIRE may require the services of a debt collection agency at the Hirer's cost.",
    "The property that the HIRER takes possession of is owned by ACADEMIC DRESS HIRE.",
    "The HIRER has examined the property and acknowledges that the property is received in good condition and is safe and suitable for its intended use.",
    "ACADEMIC DRESS HIRE will not be liable in any way in respect of any claim made against the HIRER for any damage caused by the Hirer's use of the property.",
    "ACADEMIC DRESS HIRE will not be liable to the HIRER or any third party for any damage or loss resulting from any defect, failure, or breakdown in the property from any cause. Such cause presumes an absence of any negligence on the part of ACADEMIC DRESS HIRE.",
    "The HIRER agrees to return the property to ACADEMIC DRESS HIRE in the same condition as received, fair wear and tear accepted, on the return date advised at the time of hire. Unless the invoice/contract is amended to state otherwise, the HIRER will return the property to ACADEMIC DRESS HIRE at its premises noted in the invoice/contract.",
    "ACADEMIC DRESS HIRE reserves the right to demand immediate return of the property on any breach of these terms and conditions.",
    "ACADEMIC DRESS HIRE reserves the right to charge additional hire time if the property is not returned by the specified date.",
    "The HIRER agrees not to use the property in violation of any law, statute, or regulation. The laws of New Zealand apply.",
    "The HIRER agrees to pay ACADEMIC DRESS HIRE the fee, and a bond if that applies, by the due date set out in the invoice/contract.",
    "The HIRER agrees that he or she will retain possession and control of the property throughout the period of hire.",
    "The HIRER agrees that he or she is liable to ACADEMIC DRESS HIRE for any loss of property, or part of the property, and may be required to meet the replacement cost of the property.",
    "ACADEMIC DRESS HIRE reserves the right to retain a cancellation fee on any cancelled bookings.",
    "We are unable to refund any donations made with the hire.",
  ];
  const atList = parseList(getValue("tac.additionalTerms.list"), atDefault);

  const atOutro =
    getValue("tac.additionalTerms.outro") ||
    `We reserve the right to alter and/or add to our hire terms and conditions as required. Any amendments to our terms and conditions will be posted on our website and will be effective immediately upon the posting of those terms and conditions on our website. The hirer is responsible for ensuring that they are aware of the latest terms and conditions and that hire of any items is an acknowledgement by the hirer of our terms and conditions as amended.

The terms and conditions on this website are the terms on which ACADEMIC DRESS HIRE offers the hire of regalia. In hiring any items of regalia the hirer accepts these terms and conditions. If the hirer does not accept these terms and conditions they must not proceed with the hire.`;

  return (
    <div className="tac">
      <header className="tac__header">
        <h1 className="tac__title">{tacTitle}</h1>
        <p className="tac__updated">Last updated: {tacLastUpdated}</p>
      </header>

      <section
        className="tac__section tac__section--major"
        id="customer-service"
      >
        <h2>{csTitle}</h2>
        {renderRichText(csText)}
      </section>

      <section
        className="tac__section tac__section--major"
        id="ordering-paying"
      >
        <h2>{opTitle}</h2>

        <h3>{hireTitle}</h3>
        <ul>
          {hireList.map((item, i) => (
            <li key={i}>{renderTextWithEmailLink(item)}</li>
          ))}
        </ul>

        <h3>{casualTitle}</h3>
        <ul>
          {casualList.map((item, i) => (
            <li key={i}>{renderTextWithEmailLink(item)}</li>
          ))}
        </ul>

        <h3>{overseasTitle}</h3>
        {renderRichText(overseasText)}

        <h3>{payOptionsTitle}</h3>
        {renderRichText(payOptionsIntro)}
        <ul>
          {payOptionsList.map((item, i) => (
            <li key={i}>{renderTextWithEmailLink(item)}</li>
          ))}
        </ul>

        <h3>{cancelTitle}</h3>
        {renderRichText(cancelText)}
      </section>

      <section
        className="tac__section tac__section--major"
        id="collection-returns"
      >
        <h2>{crTitle}</h2>

        <h3>{collectionTitle}</h3>
        {renderRichText(collectionText)}

        <h3>{returnsTitle}</h3>
        <ul>
          {returnsList.map((item, i) => (
            <li key={i}>{renderTextWithEmailLink(item)}</li>
          ))}
        </ul>
      </section>

      {/* Non-Returned... NOT major */}
      <section className="tac__section" id="non-returned-damaged">
        <h2>{ndTitle}</h2>
        {renderRichText(ndIntro)}

        <ul className="tac__arrowList">
          {fees.map((f, i) => (
            <li key={i}>
              <strong>{f.value}</strong> per {f.label}
            </li>
          ))}
        </ul>

        {renderRichText(ndOutro)}
      </section>

      <section
        className="tac__section tac__section--major"
        id="security-privacy"
      >
        <h2>{spTitle}</h2>
        <ul>
          {spList.map((item, i) => (
            <li key={i}>{renderTextWithEmailLink(item)}</li>
          ))}
        </ul>
      </section>

      <section className="tac__section tac__section--major" id="shipping">
        <h2>{shipTitle}</h2>

        <h3>{shipOverviewTitle}</h3>
        <ul>
          {shipOverviewList.map((item, i) => (
            <li key={i}>{renderTextWithEmailLink(item)}</li>
          ))}
        </ul>

        <h3>{shipCostsTitle}</h3>
        <ul>
          {shipCostsList.map((item, i) => (
            <li key={i}>{renderTextWithEmailLink(item)}</li>
          ))}
        </ul>

        <h3>{shipNewTitle}</h3>
        {renderRichText(shipNewText)}

        <h3>{deliveriesTitle}</h3>
        <ul>
          {deliveriesList.map((item, i) => (
            <li key={i}>{renderTextWithEmailLink(item)}</li>
          ))}
        </ul>
      </section>

      <section className="tac__section tac__section--major" id="stock-control">
        <h2>{stockTitle}</h2>
        {renderRichText(stockText)}
      </section>

      <section className="tac__section tac__section--major" id="returns-policy">
        <h2>{rpTitle}</h2>

        {/* Treat blank lines as separate paragraph breaks, or render it as a list */}
        {rpRaw && /\n\s*\n/.test(String(rpRaw)) ? (
          renderRichText(rpRaw)
        ) : (
          <ul>
            {rpList.map((item, i) => (
              <li key={i}>{renderTextWithEmailLink(item)}</li>
            ))}
          </ul>
        )}

        <address className="tac__address">
          <strong>{addressName}</strong>
          <br />
          {addressLines.map((line, i) => (
            <React.Fragment key={i}>
              {line}
              <br />
            </React.Fragment>
          ))}
        </address>
      </section>

      <section
        className="tac__section tac__section--major"
        id="colour-on-the-internet"
      >
        <h2>{colorTitle}</h2>
        {renderRichText(colorText)}
      </section>

      <section className="tac__section tac__section--major" id="dispute">
        <h2>{disputeTitle}</h2>
        {renderRichText(disputeText)}
      </section>

      <section
        className="tac__section tac__section--major"
        id="loss-damage-clothing"
      >
        <h2>{ldcTitle}</h2>
        {renderRichText(ldcText)}
      </section>

      <section className="tac__section tac__section--major" id="force-majeure">
        <h2>{fmTitle}</h2>
        {renderRichText(fmText)}
      </section>

      <section
        className="tac__section tac__section--major tac__section--caps"
        id="additional-terms"
      >
        <h2>{atTitle}</h2>

        <div className="tac__small">{renderRichText(atIntro)}</div>

        {renderRichText(atLead)}

        <ul className="tac__arrowList">
          {atList.map((item, i) => (
            <li key={i}>{renderTextWithEmailLink(item)}</li>
          ))}
        </ul>

        {renderRichText(atOutro)}
      </section>
    </div>
  );
}

TermsAndConditions.propTypes = {
  lastUpdated: PropTypes.string,
};

export default TermsAndConditions;
