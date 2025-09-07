import React, { useState, useEffect } from "react";
import "./ProgressBar.css";

function ProgressBar({ step, steps }) {
  const [currentStep, setCurrentStep] = useState(step);

  // Sync step with localStorage (persist across refreshes)
  useEffect(() => {
    const savedStep = localStorage.getItem("step");
    if (savedStep) {
      setCurrentStep(Number(savedStep));
    } else {
      setCurrentStep(step);
    }
  }, [step]);

  // Update localStorage whenever step changes
  useEffect(() => {
    localStorage.setItem("step", currentStep);
  }, [currentStep]);

  return (
    <div className="container">
      {/* Progress Bar */}
      <div className="progressbar">
        {/* Progress line that grows */}
        <div
          className="progress"
          style={{
            width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
          }}
        ></div>

        {steps.map((label, index) => {
          const stepNumber = index + 1;
          let circleClass = "circle";
          let nameClass = "stepName";
          
          // Determine step state
          if (stepNumber < currentStep) {
            // Completed steps - Green
            circleClass += " completed";
            nameClass += " completed";
          } else if (stepNumber === currentStep) {
            // Current step - Blue
            circleClass += " current";
            nameClass += " current";
          }
          // Future steps use default gray styling

          return (
            <div key={index} className="step">
              <div className={circleClass}>
                {stepNumber < currentStep ? "✓" : stepNumber}
              </div>
              <div className={nameClass}>
                {label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ProgressBar;