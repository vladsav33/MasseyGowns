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
    }
  };

  const handleNext = () => {
    if (step < steps.length) {
      const newStep = step + 1;
      setStep(newStep);
      localStorage.setItem("step", newStep);
    }
  };

  return (
    <>
      {action === 0 ? (
        <div className="btns">
          <button
            className={`btn ${step === 1 ? "disabled" : ""} prev`}
            onClick={handlePrev}
            disabled={step === 1}
          >
            &lt;
          </button>

          <button
            className={`btn ${
              step === steps.length ||
              (!selectedCeremonyId && !selectedCourseId)
                ? "disabled"
                : ""
            }`}
            onClick={
              !selectedCeremonyId && !selectedCourseId ? undefined : handleNext
            }
            disabled={
              step === steps.length ||
              (!selectedCeremonyId && !selectedCourseId)
            }
          >
            &gt;
          </button>
        </div>
      ) : (
        <div className="btns">
          <button
            className={`btn ${step === 1 ? "disabled" : ""} prev`}
            onClick={handlePrev}
            disabled={step === 1}
          >
            &lt;
          </button>

          <button
            className={`btn ${step === steps.length ? "disabled" : ""}`}
            onClick={handleNext}
            disabled={step === steps.length}
          >
            &gt;
          </button>
        </div>
      )}
    </>
  );
}

export default ProgressButtons;
