import React, { useState } from "react";
import CartItem from "./CartItem.jsx";
import "./CartList.css";

function CartList({step}) {
  const [items, setItems] = useState([
    {
      id: 1,
      image: "/images/hero.jpg",
      title: "Hire Gown - Masters",
      price: "$48.00",
      category: "Academic Gown",
      quantity: 1,
      description: "Master gowns are worn by master degree recipients.They are black, Cambridge master style, and have a closed or pocket sleeve. They are a generous fit and should suit most people.  We do have gowns that are wider across the shoulders if required. Gowns are sized according to your full height and should be worn at mid-calf length. Please use the drop box below to choose the height range you fit in.  The size you select is a guide only as every customer is given an opportunity for a personal fitting when collecting regalia, so if you are not sure of your height just leave the gown size on the current selection",
      options: [
        {
          label: "Gown Type",
          value: "Regular Fit",
          choices: ["Regular Fit", "Wide Fit"]
        },
        {
          label: "My full height",
          value: "Less than 150 cm",
          choices: ["Less than 150 cm", "151- 154 cm"]
        }
      ]
    },
    {
      id: 2,
      image: "/images/hood.jpg",
      title: "Hire Hood",
      price: "$20.00",
      category: "Academic Hood",
      quantity: 1,
      description: "Master gowns are worn by master degree recipients.They are black, Cambridge master style, and have a closed or pocket sleeve. They are a generous fit and should suit most people.  We do have gowns that are wider across the shoulders if required. Gowns are sized according to your full height and should be worn at mid-calf length. Please use the drop box below to choose the height range you fit in.  The size you select is a guide only as every customer is given an opportunity for a personal fitting when collecting regalia, so if you are not sure of your height just leave the gown size on the current selection",
      options: [
        {
          label: "Hood Type",
          value: "Massey-M.Arts",
          choices: ["Massey-M.Arts", "Massey-MBA", "Massey-M.Agriculture"]
        }
      ]
    },
    {
      id: 3,
      image: "/images/trencher.jpg",
      title: "Hire Trencher",
      price: "$20.00",
      category: "Academic Cap",
      quantity: 1,
      description: "Master gowns are worn by master degree recipients.They are black, Cambridge master style, and have a closed or pocket sleeve. They are a generous fit and should suit most people.  We do have gowns that are wider across the shoulders if required. Gowns are sized according to your full height and should be worn at mid-calf length. Please use the drop box below to choose the height range you fit in.  The size you select is a guide only as every customer is given an opportunity for a personal fitting when collecting regalia, so if you are not sure of your height just leave the gown size on the current selection",
      options: [
        {
          label: "Head Size",
          value: "57 cm",
          choices: ["57 cm", "58 cm", "59 cm"]
        }
      ]
    },
    // {
    //   id: 4,
    //   image: "/images/courier.jpg",
    //   title: "Courier Delivery",
    //   price: "$20.00",
    //   category: "Delivery Service",
    //   size: "N/A",
    //   quantity: 1,
    //   options: [
    //     {
    //       label: "Delivery Speed",
    //       value: "Next Day",
    //       choices: ["Standard", "Next Day", "Same Day"]
    //     }
    //   ]
    // }
  ]);

  const handleIncrease = (id) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    ));
  };

  const handleDecrease = (id) => {
    setItems(items.map(item =>
      item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
    ));
  };

  const handleRemove = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleOptionChange = (itemId, optionLabel, newValue) => {
    setItems(items.map(item => {
      if (item.id === itemId) {
        const updatedOptions = item.options.map(option =>
          option.label === optionLabel 
            ? { ...option, value: newValue }
            : option
        );
        return { ...item, options: updatedOptions };
      }
      return item;
    }));
  };

  const getNumericPrice = (priceString) => {
    return parseFloat(priceString.replace('$', ''));
  };

  const totalPrice = items.reduce((acc, item) => 
    acc + getNumericPrice(item.price) * item.quantity, 0
  );

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="cart-container">
      {items.length > 0 ? (
        <>
          {items.map(item => (
            <CartItem
              key={item.id}
              item={item}
              onIncrease={() => handleIncrease(item.id)}
              onDecrease={() => handleDecrease(item.id)}
              onRemove={() => handleRemove(item.id)}
              onOptionChange={handleOptionChange}
            />
          ))}

          {step == 2 ? (
            <div className="cart-summary">
              <h3>Order Summary</h3>
              <div className="summary-row">
                <span>Total Items:</span> 
                <span>{totalItems}</span>
              </div>
              <div className="summary-row">
                <span>Subtotal:</span> 
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              {/* <div className="summary-row">
                <span>Tax (10%):</span> 
                <span>${(totalPrice * 0.1).toFixed(2)}</span>
              </div> */}
              <div className="summary-row total">
                <span>Total Price:</span> 
                <span>${(totalPrice).toFixed(2)}</span>
              </div>
              <button 
                className="checkout-btn"
                onClick={() => alert(`Proceeding to checkout with ${totalItems} items totaling $${(totalPrice * 1.1).toFixed(2)}`)}
              >
                Proceed to Checkout
              </button>
            </div>
          ) : (
            <div></div>
          )}
        </>
      ) : (
        <div className="empty-cart">
          <span className="empty-cart-icon">🛒</span>
          <div>Your cart is empty</div>
          <div style={{ fontSize: '0.9rem', marginTop: '8px' }}>
            Add some items to get started!
          </div>
        </div>
      )}
    </div>
  );
}

export default CartList;