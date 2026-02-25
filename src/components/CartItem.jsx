import React, { useEffect, useState } from "react";
import "./CartItem.css";
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";
import { IoSaveOutline } from "react-icons/io5";

function CartItem({
  item,
  quantity,
  step,
  onIncrease,
  onDecrease,
  onRemove,
  onOptionChange,
  onDeliveryChange,
  onTogglePurchaseType,
  isEditing,
  onEdit,
  onSave,
  onCancel,
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [unitPrice, setUnitPrice] = useState(0);
  const total = unitPrice * quantity;
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    // Donation
    if (item.name === "Donation" || item.isDonation) {
      setUnitPrice(parseFloat(item.hirePrice ?? 0));
      return;
    }

    // Delivery item - price depends on selected "Delivery Type"
    if (item.category === "Delivery") {
      const selectedId = item.selectedOptions?.["Delivery Type"];
      const choices = Array.isArray(item.options?.[0]?.choices)
        ? item.options[0].choices
        : [];

      const selectedChoice = choices.find(
        (c) => String(c?.id ?? c?.value ?? "") === String(selectedId ?? ""),
      );

      const price = parseFloat(selectedChoice?.price ?? 0);
      setUnitPrice(price);

      onDeliveryChange(item.id, price);
      return;
    }

    // Normal items (Hire/Buy)
    const price = parseFloat(
      (item.isHiring ? item.hirePrice : item.buyPrice) ?? 0,
    );
    setUnitPrice(price);
  }, [
    selectedOption,
    item.isHiring,
    item.hirePrice,
    item.buyPrice,
    item.category,
    item.isDonation,
    item.name,
    item.selectedOptions,
    item.options,
    item.id,
    onDeliveryChange,
  ]);

  const orderType = parseInt(
    JSON.parse(localStorage.getItem("orderType")) || 0,
  );

  const renderOptionDropdowns = () => {
    if (!item.options || item.options.length === 0) return null;

    return item.options.map((option, index) => (
      <div key={index} className="item-option">
        <label>{option.label}:</label>
        <select
          className="option-select"
          value={item.selectedOptions?.[option.label] || ""}
          onChange={(e) => {
            const selectedId = e.target.value;

            const choices = Array.isArray(option.choices) ? option.choices : [];
            const selectedChoice = choices.find(
              (c) =>
                String(
                  typeof c === "object" && c !== null ? (c.id ?? c.value) : c,
                ) === String(selectedId),
            );

            setSelectedOption(selectedChoice || null);
            onOptionChange(item.id, option.label, selectedId);
          }}
          required
          // - step 1 always editable
          // - step 2 only editable if isEditing
          disabled={step === 2 && !isEditing}
        >
          <option value="">Please select...</option>
          {(option.choices || []).map((choice, idx) => (
            <option
              key={idx}
              value={
                typeof choice === "object" ? choice.id || choice.value : choice
              }
            >
              {typeof choice === "object"
                ? choice.value ||
                  choice.size ||
                  choice.name ||
                  JSON.stringify(choice)
                : choice}
            </option>
          ))}
        </select>
      </div>
    ));
  };

  return (
    <>
      <div className="cart-item-wrapper">
        <div className="cart-item item-image-container">
          <img
            src={`data:image/jpeg;base64,${item.pictureBase64}`}
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
            // Step 1 view (editable)
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

              {renderOptionDropdowns()}
            </div>
          ) : (
            // Step 2 view
            <div className="item-details">
              <p>
                <span className="item-title">{item.name} </span>
                <span className="item-category">({item.category})</span>
              </p>

              {/* Edit controls for step 2 (not for donation) */}
              {step === 2 && !item.isDonation && item.name !== "Donation" && (
                <div className="cart-edit-actions">
                  {!isEditing ? (
                    <button
                      type="button"
                      className="icon-btn"
                      onClick={onEdit}
                      aria-label="Edit item"
                      title="Edit"
                    >
                      <FaRegEdit size={14} />
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        className="icon-btn"
                        onClick={onSave}
                        aria-label="Save changes"
                        title="Save"
                      >
                        <IoSaveOutline size={16} />
                      </button>
                      {/* <button
                        type="button"
                        className="icon-btn"
                        onClick={onCancel}
                        aria-label="Cancel editing"
                        title="Cancel"
                      >
                        <MdOutlineCancel size={16} />
                      </button> */}
                    </>
                  )}
                </div>
              )}

              {/* When NOT editing: show summary (your current UI) */}
              {(!isEditing || item.isDonation || item.name === "Donation") && (
                <>
                  {item.options && item.options.length > 0 && (
                    <div className="item-options">
                      {item.options.map((option, index) => {
                        const selectedId = item.selectedOptions?.[option.label];

                        const choices = Array.isArray(option.choices)
                          ? option.choices
                          : [];

                        const selectedChoice = choices.find((c) => {
                          const choiceId =
                            typeof c === "object" && c !== null
                              ? String(c.id ?? c.value ?? "")
                              : String(c);
                          return String(selectedId ?? "") === choiceId;
                        });

                        const displayText =
                          typeof selectedChoice === "object" &&
                          selectedChoice !== null
                            ? (selectedChoice.value ??
                              selectedChoice.name ??
                              selectedChoice.size ??
                              String(selectedChoice.id ?? ""))
                            : (selectedChoice ?? "");

                        return (
                          <div key={index} className="option-row">
                            <span className="option-label">
                              {option.label}:
                            </span>
                            <span className="option-value">
                              {selectedId
                                ? displayText || "Selected"
                                : "Not selected"}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}

              {/* When editing: show dropdowns (enabled) */}
              {isEditing && !item.isDonation && item.name !== "Donation" && (
                <div style={{ marginTop: 8 }}>{renderOptionDropdowns()}</div>
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
                <div className="price-row total-row">
                  <span>Total (Including GST):</span>
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
            <div
              className="dialog-overlay"
              onClick={() => setIsDialogOpen(false)}
            >
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
        <div></div> {/* Don't Remove */}
        {/* Purchase this item - moved outside the card */}
        {item.category !== "Delivery" &&
          item.name !== "Donation" &&
          orderType !== 2 &&
          step === 1 && (
            <div className="purchase-box">
              <span className="purchase-label">Purchase this item</span>

              <button
                type="button"
                className={`purchase-btn ${item.isHiring ? "btn-buy" : "btn-hire"}`}
                onClick={() => onTogglePurchaseType(item.id, !item.isHiring)}
              >
                {item.isHiring ? "Buy" : "Hire"}
              </button>

              <div className="purchase-price">
                $
                {parseFloat(
                  (item.isHiring ? item.buyPrice : item.hirePrice) ?? 0,
                ).toFixed(2)}
              </div>
            </div>
          )}
      </div>
    </>
  );
}

export default CartItem;
