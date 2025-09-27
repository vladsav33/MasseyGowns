import React, { useState, useEffect } from "react";
import "./PaymentCompleted.css";
import { CreditCard, Eye } from "lucide-react";
import jsPDF from "jspdf";
import { Link } from "react-router-dom";
import { updatePaidStatus } from "./../services/HireBuyRegaliaService";

function PaymentCompleted() {
  // Success dialog state
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showPaymentCard, setShowPaymentCard] = useState(true);
  const [paymentComplete, setPaymentComplete] = useState(false);

  // Card Payment
  const [formData, setFormData] = useState({
    cardHolder: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const [errors, setErrors] = useState({
    cardHolder: false,
    cardNumber: false,
    expiryDate: false,
    cvv: false,
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: false }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      cardHolder: !formData.cardHolder || formData.cardHolder.trim().length < 2,
      cardNumber:
        !formData.cardNumber ||
        formData.cardNumber.replace(/\s/g, "").length < 16,
      expiryDate:
        !formData.expiryDate || !/^\d{2}\/\d{2}$/.test(formData.expiryDate),
      cvv: !formData.cvv || formData.cvv.length < 3,
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handlePayment = () => {
    if (validateForm()) {
      setShowSuccessDialog(true);
      updatePaidStatus();
    }
  };

  const handleCloseSuccessDialog = () => {
    setShowSuccessDialog(false);
    localStorage.removeItem("orderResponse");
  };

  const formatCardHolder = (value) => {
    // Allow only letters, spaces, hyphens, and apostrophes
    return value.replace(/[^a-zA-Z\s\-']/g, "").substring(0, 50);
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\D/g, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  // Get masked card number for success dialog
  const getMaskedCardNumber = () => {
    if (formData.cardNumber.length >= 4) {
      const lastFour = formData.cardNumber.slice(-4);
      return `•••• •••• •••• ${lastFour}`;
    }
    return "•••• •••• •••• ••••";
  };

  // Other Payment methods
  const org = {
    gstNo: "41782315",
    name: "Academic Dress Hire",
    addressLines: [
      "Refectory Rd, University Ave, Massey University, Tennent Drive",
      "Palmerston North",
    ],
    email: "info@masseygowns.org.nz",
    phone: "+64 6 350 4166",
  };

  const customerDetails =
    JSON.parse(localStorage.getItem("customerDetails")) || {};
  const items = JSON.parse(localStorage.getItem("cart")) || [];

  const totals = {
    grandTotal: 88.0,
    amountPaid: 0.0,
    balanceOwing: 88.0,
    includeGstNote: "All prices include GST",
  };

  const bank = {
    heading: "Direct Credit Payment Instructions:",
    urgentLine:
      "Please NOW go into your bank account and make the payment of the amount showing on this order.",
    infoLine:
      "The Account Number, Account Name and the information to include is shown below.",
    instructionsLead:
      "Please read and follow these instructions carefully. The total dollar amount of your order shown above should be deposited into the following account:",
    bankName: "Bank of New Zealand",
    swift: "BKNZNZ22500",
    accountName: "Graduate Women Manawatu Charitable Trust Inc.",
    accountNumber: "02-1231-0017007-000",
    particularsHintPrefix:
      "In the 'Particulars' field type in the order number:",
    payeeCodeHintPrefix: "In the 'Payee Code' field type your surname.",
    referenceHint: "Leave the 'Reference' field blank.",
  };

  // Payment details for success dialog
  const paymentDetails = {
    amount: `$${totals.grandTotal.toFixed(2)} NZD`,
    paymentMethod: getMaskedCardNumber(),
    date: new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
    transactionId: `TXN${Math.random().toString().substr(2, 9)}`,
    email: customerDetails.email || "customer@example.com",
  };

  // ------- Helpers & handlers -------
  const currency = (n) =>
    n.toLocaleString("en-NZ", { style: "currency", currency: "NZD" });

  const onPrint = () => window.print();

  const onSubmitContact = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    alert(`Thanks ${data.firstName}! We'll record your details.`);
  };

  const PaymentSuccessDialog = ({ isOpen, onClose, paymentDetails }) => {
    // Close dialog with Escape key
    useEffect(() => {
      const handleEscapeKey = (e) => {
        if (e.key === "Escape" && isOpen) {
          onClose();
        }
      };

      if (isOpen) {
        document.addEventListener("keydown", handleEscapeKey);
      }

      return () => {
        document.removeEventListener("keydown", handleEscapeKey);
      };
    }, [isOpen, onClose]);

    // Prevent body scroll when dialog is open
    useEffect(() => {
      if (isOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "unset";
      }

      return () => {
        document.body.style.overflow = "unset";
      };
    }, [isOpen]);

    const handleOverlayClick = (e) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    };

    const backBtn = async () => {
      localStorage.removeItem("step");
    }

    const handleDownloadReceipt = (paymentDetails) => {
      const doc = new jsPDF();

      // === Header ===
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.setTextColor(40, 40, 40);
      doc.text("PAYMENT RECEIPT", 105, 20, { align: "center" });

      // === Subheading / Company Info ===
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 100, 100);
      doc.text("Thank you for your payment!", 105, 28, { align: "center" });
      doc.text("Massey University Regalia Hire Service", 105, 35, {
        align: "center",
      });

      // === Divider Line ===
      doc.setDrawColor(200, 200, 200);
      doc.line(20, 40, 190, 40);

      // === Payment Info Section ===
      let y = 50;
      const lineHeight = 10;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text("Payment Details", 20, y);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      y += lineHeight;
      doc.text(`Transaction ID:`, 20, y);
      doc.text(`${paymentDetails.transactionId}`, 80, y);

      y += lineHeight;
      doc.text(`Date:`, 20, y);
      doc.text(`${paymentDetails.date}`, 80, y);

      y += lineHeight;
      doc.text(`Email:`, 20, y);
      doc.text(`${paymentDetails.email}`, 80, y);

      y += lineHeight;
      doc.text(`Payment Method:`, 20, y);
      doc.text(`${paymentDetails.paymentMethod}`, 80, y);

      y += lineHeight;
      doc.text(`Amount Paid:`, 20, y);
      doc.setTextColor(0, 128, 0);
      doc.setFont("helvetica", "bold");
      doc.text(`$${paymentDetails.amount}`, 80, y);

      // === Divider ===
      doc.setDrawColor(200, 200, 200);
      y += 10;
      doc.line(20, y, 190, y);

      // === Footer / Thank You ===
      y += 15;
      doc.setFontSize(13);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(60, 60, 60);
      doc.text("Thank you for your payment!", 105, y, { align: "center" });

      y += 8;
      doc.setFontSize(11);
      doc.setTextColor(120, 120, 120);
      doc.text("A copy of this receipt has been sent to your email.", 105, y, {
        align: "center",
      });

      // === Save File ===
      const filename = `Payment_Receipt_${paymentDetails.transactionId}.pdf`;
      doc.save(filename);
    };

    const handleContinue = () => {
      onClose();
      setShowPaymentCard(false); // hide payment form
      setPaymentComplete(true); // show thank-you message
    };

    if (!isOpen) return null;

    return (
      <div className="dialog-overlay" onClick={handleOverlayClick}>
        <div className="success-dialog">
          <div className="success-icon">
            <svg className="checkmark" viewBox="0 0 24 24">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>

          <h2 className="dialog-title">Payment Successful!</h2>
          <p className="dialog-message">
            Your payment has been processed successfully. You will receive a
            confirmation email shortly.
          </p>

          <div className="payment-details">
            <div className="detail-row">
              <span className="detail-label">Amount Paid</span>
              <span className="detail-value">{paymentDetails.amount}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Payment Method</span>
              <span className="detail-value">
                {paymentDetails.paymentMethod}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Date</span>
              <span className="detail-value">{paymentDetails.date}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Total</span>
              <span className="detail-value">{paymentDetails.amount}</span>
            </div>
          </div>

          <div className="transaction-id">
            Transaction ID: {paymentDetails.transactionId}
          </div>

          <div className="dialog-actions">
            <button
              className="btnsPay btn-secondary"
              onClick={() => handleDownloadReceipt(paymentDetails)}
            >
              Download PDF Receipt
            </button>
            <button
              className="btnsPay btn-primary"
              onClick={handleContinue}
              style={{ textAlign: "center" }}
            >
              Continue
            </button>
          </div>

          <div className="receipt-note">
            A receipt has been sent to {paymentDetails.email}. Please keep this
            for your records.
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {customerDetails.paymentMethod === "1" ? (
        <div className="payment-container">
          {/* Language Selector */}
          <div className="language-selector">
            <select className="language-select">
              <option>English</option>
            </select>
          </div>
          {showPaymentCard && (
            <div className="payment-content">
              {/* Payment Form Card */}
              <div className="payment-form-card">
                <div className="form-header">
                  <CreditCard className="form-icon" />
                  <h2 className="form-title">Pay with card</h2>
                </div>

                <div className="form-fields">
                  {/* Card Holder Name */}
                  <div className="field-group">
                    <label className="field-label">Cardholder Name</label>
                    <div className="input-wrapper">
                      <input
                        type="text"
                        placeholder="Enter cardholder name"
                        value={formData.cardHolder}
                        onChange={(e) =>
                          handleInputChange(
                            "cardHolder",
                            formatCardHolder(e.target.value)
                          )
                        }
                        className={`field-input ${
                          errors.cardHolder ? "field-error" : ""
                        }`}
                        maxLength="50"
                      />
                      <div className="input-icon">
                        <CreditCard className="icon" />
                      </div>
                    </div>
                    {errors.cardHolder && (
                      <p className="error-message">
                        Cardholder name is required
                      </p>
                    )}
                  </div>

                  {/* Card Number */}
                  <div className="field-group">
                    <label className="field-label">Card number</label>
                    <div className="input-wrapper">
                      <input
                        type="text"
                        placeholder="Your card number"
                        value={formData.cardNumber}
                        onChange={(e) =>
                          handleInputChange(
                            "cardNumber",
                            formatCardNumber(e.target.value)
                          )
                        }
                        className={`field-input ${
                          errors.cardNumber ? "field-error" : ""
                        }`}
                        maxLength="19"
                      />
                      <div className="input-icon">
                        <CreditCard className="icon" />
                      </div>
                    </div>
                    {errors.cardNumber && (
                      <p className="error-message">Card number is not valid</p>
                    )}
                  </div>

                  {/* Expiration Date and CVV */}
                  <div className="field-row">
                    <div className="field-group">
                      <label className="field-label">Expiration date</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={formData.expiryDate}
                        onChange={(e) =>
                          handleInputChange(
                            "expiryDate",
                            formatExpiryDate(e.target.value)
                          )
                        }
                        className={`field-input ${
                          errors.expiryDate ? "field-error" : ""
                        }`}
                        maxLength="5"
                      />
                      {errors.expiryDate && (
                        <p className="error-message">
                          Expiration date must be valid (MM/YY)
                        </p>
                      )}
                    </div>

                    <div className="field-group">
                      <label className="field-label">CVV</label>
                      <div className="input-wrapper">
                        <input
                          type="password" // mask input automatically
                          placeholder="CVV"
                          value={formData.cvv}
                          onChange={(e) =>
                            handleInputChange(
                              "cvv",
                              e.target.value.replace(/\D/g, "")
                            )
                          }
                          className={`field-input ${
                            errors.cvv ? "field-error" : ""
                          }`}
                          maxLength="4"
                        />
                      </div>
                      {errors.cvv && (
                        <p className="error-message">CVV is required</p>
                      )}
                    </div>
                  </div>

                  {/* Pay Button */}
                  <button onClick={handlePayment} className="pay-button">
                    Pay ${totals.grandTotal || 0}
                  </button>
                </div>

                {/* Footer */}
                <div className="form-footer">
                  <div className="footer-text">Secure payments provided by</div>
                </div>
              </div>
            </div>
          )}

          {/* Success Dialog */}
          <PaymentSuccessDialog
            isOpen={showSuccessDialog}
            onClose={handleCloseSuccessDialog}
            paymentDetails={paymentDetails}
          />

          {paymentComplete && (
            <div className="thank-you-message">
              <h2> Thank you for your purchasing!</h2>
              <p>
                Your payment was successful. A receipt has been sent to{" "}
                <strong>{customerDetails.email}</strong>.
                <br />
                <Link to="/" className="home-btn" onClick={() => backBtn()}>
                  Back to Home
                </Link>
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="oc-wrap">
          {/* Header */}
          <header className="oc-header">
            <div>
              <h1 className="oc-title">Order Confirmation</h1>
              <div className="oc-gst">GST No: {org.gstNo}</div>
            </div>
            <div className="oc-org">
              <div className="oc-org-name">{org.name}</div>
              {org.addressLines.map((l, i) => (
                <div key={i}>{l}</div>
              ))}
              <div className="oc-contact">Email: {org.email}</div>
              <div className="oc-contact">Ph: {org.phone}</div>
            </div>
          </header>

          <p className="oc-note">
            Congratulations, you have successfully ordered. Please click on the
            print link below to print your receipt. All collection and return
            information can be found on the attached receipt. Your receipt and
            order confirmation will also be emailed to you shortly!
          </p>

          {/* Order meta */}
          <section className="oc-meta-grid">
            <div>
              <div className="oc-meta-row">
                <span>Order Number</span>
                <strong>{customerDetails.id}</strong>
              </div>
              <div className="oc-meta-row">
                <span>Name</span>
                <strong>
                  {customerDetails.firstName} {customerDetails.lastName}
                </strong>
              </div>
              <div className="oc-meta-row">
                <span>Email Address</span>
                <strong>{customerDetails.email}</strong>
              </div>
              <div className="oc-meta-row">
                <span>Mobile Number</span>
                <strong>{customerDetails.mobile || "-"}</strong>
              </div>
            </div>

            <div>
              <div className="oc-meta-row">
                <span>Address</span>
                <strong>{customerDetails.address}</strong>
              </div>
              <div className="oc-meta-row">
                <span>City, Post Code</span>
                <strong>
                  {customerDetails.city} {customerDetails.postcode}
                </strong>
              </div>
              <div className="oc-meta-row">
                <span>Country</span>
                <strong>{customerDetails.country}</strong>
              </div>
              <div className="oc-meta-row">
                <span>Phone Number</span>
                <strong>{customerDetails.phoneNumber}</strong>
              </div>
            </div>
          </section>

          {/* Items table */}
          <div className="oc-table-wrap">
            <table className="oc-table">
              <thead>
                <tr>
                  <th className="oc-col-item">Item</th>
                  <th className="oc-col-unit">Unit</th>
                  <th className="oc-col-qty">Quantity</th>
                  <th className="oc-col-total">Total</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it, idx) => (
                  <tr key={idx}>
                    <td>
                      <div className="oc-item-name">{it.name}</div>
                      {it.details && (
                        <div className="oc-item-details">{it.details}</div>
                      )}
                    </td>
                    <td>{it.unit}</td>
                    <td>Quantity {it.qty}</td>
                    <td>{it.total}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="oc-row-spacer">
                  <td colSpan={4} />
                </tr>
                <tr>
                  <td className="oc-right" colSpan={3}>
                    Grand total
                  </td>
                  <td>{currency(totals.grandTotal)}</td>
                </tr>
                <tr>
                  <td className="oc-right" colSpan={3}>
                    Amount Paid
                  </td>
                  <td>{currency(totals.amountPaid)}</td>
                </tr>
                <tr>
                  <td className="oc-right" colSpan={3}>
                    Balance Owing
                  </td>
                  <td>{currency(totals.balanceOwing)}</td>
                </tr>
                <tr>
                  <td colSpan={4} className="oc-gst-note">
                    {totals.includeGstNote}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Direct credit instructions */}
          <section className="oc-bank">
            <h2 className="oc-bank-title">{bank.heading}</h2>
            <p className="oc-bank-urgent">{bank.urgentLine}</p>
            <p className="oc-bank-urgent">{bank.infoLine}</p>

            <p className="oc-bank-lead">{bank.instructionsLead}</p>
            <ul className="oc-bank-list">
              <li>
                <strong>Bank:</strong> {bank.bankName}
              </li>
              <li>
                <strong>Bank Swift Code:</strong> {bank.swift}
              </li>
              <li>
                <strong>Account Name:</strong> {bank.accountName}
              </li>
              <li>
                <strong>Account Number:</strong> {bank.accountNumber}
              </li>
            </ul>

            <p>
              {bank.particularsHintPrefix} <strong>{customerDetails.id}</strong>
              .
              <br />
              {bank.payeeCodeHintPrefix}
              <br />
              {bank.referenceHint}
            </p>

            <div className="oc-print-row">
              <button type="button" className="oc-print-btn" onClick={onPrint}>
                🖨️ Please print this receipt for your records
              </button>
            </div>
          </section>

          {/* Contact capture */}
          <section className="oc-form">
            <form onSubmit={onSubmitContact} className="oc-form-grid">
              <div className="oc-field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  defaultValue={customerDetails.email}
                  type="email"
                />
              </div>

              <div className="oc-field">
                <label htmlFor="firstName">
                  First Name<span className="oc-req">*</span>
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  defaultValue="Abc"
                  required
                />
              </div>

              <div className="oc-field">
                <label htmlFor="lastName">
                  Last Name<span className="oc-req">*</span>
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  defaultValue="abc"
                  required
                />
              </div>

              <label className="oc-check">
                <input type="checkbox" name="newsletter" /> I would like to
                receive email newsletters and Academic Award information -
              </label>

              <div className="oc-actions">
                <button className="oc-send" type="submit">
                  SEND
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </>
  );
}

export default PaymentCompleted;
