import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <section className="footer">
      <div className="footer_left">
        <p className="icons">
          <Link to="/contact">Home</Link> {"|"}{" "}
          <Link to="/contact">Back to top</Link> {"|"}{" "}
          <Link to="/contact">Terms & Conditions</Link>
        </p>
        <p>© 2025 Academic Dress Hire. All rights reserved.</p>
      </div>
      <div className="footer_pay">
        <img src="/visa.png" alt="visa&master" className="img" />
      </div>
    </section>
  );
}
