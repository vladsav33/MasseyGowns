import React, { useEffect, useRef, useState } from "react";

const API_URL = import.meta.env.VITE_GOWN_API_BASE;

export default function Payment() {
  const [loading, setLoading] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState(null);
  const hasRun = useRef(false);

  //Handle Paystation return

  const startPayment = async () => {
    setLoading(true);
    try {
      const grandTotal = localStorage.getItem("grandTotal");
      const orderNo = localStorage.getItem("orderNo");

      console.log("Order Number=", orderNo);

      const res = await fetch(`${API_URL}/api/payment/create-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json", OrderNo: orderNo },
        body: JSON.stringify({
          PayAmount: parseFloat(grandTotal) * 100,
          OrderNo: orderNo,
        }),
      });
      const data = await res.json();
      if (data.redirectUrl) {
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
