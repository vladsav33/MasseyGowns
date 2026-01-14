// EmailTemplate.jsx
export function EmailTemplate(payload = {}, template) {
  const {
    firstName = "",
    lastName = "",
    email = "",
    gstNumber = "",
    invoiceNumber = "",
    invoiceDate = "",
    studentId = "",
    mobile = "",
    phone = "",
    address = "",
    city = "",
    postcode = "",
    country = "",
    cart = [],
    total = 0
  } = payload;

  // ----------------------------
  // BUILD CART ROWS (HTML)
  // ----------------------------
  const cartRows =
    cart.length > 0
      ? cart
          .map((item) => {
            const name = item.name ?? "";
            const qty = Number(item.quantity ?? 1);
            const price = Number(item.hirePrice ?? 0);
            const gst = Number(item.gst ?? price * 0.15);
            const rowTotal = qty * price;

            return `
              <tr style="border-bottom:1px solid #e5e5e5;">
                <td style="padding:10px;">${escapeHtml(name)}</td>
                <td align="center" style="padding:10px;">${qty}</td>
                <td align="right" style="padding:10px;">$${price.toFixed(2)}</td>
                <td align="right" style="padding:10px;">$${gst.toFixed(2)}</td>
                <td align="right" style="padding:10px; font-weight:bold;">$${rowTotal.toFixed(2)}</td>
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

  // ----------------------------
  // BIND DATA TO TEMPLATE
  // ----------------------------
  return bindTemplate(template, {
    firstName,
    lastName,
    email,
    gstNumber,
    invoiceNumber,
    invoiceDate,
    studentId,
    mobile,
    phone,
    address,
    city,
    postcode,
    country,
    cartRows,
    total: `$${Number(total).toFixed(2)}`
  });
}

/* ======================================================
   HELPER FUNCTIONS
====================================================== */

// Replace {{variable}} placeholders
function bindTemplate(template, data) {
  return template.replace(/{{(.*?)}}/g, (_, key) => {
    return data[key.trim()] ?? "";
  });
}

// Prevent HTML injection
function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
