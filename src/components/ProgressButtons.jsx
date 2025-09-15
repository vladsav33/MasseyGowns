import React, { useEffect } from "react";
import "./ProgressButtons.css";

function ProgressButtons({
  step,
  setStep,
  steps,
  selectedCeremonyId,
  selectedCourseId,
  action,
}) {
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
        behavior: 'smooth'
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
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      {action === 0 ? (
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
                step === 3
                  ? "disabled"
                  : ""
              }`}
              onClick={handleNext}
              disabled={
                step === steps.length ||
                !selectedCeremonyId ||
                !selectedCourseId ||
                step === 3
              }
            >
              &gt;
            </button>
          )}
        </div>
      ) : (
        <div className="btns">
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
              className={`btn next${ 
                step === steps.length || step === 3 ? "disabled" : ""
              }`}
              onClick={handleNext}
              disabled={step === steps.length || step === 3}
            >
              &gt;
            </button>
          )}
        </div>
      )}
    </>
  );
}

export default ProgressButtons;
