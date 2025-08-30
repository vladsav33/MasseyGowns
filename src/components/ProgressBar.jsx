import React, { useState } from "react";
import "./ProgressBar.css";

function ProgressBar({ step, steps }) {
  return (
    <div className="container">
      {/* Progress Bar */}
      <div className="progressbar">
        {/* Blue line that grows */}
        <div
          className="progress"
          style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
        ></div>

        {steps.map((label, index) => (
          <div key={index} className="step">
            <div className={`circle ${step > index ? "active" : ""}`}>
              {index + 1}
            </div>
            <div
              className={`stepName ${step === index + 1 ? "highlight" : ""}`}
            >
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* Current Step Message */}
      <div className="content">
        <h2>{steps[step - 1]}</h2>
      </div>


    </div>
  );
}

export default ProgressBar;
