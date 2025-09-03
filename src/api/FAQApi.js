const API_BASE = import.meta.env.VITE_GOWN_API_BASE;

// get faq list
export async function fetchFAQs() {
  const controller = new AbortController();
  // set time out
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(`${API_BASE}/faq`, {
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) {
      throw new Error(`API request failed: ${res.status}`);
    }

    return await res.json(); // [{id, question, answer}, ...]
  } catch (err) {
    clearTimeout(timeout);
    console.error("❌ FAQ API error:", err);
    throw err;
  }
}
