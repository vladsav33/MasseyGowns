import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import "./PaymentCompleted.css";
import { getEmailTemplateByName } from "../api/EmailApi";
import { EmailTemplate } from "../components/EmailTemplate.jsx";

function PaymentCompleted() {
  const [html, setHtml] = useState("");
  const [loading, setLoading] = useState(true);

  const snapshot = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("orderSnapshot") || "{}");
    } catch {
      return {};
    }
  }, []);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);

        const data = await getEmailTemplateByName("OrderCompleted");
        const template = data.taxReceiptHtml;

        const payload = {
          ...(snapshot.customerDetails || {}),
          invoiceNumber: snapshot.orderNo || localStorage.getItem("orderNo") || "-",
          cart: snapshot.cart || [],
        };

        const htmlOut = EmailTemplate(payload, template);
        setHtml(htmlOut);
      } catch (e) {
        console.error(e);
        setHtml("<div>Failed to load receipt template.</div>");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [snapshot]);

  return (
    <div>
      <Navbar />

      {loading && <div style={{ padding: 16 }}>Loading...</div>}

      {!loading && (
        <div className="receipt-page">
          <button className="oc-print-btn" onClick={() => window.print()}>
            🖨️ Please print this receipt for your records
          </button>

          <div
            className="receipt-html"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      )}
    </div>
  );
}

export default PaymentCompleted;