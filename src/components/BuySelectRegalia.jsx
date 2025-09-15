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

  // individual items
  const [items, setItemsLocal] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // degree sets
  const [sets, setSets] = useState([]);
  const [loadingSets, setLoadingSets] = useState(true);
  const [errorSets, setErrorSets] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getItems();
        const safe = Array.isArray(data) ? data : [];
        setItemsLocal(safe);

        const firstCategory =
          safe
            .filter((x) => x?.buyPrice != null)
            .map((x) => x.category)
            .find(Boolean) || null;
        setSelectedCategory(firstCategory || null);
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

  const itemsByCategory = React.useMemo(() => {
    const map = new Map();
    for (const it of items || []) {
      if (it?.buyPrice == null) continue;
      const cat = it?.category || "Other";
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat).push({
        ...it,
        uiId: `${it.degreeId}-${it.id}`,
      });
    }
    const obj = {};
    [...map.keys()].sort().forEach((k) => {
      obj[k] = map
        .get(k)
        .sort((a, b) =>
          String(a.name || "").localeCompare(String(b.name || ""))
        );
    });
    return obj;
  }, [items]);

  const categories = React.useMemo(
    () => Object.keys(itemsByCategory),
    [itemsByCategory]
  );

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

  // add to cart for individual products (buy flow)
  const addIndividualToCart = (product) => {
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
      selectedOptions: {},
      type: "individual",
    };
    pushToCart(newItem);
  };

  // add to cart for a set (buy flow)
  const addSetToCart = (setItem) => {
    const newItem = {
      id: `set-${setItem.id}-${Date.now()}`,
      name: setItem.name,
      category: setItem.category || "Set",
      description: setItem.description,
      pictureBase64: setItem.pictureBase64 ?? null,
      hirePrice: Number(setItem.buyPrice) || 0,
      buyPrice: setItem.buyPrice ?? null,
      quantity: 1,
      options: [],
      selectedOptions: {},
      type: "set",
    };
    pushToCart(newItem);
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
                Complete Degree Sets
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
                    Congratulations on your decision to purchase your own Massey
                    University regalia.
                  </p>
                </li>
                <li>
                  <p>
                    For more information and a detailed quote email us{" "}
                    <a href="mailto:info@masseygowns.org.nz?subject=Quote Request">
                      info@masseygowns.org.nz
                    </a>
                  </p>
                </li>
                <li>
                  <p>
                    Please allow four weeks for manufacture - this may be longer
                    during the graduation season due to the increase in demand
                    around this time.
                  </p>
                </li>
              </ul>
            </div>
            <br />
            {/* --------- Sets Tab --------- */}
            {activeTab === "sets" && (
              <div>
                <h2 className="section-title">Complete Degree Sets</h2>

                {loadingSets && <p className="muted">Loading degree sets…</p>}
                {errorSets && <p className="error-text">{errorSets}</p>}

                {!loadingSets && !errorSets && sets.length === 0 && (
                  <div className="empty-cart">No degree sets available.</div>
                )}

                {!loadingSets && !errorSets && sets.length > 0 && (
                  <div className="items-grid">
                    {sets.map((s) => (
                      <div key={`set-${s.id}`} className="product-card">
                        <div className="product-image">
                          {/* Uncomment if you’ll have images
                          <img
                            src={renderImage(s.pictureBase64)}
                            alt={s.name}
                            className="item-image-topic"
                            onError={(e) => (e.currentTarget.src = placeholderSvg)}
                          /> */}
                        </div>
                        <div className="product-info">
                          <span className="item-category">
                            {s.category || "Set"}
                          </span>
                          <h4
                            className="product-name item-title clickable"
                            onClick={() => setIsDialogOpen(true)}
                            onMouseEnter={() => setShowTooltip(true)}
                            onMouseLeave={() => setShowTooltip(false)}
                          >
                            {s.name}
                          </h4>
                          {/* {s.description ? (
                            <p className="product-description">
                              {s.description}
                            </p>
                          ) : (
                            <p className="product-description muted">&nbsp;</p>
                          )} */}
                          <div className="product-footer">
                            <span className="product-price">
                              ${Number(s.buyPrice ?? 0).toFixed(2)}
                            </span>
                            <button
                              onClick={() => addSetToCart(s)}
                              className="add-to-cart-btn"
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
                <h2 className="section-title">Shop by Category</h2>

                <div className="category-select-row">
                  <label className="category-label" htmlFor="categorySelect">
                    Category:
                  </label>
                  <select
                    id="categorySelect"
                    className="category-select"
                    value={selectedCategory || ""}
                    onChange={(e) =>
                      setSelectedCategory(e.target.value || null)
                    }
                  >
                    {categories.length === 0 && (
                      <option value="">No categories</option>
                    )}
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="category-accordion">
                  {loading && <p className="muted">Loading items…</p>}
                  {error && <p className="error-text">{error}</p>}

                  {!loading && !error && categories.length === 0 && (
                    <p className="muted">No purchasable items available.</p>
                  )}

                  {!loading && !error && selectedCategory && (
                    <div className="category-panel">
                      <div className="category-panel-header">
                        <h3 className="product-name">{selectedCategory}</h3>
                        <span className="muted">
                          {itemsByCategory[selectedCategory]?.length || 0} item
                          {itemsByCategory[selectedCategory]?.length === 1
                            ? ""
                            : "s"}
                        </span>
                      </div>

                      <div className="items-grid">
                        {itemsByCategory[selectedCategory]?.map((product) => (
                          <div key={product.uiId} className="product-card">
                            <div className="product-image">
                              {/* Uncomment when images are ready
                              <img
                                src={renderImage(product.pictureBase64)}
                                alt={product.name}
                                className="item-image-topic"
                                onError={(e) => {
                                  e.currentTarget.src = placeholderSvg;
                                }}
                              /> */}
                            </div>
                            <div className="product-info">
                              <span className="item-category">
                                {product.category}
                              </span>
                              <h4
                                className="product-name item-title clickable"
                                onClick={() => setIsDialogOpen(true)}
                                onMouseEnter={() => setShowTooltip(true)}
                                onMouseLeave={() => setShowTooltip(false)}
                              >
                                {product.name}
                              </h4>
                              <div className="product-footer">
                                <span className="product-price">
                                  ${Number(product.buyPrice).toFixed(2)}
                                </span>
                                <button
                                  onClick={() => addIndividualToCart(product)}
                                  className="add-to-cart-btn"
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
      {isDialogOpen && (
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
              <h3>Name</h3>
              <p>Description</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuySelectRegalia;
