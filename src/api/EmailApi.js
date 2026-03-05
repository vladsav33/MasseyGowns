const API_BASE = import.meta.env.VITE_GOWN_API_BASE;

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
    //console.log(data);
    const err = new Error(data.message || "Failed to send email");
    err.response = data;
    throw err;
  }

  return data;
}
