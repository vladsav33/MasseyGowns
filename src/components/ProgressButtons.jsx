import React, { useEffect } from "react";
import "./ProgressButtons.css";

function ProgressButtons({
  step,
  setStep,
  steps,
  selectedCeremonyId,
  selectedCourseId,
  action,
  areAllOptionsSelected,
}) {
  const cartData = JSON.parse(localStorage.getItem("cart"));
  const cart = cartData?.length || 0;

  let isDropdownSelected = true;

  cartData?.forEach((item) => {
    if (item.options?.length > 0) {
      if (!item.selectedOptions) {
        isDropdownSelected = false;
      } else {
        // check if any option value is empty
        Object.values(item.selectedOptions).forEach((val) => {
          if (!val) {
            isDropdownSelected = false;
          }
        });
      }
    }
  });

  // Save step into localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("step", step);
  }, [step]);

  const handlePrev = () => {
    if (step > 1) {
      const newStep = step - 1;
      setStep(newStep);
      localStorage.setItem("step", newStep);

      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    }
  };

  const handleNext = () => {
    if (step < steps.length) {
      const newStep = step + 1;
      setStep(newStep);
      localStorage.setItem("step", newStep);

      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      {/* Hire Regalia */}
      {action === 0 ? (
        <div>
          {!areAllOptionsSelected() && (
            <div className="dropDownLabel">
              Please select all required options for your items before proceeding...
            </div>
          )}

          <div className="btns">
            {/* Prev Button (only if step > 1) */}
            {step > 1 && (
              <button
                className="btn prev"
                onClick={handlePrev}
                disabled={step === 1}
              >
                &lt;
              </button>
            )}

            {/* Next Button */}
            {step < 3 && (
              <button
                className={`btn next ${
                  step === steps.length ||
                  !selectedCeremonyId ||
                  !selectedCourseId ||
                  step === 3 ||
                  !areAllOptionsSelected()
                    ? "disabled"
                    : ""
                }`}
                onClick={handleNext}
                disabled={
                  step === steps.length ||
                  !selectedCeremonyId ||
                  !selectedCourseId ||
                  step === 3 ||
                  !areAllOptionsSelected()
                }
              >
                &gt;
              </button>
            )}
          </div>
        </div>
      ) : (
        <div>
          {!isDropdownSelected && (
            <div className="dropDownLabel">
              Please select all required options for your items before proceeding.
            </div>
          )}
          <div className="btns">
            {/* Buy Regalia */}
            {/* Prev */}
            {step > 1 && (
              <button
                className="btn prev"
                onClick={handlePrev}
                disabled={step === 1}
              >
                &lt;
              </button>
            )}

            {/* Next */}
            {step < 3 && (
              <button
                className={`btn next ${
                  step === steps.length ||
                  step === 3 ||
                  cart === 0 ||
                  !isDropdownSelected
                    ? "disabled"
                    : ""
                }`}
                onClick={handleNext}
                disabled={
                  step === steps.length ||
                  step === 3 ||
                  (cart === 0) ||
                  !isDropdownSelected
                }
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
