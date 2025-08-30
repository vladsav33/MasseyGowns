import React, { useState } from "react";
import "./CartItem.css";

function CartItem({ item, onIncrease, onDecrease, onRemove, onOptionChange }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="cart-item">
      <img
        src={item.image}
        alt={item.title}
        className="item-image"
        onError={(e) => {
          e.target.src =
            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zNSA0MEg2NVY0NEgzNVY0MFpNMzUgNTBINjVWNTRIMzVWNTBaTTM1IDYwSDU1VjY0SDM1VjYwWiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K";
        }}
      />

      <div className="item-details">
        <div className="title-container">
          <h4
            className="item-title clickable"
            onClick={() => setIsDialogOpen(true)}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            {item.title}
            <span className="info-icon">*</span>
          </h4>

          {/* Tooltip */}
          {showTooltip && <div className="tooltip">Click to view details</div>}
        </div>
        <p className="item-category">{item.category}</p>
        <p className="item-price">{item.price}</p>
        <p className="item-size">Size: {item.size}</p>

        {/* Dynamic Options */}
        {item.options &&
          item.options.map((option, index) => (
            <div key={index} className="item-option">
              <label>{option.label}:</label>
              <select
                className="option-select"
                value={option.value}
                onChange={(e) =>
                  onOptionChange(item.id, option.label, e.target.value)
                }
              >
                {option.choices.map((choice, choiceIndex) => (
                  <option key={choiceIndex} value={choice}>
                    {choice}
                  </option>
                ))}
              </select>
            </div>
          ))}
      </div>

      <div className="item-controls">
        <div className="quantity-controls">
          <button
            onClick={onDecrease}
            className="quantity-btn"
            disabled={item.quantity <= 1}
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="quantity">{item.quantity}</span>
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

            {/* Add your dialog content here */}
            <div className="dialog-content">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartItem;
