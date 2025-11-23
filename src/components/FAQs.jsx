import React, { useEffect, useState } from "react";
import "./FAQs.css";
import { Link } from "react-router-dom";

const API_BASE = import.meta.env.VITE_GOWN_API_BASE;

export default function FAQs() {
  const [sectionTitle, setSectionTitle] = useState("FAQs");

  const [cards, setCards] = useState({
    topleft: {
      title: "Ordering and Payment",
      desc: "Find information on how to order, hire and purchase regalia, pricing, payment options, and other important graduation gown details.",
      href: "/faqs",
    },
    topright: {
      title: "Collection and Return Times",
      desc: "Check your graduation's specific collection and return times, plus what to bring when picking up regalia.",
      href: "/faqs",
    },
    bottomleft: {
      title: "What to Wear",
      desc: "Find out what regalia to wear for your graduation, including gowns, hoods, hats, and institution-specific requirements.",
      href: "/faqs",
    },
    bottomright: {
      title: "Sizes and Fitting",
      desc: "Learn about gown sizing, fitting, collection, and what to bring when picking up or returning your graduation regalia.",
      href: "/faqs",
    },
  });

  useEffect(() => {
    async function loadCms() {
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

        const get = (key) => {
          const b = blocks.find((x) => x.key === key);
          return b && typeof b.value === "string" ? b.value : null;
        };

        const newCards = { ...cards };

        const sectionT = get("home.faqs.title");
        if (sectionT) setSectionTitle(sectionT);

        const positions = ["topleft", "topright", "bottomleft", "bottomright"];

        positions.forEach((pos) => {
          const t = get(`home.faqs.${pos}.title`);
          const d = get(`home.faqs.${pos}.desc`);
          const h = get(`home.faqs.${pos}.href`);

          if (t) newCards[pos].title = t;
          if (d) newCards[pos].desc = d;
          if (h) newCards[pos].href = h;
        });

        setCards(newCards);
      } catch (err) {
        console.error("Failed to load FAQs CMS content", err);
      }
    }

    loadCms();
  }, []);

  const renderCards = () => {
    const order = ["topleft", "topright", "bottomleft", "bottomright"];

    return order.map((pos) => {
      const item = cards[pos];
      return (
        <div className="faqs_card" key={pos}>
          <div className="faqs_head">
            <Link to={item.href} className="faqs_link">
              <h3 className="faqs_title">{item.title}</h3>
              <span className="faqs_arrow">{">"}</span>
            </Link>
          </div>
          <p className="faqs_desc">{item.desc}</p>
        </div>
      );
    });
  };

  return (
    <section className="faqs">
      <h2 className="h2">{sectionTitle}</h2>
      <div className="faqs_grid">{renderCards()}</div>
    </section>
  );
}
