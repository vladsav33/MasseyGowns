import React, { useEffect, useState } from "react";
import "./Ceremony.css";

const API_BASE = import.meta.env.VITE_GOWN_API_BASE;

function Ceremony() {
  const [ceremonyImageUrl, setCeremonyImageUrl] = useState(null);
  const [ceremonyText, setCeremonyText] = useState(null);

  useEffect(() => {
    async function loadCeremonyImage() {
      try {
        const res = await fetch(`${API_BASE}/api/HomePage/ceremony-image`);
        if (!res.ok) throw new Error("Failed to load ceremony image");
        const json = await res.json();
        const url =
          json?.data?.ceremonyImageUrl || json.ceremonyImageUrl || null;

        if (url) setCeremonyImageUrl(url);
      } catch (err) {
        console.error("Ceremony image fallback to local", err);
      }
    }

    async function loadCeremonyText() {
      try {
        const res = await fetch(`${API_BASE}/api/HomePage/ceremony-text`);
        if (!res.ok) throw new Error("Failed to load ceremony text");

        const json = await res.json();
        const text = json?.data?.ceremonyText || json.ceremonyText || null;

        if (text) setCeremonyText(text);
      } catch (err) {
        console.error("Ceremony text fallback to local", err);
      }
    }

    loadCeremonyImage();
    loadCeremonyText();
  }, []);

  // fallback image
  const finalCeremonyImage = ceremonyImageUrl || "/cere_img.png";

  // fallback text
  const fallbackText = `
Your graduation ceremony is a formal celebration of your achievement,and you are encouraged to dress appropriately.

All graduands are required to wear academic regalia at the graduation ceremony.

Appropriate dress is considered to be:
Men: suit and tie and applicable academic dress.
Women: formal clothes and applicable academic dress.
  `.trim();

  const finalCeremonyText = ceremonyText || fallbackText;

  return (
    <section className="ceremony">
      <div className="ceremony_inner">
        <div className="cere_img">
          <img src={finalCeremonyImage} alt="graduations" />
        </div>

        <div className="ceremony_text">
          <h2 className="ceremony_title">WHAT YOU SHOULD WEAR ON</h2>
          <div className="littlebox">
            <h2>YOUR GRADUATION DAY</h2>
          </div>

          <div className="graduation_text">
            {finalCeremonyText.split("\n").map((line, idx) => (
              <p key={idx}>{line}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Ceremony;
