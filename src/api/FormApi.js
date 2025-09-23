const API_BASE = import.meta.env.VITE_GOWN_API_BASE;

export async function sendContactForm(formData) {
  try {
    const response = await fetch(`${API_BASE}/contacts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: formData.id,
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        subject: formData.subject,
        query: formData.query,
        createdAt: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Server error:", errorText);
      throw new Error("Failed to send contact form");
    }

    return await response.json();
  } catch (error) {
    console.error("Error sending contact form:", error);
    throw error;
  }
}
