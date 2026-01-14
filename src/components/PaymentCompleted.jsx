import React, { useState, useEffect } from "react";
import "./PaymentCompleted.css";
import { CreditCard, Eye } from "lucide-react";
import jsPDF from "jspdf";
import { Link } from "react-router-dom";
import { updatePaidStatus } from "./../services/HireBuyRegaliaService";

function PaymentCompleted() {


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
    grandTotal: 48.0,
    amountPaid: 0.0,
    balanceOwing: 48.0,
    includeGstNote: "All prices include GST",
  };
  // Calculate total
  const total = items.reduce(
    (sum, item) => sum + (item.hirePrice || 0) * (item.quantity || 1),
    0
  );

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


  // ------- Helpers & handlers -------
  const currency = (n) =>
    n.toLocaleString("en-NZ", { style: "currency", currency: "NZD" });

  const onPrint = () => window.print();

  const onSubmitContact = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    alert(`Thanks ${data.firstName}! We'll record your details.`);
  };

  return (
    <>
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
                <strong>{customerDetails.phone}</strong>
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
                    <td>{it.hirePrice}</td>
                    <td>Quantity {it.quantity}</td>
                    <td>{(it.hirePrice) * (it.quantity || 1)}</td>
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
                  <td>{currency(total)}</td>
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
    </>
  );
}

export default PaymentCompleted;
