import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import "./HireRegalia.css";
import ProgressBar from "../components/ProgressBar";
import ProgressButtons from "../components/ProgressButtons";
import CeremonyCourseSelection from "../components/CeremonyCourseSelection";
import CartList from "../components/CartList";
import CustomerDetails from "../components/customerDetails";
import Contact from "../components/Contact"
import {
  getCoursesByCeremonyId,
  getCeremonies,
  getItemsByCourseId
} from "../services/hireRegaliaService";

function HireRegalia() {
  const [step, setStep] = useState(1);

  const [ceremony, setCeremony] = useState("");
  const [ceremonies, setCeremonies] = useState([]);
  const [selectedCeremonyId, setSelectedCeremonyId] = useState(null);

  const [course, setCourse] = useState("");
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  const [item, setItem] = useState("");
  const [items, setItems] = useState([]);

  const [loading, setLoading] = useState(true); // Added loading state
  const [error, setError] = useState(null); // Added error state

  const steps = [
    "Select Regalia",
    "Place Order",
    "Customer Details",
    "Payment Completed",
  ];

  // Get ceremonies
  useEffect(() => {
    const fetchCeremonies = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getCeremonies();
        setCeremonies(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCeremonies();
  }, []);

  // Get Courses
  useEffect(() => {
    const fetchCourses = async () => {
      if (!selectedCeremonyId) return;

      try {
        setLoading(true);
        setError(null);
        const data = await getCoursesByCeremonyId(selectedCeremonyId);
        setCourses(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [selectedCeremonyId]);

  // Get Items
  useEffect(() => {
    const fetchItems = async () => {
      if (!selectedCourseId) return;

      try {
        setLoading(true);
        setError(null);
        const data = await getItemsByCourseId(selectedCourseId);
        setItems(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [selectedCourseId]);

  return (
    <div className="content">
      <Navbar />
      <ProgressBar step={step} steps={steps} />
      <ProgressButtons step={step} setStep={setStep} steps={steps} iselectedCeremonyId={selectedCeremonyId} selectedCourseId={selectedCourseId} />

      {step === 1 && (
        <>
          {/* Show loading while fetching */}
          {loading && (
            <div style={{ padding: "20px", textAlign: "center" }}>
              Loading data...
            </div>
          )}

          {/* Show error if API fails */}
          {error && (
            <div
              style={{
                padding: "10px",
                backgroundColor: "#fef2f2",
                color: "#dc2626",
                borderRadius: "4px",
                margin: "10px 0",
              }}
            >
              Error loading data: {error}
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
              onCeremonySelect={setSelectedCeremonyId}
              onCourseSelect={setSelectedCourseId}
            />
          )}

          {/* Show items base on selected ceremony and course */}
          {!loading && (
            <CartList step={step} item={item} items={items} setItem={setItem} setItems={setItems}/>
          )}
        </>
      )}

      {step === 2 && (
        <div>
          <h2 className="cart-label">Shopping Cart</h2>
          <CartList step={step} item={item} items={items} setItem={setItem} setItems={setItems}/>
        </div>
      )}

      {step === 3 && 
      <div>
        <CustomerDetails item={item} quantity={item.quantity || 1}></CustomerDetails>
      </div>}

      {step === 4 && <div>{/* Payment Completed content goes here */}</div>}

      <ProgressButtons step={step} setStep={setStep} steps={steps} selectedCeremonyId={selectedCeremonyId} selectedCourseId={selectedCourseId} />

      <Contact />
    </div>
  );
}

export default HireRegalia;