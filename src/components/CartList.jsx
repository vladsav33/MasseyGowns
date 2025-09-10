import React, { useState, useEffect } from "react";
import CartItem from "./CartItem.jsx";
import "./CartList.css";

function CartList({ step, items, setItems }) {
  const [donationQuantity, setDonationQuantity] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Centralized cart updater (single source of truth)
  const updateCart = (next) => {
    setItems((prev) => {
      const updated = typeof next === "function" ? next(prev) : next;
      if (updated && updated.length > 0) {
        localStorage.setItem("cart", JSON.stringify(updated));
      } else {
        localStorage.removeItem("cart");
      }
      return updated;
    });
  };

  // Load cart from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch {
        console.error("Failed to parse cart from localStorage");
      }
    }
  }, [setItems]);

  // --- Cart actions ---
  const handleAddDonationToCart = () => {
    const donationItem = {
      id: Date.now(),
      name: "Donation",
      category: "Graduate Women Manawatu Charitable Trust Inc.",
      hirePrice: 2,
      quantity: donationQuantity,
      isDonation: true,
    };

    setDonationQuantity(1);
    updateCart([...items, donationItem]);
    setIsDialogOpen(false);
  };

  // const handleAddItemToCart = (itemData) => {
  //   const newItem = {
  //     ...itemData,
  //     selectedOptions: {}, // initialize empty object
  //     quantity: 1,
  //   };
  
  //   updateCart([...items, newItem]);
  // };
  

  const handleIncrease = (id) => {
    updateCart(
      items.map((item) =>
        item.id === id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
      )
    );
  };

  const handleDecrease = (id) => {
    updateCart(
      items.map((item) =>
        item.id === id && (item.quantity || 1) > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const handleRemove = (id) => {
    updateCart((prev) => prev.filter((it) => it.id !== id));
  };
  const handleOptionChange = (itemId, optionLabel, newValue) => {
    const updatedItems = items.map((item) => {
      if (item.id === itemId) {
        return {
          ...item,
          selectedOptions: {
            ...item.selectedOptions, // preserve other options
            [optionLabel]: newValue, // save the selected value
          },
        };
      }
      return item;
    });
  
    setItems(updatedItems);
    localStorage.setItem("cart", JSON.stringify(updatedItems)); // persist to localStorage
  };
  
  
  

  // --- Price utilities ---
  const getNumericPrice = (priceString) =>
    parseFloat(String(priceString || 0).replace("$", "")) || 0;

  const totalItems = items
    .filter((item) => !item.isDonation)
    .reduce((acc, item) => acc + (item.quantity || 1), 0);

  const totalPrice = items
    .filter((item) => !item.isDonation)
    .reduce(
      (acc, item) =>
        acc + getNumericPrice(item.hirePrice) * (item.quantity || 1),
      0
    );

  const totalDonationPrice = items
    .filter((item) => item.isDonation)
    .reduce((acc, item) => acc + item.hirePrice * (item.quantity || 1), 0);

  const totalDonationCount = items
    .filter((item) => item.isDonation)
    .reduce((acc, item) => acc + (item.quantity || 1), 0);

  const taxOnItems = totalPrice * 0.1;
  const taxOnDonations = totalDonationPrice * 0.1;

  const grandTotal =
    totalPrice + totalDonationPrice + taxOnItems + taxOnDonations;

  return (
    <div className="cart">
      {items.length > 0 ? (
        <>
          <h4>You have {items.length} items in your cart</h4>
          {items.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              step={step}
              quantity={item.quantity || 1}
              onIncrease={() => handleIncrease(item.id)}
              onDecrease={() => handleDecrease(item.id)}
              onRemove={() => handleRemove(item.id)}
              onOptionChange={handleOptionChange}
            />
          ))}
          <div></div>

          {step === 2 && (
            <div>
              {/* Donation */}
              <div className="donation">
                <h4>Make a donation to our Charitable Trust</h4>
                <p>
                  Graduate Women Manawatu Trust Inc., is a Charitable Trust
                  supporting women in and beyond education.
                </p>

                <button
                  className="donate-btn"
                  onClick={() => setIsDialogOpen(true)}
                >
                  Donate
                </button>
              </div>

              {/* Order Summary */}
              <div className="cart-summary">
                <h3>Order Summary</h3>
                <div className="summary-row">
                  <span>Total Items:</span>
                  <span>{items.length}</span>
                </div>

                <div className="summary-row">
                  <span>Subtotal (Items):</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>

                <div className="summary-row">
                  <span>Tax on Items (10%):</span>
                  <span>${taxOnItems.toFixed(2)}</span>
                </div>

                <div className="summary-row">
                  <span>Total Donation ({totalDonationCount} × $2):</span>
                  <span>${totalDonationPrice.toFixed(2)}</span>
                </div>

                <div className="summary-row">
                  <span>Tax on Donations (10%):</span>
                  <span>${taxOnDonations.toFixed(2)}</span>
                </div>

                <div className="summary-row total">
                  <span>Total Amount:</span>
                  <span>${grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="empty-cart">
          <span className="empty-cart-icon">&#x1F6D2;</span>
          <div>Your cart is empty</div>
        </div>
      )}

      {/* Donation dialog */}
      {isDialogOpen && (
        <div className="dialog-overlay" onClick={() => setIsDialogOpen(false)}>
          <div className="dialog-box" onClick={(e) => e.stopPropagation()}>
            <div className="dialog-content">
              <div className="dialog-header">
                <h1>Donate</h1>
              </div>

              <div className="dialog-body">
                <div className="charity-info">
                  <p>
                    We are a not-for-profit Charitable Trust registered with the
                    Charities Commission (CC31226).
                  </p>
                  <div className="mission-section">
                    <h3>Our Mission is</h3>
                    <ul>
                      <li>
                        To provide a robe hire service of the highest quality
                      </li>
                      <li>
                        To disburse funds raised by robe hire for the
                        advancement of education
                      </li>
                    </ul>
                  </div>
                  <div className="impact-section">
                    <p>
                      A $2 donation will go towards a grant to help someone
                      realise their potential.
                    </p>
                    <p className="highlight">
                      ADH Palmerston North has given over{" "}
                      <strong>$1 million in grants</strong> to help students
                      since its formation.
                    </p>
                  </div>
                </div>

                <div className="donation-section">
                  <div className="quantity-controls">
                    <label>Number of $2 donations:</label>
                    <input
                      id="donation-quantity"
                      type="number"
                      min="1"
                      max="50"
                      value={donationQuantity}
                      onChange={(e) =>
                        setDonationQuantity(
                          Math.max(1, parseInt(e.target.value) || 1)
                        )
                      }
                      className="quantity-input"
                    />
                    <div className="total-display">
                      Total:{" "}
                      <strong>${(donationQuantity * 2).toFixed(2)}</strong>
                    </div>
                  </div>
                </div>
              </div>

              <div className="dialog-footer">
                <button
                  className="donate-btn"
                  onClick={handleAddDonationToCart}
                >
                  Add to Cart
                </button>
                <button
                  className="cancel-btn"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartList;
