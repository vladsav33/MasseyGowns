import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_GOWN_API_BASE;

export function useCmsContent() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [blocks, setBlocks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCmsContent() {
      try {
        const res = await fetch(`${API_BASE}/api/CmsContent`);
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Failed to load CMS content(${res.status}):${text}`);
        }
        const json = await res.json();
        const dataBlocks = json.data || [];
        setBlocks(dataBlocks);
      } catch (err) {
        console.error(err);
        setError(err);
      } finally {
        setIsLoaded(true);
      }
    }
    fetchCmsContent();
  }, []);

  const getValue = (key) => {
    const block = blocks.find((b) => b.key === key);
    if (!block) return null;
    return typeof block.value === "string" ? block.value : null;
  };

  return { blocks, getValue, isLoaded, error };
}
