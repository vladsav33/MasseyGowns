// CeremonyCourseSelection.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import "./CeremonyCourseSelection.css";
import { getItemsByCourseId } from "../services/HireBuyRegaliaService";

const placeholderSvg =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+PHBhdGggZD0iTTM1IDQwSDY1VjQ0SDM1VjQwWk0zNSA1MEg2NVY1NEgzNVY1MFpNMzUgNjBINTVWNjRIMzVWNjBaIiBmaWxsPSIjOUNBM0FGIi8+";

function CeremonyCourseSelection({
  showCeremony,
  course,
  courses,
  setCourse,
  ceremony,
  ceremonies,
  setCeremony,
  onCeremonySelect,
  onCourseSelect,
  setCardOptionsComplete,
}) {
  const courseSelectRef = useRef(null);

  const [loadingItems, setLoadingItems] = useState(false);
  const [itemsError, setItemsError] = useState(null);

  const [displayedItems, setDisplayedItems] = useState([]);
  const [itemOptions, setItemOptions] = useState({});
  const [purchaseTypeByUiId, setPurchaseTypeByUiId] = useState({});
  const isHiringFor = (uiId) => purchaseTypeByUiId[uiId] ?? true;

  //  restore dropdowns + temp selections (when coming from Edit)
  useEffect(() => {
    const savedCeremonyId = showCeremony
      ? localStorage.getItem("selectedCeremonyId")
      : localStorage.getItem("selectedPhotoCeremonyId") || 2;

    const savedCourseId = showCeremony
      ? localStorage.getItem("selectedCourseId")
      : localStorage.getItem("selectedPhotoCourseId") || null;

    if (savedCeremonyId) setCeremony(Number(savedCeremonyId));
    if (savedCourseId) setCourse(Number(savedCourseId));

    const temp = JSON.parse(localStorage.getItem("hireStep1Temp") || "{}");
    if (temp?.itemOptions) setItemOptions(temp.itemOptions);
    if (temp?.purchaseTypeByUiId)
      setPurchaseTypeByUiId(temp.purchaseTypeByUiId);
  }, [showCeremony, setCeremony, setCourse]);

  //  listen for reset from ProgressButtons (after Next)
  useEffect(() => {
    const onReset = () => {
      setDisplayedItems([]);
      setItemOptions({});
      setPurchaseTypeByUiId({});
      setItemsError(null);
      setLoadingItems(false);
      // optional: visually clear dropdowns too
      setCeremony(null);
      setCourse(null);
    };

    window.addEventListener("hireStep1Reset", onReset);
    return () => window.removeEventListener("hireStep1Reset", onReset);
  }, [setCeremony, setCourse]);

  const handleCeremonyChange = (e) => {
    const val = e.target.value;
    const id = val ? Number(val) : null;

    setCeremony(id);
    onCeremonySelect?.(id);

    setCourse(null);
    setDisplayedItems([]);
    setItemOptions({});
    setPurchaseTypeByUiId({});

    if (id !== null && showCeremony)
      localStorage.setItem("selectedCeremonyId", String(id));
    else localStorage.removeItem("selectedCeremonyId");

    if (id !== null && !showCeremony)
      localStorage.setItem("selectedPhotoCeremonyId", String(id));
    else localStorage.removeItem("selectedPhotoCeremonyId");
  };

  const handleCourseChange = (e) => {
    const val = e.target.value;
    const id = val ? Number(val) : null;

    setCourse(id);
    onCourseSelect?.(id);

    setDisplayedItems([]);

    if (showCeremony) {
      if (id !== null) localStorage.setItem("selectedCourseId", String(id));
      else localStorage.removeItem("selectedCourseId");
    } else {
      if (id !== null)
        localStorage.setItem("selectedPhotoCourseId", String(id));
      else localStorage.removeItem("selectedPhotoCourseId");
    }
  };

  const selectedCeremonyObj =
    ceremony != null && Array.isArray(ceremonies)
      ? ceremonies.find((c) => c.id === Number(ceremony))
      : null;

  // Fetch items
  useEffect(() => {
    const fetchCourseItems = async () => {
      if (!course) return;

      try {
        setLoadingItems(true);
        setItemsError(null);

        const data = await getItemsByCourseId(course);
        const list = Array.isArray(data) ? data : [];

        const withUiId = list.map((it) => ({
          ...it,
          uiId: `${course}-${it.id}`,
        }));

        const seen = new Set();
        const unique = [];
        for (const it of withUiId) {
          if (!seen.has(it.uiId)) {
            seen.add(it.uiId);
            unique.push(it);
          }
        }

        unique.sort((a, b) =>
          String(a.name || "").localeCompare(String(b.name || "")),
        );
        setDisplayedItems(unique);

        setTimeout(() => {
          const el = document.getElementById("course-items-section");
          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 50);
      } catch (err) {
        setItemsError(err?.message || "Failed to load items for course");
      } finally {
        setLoadingItems(false);
      }
    };

    fetchCourseItems();
  }, [course]);

  const handleOptionChange = (uiId, optionLabel, value) => {
    setItemOptions((prev) => {
      const next = {
        ...prev,
        [uiId]: {
          ...prev[uiId],
          [optionLabel]: value,
        },
      };

      //  persist temp to localStorage for Next click
      const temp = JSON.parse(localStorage.getItem("hireStep1Temp") || "{}");
      localStorage.setItem(
        "hireStep1Temp",
        JSON.stringify({
          ...temp,
          itemOptions: next,
          purchaseTypeByUiId,
        }),
      );

      return next;
    });
  };

  const togglePurchaseType = (uiId) => {
    setPurchaseTypeByUiId((prev) => {
      const next = { ...prev, [uiId]: !(prev[uiId] ?? true) };

      //  persist temp to localStorage for Next click
      const temp = JSON.parse(localStorage.getItem("hireStep1Temp") || "{}");
      localStorage.setItem(
        "hireStep1Temp",
        JSON.stringify({
          ...temp,
          itemOptions,
          purchaseTypeByUiId: next,
        }),
      );

      return next;
    });
  };

  const removeDisplayedItem = (uiId) => {
    const nextItems = displayedItems.filter((p) => p.uiId !== uiId);

    setDisplayedItems(nextItems);

    const nextItemOptions = { ...itemOptions };
    delete nextItemOptions[uiId];
    setItemOptions(nextItemOptions);

    const nextPurchase = { ...purchaseTypeByUiId };
    delete nextPurchase[uiId];
    setPurchaseTypeByUiId(nextPurchase);

    // persist temp
    const temp = JSON.parse(localStorage.getItem("hireStep1Temp") || "{}");
    localStorage.setItem(
      "hireStep1Temp",
      JSON.stringify({
        ...temp,
        itemOptions: nextItemOptions,
        purchaseTypeByUiId: nextPurchase,
      }),
    );

    // if no items left, clear dropdown localStorage too
    if (nextItems.length === 0) {
      setCeremony(null);
      setCourse(null);

      localStorage.removeItem("selectedCeremonyId");
      localStorage.removeItem("selectedCourseId");
      localStorage.removeItem("selectedPhotoCeremonyId");
      localStorage.removeItem("selectedPhotoCourseId");
      localStorage.removeItem("hireStep1Temp");
    }
  };

  //  card options complete for Step 1 Next button
  const areAllCardOptionsSelected = useMemo(() => {
    if (!displayedItems || displayedItems.length === 0) return true;

    return displayedItems.every((product) => {
      if (!product.options || product.options.length === 0) return true;
      const selected = itemOptions[product.uiId] || {};
      return product.options.every(
        (opt) => selected[opt.label] && selected[opt.label] !== "",
      );
    });
  }, [displayedItems, itemOptions]);

  useEffect(() => {
    if (typeof setCardOptionsComplete === "function") {
      setCardOptionsComplete(areAllCardOptionsSelected);
    }
  }, [areAllCardOptionsSelected, setCardOptionsComplete]);

  return (
    <div className="ceremony-course-container">
      {showCeremony && (
        <>
          <h3>Select the ceremony you are ordering regalia for</h3>
          <select
            className="dropdown-select"
            value={ceremony != null ? String(ceremony) : ""}
            onChange={handleCeremonyChange}
          >
            <option value="">Please select a ceremony...</option>
            {Array.isArray(ceremonies) &&
              ceremonies.map((ceremonyOption) => (
                <option
                  key={ceremonyOption.id}
                  value={String(ceremonyOption.id)}
                >
                  {ceremonyOption.name}
                </option>
              ))}
          </select>
        </>
      )}

      {selectedCeremonyObj?.content && (
        <div
          className="ceremony-content"
          dangerouslySetInnerHTML={{ __html: selectedCeremonyObj.content }}
        />
      )}

      <h3>Select the qualification</h3>
      <select
        ref={courseSelectRef}
        className="dropdown-select"
        value={course != null ? String(course) : ""}
        onChange={handleCourseChange}
        disabled={showCeremony ? !ceremony : false}
      >
        <option value="">Please select a qualification...</option>
        {Array.isArray(courses) &&
          courses.map((courseOption) => (
            <option
              key={courseOption.degreeId}
              value={String(courseOption.degreeId)}
            >
              {courseOption.degreeName}
            </option>
          ))}
      </select>

      <div id="course-items-section" style={{ marginTop: 20 }}>
        {loadingItems && <p className="muted">Loading items…</p>}
        {itemsError && <p className="error-text">{itemsError}</p>}

        {!loadingItems &&
          !itemsError &&
          course &&
          displayedItems.length === 0 && (
            <p className="muted">
              No items available for the selected qualification.
            </p>
          )}

        {!loadingItems && !itemsError && displayedItems.length > 0 && (
          <div className="filtered-items">
            <div className="items-list">
              {displayedItems.map((product) => {
                const hiring = isHiringFor(product.uiId);

                const unitPrice = parseFloat(
                  (hiring
                    ? (product.hirePrice ?? product.price)
                    : product.buyPrice) ?? 0,
                );

                const altPrice = parseFloat(
                  (hiring
                    ? product.buyPrice
                    : (product.hirePrice ?? product.price)) ?? 0,
                );

                return (
                  <div key={product.uiId} className="cart-item-wrapper">
                    <div className="cart-item item-image-container">
                      <img
                        src={
                          product.pictureBase64
                            ? `data:image/jpeg;base64,${product.pictureBase64}`
                            : placeholderSvg
                        }
                        className="item-image"
                        onError={(e) => (e.currentTarget.src = placeholderSvg)}
                        alt={product.name}
                      />

                      <div className={hiring ? "hire-ribbon" : "buy-ribbon"}>
                        {hiring ? "Hire" : "Buy"}
                      </div>

                      <div className="item-details">
                        <div className="title-container">
                          <h4 className="item-title">{product.name}</h4>
                        </div>

                        <p className="item-category">{product.category}</p>
                        <p className="item-price">${unitPrice.toFixed(2)}</p>

                        {Array.isArray(product.options) &&
                          product.options.map((option, index) => (
                            <div key={index} className="item-option">
                              <label>{option.label}:</label>
                              <select
                                className="option-select"
                                value={
                                  itemOptions[product.uiId]?.[option.label] ||
                                  ""
                                }
                                onChange={(e) =>
                                  handleOptionChange(
                                    product.uiId,
                                    option.label,
                                    e.target.value,
                                  )
                                }
                                required
                              >
                                <option value="">Please select...</option>
                                {(Array.isArray(option.choices)
                                  ? option.choices
                                  : []
                                ).map((choice, idx) => {
                                  const val =
                                    typeof choice === "object" &&
                                    choice !== null
                                      ? (choice.id ?? choice.value)
                                      : choice;

                                  const label =
                                    typeof choice === "object" &&
                                    choice !== null
                                      ? choice.value ||
                                        choice.size ||
                                        choice.name ||
                                        choice.id
                                      : choice;

                                  return (
                                    <option key={idx} value={String(val)}>
                                      {String(label)}
                                    </option>
                                  );
                                })}
                              </select>
                            </div>
                          ))}
                      </div>

                      <div className="item-controls">
                        <div className="quantity-controls">
                          <button
                            className="quantity-btn"
                            type="button"
                            disabled
                          >
                            −
                          </button>
                          <span className="quantity">1</span>
                          <button
                            className="quantity-btn"
                            type="button"
                            disabled
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          className="remove-btn"
                          onClick={() => removeDisplayedItem(product.uiId)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    {/*  purchase box visible */}
                    <div className="purchase-box">
                      <span className="purchase-label">Purchase this item</span>

                      <button
                        type="button"
                        className={`purchase-btn ${hiring ? "btn-buy" : "btn-hire"}`}
                        onClick={() => togglePurchaseType(product.uiId)}
                      >
                        {hiring ? "Buy" : "Hire"}
                      </button>

                      <div className="purchase-price">
                        ${altPrice.toFixed(2)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CeremonyCourseSelection;
