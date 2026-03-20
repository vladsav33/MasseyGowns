import React, { useState, useEffect } from "react";
import "./BuyRegalia.css";
import Navbar from "../components/Navbar";
import Contact from "../components/Contact";
import ProgressBar from "../components/ProgressBar";
import ProgressButtons from "../components/ProgressButtons";
import BuySelectRegalia from "../components/BuySelectRegalia";
import { useLocation, useNavigate } from "react-router-dom";

function BuyRegalia() {

  const orderType = 2;

  const navigate = useNavigate();

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

  //  Track whether step 1 options are fully complete (fed from BuySelectRegalia)
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

            {step === 1 && (
              <>
                <BuySelectRegalia
                  setItems={setItems}
                  onOptionsComplete={setBuyStep1Complete}
                />
              </>
            )}
            
            <ProgressButtons
              step={step}
              setStep={setStep}
              steps={steps}
              cardOptionsComplete={buyStep1Complete}
              orderType={orderType}
            />
            <Contact />
          </div>
        </div>
      </>
    </div>
  );
}

export default BuyRegalia;