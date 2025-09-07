import React, { useState } from "react";
import "./BuyRegalia.css";
import Navbar from "../components/Navbar";
import Contact from "../components/Contact";
import ProgressBar from "../components/ProgressBar";
import ProgressButtons from "../components/ProgressButtons";
import BuySelectRegalia from "../components/BuySelectRegalia";
import CartList from "../components/CartList";
import CustomerDetails from "../components/CustomerDetails";

function BuyRegalia() {
    const action = 1; // Buy

  const [step, setStep] = useState(() => {
    return Number(localStorage.getItem("step")) || 1;
  });

  const [item, setItem] = useState(() => {
    const saved = localStorage.getItem("item");
    return saved ? JSON.parse(saved) : "";
  });

  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem("items");
    return saved ? JSON.parse(saved) : [];
  });
  //   const [loading, setLoading] = useState(true);
  //   const [error, setError] = useState(null);

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
            <BuySelectRegalia />
            {/* )} */}

            {/* Show items base on selected ceremony and course */}
            {/* {!loading && ( */}
            <CartList
            action={action}
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
          <CustomerDetails
            item={item}
            quantity={item.quantity || 1}
          ></CustomerDetails>
        </div>
      )}

      {step === 4 && <div>{/* Payment Completed content goes here */}</div>}
<ProgressButtons
        action={action}
          step={step}
          setStep={setStep}
          steps={steps}
        />
        {/* <Contact /> */}
      </div>
    </>
  );
}

export default BuyRegalia;
