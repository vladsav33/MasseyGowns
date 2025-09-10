import "./BuySelectRegalia.css";
import React, { useState, useEffect } from "react";
import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";
import { getItems } from "../services/hireRegaliaService";

const placeholderSvg =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNGM0Y0RjYiLz48cGF0aCBkPSJNNSA4NUg5NVY5MEg1Vjg1Wk01IDUwSDk1VjU1SDVWNDVaTTM1IDQwSDY1VjQ0SDM1VjQwWiIgZmlsbD0iIzlDQTNBRiIvPjwvc3ZnPg==";

const BuySelectRegalia = () => {
  const [activeTab, setActiveTab] = useState("individual");
  const [cart, setCart] = useState([]);
  //   const [showCart, setShowCart] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [items, setItems] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getItems();
        const safe = Array.isArray(data) ? data : [];
        setItems(safe);
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


  // Group items by category (only show things that are buyable; hide null buyPrice)
  const itemsByCategory = React.useMemo(() => {
    const map = new Map();
    for (const it of items || []) {
      if (it?.buyPrice == null) continue; // only show purchasable
      const cat = it?.category || "Other";
      if (!map.has(cat)) map.set(cat, []);
      // build a stable UI id: some ids in your payload repeat across degreeId, so combine:
      map.get(cat).push({
        ...it,
        uiId: `${it.degreeId}-${it.id}`, // unique per degree+item
      });
    }
    // sort categories alpha, items by name
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

  const addToCart = (item, type = "individual") => {
    const cartItem = {
      ...item,
      price: item?.buyPrice ?? item?.price ?? 0,
      cartId: `${item.uiId || item.id}-${Date.now()}`,
      type,
      quantity: 1,
    };
    setCart((prev) => [...prev, cartItem]);
    localStorage.setItem("cart");
    if (!showCart) setShowCart(true);
  };

  const updateQuantity = (cartId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(cartId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.cartId === cartId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (cartId) => {
    setCart((prev) => prev.filter((item) => item.cartId !== cartId));
  };

  const getTotalPrice = () => {
    return cart.reduce(
      (total, item) => total + (item.price || 0) * item.quantity,
      0
    );
  };

  //   const getTotalItems = () => {
  //     return cart.reduce((total, item) => total + item.quantity, 0);
  //   };

  // ----------------------------
  // Render helpers
  // ----------------------------
  const renderImage = (base64) => {
    if (base64 && typeof base64 === "string") {
      return `data:image/jpeg;base64,${base64}`;
    }
    // fallback to your placeholder image or your static jpg
    return placeholderSvg;
  };

  return (
    <div className="regalia-shop">
      {/* Header */}
      {/* <header className="shop-header">
        <div className="header-container">
          <div className="header-content">
            <h1 className="shop-title">Graduation Regalia Store</h1>
            <button
              onClick={() => setShowCart((v) => !v)}
              className="cart-button"
            >
              <ShoppingCart size={20} />
              Cart ({getTotalItems()})
              {cart.length > 0 && (
                <span className="cart-badge">{getTotalItems()}</span>
              )}
            </button>
          </div>
        </div>
      </header> */}

      <div className="main-container">
        {/* Tab Navigation */}
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
          {/* Main Content */}
          <div className="main-content">
            {activeTab === "sets" && (
              <div>
                <h2 className="section-title">Complete Degree Sets</h2>
                <div className="empty-cart">
                  {/* You can wire this to another API once sets are available */}
                  Degree sets are coming soon.
                </div>
              </div>
            )}

            {activeTab === "individual" && (
              <div>
                <h2 className="section-title">Shop by Category</h2>

                {/* CATEGORY SELECTOR (single select) */}
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

                {/* ACCORDION-LIKE EXPAND AREA */}
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
                        {itemsByCategory[selectedCategory]?.map((item) => (
                          <div key={item.uiId} className="product-card">
                            <div className="product-image">
                              <img
                                src={renderImage(item.pictureBase64)}
                                alt={item.name}
                                className="item-image-topic"
                                onError={(e) => {
                                  e.currentTarget.src = placeholderSvg;
                                }}
                              />
                            </div>
                            <div className="product-info">
                              <span className="item-category">
                                {item.category}
                              </span>
                              <h4 className="product-name">{item.name}</h4>
                              {item.description ? (
                                <p className="product-description">
                                  {item.description}
                                </p>
                              ) : (
                                <p className="product-description muted">
                                  &nbsp;
                                </p>
                              )}
                              <div className="product-footer">
                                <span className="product-price">
                                  ${Number(item.buyPrice).toFixed(2)}
                                </span>
                                <button
                                  onClick={() => addToCart(item)}
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

          {/* Cart Sidebar */}
          {/* {showCart && ( */}
          <div className="cart-sidebar">
            <div className="cart-container">
              <h3 className="cart-title">
                <ShoppingCart size={20} />
                Shopping Cart
              </h3>

              {cart.length === 0 ? (
                <p className="empty-cart">Your cart is empty</p>
              ) : (
                <>
                  <div className="cart-items">
                    {cart.map((item) => (
                      <div key={item.cartId} className="cart-item">
                        <div className="cart-item-header">
                          <div className="cart-item-info">
                            <h4 className="cart-item-name">{item.name}</h4>
                            <span className="cart-item-type">
                              {item.type === "set"
                                ? "Complete Set"
                                : "Individual Item"}
                            </span>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.cartId)}
                            className="remove-btn"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        <div className="cart-item-footer">
                          <div className="quantity-controls">
                            <button
                              onClick={() =>
                                updateQuantity(item.cartId, item.quantity - 1)
                              }
                              className="quantity-btn"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="quantity-display">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.cartId, item.quantity + 1)
                              }
                              className="quantity-btn"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                          <span className="item-total">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
          {/* )} */}
        </div>
      </div>
    </div>
  );
};

export default BuySelectRegalia;
