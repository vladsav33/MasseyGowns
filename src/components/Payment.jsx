import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { sendOrderEmail } from "../api/EmailApi";

const API_URL = import.meta.env.VITE_GOWN_API_BASE;

export default function Payment() {
  const [loading, setLoading] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState(null);
  const [searchParams] = useSearchParams();
  const hasRun = useRef(false);

  // Handle Paystation return
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
      const res = await fetch(`${API_URL}/api/payment/create-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Amount: parseFloat(grandTotal) * 100
        })
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
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
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

    const emailHtml = WebsiteEmailTemplate(emailPayload);
    // console.log("Generated Email Template:", emailHtml);

    const payload = {
      to: formData.email,
      subject: "Payment Completed",
      htmlBody: emailHtml,
    };

    await sendOrderEmail(payload);
  };

  const WebsiteEmailTemplate = ({
    firstName,
    lastName,
    email,
    gstNumber,
    invoiceNumber,
    invoiceDate,
    studentId,
    address,
    city,
    postcode,
    country,
    cart,
    grandTotal,
    amountPaid,
    balanceOwing,
  }) => {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1.0" />
</head>

<body style="margin:0; padding:0; background:#f4f4f4; font-family:Arial, sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="padding:20px; background:#f4f4f4;">
  <tr>
    <td align="center">

      <table width="650" cellpadding="0" cellspacing="0" style="background:white; border-radius:8px; padding:30px;">

        <!-- HEADER -->
        <tr>
          <td style="border-bottom:2px solid #333333; padding-bottom:15px;">
            <h1 style="margin:0; font-size:26px; color:#333;">Tax Receipt</h1>
            <p style="margin:6px 0; color:#666; font-size:14px;">GST Number: <strong>${gstNumber}</strong></p>
            <p style="margin:6px 0; color:#666; font-size:14px;">Invoice Number: <strong>${invoiceNumber}</strong></p>
            <p style="margin:6px 0; color:#666; font-size:14px;">Invoice Date: <strong>${invoiceDate}</strong></p>
          </td>
        </tr>

        <!-- COMPANY ADDRESS -->
        <tr>
          <td style="font-size:14px; padding-top:20px; color:#555;">
            <p style="margin:0;"><strong>Refectory Rd, University Ave, Massey University, Tennent Drive</strong></p>
            <p style="margin:0;">Palmerston North</p>
            <p style="margin:0;">Tel +64 6 350 4166</p>
          </td>
        </tr>

        <!-- INVOICE TO / FROM -->
        <tr>
          <td style="padding-top:25px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td width="50%" valign="top">
                  <h3 style="margin:0 0 8px 0; font-size:16px; color:#333;">Invoice To:</h3>
                  <p style="margin:0; font-size:14px; line-height:1.6; color:#555;">
                    <strong>${firstName} ${lastName}</strong><br/>
                    ${address}<br/>
                    ${city}, ${postcode}<br/>
                    ${country}<br/><br/>
                    <strong>Student ID:</strong> ${studentId}<br/>
                    <strong>Email:</strong> ${email}
                  </p>
                </td>

                <td width="50%" valign="top">
                  <h3 style="margin:0 0 8px 0; font-size:16px; color:#333;">Invoice From:</h3>
                  <p style="margin:0; font-size:14px; line-height:1.6; color:#555;">
                    <strong>Academic Dress Hire</strong><br/>
                    Refectory Rd, University Ave,<br/>
                    Massey University, Tennent Drive<br/>
                    Palmerston North
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- EVENT -->
        <tr>
          <td style="margin-top:30px; background:#eef3ff; padding:12px; border-left:4px solid #1e40af; font-size:14px; color:#333; font-weight:bold;">
            Massey University Graduation Event
          </td>
        </tr>

        <!-- CART TABLE -->
        <tr>
          <td style="padding-top:25px;">
            <table width="100%" cellpadding="8" cellspacing="0" style="border-collapse:collapse;">

              <thead>
                <tr style="background:#333; color:#fff;">
                  <th align="left" style="padding:10px; font-size:14px;">Item</th>
                  <th align="center" style="padding:10px; font-size:14px;">Qty</th>
                  <th align="right" style="padding:10px; font-size:14px;">Price</th>
                  <th align="right" style="padding:10px; font-size:14px;">GST</th>
                  <th align="right" style="padding:10px; font-size:14px;">Total</th>
                </tr>
              </thead>

              <tbody>
                ${
                  cart.length > 0
                    ? cart
                        .map(
                          (item) => `
                <tr style="border-bottom:1px solid #e5e5e5;">
                  <td style="padding:10px; font-size:14px; color:#444;">${
                    item.name
                  }</td>
                  <td align="center" style="padding:10px; font-size:14px;">${
                    item.quantity || 1
                  }</td>
                  <td align="right" style="padding:10px; font-size:14px;">$${item.hirePrice.toFixed(
                    2
                  )}</td>
                  <td align="right" style="padding:10px; font-size:14px;">$${
                    item.gst || 0
                  }</td>
                  <td align="right" style="padding:10px; font-size:14px; font-weight:bold;">$${(
                    item.hirePrice * item.quantity || 1
                  ).toFixed(2)}</td>
                </tr>`
                        )
                        .join("")
                    : `
                <tr>
                  <td colspan="5" align="center" style="padding:20px; color:#888; font-style:italic;">No items</td>
                </tr>`
                }
              </tbody>

            </table>
          </td>
        </tr>

        <!-- TOTALS -->
        <tr>
          <td style="padding-top:30px;">
            <table width="100%" cellpadding="8" cellspacing="0">

              <tr>
                <td align="right" style="font-size:16px; color:#333;">
                  <strong>Grand Total:</strong>
                </td>
                <td align="right" style="font-size:18px; font-weight:bold; width:150px;">
                  $${total.toFixed(2)}
                </td>
              </tr>

              <tr style="background:#e8f4e8;">
                <td align="right" style="font-size:16px; color:#2d7a2d;">
                  <strong>Amount Paid:</strong>
                </td>
                <td align="right" style="font-size:18px; font-weight:bold; color:#2d7a2d; width:150px;">
                  $${total.toFixed(2)}
                </td>
              </tr>

              <tr style="background:#f7f7f7;">
                <td align="right" style="font-size:16px;">
                  <strong>Balance Owing:</strong>
                </td>
                <td align="right" style="font-size:18px; font-weight:bold; width:150px;">
                  $${balanceOwing.toFixed(2)}
                </td>
              </tr>

            </table>
          </td>
        </tr>

        <!-- NOTES -->
        <tr>
          <td style="margin-top:20px; background:#fff8e1; padding:15px; border:1px solid #ffe28a; font-size:14px;">
            <strong style="font-size:15px;">Important Notes:</strong>
            <ul style="padding-left:20px; margin-top:10px; line-height:1.7;">
              <li>Please bring this receipt when collecting regalia.</li>
              <li>Regalia must be returned by the due date to avoid extra fees.</li>
              <li>You will be invoiced for unreturned or damaged regalia.</li>
              <li>If couriering regalia back, include your contact details.</li>
            </ul>
          </td>
        </tr>
<!-- COLLECTION & RETURN TIMES -->
<tr>
  <td style="margin-top:20px; padding:15px; background:#f0f7ff; border:1px solid #bcd4ff;">

    <h3 style="margin:0 0 10px 0; font-size:16px; font-weight:bold; color:#1b3a70;">
      COLLECTION & RETURN TIMES
    </h3>

    <p style="font-size:14px; color:#333; margin:5px 0;">
      These details will be confirmed by email 10 days before the graduation.
    </p>

    <p style="font-size:14px; color:#333; margin:10px 0; line-height:1.6;">
      Both collection and return of regalia will be from Massey University, Albany Campus.
      The Massey Business School MBS 2.15 room (tbc) will be open for collection and return
      only at the following times. You can uplift and return at your convenience during any
      of these times.
    </p>

    <h4 style="margin:15px 0 8px 0; font-size:15px; font-weight:bold; color:#1b3a70;">
      Collection & Return times
    </h4>

    <table width="100%" cellpadding="6" cellspacing="0" style="font-size:14px; color:#333; border-collapse:collapse;">
      <tr>
        <td style="padding:6px; border-bottom:1px solid #ddd; font-weight:bold;">Monday 26 May</td>
        <td style="padding:6px; border-bottom:1px solid #ddd;">10.30am - 6.30pm</td>
      </tr>
      <tr>
        <td style="padding:6px; border-bottom:1px solid #ddd; font-weight:bold;">Tuesday 27 May</td>
        <td style="padding:6px; border-bottom:1px solid #ddd;">7.45am - 6.30pm</td>
      </tr>
      <tr>
        <td style="padding:6px; border-bottom:1px solid #ddd; font-weight:bold;">Wednesday 28 May</td>
        <td style="padding:6px; border-bottom:1px solid #ddd;">7.45am - 6.30pm</td>
      </tr>
      <tr>
        <td style="padding:6px; border-bottom:1px solid #ddd; font-weight:bold;">Thursday 29 May</td>
        <td style="padding:6px; border-bottom:1px solid #ddd;">7.45am - 6.30pm</td>
      </tr>
      <tr>
        <td style="padding:6px; font-weight:bold;">Friday 30 May</td>
        <td style="padding:6px;">9am - 12pm (midday)</td>
      </tr>
    </table>

    <p style="font-size:14px; margin-top:15px; color:#b00000; font-weight:bold;">
      Regalia must be returned by Friday 30 May 12pm - midday.
      After this time, you will have to courier your regalia to us.
    </p>

  </td>
</tr>

        <!-- FOOTER -->
        <tr>
          <td align="center" style="padding-top:25px; font-size:12px; color:#888;">
            Academic Dress Hire | Massey University
          </td>
        </tr>

      </table>

    </td>
  </tr>
</table>

</body>
</html>
`;
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
