import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import "./PaymentCompleted.css";
const API_BASE = import.meta.env.VITE_GOWN_API_BASE;

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

        const orderId =
          snapshot?.orderId ||
          snapshot?.id ||
          localStorage.getItem("orderId") ||
          "";

        const orderNo =
          snapshot?.orderNo ||
          snapshot?.referenceNo ||
          localStorage.getItem("orderNo") ||
          "";

        const email =
          snapshot?.customerDetails?.email ||
          snapshot?.email ||
          localStorage.getItem("receiptEmail") ||
          localStorage.getItem("email") ||
          "";

        if (!orderId || !orderNo || !email) {
          setHtml(
            "<div style='padding:16px;'>Unable to load receipt. Missing order details.</div>",
          );
          return;
        }

        const url = `${API_BASE}/orders/${orderId}/receipt-html?orderNo=${encodeURIComponent(
          orderNo,
        )}&email=${encodeURIComponent(email)}`;

        console.log("snapshot:", snapshot);
        console.log(
          "orderId raw:",
          snapshot?.orderId,
          snapshot?.id,
          localStorage.getItem("orderId"),
        );
        console.log("orderId final:", orderId);
        console.log("orderNo final:", orderNo);
        console.log("email final:", email);
        console.log("url final:", url);

        const resp = await fetch(url, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        });

        if (!resp.ok) {
          let message = "Failed to load receipt.";

          try {
            const text = await resp.text();
            if (text) {
              message = text;
            }
          } catch {
            // ignore response parsing error
          }

          throw new Error(message);
        }

        const data = await resp.json();
        setHtml(
          data?.html || "<div style='padding:16px;'>No receipt found.</div>",
        );
      } catch (e) {
        console.error("Failed to load receipt:", e);
        setHtml(
          "<div style='padding:16px;'>Failed to load receipt. Please contact us if you need a copy.</div>",
        );
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
