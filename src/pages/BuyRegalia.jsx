import React, { useState, useEffect } from "react";
import "./BuyRegalia.css";
import Navbar from "../components/Navbar";
import Contact from "../components/Contact";
import ProgressBar from "../components/ProgressBar";
import ProgressButtons from "../components/ProgressButtons";
import BuySelectRegalia from "../components/BuySelectRegalia";
import CartList from "../components/CartList";
import CustomerDetail from "../components/CustomerDetail";
import PaymentCompleted from "../components/PaymentCompleted";
import { useLocation } from 'react-router-dom';

function BuyRegalia() {
  const action = 1; // Buy

  // const [step, setStep] = useState(() => {
  //   return Number(localStorage.getItem("step")) || 1;
  // });
   const location = useLocation();

  const [step, setStep] = useState(() => {
      if (location.state?.step) {
        return Number(location.state.step);
      }
      return Number(localStorage.getItem("step")) || 1;
    });

  const [item, setItem] = useState(() => {
    const saved = localStorage.getItem("item");
    return saved ? JSON.parse(saved) : "";
  });

  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  const steps = [
    "Select Regalia",
    "Place Order",
    "Customer Details",
    "Payment Completed",
  ];

  return (
    <>
      <div className="content">
        <Navbar />
        <div></div>
        {/* <h2>Buy Regalia</h2> */}
        <ProgressBar step={step} steps={steps} />
        <ProgressButtons
          action={action}
          step={step}
          setStep={setStep}
          steps={steps}
        />

        {step === 1 && (
          <>
            {/* Show loading while fetching */}
            {/* {loading && (
            <div style={{ padding: "20px", textAlign: "center" }}>
              Loading data...
            </div>
          )} */}

            {/* Show error if API fails */}
            {/* {error && (
            <div
              style={{
                padding: "10px",
                backgroundColor: "#fef2f2",
                color: "#dc2626",
                borderRadius: "4px",
                margin: "10px 0",
              }}
            >
              Error loading data: {error}
            </div>
          )} */}

            {/* Show component when not loading */}
            {/* {!loading && ( */}
            <BuySelectRegalia setItems={setItems} />
            {/* )} */}

            {/* Show items base on selected ceremony and course */}
            {/* {!loading && ( */}
            <CartList
              step={step}
              item={item}
              items={items}
              setItem={setItem}
              setItems={setItems}
            />
            {/* )} */}
          </>
        )}
        {step === 2 && (
          <div>
            <h2 className="cart-label">Shopping Cart</h2>
            <CartList
              step={step}
              item={item}
              items={items}
              setItem={setItem}
              setItems={setItems}
            />
          </div>
        )}

        {step === 3 && (
          <div>
            <CustomerDetail
              item={item}
              quantity={item.quantity || 1}
              step={step}
              setStep={setStep}
              steps={steps}
            ></CustomerDetail>
          </div>
        )}

        {step === 4 && (
          <div>
            <PaymentCompleted />
          </div>
        )}
        <ProgressButtons
          action={action}
          step={step}
          setStep={setStep}
          steps={steps}
        />
        <Contact />
      </div>
    </>
  );
}

export default BuyRegalia;
