import React, { useEffect, useState } from "react";
import "./BuyDressSet.css";
import { Link } from "react-router-dom";

const API_BASE = import.meta.env.VITE_GOWN_API_BASE;

export default function BuyDressSet() {
  const [title, setTitle] = useState("Purchasing a Set of Academic Regalia");

  const [bachelorImage, setBachelorImage] = useState("/BuyBachelorRobes.png");
  const [bachelorLabel, setBachelorLabel] = useState("Buy Bachelor Robes");

  const [mastersImage, setMastersImage] = useState("/BuyMastersRobes.png");
  const [mastersLabel, setMastersLabel] = useState("Buy Masters Robes");

  const [phdImage, setPhdImage] = useState("/BuyPhDRobes.png");
  const [phdLabel, setPhdLabel] = useState("Buy PhD Robes");

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

        const titleVal = getValue("home.buyDressSetTitle");
        if (titleVal) setTitle(titleVal);

        const bachelorImg = getValue("home.buyBachelorImage");
        if (bachelorImg) setBachelorImage(bachelorImg);

        const bachelorText = getValue("home.buyBachelorLabel");
        if (bachelorText) setBachelorLabel(bachelorText);

        const mastersImg = getValue("home.buyMastersImage");
        if (mastersImg) setMastersImage(mastersImg);

        const mastersText = getValue("home.buyMastersLabel");
        if (mastersText) setMastersLabel(mastersText);

        const phdImg = getValue("home.buyPhDImage");
        if (phdImg) setPhdImage(phdImg);

        const phdText = getValue("home.buyPhDLabel");
        if (phdText) setPhdLabel(phdText);
      } catch (err) {
        console.error("Failed to load BuyDressSet CMS content", err);
      }
    }

    loadCmsContent();
  }, []);

  return (
    <section>
      <h2 className="BuyDressSetTitle">{title}</h2>
      <div className="BuyDressSetImg">
        <div className="threepic">
          <img src={bachelorImage} alt={bachelorLabel} />
          <Link to="/buyregalia" className="buyrobes">
            {bachelorLabel}
          </Link>
        </div>
        <div className="threepic">
          <img src={mastersImage} alt={mastersLabel} />
          <Link to="/buyregalia" className="buyrobes">
            {mastersLabel}
          </Link>
        </div>
        <div className="threepic">
          <img src={phdImage} alt={phdLabel} />
          <Link to="/buyregalia" className="buyrobes">
            {phdLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
