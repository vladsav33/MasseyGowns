import React, { useState } from "react";
import "./Contact.css";
import { Link } from "react-router-dom";
import Googlemap from "./Googlemap";

export default function Contact() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [honeypot, setHoneypot] = useState("");

  // 简单邮箱校验（前端）
  const isValidEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg({ type: "", text: "" });

    // 蜜罐命中：机器人，直接返回成功但不提交
    if (honeypot) {
      setMsg({ type: "success", text: "Thanks! We received your request." });
      setEmail("");
      return;
    }

    if (!isValidEmail(email)) {
      setMsg({ type: "error", text: "Please enter a valid email address." });
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/contact/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      if (!res.ok) {
        // 尝试读取后端返回的错误信息
        let errText = "Submit failed. Please try again later.";
        try {
          const data = await res.json();
          if (data?.message) errText = data.message;
        } catch (_) {}
        throw new Error(errText);
      }

      setMsg({ type: "success", text: "Thank you! We'll be in touch." });
      setEmail("");
    } catch (err) {
      setMsg({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="contact">
      <div className="contact_inner">
        {/* 左侧 email contact */}
        <div className="contact_left">
          <h2 className="contact_email">Email Contact</h2>

          <form onSubmit={handleSubmit} className="contact_form" noValidate>
            {/* 蜜罐（对人类不可见） */}
            <input
              className="honeypot"
              autoComplete="off"
              tabIndex="-1"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              placeholder="Leave this field empty"
            />

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="contact_input"
              aria-label="Email address"
            />
            <button type="submit" className="contact_button" disabled={loading}>
              {loading ? "Sending..." : "Send"}
            </button>
          </form>

          {msg.text ? (
            <div
              className={`contact_msg ${
                msg.type === "success" ? "success" : "error"
              }`}
              role="status"
              aria-live="polite"
            >
              {msg.text}
            </div>
          ) : null}
          <div className="footer_pay">
            <img src="/visa.png" alt="visa&master" className="visaimg" />
          </div>
          <div className="footer_left">
            <p className="icons">
              <Link to="/contact">Home</Link> {"|"}{" "}
              <Link to="/contact">Back to top</Link> {"|"}{" "}
              <Link to="/contact">Terms & Conditions</Link>
            </p>
          </div>

          <p className="copy_right">
            © 2025 Academic Dress Hire. All rights reserved.
          </p>
        </div>

        {/* 中间 Google Map */}
        <div className="contact_map">
          <Googlemap />
        </div>

        {/* 右侧信息 */}
        <div className="contact_info">
          <h3 className="contact_location">Location</h3>
          <p className="location">
            3 Refectory Road, University Avenue <br />
            Massey University <br />
            Palmerston North
          </p>
          <h3 className="contact_service">Customer Service</h3>
          <p className="phone">
            Phone: <br />
            06 350 4166
          </p>
          <p className="email">
            Email: <br />
            info@masseygowns.org.nz
          </p>
          <p className="openinghours">
            Opening Hours: <br />
            Monday - Thursday 9am - 2.30pm
          </p>
          <p className="detail">
            For more details, click{" "}
            <Link to="/contact" className="underline">
              here
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
