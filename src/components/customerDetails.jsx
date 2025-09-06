import React, { useState } from "react";
import "./customerDetails.css";

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
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto p-6 bg-white shadow rounded-lg space-y-6"
      >
        <h1 className="text-2xl font-bold text-gray-00">Place Order</h1>

        {/* Email */}
        <div>
          <label className="block mb-1 text-gray-700">Email*</label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        {/* First & Last Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-gray-700">First Name*</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="First Name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-700">Last Name*</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="Last Name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
        </div>

        {/* Address, City, Postcode */}
        <div>
          <label className="block mb-1 text-gray-700">Address*</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Address"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            placeholder="City"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
          <input
            type="text"
            name="postcode"
            value={formData.postcode}
            onChange={handleInputChange}
            placeholder="Postcode"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
          <select
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
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
        <div>
          <label className="block mb-1 text-gray-700">Student ID*</label>
          <input
            type="text"
            name="studentId"
            value={formData.studentId}
            onChange={handleInputChange}
            placeholder="Student ID"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Phone & Mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            placeholder="Phone Number"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
          <input
            type="tel"
            name="mobile"
            value={formData.mobile}
            onChange={handleInputChange}
            placeholder="Mobile"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Terms & Conditions */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="termsAccepted"
            checked={formData.termsAccepted}
            onChange={handleInputChange}
            className="w-5 h-5"
            required
          />
          <label className="text-gray-600">
            I've read and agree to all Terms and Conditions
          </label>
        </div>

        {/* Payment Methods */}
        <div>
          <h3 className="font-semibold text-gray-700 mb-2">Payment</h3>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="paymentMethod"
                value="account2Account"
                checked={formData.paymentMethod === "account2Account"}
                onChange={handleInputChange}
              />
              <span>Account2Account (on-line)</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="paymentMethod"
                value="purchaseOrder"
                checked={formData.paymentMethod === "purchaseOrder"}
                onChange={handleInputChange}
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            )}
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="paymentMethod"
                value="creditCard"
                checked={formData.paymentMethod === "creditCard"}
                onChange={handleInputChange}
              />
              <span>Credit Card (Verifone)</span>
            </label>
          </div>
        </div>

        {/* Message */}
        <div>
          <label className="block mb-1 text-gray-700">Message</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            placeholder="If you require a wide gown or have any other queries..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            rows="4"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full order-btn"
        >
          PLACE ORDER
        </button>
      </form>
    </>
  );
}

export default CustomerDetails;
