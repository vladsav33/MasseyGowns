import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function Payment() {
    const [loading, setLoading] = useState(false);
    const [redirectUrl, setRedirectUrl] = useState(null);
    const [searchParams] = useSearchParams();

    // Handle Paystation return
    useEffect(() => {
        const result = searchParams.get("ec"); // Error code
        const message = searchParams.get("em"); // Error message
        const txnId = searchParams.get("ti");   // Transaction ID

        if (result) {
            console.log("Paystation response:", { result, message, txnId });
            if (result === "0") {
                alert("✅ Payment successful! Transaction ID: " + txnId);
            } else {
                alert("❌ Payment failed: " + message);
            }
        }
    }, [searchParams]);

    const startPayment = async () => {
        setLoading(true);
        try {
            const res = await fetch("https://localhost:7185/api/payment/create-payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    Amount: 1000 // e.g. $10.00
                })
            });
            const data = await res.json();
            console.log(data);
            if (data.redirectUrl) {
                console.log(data.redirectUrl);
                setRedirectUrl(data.redirectUrl);
                window.location.href = data.redirectUrl; // Redirect to Paystation
            }
        } catch (err) {
            console.error(err);
            alert("Error starting payment");
        }
        setLoading(false);
    };

    return (
        <div className="p-6">
            <h2 className="text-xl mb-4">Checkout</h2>
            <button
                onClick={startPayment}
                disabled={loading}
                className="!bg-blue-600 text-white px-4 py-2 rounded"
            >
                {loading ? "Processing..." : "Pay with Paystation"}
            </button>

            {redirectUrl && (
                <p className="mt-4">Redirecting to Paystation…</p>
            )}
        </div>
    );
}
