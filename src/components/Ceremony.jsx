import React, { useEffect, useState } from "react";
import "./Ceremony.css";

const API_BASE = import.meta.env.VITE_GOWN_API_BASE;

function Ceremony() {
  const [ceremonyImageUrl, setCeremonyImageUrl] = useState(null);
  const [ceremonyText, setCeremonyText] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false); // track CMS load status

  useEffect(() => {
    async function loadCmsContent() {
      try {
        const res = await fetch(`${API_BASE}/api/CmsContent`);
        if (!res.ok) {
          const text = await res.text();
          throw new Error(
            `Failed to load CMS content (${res.status}): ${text}`
          );
        }

        const json = await res.json();
        const blocks = json.data || [];

        const getValue = (key) => {
          const block = blocks.find((b) => b.key === key);
          if (!block) return null;
          return typeof block.value === "string" ? block.value : null;
        };

        const img = getValue("home.ceremonyImage");
        if (img) setCeremonyImageUrl(img);

        const txt = getValue("home.ceremonyText");
        if (txt) setCeremonyText(txt);
      } catch (err) {
        console.error("Failed to load ceremony content", err);
      } finally {
        // only after we tried to load CMS, we decide whether to use fallback
        setIsLoaded(true);
      }
    }

    loadCmsContent();
  }, []);

  // Only decide the final image after CMS load finished
  const fallbackImage = "/cere_img.png";
  const finalCeremonyImage = isLoaded
    ? ceremonyImageUrl || fallbackImage
    : null;

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
          {finalCeremonyImage ? (
            <img src={finalCeremonyImage} alt="graduations" />
          ) : null}
        </div>

        <div className="ceremony_text">
          <h2 className="ceremony_title">WHAT YOU SHOULD WEAR ON</h2>
          <div className="littlebox">
            <h2>YOUR GRADUATION DAY</h2>
          </div>

          <div className="graduation_text">
            {finalCeremonyText.split(/\n\s*\n/).map((para, idx) => {
              const lines = para.split("\n");
              return (
                <p key={idx}>
                  {lines.map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < lines.length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </p>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Ceremony;
