const API_BASE = import.meta.env.VITE_GOWN_API_BASE;

export async function fetchVisibleCeremonyLinks() {
  try {
    const response = await fetch(`${API_BASE}/ceremonies/visible-links`, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Server error:", errorText);
      throw new Error("Failed to fetch data from the server");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching visible ceremony links:", error);
    throw error;
  }
}

export async function fetchCeremonyContentById(id) {
  try {
    const response = await fetch(`${API_BASE}/ceremonies/content/${id}`, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Server error:", errorText);
      throw new Error("Failed to fetch data from the server");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching ceremony content by ID:", error);
    throw error;
  }
}
