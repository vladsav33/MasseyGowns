// EmailTemplate.jsx
export function EmailTemplate(payload) {
  const {
    firstName = "",
    lastName = "",
    email = "",
    gstNumber = "",
    invoiceNumber = "",
    invoiceDate = "",
    studentId = "",
    address = "",
    city = "",
    postcode = "",
    country = "",
    cart = [],
    total = 0,
    amountPaid = 0,
    balanceOwing = 0,
  } = payload;

  // Format cart rows safely
  const cartRows =
    cart.length > 0
      ? cart
          .map((item) => {
            const qty = item.quantity || 1;
            const price = item.hirePrice || 0;
            const gst = item.gst ?? (price * 0.15).toFixed(2); // fallback GST
            const rowTotal = (qty * price).toFixed(2);

            return `
            <tr style="border-bottom:1px solid #e5e5e5;">
              <td style="padding:10px;">${item.name}</td>
              <td align="center" style="padding:10px;">${qty}</td>
              <td align="right" style="padding:10px;">$${price.toFixed(2)}</td>
              <td align="right" style="padding:10px;">$${gst}</td>
              <td align="right" style="padding:10px; font-weight:bold;">$${rowTotal}</td>
            </tr>
          `;
          })
          .join("")
      : `
        <tr>
          <td colspan="5" align="center" style="padding:20px; font-style:italic; color:#777;">
            No items found
          </td>
        </tr>
      `;

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Your Receipt</title>
</head>

<body style="margin:0; padding:0; background:#f4f4f4; font-family:Arial, sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="padding:20px;">
<tr>
<td align="center">

  <!-- MAIN CONTAINER -->
  <table width="650" cellpadding="0" cellspacing="0" style="background:white; border-radius:8px; padding:30px;">

    <!-- HEADER -->
    <tr>
      <td style="border-bottom:2px solid #333; padding-bottom:15px;">
        <h1 style="margin:0; font-size:26px; color:#333;">Tax Receipt</h1>
        <p style="margin:4px 0; font-size:14px; color:#555;">GST Number: <strong>${gstNumber}</strong></p>
        <p style="margin:4px 0; font-size:14px; color:#555;">Invoice Number: <strong>${invoiceNumber}</strong></p>
        <p style="margin:4px 0; font-size:14px; color:#555;">Invoice Date: <strong>${invoiceDate}</strong></p>
      </td>
    </tr>

    <!-- CUSTOMER DETAILS -->
    <tr>
      <td style="padding-top:25px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>

            <!-- Invoice To -->
            <td width="50%" valign="top">
              <h3 style="margin:0 0 8px 0; font-size:16px;">Invoice To:</h3>
              <p style="margin:0; line-height:1.6;">
                <strong>${firstName} ${lastName}</strong><br/>
                ${address}<br/>
                ${city}, ${postcode}<br/>
                ${country}<br/><br/>
                <strong>Student ID:</strong> ${studentId}<br/>
                <strong>Email:</strong> ${email}
              </p>
            </td>

            <!-- Invoice From -->
            <td width="50%" valign="top">
              <h3 style="margin:0 0 8px 0; font-size:16px;">Invoice From:</h3>
              <p style="margin:0; line-height:1.6;">
                <strong>Academic Dress Hire</strong><br/>
                Refectory Rd, University Ave,<br/>
                Massey University, Tennent Drive<br/>
                Palmerston North<br/>
                Tel: +64 6 350 4166
              </p>
            </td>

          </tr>
        </table>
      </td>
    </tr>

    <!-- EVENT SECTION -->
    <tr>
      <td style="margin-top:30px; background:#eef3ff; padding:12px; border-left:4px solid #1e40af; font-weight:bold;">
        Massey University Graduation Event
      </td>
    </tr>

    <!-- CART TABLE -->
    <tr>
      <td style="padding-top:25px;">
        <table width="100%" cellpadding="8" cellspacing="0" style="border-collapse:collapse;">

          <thead>
            <tr style="background:#333; color:white;">
              <th align="left" style="padding:10px;">Item</th>
              <th align="center" style="padding:10px;">Qty</th>
              <th align="right" style="padding:10px;">Price</th>
              <th align="right" style="padding:10px;">GST</th>
              <th align="right" style="padding:10px;">Total</th>
            </tr>
          </thead>

          <tbody>
            ${cartRows}
          </tbody>

        </table>
      </td>
    </tr>

    <!-- TOTALS -->
    <tr>
      <td style="padding-top:30px;">
        <table width="100%" cellpadding="8" cellspacing="0">

          <tr>
            <td align="right" style="font-size:16px;">Grand Total:</td>
            <td align="right" style="font-size:18px; font-weight:bold; width:150px;">$${total.toFixed(
              2
            )}</td>
          </tr>

          <tr style="background:#e8f4e8;">
            <td align="right" style="font-size:16px; color:#2d7a2d;">Amount Paid:</td>
            <td align="right" style="font-size:18px; font-weight:bold; color:#2d7a2d; width:150px;">
              $${amountPaid.toFixed(2)}
            </td>
          </tr>

          <tr style="background:#f7f7f7;">
            <td align="right" style="font-size:16px;">Balance Owing:</td>
            <td align="right" style="font-size:18px; font-weight:bold; width:150px;">
              $${balanceOwing.toFixed(2)}
            </td>
          </tr>

        </table>
      </td>
    </tr>

    <!-- NOTES -->
    <tr>
      <td style="margin-top:20px; background:#fff8e1; padding:15px; border:1px solid #ffe28a;">
        <strong style="font-size:15px;">Important Notes:</strong>
        <ul style="padding-left:18px; line-height:1.7; font-size:14px;">
          <li>Please bring this receipt when collecting regalia.</li>
          <li>Regalia must be returned by the due date to avoid extra fees.</li>
          <li>You will be invoiced for unreturned or damaged regalia.</li>
          <li>If couriering regalia back, include your contact details.</li>
        </ul>
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
}
