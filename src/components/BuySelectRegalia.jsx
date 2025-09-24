import "./BuySelectRegalia.css";
import React, { useState, useEffect } from "react";
import { getItems, getItemSets } from "../services/HireBuyRegaliaService";

const placeholderSvg = "data:image/svg+xml;base64,...";

const BuySelectRegalia = ({ setItems }) => {
  const [activeTab, setActiveTab] = useState("sets"); // show sets by default
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // individual items
  const [items, setItemsLocal] = useState([]);

  // Cascading dropdown states
  const [selectedItemType, setSelectedItemType] = useState("");
  const [selectedDegree, setSelectedDegree] = useState("");

  // degree sets
  const [sets, setSets] = useState([]);
  const [loadingSets, setLoadingSets] = useState(true);
  const [errorSets, setErrorSets] = useState(null);

  // State to manage selected options for each item
  const [itemOptions, setItemOptions] = useState({});

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getItems();
        const safe = Array.isArray(data) ? data : [];
        setItemsLocal(safe);
      } catch (err) {
        setError(err?.message || "Failed to load items");
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  // Fetch degree sets
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

  // Get unique item types (categories)
  const itemTypes = React.useMemo(() => {
    const types = new Set();
    items.forEach((item) => {
      if (item.category) {
        types.add(item.category);
      }
    });
    return Array.from(types).sort();
  }, [items]);

  // Get degrees available for the selected item type
  const availableDegrees = React.useMemo(() => {
    if (!selectedItemType) return [];

    const degrees = new Set();
    items.forEach((item) => {
      if (
        item.category === selectedItemType &&
        item.degreeId &&
        item.degreeName
      ) {
        degrees.add(item.degreeName);
      }
    });
    return Array.from(degrees).sort();
  }, [items, selectedItemType]);

  // Get filtered items based on both selections
  const filteredItems = React.useMemo(() => {
    if (!selectedItemType || !selectedDegree) return [];

    const filtered = items
      .filter((item) => {
        if (item.category !== selectedItemType) return false;

        // Check if item degree name contains the selected degree
        return item.degreeName && item.degreeName.includes(selectedDegree);
      })
      .map((item, index) => ({
        ...item,
        uiId: `${item.degreeId}-${item.id}-${index}`,
      }));

    // Remove duplicates based on degree id and category
    const uniqueItems = [];
    const seen = new Set();
    
    filtered.forEach((item) => {
      const key = `${item.degreeId}-${item.category}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueItems.push(item);
      }
    });

    return uniqueItems.sort((a, b) => String(a.name || "").localeCompare(String(b.name || "")));
  }, [items, selectedItemType, selectedDegree]);

  // Reset degree selection when item type changes
  useEffect(() => {
    setSelectedDegree("");
  }, [selectedItemType]);

  // Helpers
  const renderImage = (base64) =>
    base64 && typeof base64 === "string"
      ? `data:image/jpeg;base64,${base64}`
      : placeholderSvg;

  const pushToCart = (newItem) => {
    const prev = JSON.parse(localStorage.getItem("cart") || "[]");
    const updated = [...prev, newItem];
    localStorage.setItem("cart", JSON.stringify(updated));
    if (typeof setItems === "function") setItems(updated);
  };

  // Handle option changes
  const handleOptionChange = (itemId, optionLabel, value) => {
    setItemOptions((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [optionLabel]: value,
      },
    }));
  };

  // Check if all required options are selected
  const areAllOptionsSelected = (product) => {
    if (!product.options || product.options.length === 0) return true;

    // Use the correct ID for sets vs individual items
    const itemId = product.uiId || `set-${product.id}`;
    const selectedOptions = itemOptions[itemId] || {};
    
    return product.options.every(
      (option) =>
        selectedOptions[option.label] && selectedOptions[option.label] !== ""
    );
  };

  // add to cart for individual products (buy flow)
  const addIndividualToCart = (product) => {
    // Check if all required options are selected
    if (!areAllOptionsSelected(product)) {
      alert("Please select all required options before adding to cart.");
      return;
    }

    const selectedOptions = itemOptions[product.uiId] || {};
    const newItem = {
      id: `${product.degreeId ?? "NA"}-${product.id}-${Date.now()}`,
      name: product.name,
      category: product.category,
      description: product.description,
      pictureBase64: product.pictureBase64 ?? null,
      hirePrice: Number(product.buyPrice) || 0,
      buyPrice: product.buyPrice ?? null,
      quantity: 1,
      options: product.options || [],
      selectedOptions: selectedOptions,
      type: "individual",
      isHiring: false,
    };
    pushToCart(newItem);
    window.dispatchEvent(new Event("cartUpdated"));

    // Clear the selected options for this item after adding to cart
    setItemOptions((prev) => ({
      ...prev,
      [product.uiId]: {},
    }));
  };

  // add to cart for a set (buy flow)
  const addSetToCart = (setItem) => {
    // Check if all required options are selected for sets too
    if (!areAllOptionsSelected({ ...setItem, uiId: `set-${setItem.id}` })) {
      alert("Please select all required options before adding to cart.");
      return;
    }

    const selectedOptions = itemOptions[`set-${setItem.id}`] || {};
    const newItem = {
      id: `set-${setItem.id}-${Date.now()}`,
      name: setItem.name,
      category: setItem.category || "Set",
      description: setItem.description,
      pictureBase64: setItem.pictureBase64 ?? null,
      hirePrice: Number(setItem.buyPrice) || 0,
      buyPrice: setItem.buyPrice ?? null,
      quantity: 1,
      options: setItem.options || [],
      selectedOptions: selectedOptions,
      type: "set",
      isHiring: false,
    };
    pushToCart(newItem);
    window.dispatchEvent(new Event("cartUpdated"));
    
    // Clear the selected options for this set after adding to cart
    setItemOptions((prev) => ({
      ...prev,
      [`set-${setItem.id}`]: {},
    }));
  };

  const openDialog = (item) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
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

        <div className="content-grid">
          <div className="main-content">
            <div>
              <ul style={{ listStyleType: "disc", paddingLeft: "1.5rem" }}>
                <li>
                  <p>
                    Thank you for your order to purchase your own Massey
                    University regalia.
                  </p>
                </li>
                <li>
                  <p>
                    For more information email us{" "}
                    <a href="mailto:info@masseygowns.org.nz?subject=Quote Request">
                      info@masseygowns.org.nz
                    </a>
                  </p>
                </li>
                <li>
                  <p>
                    Please allow four weeks for manufacture - this may be longer
                    during the graduation season due to the increase in demand
                    on our supplies around this time.
                  </p>
                </li>
              </ul>
            </div>
            <br />

            {/* --------- Sets Tab --------- */}
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
                        <div key={`set-${s.id}`} className="product-card-set">
                          <div className="product-image">
                            {/* Image placeholder */}
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

                            {/* Display options as dropdowns for sets */}
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
                                        itemOptions[`set-${s.id}`]?.[
                                          option.label
                                        ] || ""
                                      }
                                      onChange={(e) =>
                                        handleOptionChange(
                                          `set-${s.id}`,
                                          option.label,
                                          e.target.value
                                        )
                                      }
                                    >
                                      <option value="">
                                        Please select...
                                      </option>
                                      {option.choices.map((choice, idx) => (
                                        <option key={idx} value={choice}>
                                          {choice}
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
                                  !areAllOptionsSelected({
                                    ...s,
                                    uiId: `set-${s.id}`
                                  }) ? "disabled" : ""
                                }`}
                                disabled={!areAllOptionsSelected({
                                  ...s,
                                  uiId: `set-${s.id}`
                                })}
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

            {/* --------- Individual Items Tab --------- */}
            {activeTab === "individual" && (
              <div>
                <h2 className="section-title">Shop Individual Items</h2>

                {/* Cascading Dropdowns */}
                <div className="cascading-dropdowns">
                  <div className="dropdown-row">
                    <div className="dropdown-group">
                      <label
                        className="dropdown-label"
                        htmlFor="itemTypeSelect"
                      >
                        Item Type:
                      </label>
                      <select
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

                  {!loading &&
                    !error &&
                    !selectedItemType &&
                    !selectedDegree && (
                      <p className="muted">
                        Please select an item type and degree to view available
                        items.
                      </p>
                    )}

                  {!loading &&
                    !error &&
                    selectedItemType &&
                    !selectedDegree && (
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

                  {!loading && !error && filteredItems.length > 0 && (
                    <div className="filtered-items">
                      <div className="items-header">
                        <h3 className="items-title">
                          {selectedItemType} {selectedDegree}
                        </h3>
                        <span className="items-count">
                          {filteredItems.length} item
                          {filteredItems.length === 1 ? "" : "s"}
                        </span>
                      </div>

                      <div className="items-grid">
                        {filteredItems.map((product) => (
                          <div key={product.uiId} className="product-card">
                            <div className="product-image">
                              {/* Image placeholder */}
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

                              {/* Display options as dropdowns */}
                              {product.options &&
                                product.options.length > 0 && (
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
                                              e.target.value
                                            )
                                          }
                                        >
                                          <option value="">
                                            Please select...
                                          </option>
                                          {option.choices.map((choice, idx) => (
                                            <option key={idx} value={choice}>
                                              {choice}
                                            </option>
                                          ))}
                                        </select>
                                      </div>
                                    ))}
                                  </div>
                                )}

                              <div className="product-footer">
                                <span className="product-price">
                                  ${Number(product.buyPrice).toFixed(2)}
                                </span>
                                <button
                                  onClick={() => addIndividualToCart(product)}
                                  className={`add-to-cart-btn ${
                                    !areAllOptionsSelected(product)
                                      ? "disabled"
                                      : ""
                                  }`}
                                  disabled={!areAllOptionsSelected(product)}
                                >
                                  Add to Cart
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dialog Box */}
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