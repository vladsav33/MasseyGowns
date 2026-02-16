import "./BuySelectRegalia.css";
import React, { useState, useEffect, useRef } from "react";
import {
  getItems,
  getItemSets,
  getDelivery,
} from "../services/HireBuyRegaliaService";
import { useCmsContent } from "../api/useCmsContent";

const placeholderSvg =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zNSA0MEg2NVY0NEgzNVY0MFpNMzUgNTBINjVWNTRIMzVWNTBaTTM1IDYwSDU1VjY0SDM1VjYwWiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K";

const BuySelectRegalia = ({ setItems }) => {
  const [activeTab, setActiveTab] = useState("sets");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [loadingSets, setLoadingSets] = useState(true);
  const [errorSets, setErrorSets] = useState(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [items, setItemsLocal] = useState([]);
  const [sets, setSets] = useState([]);

  const [selectedItemType, setSelectedItemType] = useState("");
  const [selectedDegree, setSelectedDegree] = useState("");

  const [displayedItems, setDisplayedItems] = useState([]);
  const [itemOptions, setItemOptions] = useState({});

  const lastSelectionKeyRef = useRef("");
  const itemTypeSelectRef = useRef(null); //  first dropdown ref

  const { getValue } = useCmsContent();
  const intro =
    getValue("buyRegaliaIntro") ||
    "Thank you for your order to purchase your own Massey University regalia. Please allow four weeks for manufacture - this may be longer during the graduation season due to the increase in demand on our supplies around this time. For more information and a detailed quote email us info@masseygowns.org.nz";

  // -------------------- Fetch items --------------------
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

  // -------------------- Fetch sets --------------------
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

  // -------------------- Memo-ish helpers --------------------
  const itemTypes = React.useMemo(() => {
    const types = new Set();
    items.forEach((item) => {
      if (item?.buyPrice != null && item.category) types.add(item.category);
    });
    return Array.from(types).sort();
  }, [items]);

  const availableDegrees = React.useMemo(() => {
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

  const filteredItems = React.useMemo(() => {
    if (!selectedItemType || !selectedDegree) return [];

    const filtered = items
      .filter((item) => item.category === selectedItemType)
      .filter(
        (item) => item.degreeName && item.degreeName.includes(selectedDegree),
      )
      .map((item) => ({
        ...item,
        uiId: `${item.degreeId ?? "deg"}-${item.id}`,
      }));

    // unique by uiId
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

  // Merge into displayed items when selection changes
  useEffect(() => {
    if (!selectedItemType || !selectedDegree) return;

    const selectionKey = `${selectedItemType}__${selectedDegree}`;
    if (lastSelectionKeyRef.current === selectionKey) return;
    lastSelectionKeyRef.current = selectionKey;

    setDisplayedItems((prev) => {
      const map = new Map(prev.map((p) => [p.uiId, p]));
      for (const it of filteredItems) map.set(it.uiId, it);
      return Array.from(map.values());
    });
  }, [selectedItemType, selectedDegree, filteredItems]);

  useEffect(() => {
    setSelectedDegree("");
  }, [selectedItemType]);

  // -------------------- UI Actions --------------------
  const removeDisplayedItem = (uiId) => {
    setDisplayedItems((prev) => prev.filter((p) => p.uiId !== uiId));
    setItemOptions((prev) => {
      const next = { ...prev };
      delete next[uiId];
      return next;
    });
  };

  const handleOptionChange = (itemId, optionLabel, value) => {
    setItemOptions((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [optionLabel]: value,
      },
    }));
  };

  const areAllOptionsSelected = (product) => {
    if (!product.options || product.options.length === 0) return true;
    const itemId = product.uiId || product.id;
    const selected = itemOptions[itemId] || {};
    return product.options.every(
      (opt) => selected[opt.label] && selected[opt.label] !== "",
    );
  };

  // When user clicks "Add Selected Items to Cart" with missing dropdowns -> show message
  const validateDisplayedItems = () => {
    for (const item of displayedItems) {
      if (!item.options || item.options.length === 0) continue;

      const selected = itemOptions[item.uiId] || {};
      const missing = item.options.find(
        (opt) => !selected[opt.label] || selected[opt.label] === "",
      );

      if (missing) {
        alert(
          `Please select "${missing.label}" for "${item.name}" before adding to cart.`,
        );
        return false;
      }
    }
    return true;
  };

  const buildCartItemFromProduct = (product) => ({
    id: product.id,
    name: product.name,
    category: product.category,
    description: product.description,
    pictureBase64: product.pictureBase64 ?? null,
    hirePrice: Number(product.buyPrice) || 0,
    buyPrice: product.buyPrice ?? null,
    quantity: 1,
    options: product.options || [],
    selectedOptions: itemOptions[product.uiId] || {},
    type: "individual",
    isHiring: false,
  });

  const addAllDisplayedToCart = async () => {
    if (displayedItems.length === 0) return;

    // show message if missing options
    if (!validateDisplayedItems()) return;

    const prev = JSON.parse(localStorage.getItem("cart") || "[]");
    const itemsToAdd = displayedItems.map(buildCartItemFromProduct);
    const updated = [...prev, ...itemsToAdd];

    const data = await getDelivery();
    const delivery = Array.isArray(data) ? data : [];
    const hasDelivery = updated.some((i) => i.type === "delivery");

    if (!hasDelivery && delivery?.length) {
      const selectedOptions = itemOptions[delivery[0].id] || {};
      updated.push({
        id: delivery[0].id || "",
        name: delivery[0].name || "Courier Delivery",
        category: delivery[0].category || "Service",
        description: delivery[0].description || "Regalia delivery service",
        buyPrice: 0,
        hirePrice: 0,
        quantity: 1,
        options: delivery[0].options,
        selectedOptions,
        type: "delivery",
        isHiring: false,
      });
    }

    localStorage.setItem("cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cartUpdated"));
    if (typeof setItems === "function") setItems(updated);

    //  CLEAR selected cards AFTER add
    setDisplayedItems([]);

    //  OPTIONAL: clear all dropdown selections for those cards
    setItemOptions((prevOptions) => {
      const next = { ...prevOptions };
      for (const p of displayedItems) {
        delete next[p.uiId];
      }
      return next;
    });

    //  OPTIONAL: reset the top cascading dropdowns too
    setSelectedItemType("");
    setSelectedDegree("");

    //  OPTIONAL: allow re-adding same selection again (reset last key)
    lastSelectionKeyRef.current = "";
  };

  const pushToCart = async (newItem) => {
    const data = await getDelivery();
    const delivery = Array.isArray(data) ? data : [];

    const prev = JSON.parse(localStorage.getItem("cart") || "[]");
    const hasDelivery = prev.some((item) => item.type === "delivery");

    const updated = [...prev, newItem];

    if (!hasDelivery && delivery.length) {
      const selectedOptions = itemOptions[delivery[0].id] || {};
      updated.push({
        id: delivery[0].id || "",
        name: delivery[0].name || "Courier Delivery",
        category: delivery[0].category || "Service",
        description: delivery[0].description || "Regalia delivery service",
        buyPrice: 0,
        hirePrice: 0,
        quantity: 1,
        options: delivery[0].options,
        selectedOptions,
        type: "delivery",
        isHiring: false,
      });
    }

    localStorage.setItem("cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cartUpdated"));
    if (typeof setItems === "function") setItems(updated);
  };

  const addSetToCart = (setItem) => {
    if (!areAllOptionsSelected({ ...setItem, uiId: setItem.id })) {
      alert("Please select all required options before adding to cart.");
      return;
    }

    const selectedOptions = itemOptions[setItem.id] || {};
    pushToCart({
      id: setItem.id,
      name: setItem.name,
      category: setItem.category || "Set",
      description: setItem.description,
      pictureBase64: setItem.pictureBase64 ?? null,
      hirePrice: Number(setItem.buyPrice) || 0,
      buyPrice: setItem.buyPrice ?? null,
      quantity: 1,
      options: setItem.options || [],
      selectedOptions,
      type: "set",
      isHiring: false,
    });

    setItemOptions((prev) => ({ ...prev, [setItem.id]: {} }));
  };

  const openDialog = (item) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  //  Add more items button: go to first dropdown and focus it
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
                className={`tab-button ${
                  activeTab === "sets" ? "tab-active" : "tab-inactive"
                }`}
              >
                Complete Sets
              </button>
              <button
                onClick={() => setActiveTab("individual")}
                className={`tab-button ${
                  activeTab === "individual" ? "tab-active" : "tab-inactive"
                }`}
              >
                Individual Items
              </button>
            </nav>
          </div>
        </div>

        {/* <div className="content-grid"> */}
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
                    .map((s) => (
                      <div key={s.id} className="product-card-set">
                        <div className="product-image">
                          <img
                            src={`data:image/jpeg;base64,${s.pictureBase64}`}
                            className="item-image"
                            onError={(e) => {
                              e.target.src = placeholderSvg;
                            }}
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

                          {s.options && s.options.length > 0 && (
                            <div className="product-options">
                              {s.options.map((option, index) => (
                                <div key={index} className="option-group">
                                  <label className="option-label">
                                    {option.label}:
                                  </label>
                                  <select
                                    className="option-select"
                                    value={
                                      itemOptions[s.id]?.[option.label] || ""
                                    }
                                    onChange={(e) =>
                                      handleOptionChange(
                                        s.id,
                                        option.label,
                                        e.target.value,
                                      )
                                    }
                                  >
                                    <option value="">Please select...</option>
                                    {option.choices.map((choice, idx) => (
                                      <option
                                        key={idx}
                                        value={
                                          typeof choice === "object"
                                            ? choice.id
                                            : choice
                                        }
                                      >
                                        {typeof choice === "object"
                                          ? choice.value ||
                                            choice.name ||
                                            JSON.stringify(choice)
                                          : choice}
                                      </option>
                                    ))}
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
                              onClick={() => addSetToCart(s)}
                              className={`add-to-cart-btn ${
                                !areAllOptionsSelected({ ...s, uiId: s.id })
                                  ? "disabled"
                                  : ""
                              }`}
                              disabled={
                                !areAllOptionsSelected({ ...s, uiId: s.id })
                              }
                            >
                              Add to Cart
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
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

                {!loading && !error && !selectedItemType && !selectedDegree && (
                  <p className="muted">
                    Please select an item type and degree to view available
                    items.
                  </p>
                )}

                {!loading && !error && selectedItemType && !selectedDegree && (
                  <p className="muted">
                    Please select a degree to view available items.
                  </p>
                )}

                {!loading &&
                  !error &&
                  selectedItemType &&
                  selectedDegree &&
                  filteredItems.length === 0 && (
                    <p className="muted">
                      No items available for the selected combination.
                    </p>
                  )}

                {!loading && !error && displayedItems.length > 0 && (
                  <div className="filtered-items">
                    <div className="items-header">
                      <div className="items-header-two">
                        <h3 className="items-title">Selected items</h3>
                        <span className="items-count">
                          {displayedItems.length} item
                          {displayedItems.length === 1 ? "" : "s"}
                        </span>
                      </div>

                      {/*  Keep button clickable always.
                            If missing options, validateDisplayedItems() will show alert. */}
                      <button
                        type="button"
                        className={`bulk-add-btn ${
                          displayedItems.some((p) => !areAllOptionsSelected(p))
                            ? "disabled"
                            : ""
                        }`}
                        onClick={addAllDisplayedToCart}
                      >
                        Add Selected Items to Cart
                      </button>
                    </div>

                    <div className="items-grid">
                      {displayedItems.map((product) => (
                        <div key={product.uiId} className="product-card">
                          <div className="product-image">
                            <img
                              src={`data:image/jpeg;base64,${product.pictureBase64}`}
                              className="item-image"
                              onError={(e) => {
                                e.target.src = placeholderSvg;
                              }}
                            />

                            <button
                              type="button"
                              className="remove-icon-btn"
                              onClick={() => removeDisplayedItem(product.uiId)}
                              aria-label={`Remove ${product.name}`}
                              title="Remove"
                            >
                              ❌
                            </button>
                          </div>

                          <div className="product-info">
                            <span className="item-category">
                              {product.category}
                            </span>

                            <h4
                              className="product-name item-title clickable"
                              onClick={() => openDialog(product)}
                              onMouseEnter={() => setShowTooltip(true)}
                              onMouseLeave={() => setShowTooltip(false)}
                            >
                              {product.name}
                            </h4>

                            {product.options && product.options.length > 0 && (
                              <div className="product-options">
                                {product.options.map((option, index) => (
                                  <div key={index} className="option-group">
                                    <label className="option-label">
                                      {option.label}:
                                    </label>
                                    <select
                                      className="option-select"
                                      value={
                                        itemOptions[product.uiId]?.[
                                          option.label
                                        ] || ""
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
                                      {option.choices.map((choice, idx) => (
                                        <option
                                          key={idx}
                                          value={
                                            typeof choice === "object"
                                              ? choice.id
                                              : choice
                                          }
                                        >
                                          {typeof choice === "object"
                                            ? choice.value ||
                                              choice.name ||
                                              JSON.stringify(choice)
                                            : choice}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                ))}
                              </div>
                            )}

                            <div className="product-footer">
                              <span className="product-price">
                                ${Number(product.buyPrice ?? 0).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}

                      <div
                        className="add-more-card"
                        role="button"
                        tabIndex={0}
                        onClick={handleAddMoreItems}
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleAddMoreItems()
                        }
                      >
                        <div className="add-more-icon">+</div>

                        <h4 className="add-more-title">Add more items</h4>

                        <p className="add-more-subtitle">
                          Choose another regalia item to add
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        {/* </div> */}
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
