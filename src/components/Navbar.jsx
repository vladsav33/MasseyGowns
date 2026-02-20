import React, { useState, useEffect, useRef } from "react";
import "./Navbar.css";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";

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

  const totalItems = cartItems
    .filter(Boolean)
    .reduce((acc, item) => acc + (item.quantity || 1), 0);

  const totalPrice = cartItems.filter(Boolean).reduce((acc, item) => {
    // Use buyPrice if item is in buy mode (isHiring === false), otherwise use hirePrice
    const price =
      item.isHiring === false
        ? getNumericPrice(item.buyPrice)
        : getNumericPrice(item.hirePrice);
    return acc + price * (item.quantity || 1);
  }, 0);

  const handleCartIconClick = () => {
    setIsCartOpen(!isCartOpen);
  };

  const handleViewCart = () => {
    setIsCartOpen(false);
    navigate("/cart");
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

  // Helper function to get item price based on hire/buy mode
  const getItemPrice = (item) => {
    const price =
      item.isHiring === false
        ? getNumericPrice(item.buyPrice)
        : getNumericPrice(item.hirePrice);
    return price * (item.quantity || 1);
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
          <NavLink
            to="/hireregalia"
            state={{ step: 1 }}
            className={({ isActive }) => {
              const isPhoto =
                new URLSearchParams(location.search).get("mode") === "photo";
              return isActive && !isPhoto ? "menu-link active" : "menu-link";
            }}
          >
            HIRE REGALIA
          </NavLink>
        </li>
        <li className="has-dropdown">
          <NavLink to="/buyregalia" state={{ step: 1 }}>
            BUY REGALIA
          </NavLink>
        </li>

        <li className="has-dropdown">
          <NavLink
            to="/hireregalia?mode=photo"
            state={{ step: 1 }}
            className={({ isActive }) => {
              const isPhoto =
                new URLSearchParams(location.search).get("mode") === "photo";
              return isActive && isPhoto ? "menu-link active" : "menu-link";
            }}
          >
            CASUAL HIRE FOR PHOTOS
          </NavLink>
        </li>

        <li>
          <NavLink to="/faqs">FAQs</NavLink>
        </li>
        <li>
          <NavLink to="/contactus">CONTACT US</NavLink>
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
                                  {item.options &&
                                    item.options.map((option) => {
                                      const selectedId =
                                        item.selectedOptions[option.label];
                                      if (!selectedId) return null;

                                      const selectedChoice =
                                        option.choices.find(
                                          (c) =>
                                            String(c.id || c.value) ===
                                            String(selectedId),
                                        );

                                      const displayValue = selectedChoice
                                        ? selectedChoice.value ||
                                          selectedChoice.size ||
                                          selectedChoice.name ||
                                          selectedChoice
                                        : selectedId;

                                      return (
                                        <div
                                          key={option.label}
                                          className="cart-option"
                                        >
                                          <span className="option-label">
                                            {option.label}:
                                          </span>
                                          <span className="option-value">
                                            {displayValue}
                                          </span>
                                        </div>
                                      );
                                    })}
                                </div>
                              )}
                          </div>
                          <div className="cart-item-actions">
                            <div className="cart-item-price">
                              ${getItemPrice(item).toFixed(2)}
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
        {/*<i className="fa fa-search"></i>*/}
        {/*<Link to={"/payment"}>*/}
        {/*  <i className="fa fa-user"></i>*/}
        {/*</Link>*/}
      </div>
    </nav>
  );
}

export default Navbar;
