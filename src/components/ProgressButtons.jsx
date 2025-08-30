import React, { useState } from "react";
import "./ProgressButtons.css"


function ProgressButtons({ step, setStep, steps }){

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleNext = () => {
    if (step < steps.length) setStep(step + 1);
  };
  return (
  <div className="btns">
      <button
        className={`btn ${step === 1 ? "disabled" : ""} prev`}
        onClick={handlePrev}
      >
        &lt;
      </button>
      <button
        className={`btn ${step === steps.length ? "disabled" : ""} `}
        onClick={handleNext}
      >
        &gt;
      </button>
    </div>
  );
}

export default ProgressButtons;
