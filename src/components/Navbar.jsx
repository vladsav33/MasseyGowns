import React, { useState, useEffect, useRef } from "react";
import "./Navbar.css";
import { Link, useLocation, useNavigate } from "react-router-dom";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const cartRef = useRef(null);

  // Get the selected ceremony ID from localStorage
  const [selectedCeremonyId, setSelectedCeremonyId] = useState(null);

  useEffect(() => {
    const ceremonyId = localStorage.getItem("selectedCeremonyId");
    setSelectedCeremonyId(ceremonyId ? parseInt(ceremonyId) : null);
  }, [location]);

  const isActive = (path, ceremonyId = null) => {
    if (location.pathname !== path) return false;
    
    // If a ceremony ID is specified, check if it matches
    if (ceremonyId !== null) {
      const storedCeremonyId = localStorage.getItem("selectedCeremonyId");
      return storedCeremonyId && parseInt(storedCeremonyId) === ceremonyId;
    }
    
    return true;
  };

  const handleHireClick = (ceremonyId) => {
    // Store the ceremony ID in localStorage
    localStorage.setItem("selectedCeremonyId", ceremonyId);
    setSelectedCeremonyId(ceremonyId);
  };

  // Load cart items from localStorage
  useEffect(() => {
    const loadCartItems = () => {
      const saved = localStorage.getItem("cart");
      if (saved) {
        try {
          const items = JSON.parse(saved);
          setCartItems(Array.isArray(items) ? items : []);
        } catch (error) {
          console.error("Failed to parse cart from localStorage:", error);
          setCartItems([]);
        }
      } else {
        setCartItems([]);
      }
    };

    loadCartItems();

    const safeLoad = () => {
      if (typeof startTransition === "function") {
        startTransition(() => loadCartItems());
      } else {
        setTimeout(loadCartItems, 0);
      }
    };

    safeLoad();

    // Listen for localStorage changes (when cart is updated in other components)
    const handleStorageChange = (e) => {
      if (e.key === "cart") safeLoad();
      if (e.key === "selectedCeremonyId") {
        const ceremonyId = localStorage.getItem("selectedCeremonyId");
        setSelectedCeremonyId(ceremonyId ? parseInt(ceremonyId) : null);
      }
    };

    // Listen for custom cart update events
    const handleCartUpdate = () => {
      safeLoad();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("cartUpdated", handleCartUpdate);

    loadCartItems();

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, [location]);

  // Close cart dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setIsCartOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Calculate cart totals
  const getNumericPrice = (priceString) =>
    parseFloat(String(priceString || 0).replace("$", "")) || 0;

  const totalItems = cartItems.reduce(
    (acc, item) => acc + (item.quantity || 1),
    0
  );

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + getNumericPrice(item.hirePrice) * (item.quantity || 1),
    0
  );

  const handleCartIconClick = () => {
    setIsCartOpen(!isCartOpen);
  };

  // Analyze cart contents to determine item types
  const analyzeCartContents = () => {
    const analysis = {
      hasBuyItems: false,
      hasHireItems: false,
      hasOnlyDonations: false,
    };

    // Filter out donations first
    const nonDonationItems = cartItems.filter((item) => !item.isDonation);

    if (nonDonationItems.length === 0) {
      analysis.hasOnlyDonations = true;
      return analysis;
    }

    // Check for buy items (items where isHiring is false or type indicates buying)
    analysis.hasBuyItems = nonDonationItems.some(
      (item) =>
        item.isHiring === false ||
        (item.type === "individual" && item.isHiring !== true) ||
        (item.type === "set" && item.isHiring !== true)
    );

    // Check for hire items (items where isHiring is true or undefined/null - old hire items)
    analysis.hasHireItems = nonDonationItems.some(
      (item) =>
        item.isHiring === true ||
        item.isHiring === undefined ||
        item.isHiring === null
    );

    return analysis;
  };

  const handleViewCart = () => {
    setIsCartOpen(false);

    const { hasBuyItems, hasHireItems, hasOnlyDonations } =
      analyzeCartContents();

    // If cart is empty or only has donations, default behavior
    if (cartItems.length === 0 || hasOnlyDonations) {
      if (location.pathname === "/hireregalia") {
        navigate("/hireregalia", { state: { step: 2 } });
      } else if (location.pathname === "/buyregalia") {
        navigate("/buyregalia", { state: { step: 2 } });
      } else {
        navigate("/buyregalia", { state: { step: 2 } });
      }
      return;
    }

    // Only buy items in cart → go to step 2 in buyRegalia
    if (hasBuyItems && !hasHireItems) {
      navigate("/buyregalia", { state: { step: 2 } });
      return;
    }

    // Only hire items in cart → go to step 2 in hireRegalia
    if (hasHireItems && !hasBuyItems) {
      navigate("/hireregalia", { state: { step: 2 } });
      return;
    }

    // Both hire and buy items in cart
    if (hasBuyItems && hasHireItems) {
      if (location.pathname === "/hireregalia") {
        // Already on hire page → go to step 2 in hireRegalia
        navigate("/hireregalia", { state: { step: 2 } });
      } else if (location.pathname === "/buyregalia") {
        // Already on buy page → go to step 2 in buyRegalia
        navigate("/buyregalia", { state: { step: 2 } });
      } else {
        // Not on hire or buy pages → go to step 2 in hireRegalia
        navigate("/hireregalia", { state: { step: 2 } });
      }
      return;
    }

    // Fallback
    navigate("/buyregalia", { state: { step: 2 } });
  };

  const removeFromCart = (itemId) => {
    const updatedItems = cartItems.filter((item) => item.id !== itemId);
    setCartItems(updatedItems);

    if (updatedItems.length > 0) {
      localStorage.setItem("cart", JSON.stringify(updatedItems));
    } else {
      localStorage.removeItem("cart");
    }

    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event("cartUpdated"));
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/">
          <img src="/logo.jpg" alt="MasseyGowns" className="logo" />
        </Link>
      </div>
      <ul className="navbar-menu">
        <li className="has-dropdown">
          <Link
            to="/hireregalia"
            state={{ step: 1 }}
            onClick={() => handleHireClick(0)}
            className={`menu-link ${isActive("/hireregalia", 0) ? "active" : ""}`}
          >
            HIRE REGALIA
          </Link>
        </li>
        <li className="has-dropdown">
          <Link
            to="/buyregalia"
            state={{ step: 1 }}
            className={`menu-link ${isActive("/buyregalia") ? "active" : ""}`}
          >
            BUY REGALIA
          </Link>
        </li>

        <li className="has-dropdown">
          <Link
            to="/hireregalia"
            state={{ step: 1 }}
            onClick={() => handleHireClick(2)}
            className={`menu-link ${isActive("/hireregalia", 2) ? "active" : ""}`}
          >
            Casual Hire for Photos
          </Link>
        </li>

        <li>
          <Link to="/faqs" className={isActive("/faqs") ? "active" : ""}>
            FAQs
          </Link>
        </li>
        <li>
          <Link to="/contactus">Contact Us</Link>
        </li>
      </ul>
      <div className="navbar-icons">
        <div className="cart-icon-container" ref={cartRef}>
          <div className="cart-icon" onClick={handleCartIconClick}>
            <i className="fa fa-shopping-bag"></i>
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </div>

          {/* Cart Dropdown */}
          {isCartOpen && (
            <div className="cart-dropdown">
              <div className="cart-dropdown-header">
                <h3>Shopping Cart</h3>
              </div>

              <div className="cart-dropdown-content">
                {cartItems.length > 0 ? (
                  <>
                    <div className="cart-items-list">
                      {cartItems.map((item) => (
                        <div key={item.id} className="cart-dropdown-item">
                          <div className="cart-item-info">
                            <div className="cart-item-name">{item.name}</div>
                            <div className="cart-item-details">
                              <span className="cart-item-category">
                                {item.category}
                              </span>
                              <span className="cart-item-quantity">
                                Qty: {item.quantity || 1}
                              </span>
                            </div>
                            {/* Show selected options if available */}
                            {item.selectedOptions &&
                              Object.keys(item.selectedOptions).length > 0 && (
                                <div className="cart-item-options">
                                  {Object.entries(item.selectedOptions).map(
                                    ([label, value]) => (
                                      <div key={label} className="cart-option">
                                        <span className="option-label">
                                          {label}:
                                        </span>
                                        <span className="option-value">
                                          {value}
                                        </span>
                                      </div>
                                    )
                                  )}
                                </div>
                              )}
                          </div>
                          <div className="cart-item-actions">
                            <div className="cart-item-price">
                              $
                              {(
                                getNumericPrice(item.hirePrice) *
                                (item.quantity || 1)
                              ).toFixed(2)}
                            </div>
                            <button
                              className="remove-item-btn"
                              onClick={() => removeFromCart(item.id)}
                              aria-label="Remove item"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="cart-dropdown-footer">
                      <div className="cart-total">
                        <strong>Total: ${totalPrice.toFixed(2)}</strong>
                      </div>
                      <button
                        className="view-cart-btn"
                        onClick={handleViewCart}
                      >
                        View Cart
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="empty-cart-message">
                    <p>Your cart is empty</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <i className="fa fa-search"></i>
        {/*<Link to={"/payment"}>*/}
        {/*  <i className="fa fa-user"></i>*/}
        {/*</Link>*/}
      </div>
    </nav>
  );
}

export default Navbar;
