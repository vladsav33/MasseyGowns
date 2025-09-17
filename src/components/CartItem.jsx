import React, { useState } from "react";
import "./CartItem.css";

function CartItem({
  item,
  quantity,
  step,
  onIncrease,
  onDecrease,
  onRemove,
  onOptionChange,
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const unitPrice = parseFloat(item.hirePrice || 0);
  const subtotal = unitPrice * quantity;
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <div className="cart-item item-image-container">
      <img
        src={"../../img/2.jpg"}
        className="item-image"
        onError={(e) => {
          e.target.src =
            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zNSA0MEg2NVY0NEgzNVY0MFpNMzUgNTBINjVWNTRIMzVWNTBaTTM1IDYwSDU1VjY0SDM1VjYwWiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K";
        }}
      />
      {item.name !== "Donation" &&
        (item.isHiring === true ? (
          <div className="hire-ribbon">Hire</div>
        ) : (
          <div className="buy-ribbon">Buy</div>
        ))}

      {step === 1 ? (
        // Step 1 view (with options and editable fields)
        <div className="item-details">
          <div className="title-container">
            <h4
              className="item-title clickable"
              onClick={() => setIsDialogOpen(true)}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              {item.name}
            </h4>
          </div>
          <p className="item-category">{item.category}</p>
          <p className="item-price">${unitPrice.toFixed(2)}</p>

          {/* Dynamic Options */}
          {item.options &&
            item.options.map((option, index) => (
              <div key={index} className="item-option">
                <label>{option.label}:</label>
                <select
                  className="option-select"
                  value={item.selectedOptions?.[option.label] || ""} // bind selected value
                  onChange={(e) =>
                    onOptionChange(item.id, option.label, e.target.value)
                  }
                  required
                >
                  <option value="">Please select...</option>
                  {option.choices.map((choice, idx) => (
                    <option key={idx} value={choice}>
                      {choice}
                    </option>
                  ))}
                </select>
              </div>
            ))}
        </div>
      ) : (
        // Step 2 view (summary)
        <div className="item-details">
          <p>
            <span className="item-title">{item.name} </span>
            <span className="item-category">({item.category})</span>
          </p>

          {/* Display selected options */}
          {item.options && item.options.length > 0 && (
            <div className="item-options">
              {item.options.map((option, index) => (
                <div key={index} className="option-row">
                  <span className="option-label">{option.label}:</span>
                  <span className="option-value">
                    {item.selectedOptions?.[option.label] || "—"}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Pricing */}
          <div className="item-pricing">
            <div className="price-row">
              <span>Unit Price:</span>
              <span>${unitPrice.toFixed(2)}</span>
            </div>
            <div className="price-row">
              <span>Quantity:</span>
              <span>{quantity}</span>
            </div>
            <div className="price-row">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="price-row">
              <span>Tax (10%):</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="price-row total-row">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="item-controls">
        <div className="quantity-controls">
          <button
            onClick={onDecrease}
            className="quantity-btn"
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="quantity">{quantity}</span>
          <button
            onClick={onIncrease}
            className="quantity-btn"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
        <button
          onClick={onRemove}
          className="remove-btn"
          aria-label="Remove item"
        >
          Remove
        </button>
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
              <h3>{item.name}</h3>
              <p>{item.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartItem;
