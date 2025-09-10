import React from "react";
import "./TermsAndConditions.css";

function TermsAndConditions({ lastUpdated = "September 2025" }) {
  return (
    <div className="tac">
      <header className="tac__header">
        <h1 className="tac__title">Terms and Conditions</h1>
        <p className="tac__updated">Last updated: {lastUpdated}</p>
      </header>

      {/* Customer Service */}
      <section className="tac__section" id="customer-service">
        <h2>Customer Service</h2>
        <p>
          If you have any questions, feedback, or issues with your order, please
          email Academic Dress Hire (ADH) customer service at{" "}
          <a href="mailto:info@masseygowns.org.nz">info@masseygowns.org.nz</a>.
          Our team will endeavour to respond to your enquiry as soon as possible.
        </p>
      </section>

      {/* Ordering and Paying */}
      <section className="tac__section" id="ordering-paying">
        <h2>Ordering and Paying</h2>

        <h3>Regalia Hire</h3>
        <ul>
          <li>
            The hirer who places an order confirms that the wearer is entitled to
            wear the regalia booked.
          </li>
          <li>Regalia must not be shared with anyone not entitled to wear it.</li>
          <li>
            Once payment is received and confirmed, your order is reserved. All
            graduation hire stock must be collected during notified periods unless
            agreed otherwise.
          </li>
        </ul>

        <h3>Casual Hire and Sales</h3>
        <ul>
          <li>
            The hirer who places an order confirms that the wearer is entitled to
            wear the regalia booked.
          </li>
          <li>
            After confirmation of payment is made and approved, your Casual Hire
            or Sales order will ship. No items are considered sold until fully
            paid for and dispatched.
          </li>
        </ul>

        <h3>Overseas Hire and Use</h3>
        <p>
          Hired robes must not be taken out of the country. You must purchase
          robes if you wish to take them overseas.
        </p>

        <h3>Payment Options</h3>
        <p>Academic Dress Hire accepts the following payment methods:</p>
        <ul>
          <li>Visa and Mastercard via our secure online payment system</li>
          <li>Online bank transfers</li>
          <li>Account2Account (A2A)</li>
          <li>
            EFTPOS or cash at our office during business hours (Mon–Thu 9am–3pm
            outside holiday time; note we do not normally work in January)
          </li>
        </ul>

        <h3>Cancellation</h3>
        <p>
          We provide a full refund for orders cancelled up to one week prior to
          graduation. To cancel, email{" "}
          <a href="mailto:info@masseygowns.org.nz">info@masseygowns.org.nz</a>.
        </p>
      </section>

      {/* Collection & Returns */}
      <section className="tac__section" id="collection-returns">
        <h2>Collection & Returns</h2>

        <h3>Collection</h3>
        <p>
          Your order will be available for collection during the 24 hours prior
          to your ceremony. If your ceremony is on a Monday, there will normally
          be an uplift opportunity on Saturday.
        </p>

        <h3>Returns</h3>
        <ul>
          <li>
            Regalia must be returned by the deadline on your order receipt email
            (or as otherwise agreed by ADH). Failure to do so will incur penalty
            fees.
          </li>
          <li>
            A casual hire duration is seven days unless an extension is sought
            and approved.
          </li>
          <li>
            For graduation hires, the return deadline is normally midday on the
            day after the last ceremony. If your robes are not returned by the
            specified deadline, a second hire fee may be invoiced.
          </li>
        </ul>
      </section>

      {/* Non-Returned & Damaged */}
      <section className="tac__section" id="non-returned-damaged">
        <h2>Non-Returned and Damaged Regalia</h2>
        <p>If your robes are not returned or are returned damaged, you are liable to pay a replacement fee:</p>
        <dl className="tac__fees">
          <div><dt>Gown (Bachelor, Masters & Doctoral)</dt><dd>$255</dd></div>
          <div><dt>Higher Doctoral Gown (Scarlet)</dt><dd>$275</dd></div>
          <div><dt>Trencher</dt><dd>$105</dd></div>
          <div><dt>Bonnet</dt><dd>$115</dd></div>
          <div><dt>Bachelor Hood</dt><dd>$175</dd></div>
          <div><dt>Bachelor Honours Hood with Ribbon</dt><dd>$105</dd></div>
          <div><dt>Masters Hood</dt><dd>$105</dd></div>
          <div><dt>PhD Stole</dt><dd>$120</dd></div>
          <div><dt>Massey Diploma Stole</dt><dd>$110</dd></div>
        </dl>
        <p>
          You are also liable for all debt collection charges should the invoice
          remain unpaid after 30 days.
        </p>
      </section>

      {/* Security & Privacy */}
      <section className="tac__section" id="security-privacy">
        <h2>Security & Privacy</h2>
        <ul>
          <li>
            Information is collected only as necessary to process your hire or
            purchase and to contact you regarding your order.
          </li>
          <li>
            By placing your order, you agree that your details may be shared
            between your learning institution and Academic Dress Hire to ensure
            you receive the correct regalia for the correct graduation.
          </li>
          <li>
            Payments are processed via a secure payment gateway operated by BNZ.
            Our Windcave payment security system encodes your credit card and
            contact details to ensure their safe transfer.
          </li>
          <li>
            We will not divulge or sell your name to third parties other than
            your learning institution without prior consent and knowledge.
          </li>
          <li>
            We may contact you by email about promotions. You may unsubscribe at
            any time.
          </li>
        </ul>
      </section>

      {/* Shipping */}
      <section className="tac__section" id="shipping">
        <h2>Shipping Information</h2>

        <h3>Overview</h3>
        <ul>
          <li>
            All Casual Hire &amp; Sale orders are shipped by courier. We aim to
            send orders within 3–5 business days of receiving payment.
          </li>
          <li>
            Delivery to New Zealand addresses typically takes up to 3 business
            days after dispatch.
          </li>
          <li>
            During peak seasonal dates (particularly Nov/Dec), delivery time
            frames are longer. In general, we are closed in January.
          </li>
        </ul>

        <h3>Shipping Costs</h3>
        <ul>
          <li>
            We operate a flat-rate shipping &amp; handling fee shown at checkout.
            Rural deliveries incur extra charges.
          </li>
          <li>
            Additional postage charges may apply if your order needs to be split
            into separate parcels due to size/weight.
          </li>
        </ul>

        <h3>Shipping — New Regalia</h3>
        <p>
          Once payment is received and confirmed, your order will be picked,
          packed, and labelled for courier collection.
        </p>

        <h3>Deliveries</h3>
        <ul>
          <li>
            Couriers typically deliver within 1–5 days (2–3 days for major
            metropolitan areas).
          </li>
          <li>
            Please provide an address where someone will be available to sign for
            the parcel on weekdays. We do not deliver at weekends.
          </li>
        </ul>
      </section>

      {/* Stock Control */}
      <section className="tac__section" id="stock-control">
        <h2>Stock Control</h2>
        <p>
          We make every effort to ensure that all products ordered are in stock.
          Some purchases may require regalia to be made; this can take up to four
          weeks.
        </p>
      </section>

      {/* Returns Policy on Purchases */}
      <section className="tac__section" id="returns-policy">
        <h2>Returns Policy on Purchases</h2>
        <ul>
          <li>
            Please choose carefully. We provide a full refund, less postage,
            where the size is wrong or the product is damaged.
          </li>
          <li>
            Exchanges must be returned and exchanged within 10 working days of
            the original purchase date.
          </li>
          <li>
            An administration fee may be applied on returned purchases if you
            have changed your mind about owning regalia.
          </li>
          <li>
            If goods are faulty in any way, contact us immediately at{" "}
            <a href="mailto:info@masseygowns.org.nz">info@masseygowns.org.nz</a>.
          </li>
          <li>All other return postage is at the customer’s expense.</li>
        </ul>

        <address className="tac__address">
          <strong>Academic Dress Hire</strong>
          <br />
          Refectory Road
          <br />
          Massey University
          <br />
          Tennent Drive
          <br />
          Palmerston North 4474
        </address>
      </section>

      {/* Colour on the Internet */}
      <section className="tac__section" id="colour-on-the-internet">
        <h2>Colour on the Internet</h2>
        <p>
          While we aim to represent product colours as accurately as possible,
          different screens may show slight variations. If you are unsure about a
          garment colour, please enquire before purchasing.
        </p>
      </section>

      {/* Dispute */}
      <section className="tac__section" id="dispute">
        <h2>Dispute</h2>
        <p>
          Where a dispute arises out of the hire and/or return of regalia, you
          agree to advise Academic Dress Hire within seven days of it occurring.
          If we are unable to resolve the dispute together, Academic Dress Hire
          may refer the matter to the Disputes Tribunal for resolution.
        </p>
      </section>

      {/* Loss or Damage to Hirers Clothing */}
      <section className="tac__section" id="loss-damage-clothing">
        <h2>Loss or Damage to Hirer’s Clothing</h2>
        <p>
          While ADH will use best efforts to ensure that hired regalia will not
          cause loss or damage to the hirer’s clothing, ADH is not liable for any
          such loss or damage of any kind, whether arising directly or indirectly
          out of the hire.
        </p>
      </section>

      {/* Force Majeure */}
      <section className="tac__section" id="force-majeure">
        <h2>Force Majeure</h2>
        <p>
          In any case beyond the control of Academic Dress Hire (including but
          not limited to any order of government or other authority, strike,
          lockout, labour dispute, delays in transit, difficulty in procuring
          components, embargo, accident, emergency, act of God, or other
          contingency) that interferes with delivery or performance, ADH may, at
          its sole discretion, suspend performance of any obligation or cancel
          without liability to the buyer.
        </p>
      </section>

      {/* Additional Terms */}
      <section className="tac__section" id="additional-terms">
        <h2>Additional Terms and Conditions</h2>
        <ul>
          <li>
            By accepting the regalia, you agree to ADH’s Terms and Conditions and
            acknowledge that you have inspected the regalia and are satisfied with
            its condition.
          </li>
          <li>
            The hirer acknowledges that, in any case of default of these terms and
            conditions, ADH may engage a debt collection agency at the hirer’s
            cost.
          </li>
          <li>The property remains owned by Academic Dress Hire.</li>
          <li>
            The hirer has examined the property and acknowledges that it is
            received in good condition and is safe and suitable for its intended
            use.
          </li>
          <li>
            ADH will not be liable for any claim made against the hirer for damage
            caused by the hirer’s use of the property.
          </li>
          <li>
            ADH will not be liable to the hirer or any third party for any damage
            or loss resulting from any defect, failure, or breakdown in the
            property from any cause, presuming no negligence by ADH.
          </li>
          <li>
            The hirer agrees to return the property to ADH in the same condition
            as received (fair wear and tear accepted) on the return date advised
            at the time of hire, or to ADH’s premises as noted on the invoice/
            contract unless otherwise stated.
          </li>
          <li>
            ADH reserves the right to demand immediate return of the property on
            any breach of these terms and conditions and to charge additional hire
            time if the property is not returned by the specified date.
          </li>
          <li>
            The hirer agrees not to use the property in violation of any law,
            statute, or regulation. The laws of New Zealand apply.
          </li>
          <li>
            The hirer agrees to pay ADH the fee (and any applicable bond) by the
            due date set out in the invoice/contract and to retain possession and
            control of the property throughout the hire period.
          </li>
          <li>
            The hirer is liable to ADH for any loss of the property (or part of
            it) and may be required to meet the replacement cost.
          </li>
          <li>
            ADH reserves the right to retain a cancellation fee on any cancelled
            bookings. Donations made with the hire are non-refundable.
          </li>
          <li>
            We reserve the right to alter and/or add to these terms as required.
            Any amendments will be posted on our website and are effective
            immediately upon posting. The hirer is responsible for reviewing the
            latest terms. Hiring any items constitutes acknowledgment and
            acceptance of the current terms.
          </li>
          <li>
            The terms on this website are the terms on which ADH offers the hire
            of regalia. If you do not accept these terms, you must not proceed
            with the hire.
          </li>
        </ul>
      </section>
    </div>
  );
}

export default TermsAndConditions;
