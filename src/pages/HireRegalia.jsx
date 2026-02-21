// HireRegalia.jsx (only the parts you MUST add/change)
// ✅ Add these new state + handler + pass onEditItems to ProgressButtons
import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import "./HireRegalia.css";
import ProgressBar from "../components/ProgressBar";
import ProgressButtons from "../components/ProgressButtons";
import CeremonyCourseSelection from "../components/CeremonyCourseSelection";
import Contact from "../components/Contact";
import { useLocation, useNavigate } from "react-router-dom";
import { getCoursesByCeremonyId, getCeremonies } from "../services/HireBuyRegaliaService";

function HireRegalia() {
  const location = useLocation();
  const mode = new URLSearchParams(location.search).get("mode");
  const showCeremony = mode !== "photo";
  const navigate = useNavigate();

  useEffect(() => {
    if (mode === "photo") localStorage.setItem("orderType", "3");
    else localStorage.setItem("orderType", "1");
  }, [mode]);

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

  const steps = ["Select Regalia", "Place Order", "Customer Details", "Payment Completed"];

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
      if (!showCeremony) {
        // casual hire can still have courses without ceremony depending on your API;
        // if your API still needs ceremony, keep the same logic as above.
      }

      try {
        setLoading(true);
        setError(null);

        if (selectedCeremonyId) {
          const data = await getCoursesByCeremonyId(selectedCeremonyId);
          setCourses(Array.isArray(data) ? data : []);
        } else {
          setCourses([]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [selectedCeremonyId, showCeremony]);

  // ✅ Edit button handler (Step 2 -> Step 1 restore selections)
  const handleEditItems = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const items = cart.filter((x) => !x.isDonation);

    if (items.length === 0) return;

    const ceremonyId = items[0].ceremonyId ?? null;
    const courseId = items[0].courseId ?? null;

    const itemOptions = {};
    const purchaseTypeByUiId = {};

    items.forEach((it) => {
      const uiId = `${courseId}-${it.id}`;
      itemOptions[uiId] = it.selectedOptions || {};
      purchaseTypeByUiId[uiId] = it.isHiring ?? true;
    });

    localStorage.setItem(
      "hireStep1Temp",
      JSON.stringify({ ceremonyId, courseId, itemOptions, purchaseTypeByUiId })
    );

    // restore dropdown localStorage (both modes safe)
    if (ceremonyId != null) {
      localStorage.setItem("selectedCeremonyId", String(ceremonyId));
      localStorage.setItem("selectedPhotoCeremonyId", String(ceremonyId));
    }
    if (courseId != null) {
      localStorage.setItem("selectedCourseId", String(courseId));
      localStorage.setItem("selectedPhotoCourseId", String(courseId));
    }

    // set state
    setSelectedCeremonyId(ceremonyId);
    setSelectedCourseId(courseId);

    setStep(1);
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  useEffect(() => {
    if (step === 2) {
      navigate("/cart", { state: { step: 2 } });
    }
  }, [step, navigate]);

  return (
    <div>
      <Navbar />
      <div className="content">
        <ProgressBar step={step} steps={steps} className="progressbar" />

        {/* <ProgressButtons
          step={step}
          setStep={setStep}
          steps={steps}
          selectedCeremonyId={selectedCeremonyId}
          selectedCourseId={selectedCourseId}
          showCeremony={showCeremony}
          cardOptionsComplete={cardOptionsComplete}
          onEditItems={handleEditItems}
        /> */}

        {step === 1 && (
          <>
            {loading && <div style={{ padding: 20, textAlign: "center" }}>Loading data...</div>}

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
          onEditItems={handleEditItems}
        />

        <Contact />
      </div>
    </div>
  );
}

export default HireRegalia;