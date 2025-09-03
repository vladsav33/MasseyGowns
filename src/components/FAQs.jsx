import React from "react";
import "./FAQs.css";
import { Link } from "react-router-dom";

const items = [
  {
    title: "Collection and Return Times",
    desc: "Learn about gown sizing, fitting, collection, and what to bring when picking up or returning your graduation regalia.",
    href: "/faqs/collection-and-return-times",
  },
  {
    title: "Sizes and Fitting",
    desc: "Check your graduation's specific collection and return times, plus what to bring when picking up regalia.",
    href: "/faqs/sizes-and-fitting",
  },
  {
    title: "What to Wear",
    desc: "Find out what regalia to wear for your graduation, including gowns, hoods, hats, and institution-specific requirements.",
    href: "/faqs/what-to-wear",
  },
  {
    title: "Ordering and Payment",
    desc: "Find information on how to order, hire and purchase regalia, pricing, payment options, and other important graduation gown details.",
    href: "/faqs/ordering-and-payment",
  },
];

function FAQs() {
  return (
    <section className="faqs">
      <h2 className="h2">FAQs</h2>
      <div className="faqs_grid">
        {items.map((it) => (
          <div className="faqs_card" key={it.title}>
            <div className="faqs_head">
              <Link to={it.href} className="faqs_link">
                <h3 className="faqs_title">{it.title}</h3>
                <span className="faqs_arrow">{">"}</span>
              </Link>
            </div>
            <p className="faqs_desc">{it.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FAQs;
