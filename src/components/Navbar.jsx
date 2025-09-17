import React, { useState, useEffect, useRef } from "react";
import "./Navbar.css";
import { Link, useLocation, useNavigate } from "react-router-dom";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const cartRef = useRef(null);

  const isActive = (path) => {
    return location.pathname === path;
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

    // Load initially
    loadCartItems();

    // Listen for localStorage changes (when cart is updated in other components)
    const handleStorageChange = (e) => {
      if (e.key === "cart") {
        loadCartItems();
      }
    };

    // Listen for custom cart update events
    const handleCartUpdate = () => {
      loadCartItems();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("cartUpdated", handleCartUpdate);

    // Also check for cart changes on location change
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

  const totalItems = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);
  
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + getNumericPrice(item.hirePrice) * (item.quantity || 1),
    0
  );

  const handleCartIconClick = () => {
    setIsCartOpen(!isCartOpen);
  };

  const handleViewCart = () => {
    setIsCartOpen(false);
    if (location.pathname === "/hireregalia") {
      // If already on hire page, go to step 2
      navigate("/hireregalia", { state: { step: 2 } });
    } else if (location.pathname === "/buyregalia") {
      // If already on buy page, go to step 2
      navigate("/buyregalia", { state: { step: 2 } });
    } else {
      // Otherwise, go to hire page step 2 by default
      navigate("/hireregalia", { state: { step: 2 } });
    }
  };

  const removeFromCart = (itemId) => {
    const updatedItems = cartItems.filter(item => item.id !== itemId);
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
          <Link to="/hireregalia" state={{step:1}} className={`menu-link ${isActive("/hireregalia") ? "active" : ""}`} >
            HIRE REGALIA
          </Link>
        </li>
        <li className="has-dropdown">
          <Link to="/buyregalia" className={`menu-link ${isActive("/buyregalia") ? "active" : ""}`} state={{step:1}}>
            BUY REGALIA
          </Link>
        </li>
        <li>
          <Link to="/faqs" className={isActive("/faqs") ? "active" : ""}>FAQs</Link>
        </li>
        <li>
          <a href="#">Contact Us</a>
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
                              <span className="cart-item-category">{item.category}</span>
                              <span className="cart-item-quantity">Qty: {item.quantity || 1}</span>
                            </div>
                            {/* Show selected options if available */}
                            {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                              <div className="cart-item-options">
                                {Object.entries(item.selectedOptions).map(([label, value]) => (
                                  <div key={label} className="cart-option">
                                    <span className="option-label">{label}:</span>
                                    <span className="option-value">{value}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="cart-item-actions">
                            <div className="cart-item-price">
                              ${(getNumericPrice(item.hirePrice) * (item.quantity || 1)).toFixed(2)}
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
                      <button className="view-cart-btn" onClick={handleViewCart}>
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
      </div>
    </nav>
  );
}

export default Navbar;