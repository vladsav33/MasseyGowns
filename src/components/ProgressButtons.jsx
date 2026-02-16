import React, { useEffect } from "react";
import "./ProgressButtons.css";
import { useNavigate } from "react-router-dom";

function ProgressButtons({
  step,
  setStep,
  steps,
  areAllOptionsSelected = () => true,

  prevPath,
  nextPath,
}) {
  const navigate = useNavigate();

  const cartData = JSON.parse(localStorage.getItem("cart") || "[]");
  const cart = cartData?.length || 0;

  let isDropdownSelected = true;
  let isOnlyHire = true;
  let isOnlyBuy = true;

  cartData?.forEach((item) => {
    if (item.isDonation) {
      isOnlyHire = true;
      isOnlyBuy = true;
    } else {
      if (item.isHiring) {
        isOnlyHire = true;
        isOnlyBuy = false;
      } else {
        isOnlyHire = false;
        isOnlyBuy = true;
      }
    }

    if (item.options?.length > 0) {
      if (
        !item.selectedOptions ||
        Object.keys(item.selectedOptions).length === 0
      ) {
        isDropdownSelected = false;
        return;
      }

      item.options.forEach((option) => {
        const selectedValue = item.selectedOptions[option.label];
        if (!selectedValue) isDropdownSelected = false;
      });
    }
  });

  useEffect(() => {
    localStorage.setItem("step", step);
  }, [step]);

  const scrollTop = () =>
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });

  const goPrev = () => {
    // routing mode
    if (prevPath) {
      localStorage.setItem("step", String(step - 1));
      navigate(prevPath);
      scrollTop();
      return;
    }

    // old step mode
    if (setStep && step > 1) {
      const newStep = step - 1;
      setStep(newStep);
      localStorage.setItem("step", newStep);
      scrollTop();
    }
  };

  const goNext = () => {
    // routing mode
    if (nextPath) {
      localStorage.setItem("step", String(step + 1));
      navigate(nextPath);
      scrollTop();
      return;
    }

    // old step mode
    if (setStep && step < steps.length) {
      const newStep = step + 1;
      setStep(newStep);
      localStorage.setItem("step", newStep);
      scrollTop();
    }
  };

  const orderType = Number(localStorage.getItem("orderType") || 0);

  // Common disable logic (same as your code)
  const disableHireNext =
    step === steps.length ||
    step === 3 ||
    cart === 0 ||
    !(typeof areAllOptionsSelected === "function"
      ? areAllOptionsSelected()
      : true);
  const disableBuyNext =
    step === steps.length ||
    step === 3 ||
    cart === 0 ||
    !isDropdownSelected;

  return (
    <>
      {/* Hire Regalia */}
      {orderType === 1 && (
        <div>
          {!(typeof areAllOptionsSelected === "function"
            ? areAllOptionsSelected()
            : true) && (
            <div className="dropDownLabel">
              Please select all required options for your items before
              proceeding...
            </div>
          )}

          <div className="btns">
            {step > 2 && step < 4 && (
              <button
                className="btn prev"
                onClick={goPrev}
                disabled={step === 1}
              >
                &lt;
              </button>
            )}

            {step < 3 && (
              <button
                className={`btn next ${disableHireNext ? "disabled" : ""}`}
                onClick={goNext}
                disabled={disableHireNext}
              >
                &gt;
              </button>
            )}
          </div>
        </div>
      )}

      {/* Buy Regalia */}
      {orderType === 2 && (
        <div>
          {!isDropdownSelected && (
            <div className="dropDownLabel">
              Please select all required options for your items before
              proceeding.
            </div>
          )}

          <div className="btns">
            {step === 3 && (
              <button
                className="btn prev"
                onClick={goPrev}
                disabled={step === 1}
              >
                &lt;
              </button>
            )}

            {step < 3 && (
              <button
                className={`btn next ${disableBuyNext ? "disabled" : ""}`}
                onClick={goNext}
                disabled={disableBuyNext}
              >
                &gt;
              </button>
            )}
          </div>
        </div>
      )}

      {/* Casual photo Regalia */}
      {orderType === 3 && (
        <div>
          {!isDropdownSelected && (
            <div className="dropDownLabel">
              Please select all required options for your items before
              proceeding.
            </div>
          )}

          <div className="btns">
            {step > 1 && step < 4 && (
              <button
                className="btn prev"
                onClick={goPrev}
                disabled={step === 1}
              >
                &lt;
              </button>
            )}

            {step < 3 && (
              <button
                className={`btn next ${disableBuyNext ? "disabled" : ""}`}
                onClick={goNext}
                disabled={disableBuyNext}
              >
                &gt;
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default ProgressButtons;
