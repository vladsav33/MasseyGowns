import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import "./HireRegalia.css";
import ProgressBar from "../components/ProgressBar";
import ProgressButtons from "../components/ProgressButtons";
import CeremonyCourseSelection from "../components/CeremonyCourseSelection";
import CartList from "../components/CartList";
import CustomerDetail from "../components/CustomerDetail";
import Contact from "../components/Contact";
import Payment from "../components/Payment";
import { useLocation } from "react-router-dom";
import {
  getCoursesByCeremonyId,
  getCeremonies,
  getItemsByCourseId,
} from "../services/HireBuyRegaliaService";

function HireRegalia() {
  const action = 0; // Hire

  // ---- STATES ----
  const location = useLocation();
  const mode = new URLSearchParams(location.search).get("mode");
  // console.log(mode);
  const showCeremony = mode !== "photo"; // hide only for casual hire
  // console.log(showCeremony);
  if (!showCeremony) {
    localStorage.setItem("selectedCeremonyId", String(2));
  }

  // Initialize step from location.state if available, otherwise from localStorage or default to 1
  const [step, setStep] = useState(() => {
    if (location.state?.step) {
      return Number(location.state.step);
    }
    return Number(localStorage.getItem("step")) || 1;
  });

  const [ceremonies, setCeremonies] = useState([]);
  const [selectedCeremonyId, setSelectedCeremonyId] = useState(() => {
    const saved = showCeremony?localStorage.getItem("selectedCeremonyId"):localStorage.getItem("selectedPhotoCeremonyId");
    console.log("Saved=", saved);
    if (!showCeremony) {
      return 2;
      }
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

  // ---- VALIDATION FUNCTIONS ----

  const areAllOptionsSelected = () => {

    return items.every((item) => {
      // Skip validation for donation items
      if (item.isDonation) return true;

      // If item has no options, it's valid
      if (!item.options || item.options.length === 0) return true;

      // Check if all options have selected values
      return item.options.every((option) => {
        const selectedValue = item.selectedOptions?.[option.label];
        return selectedValue && selectedValue.trim() !== "";
      });
    });
  };

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
    window.dispatchEvent(new Event("cartUpdated"));
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
      console.log("selectedCeremonyId = ", selectedCeremonyId)
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
  useEffect(() => {
    if (!selectedCourseId) return;

    const savedCart = localStorage.getItem("cart");

    if (!courseChanged && savedCart) {
      setItems(JSON.parse(savedCart));
      return;
    }

    if (!courseChanged) return; // don't fetch if nothing changed

    // Preserve buy items and donations when course changes
    const preserveNonHireItems = (currentItems) => {
      return currentItems.filter(item => 
        item.type === 'individual' && !item.isHiring || // buy items
        item.type === 'set' && !item.isHiring ||        // buy sets
        item.isDonation                                 // donations
      );
    };

    // Get items to preserve before clearing
    const itemsToPreserve = preserveNonHireItems(items);

    // Clear only hire items, keep buy items and donations
    setItem({});

    const fetchItems = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getItemsByCourseId(selectedCourseId);
        const newHireItems = Array.isArray(data) ? data : [];
        
        // Combine preserved items with new hire items
        const combinedItems = [...itemsToPreserve, ...newHireItems];
        setItems(combinedItems);
      } catch (err) {
        setError(err.message);
        // If fetch fails, at least keep the preserved items
        setItems(itemsToPreserve);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [selectedCourseId, courseChanged]);

  return (
    <div className="content">
      <Navbar />
      <br/>
      <br/>
      <br/>
      <ProgressBar step={step} steps={steps} className="progressbar"/>
      <ProgressButtons
        action={action}
        step={step}
        setStep={setStep}
        steps={steps}
        selectedCeremonyId={selectedCeremonyId}
        selectedCourseId={selectedCourseId}
        areAllOptionsSelected={areAllOptionsSelected}
        items={items}
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
              showCeremony={showCeremony}
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
          {/*<PaymentCompleted />*/}
          <Payment />
        </div>
      )}

      <ProgressButtons
        action={action}
        step={step}
        setStep={setStep}
        steps={steps}
        selectedCeremonyId={selectedCeremonyId}
        selectedCourseId={selectedCourseId}
        areAllOptionsSelected={areAllOptionsSelected}
        items={items}
      />

      <Contact />
    </div>
  );
}

export default HireRegalia;
