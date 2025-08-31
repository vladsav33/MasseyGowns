import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import "./HireRegalia.css";
import ProgressBar from "../components/ProgressBar";
import ProgressButtons from "../components/ProgressButtons";
import CartItem from "../components/CartItem";
import CeremonyCourseSelection from "../components/CeremonyCourseSelection";
import CartList from "../components/CartList";
import { getCeremonies } from "../services/hireRegaliaService";

function HireRegalia() {
  const [step, setStep] = useState(1);
  
  const [ceremony, setCeremony] = useState("");
  const [ceremonies, setCeremonies] = useState([]);
  
  const [course, setCourse] = useState("");
  const [loading, setLoading] = useState(true); // Added loading state
  const [error, setError] = useState(null); // Added error state

  const steps = [
    "Select Regalia",
    "Place Order",
    "Customer Details",
    "Payment Completed",
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

  // Fetch ceremonies on component mount
  useEffect(() => {
    const fetchCeremonies = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getCeremonies(); // now data is an array
        setCeremonies(Array.isArray(data) ? data : []); // safeguard
        console.log("Ceremonies loaded:", data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchCeremonies();
  }, []);  

  return (
    <div className="content">
      <Navbar />
      <ProgressBar step={step} steps={steps} />
      <ProgressButtons step={step} setStep={setStep} steps={steps} />
      
      {step === 1 && (
        <>
          {/* Show loading while fetching */}
          {loading && (
            <div style={{ padding: '20px', textAlign: 'center' }}>
              Loading ceremonies...
            </div>
          )}
          
          {/* Show error if API fails */}
          {error && (
            <div style={{ 
              padding: '10px', 
              backgroundColor: '#fef2f2', 
              color: '#dc2626', 
              borderRadius: '4px',
              margin: '10px 0'
            }}>
              Error loading ceremonies: {error}
            </div>
          )}
          
          {/* Show component when not loading */}
          {!loading && (
            <CeremonyCourseSelection 
              ceremonies={ceremonies} 
              ceremony={ceremony} 
              setCeremony={setCeremony}
              course={course} 
              courses={courses} 
              setCourse={setCourse}
            />
          )}
          
          {/* Show cart if first ceremony is selected */}

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