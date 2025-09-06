import React, { useState } from "react";
import "./ProgressButtons.css"


function ProgressButtons({ step, setStep, steps, selectedCeremonyId, selectedCourseId }){

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
        className={`btn ${step === steps.length || (!selectedCeremonyId && !selectedCourseId) ? "disabled" : ""} `}
        onClick={(!selectedCeremonyId && !selectedCourseId) ? undefined : handleNext}
      >
        &gt;
      </button>
      {/* onClick={step === 2 ? undefined: handleNext} */}

      {/* <button className="checkout-btn" onClick={step === 2 ? handleNext : undefined}>
        Proceed to Checkout
      </button> */}
    </div>
  );
}

export default ProgressButtons;
