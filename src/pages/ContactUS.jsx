import React, { useState, useEffect } from "react";
import "./ContactUs.css";
import Navbar from "../components/Navbar";
import Googlemap from "../components/Googlemap";
import { sendContactForm } from "../api/FormApi";

export default function ContactUS() {
  const [formData, setFormData] = useState({
    id: "",
    email: "",
    firstName: "",
    lastName: "",
    subject: "",
    query: "",
    captchaInput: "",
  });

  const [captchaCode, setCaptchaCode] = useState("");

  useEffect(() => {
    generateCaptcha();
  }, []);

  const generateCaptcha = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
    let code = "";
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      id: `contacts_${Date.now()}`,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.captchaInput !== captchaCode) {
      alert("Captcha incorrect, please try again.");
      generateCaptcha();
      return;
    }

    try {
      const result = await sendContactForm(formData);
      alert("Your enquiry has been sent successfully!");
      console.log("API Response:", result);

      setFormData({
        id: "",
        email: "",
        firstName: "",
        lastName: "",
        subject: "",
        query: "",
        captchaInput: "",
      });
      generateCaptcha();
    } catch (error) {
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="bg-white">
      <Navbar />
      <div className="contactus">
        <h2>Contact Us</h2>
        <div className="innercontact">
          <div className="contactinfo">
            <p>
              If you have any questions, feedback or issues with your order
              please contact ACADEMIC DRESS HIRE
            </p>

            <p>
              <span className="label">Courier Address :</span> 3 Refectory Road,
              Massey University, Palmerston North 4472
            </p>
            <p className="label">Customer service:</p>
            <ul className="pande">
              <li>Phone: 06.350.4166</li>
              <li>Email: info@masseygowns.org.nz</li>
            </ul>
            <p>
              We will endeavour to respond to your enquiry as soon as possible.
            </p>
            <p>Our normal hours are 9:00am – 2.30pm, Mon – Thurs.</p>
            <p>We operate extended hours during the graduation week.</p>
          </div>
          <div className="googlemap">
            <Googlemap />
          </div>
        </div>
        <div className="contactform">
          <p>
            To send us an enquiry please fill in the following form, and we will
            endeavour to reply to you as soon as possible.
          </p>

          <form onSubmit={handleSubmit}>
            <label>
              Your Email*
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              First Name*
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Last Name*{" "}
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Subject*
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Enquiry*
              <textarea
                type="text"
                name="query"
                value={formData.query}
                onChange={handleChange}
                rows="5"
                required
              />
            </label>
            <div className="captcha">
              <p>Please type the characters you see:</p>
              <div className="captcha-row">
                <input
                  type="text"
                  name="captchaInput"
                  value={formData.captchaInput}
                  onChange={handleChange}
                  required
                />
                <div className="captcha-code">{captchaCode}</div>
                <button
                  type="button"
                  className="refresh-btn"
                  onClick={generateCaptcha}
                >
                  Refresh
                </button>
              </div>
            </div>

            <button type="submit" className="send-btn">
              SEND
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
