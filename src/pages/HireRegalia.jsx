import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import "./HireRegalia.css";
import ProgressBar from "../components/ProgressBar";
import ProgressButtons from "../components/ProgressButtons";
import CeremonyCourseSelection from "../components/CeremonyCourseSelection";
import Contact from "../components/Contact";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getCoursesByCeremonyId,
  getCeremonies,
} from "../services/HireBuyRegaliaService";

function HireRegalia() {
  const location = useLocation();
  const mode = new URLSearchParams(location.search).get("mode");
  const showCeremony = mode !== "photo";
  const navigate = useNavigate();

  const pageOrderType = mode === "photo" ? 3 : 1;
  const hireTempKey = `hireStep1Temp_${pageOrderType}`;

  const [step, setStep] = useState(() => {
    if (location.state?.step) return Number(location.state.step);
    return Number(localStorage.getItem("step")) || 1;
  });

  const [ceremonies, setCeremonies] = useState([]);
  const [selectedCeremonyId, setSelectedCeremonyId] = useState(() => {
    const saved = showCeremony
      ? localStorage.getItem("selectedCeremonyId")
      : localStorage.getItem("selectedPhotoCeremonyId");
    return saved ? Number(saved) : null;
  });

  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(() => {
    const saved = showCeremony
      ? localStorage.getItem("selectedCourseId")
      : localStorage.getItem("selectedPhotoCourseId");
    return saved ? Number(saved) : null;
  });

  const [cardOptionsComplete, setCardOptionsComplete] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const steps = [
    "Select Regalia",
    "Place Order",
    "Customer Details",
    "Payment Completed",
  ];

  useEffect(() => localStorage.setItem("step", String(step)), [step]);

  // load ceremonies
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

  // load courses when ceremony changes
  useEffect(() => {
    const fetchCourses = async () => {
      if (showCeremony && !selectedCeremonyId) {
        setCourses([]);
        setSelectedCourseId(null);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const id = showCeremony ? selectedCeremonyId : 2;
        const data = await getCoursesByCeremonyId(id);
        setCourses(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [selectedCeremonyId, showCeremony]);

  useEffect(() => {
    if (step === 2) {
      navigate("/cart", { state: { step: 2 } });
    }
  }, [step, navigate]);

  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <Navbar />
      <div className="content" style={{ flex: 1 }}>
        <ProgressBar step={step} steps={steps} className="progressbar" />

        {step === 1 && (
          <>
            {loading && (
              <div style={{ padding: 20, textAlign: "center" }}>
                Loading data...
              </div>
            )}

            {error && (
              <div
                style={{
                  padding: 10,
                  backgroundColor: "#fef2f2",
                  color: "#dc2626",
                  borderRadius: 4,
                  margin: "10px 0",
                }}
              >
                Error loading data: {error}
              </div>
            )}

            {!loading && (
              <CeremonyCourseSelection
                key={pageOrderType}
                showCeremony={showCeremony}
                ceremonies={ceremonies}
                ceremony={selectedCeremonyId}
                setCeremony={setSelectedCeremonyId}
                courses={courses}
                course={selectedCourseId}
                setCourse={setSelectedCourseId}
                onCeremonySelect={(id) => setSelectedCeremonyId(id)}
                onCourseSelect={(id) => setSelectedCourseId(id)}
                setCardOptionsComplete={setCardOptionsComplete}
                tempKey={hireTempKey}
              />
            )}
          </>
        )}

        <ProgressButtons
          step={step}
          setStep={setStep}
          steps={steps}
          selectedCeremonyId={selectedCeremonyId}
          selectedCourseId={selectedCourseId}
          showCeremony={showCeremony}
          cardOptionsComplete={cardOptionsComplete}
          hireTempKey={hireTempKey}
          orderType={pageOrderType}
        />
      </div>
      <Contact />
    </div>
  );
}

export default HireRegalia;
