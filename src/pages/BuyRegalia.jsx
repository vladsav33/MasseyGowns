import React, { useState, useEffect } from "react";
import "./BuyRegalia.css";
import Navbar from "../components/Navbar";
import Contact from "../components/Contact";
import ProgressBar from "../components/ProgressBar";
import ProgressButtons from "../components/ProgressButtons";
import BuySelectRegalia from "../components/BuySelectRegalia";
import CartList from "../components/CartList";
import CustomerDetail from "../components/CustomerDetail";
import Payment from "../components/Payment";
import { useLocation } from "react-router-dom";
import PaymentCompleted from "../components/PaymentCompleted";

function BuyRegalia() {
  const action = 1; // Buy

    // Set orderType in localStorage when component mounts
    useEffect(() => {
      localStorage.setItem("orderType", "2"); // 2 for buy
    }, []);

  const paymentMethod = localStorage.getItem("paymentMethod");

  // const [step, setStep] = useState(() => {
  //   return Number(localStorage.getItem("step")) || 1;
  // });
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
    <div>
      <Navbar />
      <>
        <div className="content">
          <div className="body-content">
            <ProgressBar step={step} steps={steps} />
            <ProgressButtons
              action={action}
              step={step}
              setStep={setStep}
              steps={steps}
            />

            {step === 1 && (
              <>
                <BuySelectRegalia setItems={setItems} />
                <h2 className="cart-label">Shopping Cart</h2>
                <CartList
                  step={step}
                  item={item}
                  items={items}
                  setItem={setItem}
                  setItems={setItems}
                />
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
              <>
                {paymentMethod == 1 && (
                  <div>
                    <Payment />
                  </div>
                )}
                {paymentMethod == 3 && (
                  <div>
                    <PaymentCompleted />
                  </div>
                )}
              </>
            )}
            <ProgressButtons
              action={action}
              step={step}
              setStep={setStep}
              steps={steps}
            />
            <Contact />
          </div>
        </div>
      </>
    </div>
  );
}

export default BuyRegalia;
