import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import "./HireRegalia.css";
import ProgressBar from "../components/ProgressBar";
import ProgressButtons from "../components/ProgressButtons";
import CeremonyCourseSelection from "../components/CeremonyCourseSelection";
import CartList from "../components/CartList";
import CustomerDetail from "../components/customerDetail";
import Contact from "../components/Contact";
import PaymentCompleted from "../components/PaymentCompleted";
import {
  getCoursesByCeremonyId,
  getCeremonies,
  getItemsByCourseId,
} from "../services/HireBuyRegaliaService";

function HireRegalia() {
  const action = 0; // Hire

  // ---- STATES ----
  const [step, setStep] = useState(
    () => Number(localStorage.getItem("step")) || 1
  );

  const [ceremonies, setCeremonies] = useState([]);
  const [selectedCeremonyId, setSelectedCeremonyId] = useState(() => {
    const saved = localStorage.getItem("selectedCeremonyId");
    return saved ? Number(saved) : null;
  });

  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(() => {
    const saved = localStorage.getItem("selectedCourseId");
    return saved ? Number(saved) : null;
  });

  const [courseChanged, setCourseChanged] = useState(false);

  const [item, setItem] = useState(() => {
    const saved = localStorage.getItem("item");
    return saved ? JSON.parse(saved) : {};
  });

  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const steps = [
    "Select Regalia",
    "Place Order",
    "Customer Details",
    "Payment Completed",
  ];

  // ---- PERSIST TO LOCALSTORAGE ----
  useEffect(() => localStorage.setItem("step", step), [step]);
  useEffect(() => {
    if (selectedCeremonyId !== null)
      localStorage.setItem("selectedCeremonyId", selectedCeremonyId);
  }, [selectedCeremonyId]);
  useEffect(() => {
    if (selectedCourseId !== null)
      localStorage.setItem("selectedCourseId", selectedCourseId);
  }, [selectedCourseId]);
  useEffect(() => localStorage.setItem("item", JSON.stringify(item)), [item]);
  useEffect(() => {
    if (items?.length) localStorage.setItem("cart", JSON.stringify(items));
    else localStorage.removeItem("cart");
  }, [items]);

  // ---- API CALLS ----
  // Fetch Ceremonies
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

  // Fetch Courses when Ceremony changes
  useEffect(() => {
    const fetchCourses = async () => {
      if (!selectedCeremonyId) {
        setCourses([]);
        setSelectedCourseId(null);
        return;
      }

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

  // Fetch Items only if courseChanged is true
  // Fetch Items only if courseChanged is true
  useEffect(() => {
    if (!selectedCourseId) return;

    const savedCart = localStorage.getItem("cart");

    if (!courseChanged && savedCart) {
      // Load from localStorage only on initial load
      setItems(JSON.parse(savedCart));
      return;
    }

    if (!courseChanged) return; // don't fetch if nothing changed

    // Clear old items before fetching new ones
    setItems([]);
    setItem({});

    const fetchItems = async () => {
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
  }, [selectedCourseId, courseChanged]);

  // ---- RENDER ----
  return (
    <div className="content">
      <Navbar />
      <ProgressBar step={step} steps={steps} />
      <ProgressButtons
        action={action}
        step={step}
        setStep={setStep}
        steps={steps}
        selectedCeremonyId={selectedCeremonyId}
        selectedCourseId={selectedCourseId}
      />

      {step === 1 && (
        <>
          {loading && (
            <div style={{ padding: "20px", textAlign: "center" }}>
              Loading data...
            </div>
          )}

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

          {!loading && (
            <CeremonyCourseSelection
              ceremonies={ceremonies}
              ceremony={selectedCeremonyId}
              setCeremony={setSelectedCeremonyId}
              courses={courses}
              course={selectedCourseId}
              setCourse={setSelectedCourseId}
              onCeremonySelect={(id) => setSelectedCeremonyId(id)}
              onCourseSelect={(id) => {
                setSelectedCourseId(id);
                setCourseChanged(true);
              }}
            />
          )}

          {!loading && (
            <CartList
              step={step}
              item={item}
              items={items}
              setItem={setItem}
              setItems={setItems}
            />
          )}
        </>
      )}

      {step === 2 && (
        <div>
          <h2 className="cart-label">Shopping Cart</h2>
          <CartList
            step={step}
            item={item}
            items={items}
            setItem={setItem}
            setItems={setItems}
          />
        </div>
      )}

      {step === 3 && (
        <CustomerDetail
          item={item}
          quantity={item.quantity || 1}
          step={step}
          setStep={setStep}
          steps={steps}
        />
      )}

      {step === 4 && (
        <div>
          <PaymentCompleted />
        </div>
      )}

      <ProgressButtons
        action={action}
        step={step}
        setStep={setStep}
        steps={steps}
        selectedCeremonyId={selectedCeremonyId}
        selectedCourseId={selectedCourseId}
      />

      <Contact />
    </div>
  );
}

export default HireRegalia;
