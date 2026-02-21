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
import { useLocation, useNavigate } from "react-router-dom";
import PaymentCompleted from "../components/PaymentCompleted";

function BuyRegalia() {
  // Set orderType in localStorage when component mounts
  useEffect(() => {
    localStorage.setItem("orderType", "2"); // 2 for buy
  }, []);

  const navigate = useNavigate();

  const paymentMethod = localStorage.getItem("paymentMethod");

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

  // ✅ Track whether step 1 options are fully complete (fed from BuySelectRegalia)
  const [buyStep1Complete, setBuyStep1Complete] = useState(false);

  const steps = [
    "Select Regalia",
    "Place Order",
    "Customer Details",
    "Payment Completed",
  ];

  useEffect(() => {
    if (step === 2) {
      navigate("/cart", { state: { step: 2 } });
    }
  }, [step, navigate]);

  return (
    <div>
      <Navbar />
      <>
        <div className="content">
          <div className="body-content">
            <ProgressBar step={step} steps={steps} />
            {/* <ProgressButtons
              step={step}
              setStep={setStep}
              steps={steps}
              cardOptionsComplete={buyStep1Complete}
            /> */}

            {step === 1 && (
              <>
                {/* ✅ Pass callback so BuySelectRegalia can report options completeness */}
                <BuySelectRegalia
                  setItems={setItems}
                  onOptionsComplete={setBuyStep1Complete}
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
                />
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
              step={step}
              setStep={setStep}
              steps={steps}
              cardOptionsComplete={buyStep1Complete}
            />
            <Contact />
          </div>
        </div>
      </>
    </div>
  );
}

export default BuyRegalia;