import React, { useState } from "react";
import "./CustomerDetails.css";

function CustomerDetails(item, quantity) {
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
    paymentMethod: "purchaseOrder",
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

  const countries = [
    "New Zealand",
    "Australia",
    "United States",
    "United Kingdom",
    "Canada",
    "Germany",
    "France",
    "Japan",
    "China",
    "India",
    "Brazil",
    "South Africa",
    "Other",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <>
      {/* Customer Details */}
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

        {/* Address, City, Postcode */}
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
          />
          <input
            type="text"
            name="postcode"
            value={formData.postcode}
            onChange={handleInputChange}
            placeholder="Postcode"
            className="form-input"
          />
          <select
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            className="form-select"
          >
            <option value="">Country</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>

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

        {/* Terms & Conditions */}
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
            I've read and agree to all Terms and Conditions
          </label>
        </div>

        {/* Payment Methods */}
        <div className="payment-section">
          <h3 className="payment-title">Payment</h3>
          <div className="payment-options">
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
              />
            )}
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

        {/* Submit */}
        <button type="submit" className="order-btn">
          PLACE ORDER
        </button>
      </form>
    </>
  );
}

export default CustomerDetails;