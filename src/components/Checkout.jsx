import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function Checkout() {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState("loading");

    useEffect(() => {
        const ec = searchParams.get("ec");
        const em = searchParams.get("em");
        const ti = searchParams.get("ti");
        const ms = searchParams.get("ms");
        const am = searchParams.get("am");

        if (!ec) {
            setStatus("invalid");
            return;
        }

        if (ec === "0") {
            setStatus("success");
        } else {
            setStatus("error");
        }
        console.log(JSON.stringify({ ec, em, ti, ms, am }));

        // Optional: send result to backend for order update
        // fetch("https://your-backend.azurewebsites.net/api/paymentresult", {
        //     method: "POST",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify({ ec, em, ti, ms, am }),
        // }).catch(console.error);

    }, [searchParams]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center">
            {status === "loading" && <p>Checking payment result...</p>}

            {status === "success" && (
                <div className="p-6 bg-green-100 rounded-lg shadow">
                    <h2 className="text-2xl font-bold text-green-700">Payment Successful</h2>
                    <p>Your payment has been approved. Thank you!</p>
                    <a href="/" className="mt-4 inline-block text-blue-600 underline">Back to Home</a>
                </div>
            )}

            {status === "error" && (
                <div className="p-6 bg-red-100 rounded-lg shadow">
                    <h2 className="text-2xl font-bold text-red-700">Payment Failed</h2>
                    <p>Something went wrong. Please try again.</p>
                    <a href="/payment" className="mt-4 inline-block text-blue-600 underline">Try Again</a>
                </div>
            )}

            {status === "invalid" && (
                <p className="text-gray-600">Invalid payment response.</p>
            )}
        </div>
    );
}
