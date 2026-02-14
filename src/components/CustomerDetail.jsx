import React, { useState, useEffect } from "react";
import "./CustomerDetail.css";
import { Link } from "react-router-dom";
import { submitCustomerDetails } from "./../services/HireBuyRegaliaService.js";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import { sendOrderEmail } from "../api/EmailApi";
import { EmailTemplate } from "../components/EmailTemplate.jsx";
import { getEmailTemplateByName } from "../api/EmailApi";

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
    country: "NZ",
    studentId: "",
    phone: "",
    mobile: "",
    eventDate: "",
    purchaseOrder: "PN",
    paymentMethod: "1",
    termsAccepted: false,
    message: "",
  });

  // Use props if provided, otherwise load from localStorage
  const cart =
    items.length > 0 ? items : JSON.parse(localStorage.getItem("cart") || "[]");
  localStorage.setItem("customerDetails", JSON.stringify(formData));

  // Calculate total - use buyPrice or hirePrice based on item mode
  const total = cart.reduce((sum, item) => {
    // Use buyPrice if item is in buy mode (isHiring === false), otherwise use hirePrice
    const price =
      item.isHiring === false ? item.buyPrice || 0 : item.hirePrice || 0;
    return sum + price * (item.quantity || 1);
  }, 0);

  // Helper function to get item price based on hire/buy mode
  const getItemPrice = (item) => {
    return item.isHiring === false ? item.buyPrice || 0 : item.hirePrice || 0;
  };

  const handleDateChange = (date) => {
    setFormData({ ...formData, eventDate: date });
  };

  const today = new Date().toISOString().split("T")[0];

  const selectedCeremonyId = JSON.parse(
    localStorage.getItem("selectedCeremonyId") || 0,
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handlePurchaseOrderChange = (e) => {
    let value = e.target.value;

    // Always ensure it starts with 'PN'
    if (value.length < 2 || !value.startsWith("PN")) {
      const additionalText = value.replace(/^P?N?/i, "");
      value = "PN" + additionalText;
    }

    setFormData((prev) => ({
      ...prev,
      purchaseOrder: value,
    }));
  };

  const ensureCursorAfterPN = (input) => {
    setTimeout(() => {
      const cursorPos = input.selectionStart;
      const selectionEnd = input.selectionEnd;

      if (cursorPos < 2) {
        // If cursor is before PN, move it to after PN
        input.setSelectionRange(2, Math.max(2, selectionEnd));
      }
    }, 0);
  };

  const handlePurchaseOrderInteraction = (e) => {
    // Prevent backspace/delete from affecting PN
    if (e.type === "keydown" && (e.key === "Backspace" || e.key === "Delete")) {
      const cursorPosition = e.target.selectionStart;
      if (e.key === "Backspace" && cursorPosition <= 2) {
        e.preventDefault();
        return;
      }
      if (e.key === "Delete" && cursorPosition < 2) {
        e.preventDefault();
        return;
      }
    }

    ensureCursorAfterPN(e.target);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Store customer details
    localStorage.setItem("customerDetails", JSON.stringify(formData));

    try {
      // Get the current cart
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      console.log("Cart before submission:", cart);

      localStorage.setItem("paymentMethod", parseInt(formData.paymentMethod));

      // Submit order details
      const [result] = await Promise.all([submitCustomerDetails(formData)]);
      if (parseInt(formData.paymentMethod) == 3) {
        orderCompletionEmail();
      }

      console.log("Order received=", result);
      localStorage.setItem("orderNo", result.referenceNo);
      debugger;

      console.log("Order submission completed successfully");
      // setTimeout(() => { debugger; }, 0);
      // debugger;

      // Clear the cart after successful submission
      localStorage.removeItem("cart");
      localStorage.removeItem("item");
      localStorage.removeItem("selectedCeremonyId");
      localStorage.removeItem("selectedCourseId");
      // localStorage.removeItem("grandTotal");

      // Dispatch cart update event to notify other components (like Navbar)
      window.dispatchEvent(new Event("cartUpdated"));

      // Proceed to next step
      if (step < steps.length) {
        const newStep = step + 1;
        setStep(newStep);
        localStorage.setItem("step", newStep);

        // Scroll to top for better UX
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "smooth",
        });
      }
    } catch (error) {
      console.error("Error during order submission:", error);
      alert("There was an error submitting your order. Please try again.");
    }
  };

  const orderCompletionEmail = async () => {
    const emailPayload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      gstNumber: 0,
      invoiceNumber: 0,
      invoiceDate: 0,
      studentId: formData.studentId,
      mobile: formData.mobile,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      postcode: formData.postcode,
      country: formData.country,
      cart: cart,
      grandTotal: 0,
      amountPaid: 0,
      balanceOwing: 0,
    };

    const data = await getEmailTemplateByName("OrderCompleted");
    console.log(data);

    const template = data.taxReceiptHtml;
    const emailHtml = EmailTemplate(emailPayload, template);

    try {
      await sendOrderEmail({
        to: formData.email,
        subject: data.subjectTemplate,
        htmlBody: emailHtml,
      });
    } catch (err) {
      console.error("Email sending failed:", err);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const loadCountries = async () => {
      // Try REST Countries (preferred)
      try {
        const res = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,cca2,flags",
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
            value: code,
            flag: "",
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
        { label: "United Kingdom", value: "UK", flag: "" },
        { label: "United States", value: "US", flag: "" },
      ];
      if (!cancelled) {
        setCountries(staticList);
        setCountriesError(
          "Could not load countries from network; using a shortened fallback list.",
        );
      }
    };

    loadCountries();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="checkout-container">
      {/* Left: Customer Form */}
      <div className="cusomer-details">
        <form onSubmit={handleSubmit} className="customer-form">
          <h1 className="order-form-title">Place Order</h1>

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

          {/* Student ID & Phone Number */}
          <div className="form-row">
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

            <div className="form-group">
              <label className="form-label">Phone Number*</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Phone Number"
                className="form-input"
                required
              />
            </div>
          </div>

          {selectedCeremonyId === 2 && (
            <div>
              <label className="form-label">
                What date do you plan to take the photos?
                <i>Please allow two weeks to prepare and courier the order.</i>
              </label>
              <input
                type="date"
                name="eventDate"
                value={formData.eventDate}
                onChange={handleChange}
                min={today}
                className="form-input"
                required
              />
              {/* <DatePicker
                selected={formData.eventDate}
                onChange={handleDateChange}
                dateFormat="dd/MM/yyyy"
                placeholderText="DD/MM/YYYY"
                className="form-input"
              /> */}
            </div>
          )}
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
                  value="1"
                  checked={formData.paymentMethod === "1"}
                  onChange={handleInputChange}
                  className="radio-input"
                />
                <span>
                  Credit/Debit Card (Paystation) or Account2Account (Poli)
                </span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="3"
                  checked={formData.paymentMethod === "3"}
                  onChange={handleInputChange}
                  className="radio-input"
                />
                <span>Purchase Order (University Staff only)</span>
              </label>
              {formData.paymentMethod === "3" && (
                <input
                  type="text"
                  name="purchaseOrder"
                  value={formData.purchaseOrder}
                  onChange={handlePurchaseOrderChange}
                  onKeyDown={handlePurchaseOrderInteraction}
                  onClick={handlePurchaseOrderInteraction}
                  onFocus={handlePurchaseOrderInteraction}
                  onSelect={handlePurchaseOrderInteraction}
                  onKeyUp={handlePurchaseOrderInteraction}
                  placeholder="Enter ID after PN"
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
              const itemPrice = getItemPrice(item);
              const itemTotal = itemPrice * (item.quantity || 1);

              return (
                <div
                  key={item.id}
                  className="summary-card"
                  style={{ position: "relative" }}
                >
                  {/* Hire / Buy ribbon */}
                  {item.name !== "Donation" &&
                    (item.isHiring === true ? (
                      <div className="hire-ribbon">H</div>
                    ) : (
                      <div className="buy-ribbon">B</div>
                    ))}

                  <div className="summary-info">
                    <p className="summary-name">{item.name}</p>

                    {item.options &&
                      item.options.map((option) => {
                        const selectedId = item.selectedOptions?.[option.label];
                        if (!selectedId) return null;

                        const selectedChoice = option.choices.find(
                          (c) => String(c.id || c.value) === String(selectedId),
                        );

                        const displayValue = selectedChoice
                          ? selectedChoice.value ||
                            selectedChoice.size ||
                            selectedChoice.name ||
                            selectedChoice
                          : selectedId;

                        return (
                          <p key={option.label} className="summary-option">
                            {option.label}: <strong>{displayValue}</strong>
                          </p>
                        );
                      })}
                  </div>

                  <div className="summary-price">
                    ${itemPrice.toFixed(2)} * {item.quantity || 1}
                    <br />
                    <strong>${itemTotal.toFixed(2)}</strong>
                  </div>
                </div>
              );
            })}

            {/* Total */}
            <div className="summary-total">
              <span>Total (Including GST)</span>
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
