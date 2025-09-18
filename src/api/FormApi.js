const API_BASE = import.meta.env.VITE_GOWN_API_BASE;

// post the form to the database
export async function sendContactForm(formData) {
  try {
    const res = await fetch(`${API_BASE}/form`, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      throw new Error("Failed to send form");
    }

    return await res.json();
  } catch (err) {
    console.error("Form API error:", err);
    throw err;
  }
}
