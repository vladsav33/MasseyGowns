import React, { useEffect, useMemo, useRef, useState } from "react";
import "./Navbar.css";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const cartRef = useRef(null);

  //  localStorage ceremony id (keeping your logic)
  const [selectedCeremonyId, setSelectedCeremonyId] = useState(null);
  useEffect(() => {
    const ceremonyId = localStorage.getItem("selectedCeremonyId");
    setSelectedCeremonyId(ceremonyId ? parseInt(ceremonyId, 10) : null);
  }, [location]);

  //  Load cart
  useEffect(() => {
    const loadCartItems = () => {
      const saved = localStorage.getItem("cart");
      if (!saved) return setCartItems([]);
      try {
        const parsed = JSON.parse(saved);
        setCartItems(Array.isArray(parsed) ? parsed : []);
      } catch (e) {
        console.error("Failed to parse cart:", e);
        setCartItems([]);
      }
    };

    loadCartItems();

    const handleStorageChange = (e) => {
      if (e.key === "cart") loadCartItems();
      if (e.key === "selectedCeremonyId") {
        const ceremonyId = localStorage.getItem("selectedCeremonyId");
        setSelectedCeremonyId(ceremonyId ? parseInt(ceremonyId, 10) : null);
      }
    };

    const handleCartUpdate = () => loadCartItems();

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, [location]);

  //  Close cart dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setIsCartOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  //  Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname, location.search]);

  const getNumericPrice = (priceString) =>
    parseFloat(String(priceString || 0).replace("$", "")) || 0;

  const totalItems = useMemo(
    () =>
      cartItems
        .filter(Boolean)
        .reduce((acc, item) => acc + (item.quantity || 1), 0),
    [cartItems],
  );

  const totalPrice = useMemo(
    () =>
      cartItems.filter(Boolean).reduce((acc, item) => {
        const unit =
          item.isHiring === false
            ? getNumericPrice(item.buyPrice)
            : getNumericPrice(item.hirePrice);
        return acc + unit * (item.quantity || 1);
      }, 0),
    [cartItems],
  );

  const getItemPrice = (item) => {
    const unit =
      item.isHiring === false
        ? getNumericPrice(item.buyPrice)
        : getNumericPrice(item.hirePrice);
    return unit * (item.quantity || 1);
  };

  const handleViewCart = () => {
    setIsCartOpen(false);
    setIsMobileMenuOpen(false);
    navigate("/cart");
  };

  const removeFromCart = (itemId) => {
    const updated = cartItems.filter((item) => item.id !== itemId);
    setCartItems(updated);

    if (updated.length > 0) localStorage.setItem("cart", JSON.stringify(updated));
    else localStorage.removeItem("cart");

    window.dispatchEvent(new Event("cartUpdated"));
  };

  const MenuLinks = ({ onClickLink }) => (
    <>
      <NavLink
        to="/hireregalia"
        state={{ step: 1 }}
        onClick={onClickLink}
        className={({ isActive }) => {
          const isPhoto = new URLSearchParams(location.search).get("mode") === "photo";
          return isActive && !isPhoto ? "nav-link active" : "nav-link";
        }}
      >
        HIRE REGALIA
      </NavLink>

      <NavLink
        to="/buyregalia"
        state={{ step: 1 }}
        onClick={onClickLink}
        className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
      >
        BUY REGALIA
      </NavLink>

      <NavLink
        to="/hireregalia?mode=photo"
        state={{ step: 1 }}
        onClick={onClickLink}
        className={({ isActive }) => {
          const isPhoto = new URLSearchParams(location.search).get("mode") === "photo";
          return isActive && isPhoto ? "nav-link active" : "nav-link";
        }}
      >
        CASUAL HIRE PHOTO
      </NavLink>

      <NavLink
        to="/faqs"
        onClick={onClickLink}
        className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
      >
        FAQs
      </NavLink>

      <NavLink
        to="/contactus"
        onClick={onClickLink}
        className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
      >
        CONTACT US
      </NavLink>
    </>
  );

  return (
    <header className="nav-wrap">
      <nav className="nav">
        <Link to="/" className="brand" aria-label="Go to home">
          <img src="/logo.jpg" alt="MasseyGowns" className="brand-logo" />
        </Link>

        {/* Desktop menu */}
        <div className="nav-links desktop-only">
          <MenuLinks />
        </div>

        <div className="nav-actions">
          {/* Cart */}
          <div className="cart-icon-container" ref={cartRef}>
            <button
              type="button"
              className="icon-btn"
              aria-label="Open cart"
              aria-expanded={isCartOpen}
              onClick={() => setIsCartOpen((v) => !v)}
            >
              <i className="fa fa-shopping-bag" />
              {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
            </button>

            {isCartOpen && (
              <div className="cart-dropdown" role="dialog" aria-label="Shopping cart">
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
                                <span className="cart-item-category">{item.category}</span>
                                <span className="cart-item-quantity">Qty: {item.quantity || 1}</span>
                              </div>

                              {item.selectedOptions &&
                                Object.keys(item.selectedOptions).length > 0 && (
                                  <div className="cart-item-options">
                                    {(item.options || []).map((option) => {
                                      const selectedId = item.selectedOptions?.[option.label];
                                      if (!selectedId) return null;

                                      const selectedChoice = (option.choices || []).find(
                                        (c) =>
                                          String(c.id || c.value) === String(selectedId),
                                      );

                                      const displayValue = selectedChoice
                                        ? selectedChoice.value ||
                                          selectedChoice.size ||
                                          selectedChoice.name ||
                                          String(selectedChoice)
                                        : String(selectedId);

                                      return (
                                        <div key={option.label} className="cart-option">
                                          <span className="option-label">{option.label}:</span>
                                          <span className="option-value">{displayValue}</span>
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
                                type="button"
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
                        <button className="view-cart-btn" onClick={handleViewCart} type="button">
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

          {/* Mobile hamburger */}
          <button
            type="button"
            className="icon-btn mobile-only"
            aria-label="Open menu"
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen((v) => !v)}
          >
            <i className={`fa ${isMobileMenuOpen ? "fa-times" : "fa-bars"}`} />
          </button>
        </div>
      </nav>

      {/* Mobile menu panel */}
      {isMobileMenuOpen && (
        <div className="mobile-menu mobile-only">
          <MenuLinks onClickLink={() => setIsMobileMenuOpen(false)} />
        </div>
      )}
    </header>
  );
}

export default Navbar;