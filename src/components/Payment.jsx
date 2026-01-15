import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { sendOrderEmail } from "../api/EmailApi";
import { EmailTemplate } from "../components/EmailTemplate.jsx";

// const API_URL = import.meta.env.VITE_GOWN_API_BASE;
const API_URL = 'http://localhost:5144';

export default function Payment() {
  const [loading, setLoading] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState(null);
  const [searchParams] = useSearchParams();
  const hasRun = useRef(false);

  const formData = JSON.parse(localStorage.getItem("customerDetails") || "{}");
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");

  //Handle Paystation return
  useEffect(() => {
    const result = searchParams.get("ec"); // Error code
    const message = searchParams.get("em"); // Error message
    const txnId = searchParams.get("ti"); // Transaction ID

    if (result) {
      console.log("Paystation response:", { result, message, txnId });
      if (result === "0") {
        alert("✅ Payment successful! Transaction ID: " + txnId);
        paymentCompletionEmail();
      } else {
        alert("❌ Payment failed: " + message);
      }
    }
  }, [searchParams]);

  const startPayment = async () => {
    setLoading(true);
    try {
      const grandTotal = localStorage.getItem("grandTotal");
      const orderNo = localStorage.getItem("orderNo");

      console.log("Order Number=", orderNo);
      
      const res = await fetch(`${API_URL}/api/payment/create-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Amount: parseFloat(grandTotal) * 100,
          OrderNumber: orderNo,
        }),
      });
      const data = await res.json();
      console.log(data);
      if (data.redirectUrl) {
        console.log(data.redirectUrl);
        setRedirectUrl(data.redirectUrl);
        setTimeout(() => {
          window.location.href = data.redirectUrl;
        }, 1000); // 0.8 seconds delay for UX
      }
    } catch (err) {
      console.error(err);
      alert("Error starting payment");
    }
    setLoading(false);
  };

  useEffect(() => {
    console.log(hasRun.current);
    if (!hasRun.current) {
      startPayment();
      hasRun.current = true;
    }
  }, []); // run only once on mount

  const paymentCompletionEmail = async () => {
    const emailPayload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      gstNumber: 0,
      invoiceNumber: 0,
      invoiceDate: 0,
      studentId: formData.studentId,
      address: formData.address,
      city: formData.city,
      postcode: formData.postcode,
      country: formData.country,
      cart: cart,
      grandTotal: 0,
      amountPaid: 0,
      balanceOwing: 0,
    };

    const emailHtml = EmailTemplate(emailPayload);
    // console.log("Generated Email Template:", emailHtml);

    try {
      await sendOrderEmail({
        to: formData.email,
        subject: "Payment Completed",
        htmlBody: emailHtml,
      });
    } catch (err) {
      console.error("Email sending failed:", err);
    }
  };

  return (
    <div className="p-6">
      {/*<h2 className="text-xl mb-4">Checkout</h2>*/}
      {/*<button*/}
      {/*    onClick={startPayment}*/}
      {/*    disabled={loading}*/}
      {/*    className="!bg-blue-600 text-white px-4 py-2 rounded"*/}
      {/*>*/}
      {/*    {loading ? "Processing..." : "Pay with Paystation"}*/}
      {/*</button>*/}
      {loading && <p>Processing payment…</p>}
      {redirectUrl && (
        <p className="!text-2xl !text-black-500 !font-bold">
          Redirecting to Paystation…
        </p>
      )}
    </div>
  );
}
