import React, { useState, useEffect } from "react";
import "./CustomerDetail.css";
import { Link } from "react-router-dom";

function CustomerDetail({ item, items = [], step, setStep, steps }) {
  const [countries, setCountries] = useState([]);
  const [countriesError, setCountriesError] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postcode: "",
    country: "",
    studentId: "",
    phoneNumber: "",
    mobile: "",
    purchaseOrder: "",
    paymentMethod: "creditCard",
    termsAccepted: false,
    message: "",
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    if (step < steps.length) {
      const newStep = step + 1;
      setStep(newStep);
      localStorage.setItem("step", newStep);
      e.preventDefault();
      console.log("Form submitted:", formData);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const loadCountries = async () => {
      // Try REST Countries (preferred)
      try {
        const res = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,cca2,flags"
        );
        if (!res.ok) throw new Error(`REST Countries HTTP ${res.status}`);
        const data = await res.json();
        if (!Array.isArray(data)) throw new Error("Unexpected shape");

        const list = data
          .map((c) => ({
            label: c?.name?.common ?? "",
            value: c?.cca2 ?? "",
            flag: c?.flags?.png ?? c?.flags?.svg ?? "",
          }))
          .filter((c) => c.label && c.value)
          .sort((a, b) => a.label.localeCompare(b.label));

        if (!cancelled) setCountries(list);
        return; // success
      } catch (e1) {
        console.warn("REST Countries failed:", e1);
      }

      // Fallback: FIRST.org (different shape)
      try {
        const res2 = await fetch("https://api.first.org/data/v1/countries");
        if (!res2.ok) throw new Error(`FIRST.org HTTP ${res2.status}`);
        const json = await res2.json();
        const obj = json?.data ?? {};
        const list = Object.entries(obj)
          .map(([code, v]) => ({
            label: v?.country ?? "",
            value: code, // ISO-2
            flag: "", // FIRST doesn't include flags
          }))
          .filter((c) => c.label && c.value)
          .sort((a, b) => a.label.localeCompare(b.label));

        if (!cancelled) setCountries(list);
        return; // success
      } catch (e2) {
        console.warn("FIRST.org fallback failed:", e2);
      }

      // Final fallback so UI still works
      const staticList = [
        { label: "New Zealand", value: "NZ", flag: "" },
        { label: "Australia", value: "AU", flag: "" },
        { label: "United States", value: "US", flag: "" },
        { label: "United Kingdom", value: "GB", flag: "" },
      ];
      if (!cancelled) {
        setCountries(staticList);
        setCountriesError(
          "Could not load countries from network; using a shortened fallback list."
        );
      }
    };

    loadCountries();
    return () => {
      cancelled = true;
    };
  }, []);

  // Use props if provided, otherwise load from localStorage
  const cart =
    items.length > 0 ? items : JSON.parse(localStorage.getItem("cart") || "[]");

  // Calculate total
  const total = cart.reduce(
    (sum, item) => sum + (item.hirePrice || 0) * (item.quantity || 1),
    0
  );

  return (
    <div className="checkout-container">
      {/* Left: Customer Form */}
      <div className="cusomer-details">
        <form onSubmit={handleSubmit} className="customer-form">
          <h1 className="form-title">Place Order</h1>

          {/* Email */}
          <div className="form-group">
            <label className="form-label">Email*</label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className="form-input"
              required
            />
          </div>

          {/* First & Last Name */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">First Name*</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="First Name"
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Last Name*</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Last Name"
                className="form-input"
                required
              />
            </div>
          </div>

          {/* Address */}
          <div className="form-group">
            <label className="form-label">Address*</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Address"
              className="form-input"
              required
            />
          </div>

          <div className="form-row-three">
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              placeholder="City"
              className="form-input"
              required
            />
            <input
              type="text"
              name="postcode"
              value={formData.postcode}
              onChange={handleInputChange}
              placeholder="Postcode"
              className="form-input"
              required
            />

            {/* Country select */}
            <select
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              className="form-select"
              required
            >
              <option value="">Country</option>
              {countries.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {countriesError && (
            <div
              style={{
                marginTop: 8,
                color: "#b45309",
                background: "#fffbeb",
                padding: "6px 10px",
                borderRadius: 6,
                fontSize: 13,
              }}
            >
              {countriesError}
            </div>
          )}

          {/* Student ID */}
          <div className="form-group">
            <label className="form-label">Student ID*</label>
            <input
              type="text"
              name="studentId"
              value={formData.studentId}
              onChange={handleInputChange}
              placeholder="Student ID"
              className="form-input"
              required
            />
          </div>

          {/* Phone & Mobile */}
          <div className="form-row">
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              placeholder="Phone Number"
              className="form-input"
              required
            />
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleInputChange}
              placeholder="Mobile"
              className="form-input"
            />
          </div>

          {/* Terms */}
          <div className="checkbox-group">
            <input
              type="checkbox"
              name="termsAccepted"
              checked={formData.termsAccepted}
              onChange={handleInputChange}
              className="checkbox-input"
              id="termsAccepted"
              required
            />
            <label htmlFor="termsAccepted" className="checkbox-label">
              I've read and agree to all{" "}
              <Link
                to="/terms-and-conditions"
                target="_blank"
                rel="noopener noreferrer"
              >
                Terms and Conditions
              </Link>
            </label>
          </div>

          {/* Payment */}
          <div className="payment-section">
            <h3 className="payment-title">Payment</h3>
            <div className="payment-options">
              <label className="radio-label">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="creditCard"
                  checked={formData.paymentMethod === "creditCard"}
                  onChange={handleInputChange}
                  className="radio-input"
                />
                <span>Credit Card (Verifone)</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="account2Account"
                  checked={formData.paymentMethod === "account2Account"}
                  onChange={handleInputChange}
                  className="radio-input"
                />
                <span>Account2Account (on-line)</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="purchaseOrder"
                  checked={formData.paymentMethod === "purchaseOrder"}
                  onChange={handleInputChange}
                  className="radio-input"
                />
                <span>Purchase Order (University Staff only)</span>
              </label>
              {formData.paymentMethod === "purchaseOrder" && (
                <input
                  type="text"
                  name="purchaseOrder"
                  value={formData.purchaseOrder}
                  onChange={handleInputChange}
                  placeholder="Purchase Order #"
                  className="form-input purchase-order-input"
                  required
                />
              )}
            </div>
          </div>

          {/* Message */}
          <div className="form-group">
            <label className="form-label">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="If you require a wide gown or have any other queries..."
              className="form-textarea"
              rows="4"
            />
          </div>

          <button type="submit" className="order-btn">
            PLACE ORDER
          </button>
        </form>
      </div>

      {/* Right: Cart Summary */}
      <div className="cart-summary-right">
        <h2 className="summary-title">Cart Summary</h2>
        {cart.length > 0 ? (
          <>
            {cart.map((item) => {

              return (
                <div
                  key={item.id}
                  className="summary-card"
                  style={{ position: "relative" }}
                >
                  {/* Hire / Buy ribbon */}
                  {item.name !== "Donation" &&
                    (item.isHire === true ? (
                      <div className="hire-ribbon">Hire</div>
                    ) : (
                      <div className="buy-ribbon">Buy</div>
                    ))}

                  <div className="summary-info">
                    <p className="summary-name">{item.name}</p>

                    {item.selectedOptions &&
                      Object.entries(item.selectedOptions).map(
                        ([label, value]) => (
                          <p key={label} className="summary-option">
                            {label}: <strong>{value}</strong>
                          </p>
                        )
                      )}
                  </div>

                  <div className="summary-price">
                    ${(item.hirePrice || 0).toFixed(2)} × {item.quantity || 1}
                    <br />
                    <strong>
                      $
                      {((item.hirePrice || 0) * (item.quantity || 1)).toFixed(
                        2
                      )}
                    </strong>
                  </div>
                </div>
              );
            })}

            {/* Total */}
            <div className="summary-total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </>
        ) : (
          <p>Your cart is empty.</p>
        )}
      </div>
    </div>
  );
}

export default CustomerDetail;