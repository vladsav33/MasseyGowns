import React, { useState, useEffect } from "react";
import CartItem from "./CartItem.jsx";
import "./CartList.css";

function CartList({ step, items, setItems }) {
  const [donationQuantity, setDonationQuantity] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [editingItemId, setEditingItemId] = useState(null);
  const [backupItems, setBackupItems] = useState(null);

  // Centralized cart updater
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
    setTimeout(() => window.dispatchEvent(new Event("cartUpdated")), 0);
  };

  // --- Cart actions ---
  const handleAddDonationToCart = () => {
    const donationItem = {
      id: 20,
      cartItemId: crypto.randomUUID(),
      name: "Donation",
      category: "Graduate Women Manawatu Charitable Trust Inc.",
      hirePrice: 2,
      quantity: donationQuantity,
      isDonation: true,
    };
    setDonationQuantity(1);
    updateCart((prev) => [...prev, donationItem]);
    setIsDialogOpen(false);
  };

  const handleIncrease = (rowId) => {
    updateCart((prev) =>
      prev.map((item) => {
        const id = item.cartItemId ?? item.uiId ?? item.id;
        return id === rowId
          ? { ...item, quantity: (item.quantity || 1) + 1 }
          : item;
      }),
    );
  };

  const handleDecrease = (rowId) => {
    updateCart((prev) =>
      prev.map((item) => {
        const id = item.cartItemId ?? item.uiId ?? item.id;
        return id === rowId && (item.quantity || 1) > 1
          ? { ...item, quantity: (item.quantity || 1) - 1 }
          : item;
      }),
    );
  };

  const handleRemove = (rowId) => {
    updateCart((prev) =>
      prev.filter((item) => {
        const id = item.cartItemId ?? item.uiId ?? item.id;
        return id !== rowId;
      }),
    );
    if (editingItemId === rowId) {
      setEditingItemId(null);
      setBackupItems(null);
    }
  };

  const handleOptionChange = (rowId, optionLabel, newValue) => {
    updateCart((prev) =>
      prev.map((item) => {
        const id = item.cartItemId ?? item.uiId ?? item.id;
        if (id !== rowId) return item;
        return {
          ...item,
          selectedOptions: {
            ...(item.selectedOptions || {}),
            [optionLabel]: newValue,
          },
        };
      }),
    );
  };

  const handleDeliveryChange = (rowId, newPrice) => {
    updateCart((prev) =>
      prev.map((item) => {
        const id = item.cartItemId ?? item.uiId ?? item.id;
        return id === rowId ? { ...item, hirePrice: newPrice } : item;
      }),
    );
  };

  const startEdit = (rowId) => {
    if (editingItemId && editingItemId !== rowId) return;
    setBackupItems(items);
    setEditingItemId(rowId);
  };

  const onTogglePurchaseType = (rowId, newIsHiring) => {
    updateCart((prev) =>
      prev.map((item) => {
        const id = item.cartItemId ?? item.uiId ?? item.id;
        return id === rowId ? { ...item, isHiring: newIsHiring } : item;
      }),
    );
  };

  const saveEdit = () => {
    setEditingItemId(null);
    setBackupItems(null);
  };

  const cancelEdit = () => {
    if (backupItems) updateCart(backupItems);
    setEditingItemId(null);
    setBackupItems(null);
  };

  // --- Price utilities ---
  const getNumericPrice = (priceString) =>
    parseFloat(String(priceString || 0).replace("$", "")) || 0;

  const totalPrice = items
    .filter((item) => !item.isDonation)
    .reduce((acc, item) => {
      let price;

      if (item.isDelivery === true) {
        const selectedDeliveryId = item.selectedOptions?.["Delivery Type"];
        const matchedOption = item.options[0].choices.find(
          (opt) => opt.id == selectedDeliveryId,
        );
        price = getNumericPrice(matchedOption?.price);
      } else if (item.isHiring === false) {
        price = getNumericPrice(item.buyPrice);
      } else {
        price = getNumericPrice(item.hirePrice);
      }

      return acc + price * (item.quantity || 1);
    }, 0);

  const totalDonationPrice = items
    .filter((item) => item.isDonation)
    .reduce((acc, item) => acc + item.hirePrice * (item.quantity || 1), 0);

  const totalDonationCount = items
    .filter((item) => item.isDonation)
    .reduce((acc, item) => acc + (item.quantity || 1), 0);

  const grandTotal = totalPrice + totalDonationPrice;
  useEffect(() => {
    localStorage.setItem("grandTotal", String(grandTotal));
  }, [grandTotal]);

  const hasDonation = items.some((item) => item.isDonation);

  return (
    <div className="cart">
      {items.length > 0 ? (
        <>
          <h4>You have {items.length} items in your cart</h4>

          {items.map((item) => {
            const rowId = item.cartItemId ?? item.uiId ?? item.id;

            return (
              <CartItem
                key={rowId}
                item={item}
                step={step}
                quantity={item.quantity || 1}
                onIncrease={() => handleIncrease(rowId)}
                onDecrease={() => handleDecrease(rowId)}
                onRemove={() => handleRemove(rowId)}
                onOptionChange={(itemId, optionLabel, newValue) =>
                  handleOptionChange(rowId, optionLabel, newValue)
                }
                onDeliveryChange={(itemId, newPrice) =>
                  handleDeliveryChange(rowId, newPrice)
                }
                onTogglePurchaseType={onTogglePurchaseType}
                isEditing={editingItemId === rowId}
                onEdit={() => startEdit(rowId)}
                onSave={saveEdit}
                onCancel={cancelEdit}
              />
            );
          })}

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
                disabled={hasDonation}
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
                <span>Total Donation ({totalDonationCount} * $2):</span>
                <span>${totalDonationPrice.toFixed(2)}</span>
              </div>

              <div className="summary-row total">
                <span>Total Amount (Including GST):</span>
                <span>${grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
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
                    <h3>Our Mission</h3>
                    <ul
                      style={{ listStyleType: "disc", paddingLeft: "1.5rem" }}
                    >
                      <li>
                        <p>
                          To provide a robe hire service of the highest quality
                        </p>
                      </li>
                      <li>
                        <p>
                          To disburse funds raised by robe hire for the
                          advancement of education
                        </p>
                      </li>
                    </ul>
                  </div>

                  <div className="impact-section">
                    <p>
                      A $2 donation will go towards a grant to help someone
                      realise their potential.
                    </p>
                    <p className="highlight">
                      ADH Palmerston North has given over
                      <strong> $1 million in grants </strong>
                      to help students since its formation.
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
                          Math.max(1, parseInt(e.target.value) || 1),
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
                  className="donate-add-btn"
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
