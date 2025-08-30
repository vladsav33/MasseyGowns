import React, { useState } from "react";
import Navbar from "../components/Navbar";
import "./HireRegalia.css";
import ProgressBar from "../components/ProgressBar";
import ProgressButtons from "../components/ProgressButtons";
import CartItem from "../components/CartItem";
import CeremonyCourseSelection from "../components/CeremonyCourseSelection";
import CartList from "../components/CartList";

function HireRegalia() {
  const [step, setStep] = useState(1);
  const [ceremony, setCeremony] = useState("");
  const [course, setCourse] = useState("");

  const steps = [
    "Select Regalia",
    "Place Order",
    "Customer Details",
    "Payment Completed",
  ];

  const ceremonies = [
    "Massey University November Graduation 2025",
    "Casual Hire for Photos",
  ];
  
  const courses = [
    "Certificate",
    "Diploma/ Graduate Diploma/ Post Grad Diploma - No Previous Degree Held",
    "Diploma/ Graduate Diploma/ Post Grad Diploma - Previous Degree Held",
    "Bachelor Degree",
    "Master Degree",
    "PhD Degree",
    "Doctoral Degree (DEd, DBusAdmin, DClincPysch, DSW)",
    "Higher Doctoral Degree",
  ];
  
  return (
    <div className="content">
      <Navbar />
      <ProgressBar step={step} steps={steps} />
      <ProgressButtons step={step} setStep={setStep} steps={steps} />
      
      {step === 1 && (
        <>
          <CeremonyCourseSelection 
            ceremonies={ceremonies} 
            ceremony={ceremony} 
            setCeremony={setCeremony}
            course={course} 
            courses={courses} 
            setCourse={setCourse}
          />
          {ceremony === ceremonies[0] && (
            <CartList step={step}/>
          )}
        </>
      )}

      {step === 2 && (
        <div>
          <CartList step={step}/>
        </div>
      )}
      
      {step === 3 && (
        <div>
          {/* Customer Details content goes here */}
        </div>
      )}
      
      {step === 4 && (
        <div>
          {/* Payment Completed content goes here */}
        </div>
      )}

      <ProgressButtons step={step} setStep={setStep} steps={steps} />
    </div>
  );
}

export default HireRegalia;