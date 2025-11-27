const API_BASE = import.meta.env.VITE_GOWN_API_BASE;

/**
 * Send a website email using the backend /api/email/send endpoint.
 *
 * Expected payload shape:
 * {
 *   email: string,
 *   firstName: string,
 *   lastName: string,
 *   subject: string,
 *   enquiry: string
 *   toEmail?: string      // optional: override recipient
 * }
 */
export async function sendWebsiteEmail(payload) {
  const res = await fetch(`${API_BASE}/api/email/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    const err = new Error(data.message || "Failed to send email");
    err.response = data;
    throw err;
  }

  return data;
}
