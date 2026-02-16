import React, { useState } from "react";
import Navbar from "../components/Navbar";
import ProgressBar from "../components/ProgressBar";
import CustomerDetail from "../components/CustomerDetail";
import Contact from "../components/Contact";
import ProgressButtons from "../components/ProgressButtons";

export default function CustomerDetailsPage() {

  const [item] = useState(() => {
    const saved = localStorage.getItem("item");
    return saved ? JSON.parse(saved) : {};
  });

  const steps = [
    "Select Regalia",
    "Place Order",
    "Customer Details",
    "Payment Completed",
  ];

  const step = 3;

  return (
    <div>
      <Navbar />

      <div className="content">
        <ProgressBar step={step} steps={steps} />

        <ProgressButtons step={step} steps={steps} prevPath="/cart" />

        <CustomerDetail
          item={item}
          quantity={item.quantity || 1}
          step={step}
        //   setStep={setStep}
          steps={steps}
        ></CustomerDetail>

        <ProgressButtons step={step} steps={steps} prevPath="/cart" />
        <Contact />
      </div>
    </div>
  );
}
