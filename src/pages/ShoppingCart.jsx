import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import CartList from "../components/CartList";
import Contact from "../components/Contact";
import ProgressBar from "../components/ProgressBar";
import { useNavigate } from "react-router-dom";
import ProgressButtons from "../components/ProgressButtons";

export default function ShoppingCart() {
  const navigate = useNavigate();

  const [item, setItem] = useState(() => {
    const saved = localStorage.getItem("item");
    return saved ? JSON.parse(saved) : {};
  });

  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  // NEW: which cart item is currently in edit mode
  const [editingKey, setEditingKey] = useState(null);

  const steps = [
    "Select Regalia",
    "Place Order",
    "Customer Details",
    "Payment Completed",
  ];

  const step = 2;

  const areAllOptionsSelected = () => {
    return items.every((it) => {
      if (it.isDonation) return true;
      if (!it.options || it.options.length === 0) return true;

      return it.options.every((option) => {
        const selectedValue = it.selectedOptions?.[option.label];
        return selectedValue && String(selectedValue).trim() !== "";
      });
    });
  };

  useEffect(() => localStorage.setItem("item", JSON.stringify(item)), [item]);

  useEffect(() => {
    if (items?.length) localStorage.setItem("cart", JSON.stringify(items));
    else localStorage.removeItem("cart");
    window.dispatchEvent(new Event("cartUpdated"));
  }, [items]);

  const onNext = () => {
    if (!items?.length) {
      alert("Your cart is empty. Please add items first.");
      return;
    }

    if (!areAllOptionsSelected()) {
      alert("Please select all required options for your items.");
      return;
    }

    localStorage.setItem("step", "3");
    navigate("/customerdetails");
  };

  return (
    <div>
      <Navbar />

      <div className="content">
        <ProgressBar step={step} steps={steps} />

        <h2 className="cart-label">Shopping Cart</h2>

        <CartList
          step={step}
          item={item}
          items={items}
          setItem={setItem}
          setItems={setItems}
          editingKey={editingKey}
          setEditingKey={setEditingKey}
        />

        <ProgressButtons
          step={step}
          steps={steps}
          nextPath="/customerdetails"
          areAllOptionsSelected={areAllOptionsSelected}
          onNext={onNext}
        />

        <Contact />
      </div>
    </div>
  );
}