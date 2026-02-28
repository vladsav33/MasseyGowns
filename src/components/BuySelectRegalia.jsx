// BuySelectRegalia.jsx  TEMP CARDS UNDER (NO CART) + DELIVERY CARD + ADD MORE ONLY FOR INDIVIDUAL
import "./BuySelectRegalia.css";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  getItems,
  getItemSets,
  getDelivery,
} from "../services/HireBuyRegaliaService";
import { useCmsContent } from "../api/useCmsContent";

const placeholderSvg =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zNSA0MEg2NVY0NEgzNVY0MFpNMzUgNTBINjVWNTRIMzVWNTBaTTM1IDYwSDU1VjY0SDM1VjYwWiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K";

const TEMP_KEY = "buyStep1Temp";

const readTemp = () => {
  try {
    return JSON.parse(localStorage.getItem(TEMP_KEY) || "{}");
  } catch {
    return {};
  }
};

const writeTemp = (patch) => {
  const prev = readTemp();
  const next = { ...prev, ...patch };
  localStorage.setItem(TEMP_KEY, JSON.stringify(next));
  return next;
};

const BuySelectRegalia = ({ onOptionsComplete }) => {
  const saved = readTemp();

  const [activeTab, setActiveTab] = useState(saved.activeTab || "sets");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [loadingSets, setLoadingSets] = useState(true);
  const [errorSets, setErrorSets] = useState(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [items, setItemsLocal] = useState([]);
  const [sets, setSets] = useState([]);

  const [selectedItemType, setSelectedItemType] = useState(
    saved.selectedItemType || "",
  );
  const [selectedDegree, setSelectedDegree] = useState(
    saved.selectedDegree || "",
  );

  //  TEMP cards shown under selection (includes sets, individuals, delivery)
  const [displayedItems, setDisplayedItems] = useState(
    saved.displayedItems || [],
  );
  const [itemOptions, setItemOptions] = useState(saved.itemOptions || {});

  const lastSelectionKeyRef = useRef(saved.lastSelectionKey || "");
  const itemTypeSelectRef = useRef(null);

  const { getValue } = useCmsContent();
  const intro =
    getValue("buyRegaliaIntro") ||
    "Thank you for your order to purchase your own Massey University regalia. Please allow four weeks for manufacture - this may be longer during the graduation season due to the increase in demand on our supplies around this time. For more information and a detailed quote email us info@masseygowns.org.nz";

  const isProductOptionsComplete = (product, itemOptions) => {
    const opts = Array.isArray(product?.options) ? product.options : [];
    if (opts.length === 0) return true;

    const selected = itemOptions?.[product.uiId] || {};
    return opts.every((opt) => {
      const label = opt?.label;
      const val = label ? selected[label] : null;
      return val !== undefined && val !== null && String(val).trim() !== "";
    });
  };

  const areAllDisplayedItemsComplete = (displayedItems, itemOptions) => {
    const list = Array.isArray(displayedItems) ? displayedItems : [];
    if (list.length === 0) return false; // must add at least one item to proceed
    return list.every((p) => isProductOptionsComplete(p, itemOptions));
  };

  // fetch items
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getItems();
        setItemsLocal(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err?.message || "Failed to load items");
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  // fetch sets
  useEffect(() => {
    const fetchSets = async () => {
      try {
        setLoadingSets(true);
        setErrorSets(null);
        const data = await getItemSets();
        setSets(Array.isArray(data) ? data : []);
      } catch (err) {
        setErrorSets(err?.message || "Failed to load degree sets");
      } finally {
        setLoadingSets(false);
      }
    };
    fetchSets();
  }, []);

  // persist temp
  useEffect(() => {
    writeTemp({
      activeTab,
      selectedItemType,
      selectedDegree,
      displayedItems,
      itemOptions,
      lastSelectionKey: lastSelectionKeyRef.current,
    });
  }, [
    activeTab,
    selectedItemType,
    selectedDegree,
    displayedItems,
    itemOptions,
  ]);

  //  if there are NO items, don't show any "incomplete" message
  const areAllCardOptionsSelected = useMemo(() => {
    // no items -> treat as complete (prevents showing warning msg in step 1)
    if (!Array.isArray(displayedItems) || displayedItems.length === 0)
      return true;

    return displayedItems.every((product) => {
      const opts = Array.isArray(product?.options) ? product.options : [];
      if (opts.length === 0) return true;

      const selected = itemOptions?.[product.uiId] || {};
      return opts.every((opt) => {
        const label = opt?.label;
        const val = label ? selected[label] : "";
        return val !== undefined && val !== null && String(val).trim() !== "";
      });
    });
  }, [displayedItems, itemOptions]);

  useEffect(() => {
    //  if parent passes onOptionsComplete, keep it updated like CeremonyCourseSelection
    if (typeof onOptionsComplete === "function") {
      onOptionsComplete(areAllCardOptionsSelected);
    }
  }, [areAllCardOptionsSelected, onOptionsComplete]);

  // item types
  const itemTypes = useMemo(() => {
    const types = new Set();
    items.forEach((item) => {
      if (item?.buyPrice != null && item.category) types.add(item.category);
    });
    return Array.from(types).sort();
  }, [items]);

  // degrees
  const availableDegrees = useMemo(() => {
    if (!selectedItemType) return [];
    const degreesMap = new Map();

    items.forEach((item) => {
      if (
        item.category === selectedItemType &&
        item.degreeId &&
        item.degreeName &&
        item.degreeOrder
      ) {
        degreesMap.set(item.degreeName, {
          order: item.degreeOrder,
          name: item.degreeName,
        });
      }
    });

    const degrees = Array.from(degreesMap.values());
    degrees.sort((a, b) => a.order - b.order);
    return degrees.map((d) => d.name);
  }, [items, selectedItemType]);

  // filtered items for selection
  const filteredItems = useMemo(() => {
    if (!selectedItemType || !selectedDegree) return [];
    const filtered = items
      .filter((item) => item.category === selectedItemType)
      .filter(
        (item) => item.degreeName && item.degreeName.includes(selectedDegree),
      )
      .map((item) => ({
        ...item,
        uiId: `${item.degreeId ?? "deg"}-${item.id}`,
        __kind: "individual",
      }));

    const seen = new Set();
    const unique = [];
    for (const it of filtered) {
      if (!seen.has(it.uiId)) {
        seen.add(it.uiId);
        unique.push(it);
      }
    }

    return unique.sort((a, b) =>
      String(a.name || "").localeCompare(String(b.name || "")),
    );
  }, [items, selectedItemType, selectedDegree]);

  //  show individual items as TEMP cards under selection when selection changes
  useEffect(() => {
    if (!selectedItemType || !selectedDegree) return;

    const selectionKey = `${selectedItemType}__${selectedDegree}`;
    if (lastSelectionKeyRef.current === selectionKey) return;
    lastSelectionKeyRef.current = selectionKey;

    setDisplayedItems((prev) => {
      // keep sets + delivery + previous individuals, then merge new individuals
      const map = new Map(prev.map((p) => [p.uiId, p]));
      for (const it of filteredItems) map.set(it.uiId, it);
      return Array.from(map.values());
    });
  }, [selectedItemType, selectedDegree, filteredItems]);

  useEffect(() => {
    setSelectedDegree("");
  }, [selectedItemType]);

  const handleOptionChange = (itemId, optionLabel, value) => {
    setItemOptions((prev) => ({
      ...prev,
      [itemId]: { ...(prev[itemId] || {}), [optionLabel]: value },
    }));
  };

  const removeDisplayedItem = (uiId) => {
    setDisplayedItems((prev) => prev.filter((p) => p.uiId !== uiId));
    setItemOptions((prev) => {
      const next = { ...prev };
      delete next[uiId];
      return next;
    });
  };

  const areAllOptionsSelected = (product) => {
    if (!product?.options || product.options.length === 0) return true;
    const key = product.uiId ?? product.id;
    const selected = itemOptions[key] || {};
    return product.options.every(
      (opt) => selected[opt.label] && selected[opt.label] !== "",
    );
  };

  const addSetToTemp = (setItem) => {
    const uiId = `set-${setItem.id}`;
    const tempSet = { ...setItem, uiId, __kind: "set" };

    // validate ONLY this set’s options
    const opts = Array.isArray(tempSet?.options) ? tempSet.options : [];
    if (opts.length > 0) {
      const selected = itemOptions?.[uiId] || {};
      const missing = opts.find((opt) => {
        const val = selected?.[opt.label];
        return val === undefined || val === null || String(val).trim() === "";
      });
      if (missing) {
        alert(`Please select "${missing.label}" for "${tempSet.name}".`);
        return;
      }
    }

    setDisplayedItems((prev) => {
      const map = new Map(prev.map((p) => [p.uiId, p]));
      map.set(uiId, tempSet);
      return Array.from(map.values());
    });
  };

  // -------------------- DELIVERY TEMP CARD --------------------
  // delivery should exist when there is at least one non-delivery item
  const hasNonDelivery = useMemo(
    () => displayedItems.some((x) => x.__kind !== "delivery"),
    [displayedItems],
  );

  useEffect(() => {
    const ensureDelivery = async () => {
      try {
        const hasDelivery = displayedItems.some((x) => x.__kind === "delivery");
        if (!hasNonDelivery) {
          // remove delivery if no items
          if (hasDelivery) {
            setDisplayedItems((prev) =>
              prev.filter((x) => x.__kind !== "delivery"),
            );
          }
          return;
        }
        if (hasDelivery) return;

        const data = await getDelivery();
        const delivery = Array.isArray(data) ? data : [];
        if (!delivery.length) return;

        const d0 = delivery[0];
        const uiId = `delivery-${d0.id ?? "0"}`;

        const deliveryCard = {
          id: d0.id,
          uiId,
          __kind: "delivery",
          name: d0.name || "Courier Delivery (includes return tickets)",
          category: d0.category || "DELIVERY",
          description: d0.description || "",
          pictureBase64: d0.pictureBase64 ?? null,
          buyPrice: 0,
          options: d0.options || [],
        };

        setDisplayedItems((prev) => [...prev, deliveryCard]);
      } catch {
        // ignore delivery errors (don’t block selection)
      }
    };

    ensureDelivery();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasNonDelivery]);

  //  “Add more items” should be ONLY for individual items
  const hasAnyIndividual = useMemo(
    () => displayedItems.some((x) => x.__kind === "individual"),
    [displayedItems],
  );

  const openDialog = (item) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const handleAddMoreItems = () => {
    setActiveTab("individual");
    setTimeout(() => {
      if (itemTypeSelectRef.current) {
        itemTypeSelectRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        itemTypeSelectRef.current.focus();
      }
    }, 100);
  };

  return (
    <div className="regalia-shop">
      <div className="main-container">
        <div className="tabs-section">
          <div className="tabs-border">
            <nav className="tabs-nav">
              <button
                onClick={() => setActiveTab("sets")}
                className={`tab-button ${activeTab === "sets" ? "tab-active" : "tab-inactive"}`}
              >
                Complete Sets
              </button>
              <button
                onClick={() => setActiveTab("individual")}
                className={`tab-button ${activeTab === "individual" ? "tab-active" : "tab-inactive"}`}
              >
                Individual Items
              </button>
            </nav>
          </div>
        </div>

        <div className="main-content">
          <div>{intro}</div>
          <br />

          {/* -------------------- SETS TAB -------------------- */}
          {activeTab === "sets" && (
            <div>
              <h2 className="section-title">Complete Sets</h2>

              {loadingSets && <p className="muted">Loading sets…</p>}
              {errorSets && <p className="error-text">{errorSets}</p>}

              {!loadingSets && !errorSets && sets.length === 0 && (
                <div className="empty-cart">No degree sets available.</div>
              )}

              {!loadingSets && !errorSets && sets.length > 0 && (
                <div className="items-grid">
                  {sets
                    .sort((a, b) => a.id - b.id)
                    .map((s) => {
                      const setUiId = `set-${s.id}`;
                      return (
                        <div key={s.id} className="product-card-set">
                          <div className="product-image">
                            <img
                              src={
                                s.pictureBase64
                                  ? `data:image/jpeg;base64,${s.pictureBase64}`
                                  : placeholderSvg
                              }
                              className="item-image"
                              onError={(e) =>
                                (e.currentTarget.src = placeholderSvg)
                              }
                              alt={s.name}
                            />
                          </div>

                          <div className="product-info">
                            <span className="item-category">
                              {s.category || "Set"}
                            </span>

                            <h4
                              className="product-name item-title clickable"
                              onClick={() => openDialog(s)}
                              onMouseEnter={() => setShowTooltip(true)}
                              onMouseLeave={() => setShowTooltip(false)}
                            >
                              {s.name}
                            </h4>

                            {Array.isArray(s.options) &&
                              s.options.length > 0 && (
                                <div className="product-options">
                                  {s.options.map((option, index) => (
                                    <div key={index} className="option-group">
                                      <label className="option-label">
                                        {option.label}:
                                      </label>
                                      <select
                                        className="option-select"
                                        value={
                                          itemOptions[setUiId]?.[
                                            option.label
                                          ] || ""
                                        }
                                        onChange={(e) =>
                                          handleOptionChange(
                                            setUiId,
                                            option.label,
                                            e.target.value,
                                          )
                                        }
                                      >
                                        <option value="">
                                          Please select...
                                        </option>
                                        {(Array.isArray(option.choices)
                                          ? option.choices
                                          : []
                                        ).map((choice, idx) => {
                                          const val =
                                            typeof choice === "object" && choice
                                              ? (choice.id ?? choice.value)
                                              : choice;
                                          const label =
                                            typeof choice === "object" && choice
                                              ? choice.value ||
                                                choice.size ||
                                                choice.name ||
                                                choice.id
                                              : choice;
                                          return (
                                            <option
                                              key={idx}
                                              value={String(val)}
                                            >
                                              {String(label)}
                                            </option>
                                          );
                                        })}
                                      </select>
                                    </div>
                                  ))}
                                </div>
                              )}

                            <div className="product-footer">
                              <span className="product-price">
                                ${Number(s.buyPrice ?? 0).toFixed(2)}
                              </span>

                              <button
                                onClick={() => addSetToTemp(s)}
                                className={`add-to-cart-btn ${
                                  !areAllOptionsSelected({
                                    ...s,
                                    uiId: setUiId,
                                    __kind: "set",
                                  })
                                    ? "disabled"
                                    : ""
                                }`}
                                disabled={
                                  !areAllOptionsSelected({
                                    ...s,
                                    uiId: setUiId,
                                    __kind: "set",
                                  })
                                }
                              >
                                Add
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          )}

          {/* -------------------- INDIVIDUAL TAB -------------------- */}
          {activeTab === "individual" && (
            <div>
              <h2 className="section-title">Shop Individual Items</h2>

              <div className="cascading-dropdowns">
                <div className="dropdown-row">
                  <div className="dropdown-group">
                    <label className="dropdown-label" htmlFor="itemTypeSelect">
                      Item Type:
                    </label>
                    <select
                      ref={itemTypeSelectRef}
                      id="itemTypeSelect"
                      className="dropdown-select"
                      value={selectedItemType}
                      onChange={(e) => setSelectedItemType(e.target.value)}
                    >
                      <option value="">Select Item Type...</option>
                      {itemTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="dropdown-group">
                    <label className="dropdown-label" htmlFor="degreeSelect">
                      Degree:
                    </label>
                    <select
                      id="degreeSelect"
                      className="dropdown-select"
                      value={selectedDegree}
                      onChange={(e) => setSelectedDegree(e.target.value)}
                      disabled={!selectedItemType}
                    >
                      <option value="">
                        {selectedItemType
                          ? "Select Degree..."
                          : "Select Item Type First"}
                      </option>
                      {availableDegrees.map((degree) => (
                        <option key={degree} value={degree}>
                          {degree}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="items-section">
                {loading && <p className="muted">Loading items…</p>}
                {error && <p className="error-text">{error}</p>}
              </div>
            </div>
          )}

          {/*  TEMP CARDS UNDER (sets + individuals + delivery) */}
          {displayedItems.length > 0 && (
            <div className="filtered-items" style={{ marginTop: 24 }}>
              <div className="items-header">
                <div className="items-header-two">
                  <h3 className="items-title">Selected items</h3>
                  <span className="items-count">
                    {displayedItems.length} item
                    {displayedItems.length === 1 ? "" : "s"}
                  </span>
                </div>
              </div>

              <div className="items-list">
                {displayedItems.map((product) => {
                  const isDelivery = product.__kind === "delivery";
                  const isSet = product.__kind === "set";
                  const price = isDelivery ? 0 : Number(product.buyPrice ?? 0);

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
                          onError={(e) =>
                            (e.currentTarget.src = placeholderSvg)
                          }
                          alt={product.name}
                        />

                        <div className="buy-ribbon">
                          {isDelivery ? "DELIVERY" : "BUY"}
                        </div>

                        <div className="item-details">
                          <div className="title-container">
                            <h4 className="item-title">{product.name}</h4>
                          </div>

                          <p className="item-category">
                            {isDelivery ? "Service" : product.category}
                          </p>

                          <p className="item-price">${price.toFixed(2)}</p>

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
                                >
                                  <option value="">Please select...</option>
                                  {(Array.isArray(option.choices)
                                    ? option.choices
                                    : []
                                  ).map((choice, idx) => {
                                    const val =
                                      typeof choice === "object" && choice
                                        ? (choice.id ?? choice.value)
                                        : choice;
                                    const label =
                                      typeof choice === "object" && choice
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
                      <div></div>
                    </div>
                  );
                })}
                {/*  Add more items ONLY for individuals */}
                {hasAnyIndividual && (
                  <div
                    className="add-more-card"
                    role="button"
                    tabIndex={0}
                    onClick={handleAddMoreItems}
                    onKeyDown={(e) => e.key === "Enter" && handleAddMoreItems()}
                  >
                    <div className="add-more-icon">+</div>
                    <h4 className="add-more-title">Add more items</h4>
                    <p className="add-more-subtitle">
                      Choose another regalia item to add
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dialog */}
      {isDialogOpen && selectedItem && (
        <div className="dialog-overlay" onClick={() => setIsDialogOpen(false)}>
          <div className="dialog-box" onClick={(e) => e.stopPropagation()}>
            <div className="dialog-header">
              <button
                className="close-btn"
                onClick={() => setIsDialogOpen(false)}
                aria-label="Close dialog"
              >
                ✕
              </button>
            </div>
            <div className="dialog-content">
              <h3>{selectedItem.name}</h3>
              <p>{selectedItem.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuySelectRegalia;
