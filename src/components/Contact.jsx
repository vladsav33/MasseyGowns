import React, { useState, useEffect } from "react";
import "./Contact.css";
import { Link } from "react-router-dom";
import Googlemap from "./Googlemap";

const API_BASE = import.meta.env.VITE_GOWN_API_BASE;

export default function Contact() {
  // CMS based fields (only what you need)
  const [sectionTitle, setSectionTitle] = useState("CONTACT US");
  const [emailIntro, setEmailIntro] = useState(
    "You can click here to Contact Us, and then send us your queries."
  );
  const [address, setAddress] = useState(
    "3 Refectory Road, University Avenue\nMassey University\nPalmerston North"
  );
  const [phone, setPhone] = useState("06 350 4166");
  const [openingMain, setOpeningMain] = useState(
    "Our normal hours are 9:00am – 2.30pm, Mon – Thurs."
  );
  const [openingNote, setOpeningNote] = useState(
    "We operate extended hours during the graduation week."
  );

  useEffect(() => {
    async function loadCms() {
      try {
        const res = await fetch(`${API_BASE}/api/CmsContent`);
        if (!res.ok) return;

        const json = await res.json();
        const blocks = json.data || [];

        const get = (key) => {
          const b = blocks.find((x) => x.key === key);
          return b && typeof b.value === "string" ? b.value : null;
        };

        const t = get("home.contact.sectionTitle");
        if (t) setSectionTitle(t);

        const intro = get("home.contact.emailIntro");
        if (intro) setEmailIntro(intro);

        const addr = get("home.contact.address");
        if (addr) setAddress(addr);

        const ph = get("home.contact.phone");
        if (ph) setPhone(ph);

        const om = get("home.contact.openingHoursMain");
        if (om) setOpeningMain(om);

        const on = get("home.contact.openingHoursNote");
        if (on) setOpeningNote(on);
      } catch (err) {
        console.error("Failed to load contact CMS", err);
      }
    }

    loadCms();
  }, []);

  const addressLines = address.split("\n");
  const openMainLines = openingMain.split("\n");

  return (
    <section className="contact">
      <h2 className="h2">{sectionTitle}</h2>

      <div className="contact_inner">
        <div className="contact_left">
          <h2 className="contact_email">Email Contact</h2>

          <p className="clickhere">
            {emailIntro.split("Contact Us")[0]}
            <Link to="/contactus" className="contactlink">
              Contact Us
            </Link>
            {emailIntro.split("Contact Us")[1]}
          </p>

          <div className="footer_pay">
            <img src="/visa.png" alt="visa&master" className="visaimg" />
          </div>

          <div className="footer_left">
            <p className="icons">
              <Link to="/contact">Home</Link> {"|"}{" "}
              <Link to="/contact">Back to top</Link> {"|"}{" "}
              <Link to="/terms-and-conditions">Terms & Conditions</Link>
            </p>
          </div>

          <p className="copy_right">
            © 2025 Academic Dress Hire. All rights reserved.
          </p>
        </div>

        <div className="contact_map">
          <Googlemap />
        </div>

        <div className="contact_info">
          <h3 className="contact_location">Location</h3>

          <p className="location">
            {addressLines.map((line, idx) => (
              <React.Fragment key={idx}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </p>

          <h3 className="contact_service">Customer Service</h3>

          <p className="phone">
            Phone:
            <br />
            {phone}
          </p>

          <p className="openinghours">
            {openMainLines.map((line, idx) => (
              <React.Fragment key={idx}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </p>

          <p className="openinghours">{openingNote}</p>
        </div>
      </div>
    </section>
  );
}
