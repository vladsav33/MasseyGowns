import "./BuySelectRegalia.css";
import React, { useState } from "react";
import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";

const BuySelectRegalia = () => {
  const [activeTab, setActiveTab] = useState("sets");
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  // Sample data for degree sets
  const degreeSets = [
    {
      id: "bachelor-set",
      name: "Bachelor Degree Set",
      price: 199.99,
      image: "/api/placeholder/300/300",
      items: ["Gown", "Cap", "Tassel", "Hood"],
      description: "Complete bachelor degree regalia set",
    },
    {
      id: "master-set",
      name: "Master Degree Set",
      price: 279.99,
      image: "/api/placeholder/300/300",
      items: ["Gown", "Cap", "Tassel", "Hood", "Stole"],
      description: "Complete master degree regalia set",
    },
    {
      id: "doctoral-set",
      name: "Doctoral Degree Set",
      price: 399.99,
      image: "/api/placeholder/300/300",
      items: ["Gown", "Cap", "Tassel", "Hood", "Tam", "Doctoral Stole"],
      description: "Complete doctoral degree regalia set",
    },
  ];

  // Sample data for individual items
  const individualItems = [
    {
      id: "bachelor-gown",
      name: "Bachelor Gown",
      price: 89.99,
      image: "/api/placeholder/250/300",
      category: "Gowns",
      description: "Traditional bachelor graduation gown",
    },
    {
      id: "master-gown",
      name: "Master Gown",
      price: 119.99,
      image: "/api/placeholder/250/300",
      category: "Gowns",
      description: "Master graduation gown with extended sleeves",
    },
    {
      id: "doctoral-gown",
      name: "Doctoral Gown",
      price: 179.99,
      image: "/api/placeholder/250/300",
      category: "Gowns",
      description: "Premium doctoral gown with velvet panels",
    },
    {
      id: "graduation-cap",
      name: "Graduation Cap",
      price: 29.99,
      image: "/api/placeholder/250/200",
      category: "Caps",
      description: "Traditional mortarboard graduation cap",
    },
    {
      id: "tassel-gold",
      name: "Gold Tassel",
      price: 12.99,
      image: "/api/placeholder/150/200",
      category: "Accessories",
      description: "Gold graduation tassel",
    },
    {
      id: "tassel-silver",
      name: "Silver Tassel",
      price: 12.99,
      image: "/api/placeholder/150/200",
      category: "Accessories",
      description: "Silver graduation tassel",
    },
    {
      id: "bachelor-hood",
      name: "Bachelor Hood",
      price: 45.99,
      image: "/api/placeholder/200/250",
      category: "Hoods",
      description: "Bachelor degree hood with school colors",
    },
    {
      id: "master-hood",
      name: "Master Hood",
      price: 65.99,
      image: "/api/placeholder/200/250",
      category: "Hoods",
      description: "Master degree hood with discipline colors",
    },
  ];

  const addToCart = (item, type = "individual") => {
    const cartItem = {
      ...item,
      cartId: `${item.id}-${Date.now()}`,
      type: type,
      quantity: 1,
    };

    setCart((prevCart) => [...prevCart, cartItem]);
  };

  const updateQuantity = (cartId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(cartId);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.cartId === cartId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (cartId) => {
    setCart((prevCart) => prevCart.filter((item) => item.cartId !== cartId));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <div className="regalia-shop">
      {/* Header */}
      {/* <header className="shop-header">
            <div className="header-container">
              <div className="header-content">
                <h1 className="shop-title">Graduation Regalia Store</h1>
                <button
                  onClick={() => setShowCart(!showCart)}
                  className="cart-button"
                >
                  <ShoppingCart size={20} />
                  Cart ({getTotalItems()})
                  {cart.length > 0 && (
                    <span className="cart-badge">
                      {getTotalItems()}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </header> */}

      <div className="main-container">
        {/* Tab Navigation */}
        <div className="tabs-section">
          <div className="tabs-border">
            <nav className="tabs-nav">
              <button
                onClick={() => setActiveTab("sets")}
                className={`tab-button ${
                  activeTab === "sets" ? "tab-active" : "tab-inactive"
                }`}
              >
                Complete Degree Sets
              </button>
              <button
                onClick={() => setActiveTab("individual")}
                className={`tab-button ${
                  activeTab === "individual" ? "tab-active" : "tab-inactive"
                }`}
              >
                Individual Items
              </button>
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="content-grid">
          {/* Main Content */}
          <div className="main-content">
            {activeTab === "sets" && (
              <div>
                <h2 className="section-title">Complete Degree Sets</h2>
                <div className="sets-grid">
                  {degreeSets.map((set) => (
                    <div key={set.id} className="product-card">
                      <div className="product-image">
                        {/* <div className="image-placeholder">
                          Degree Set Image
                        </div> */}
                        <img
                          src={"../../img/2.jpg"}
                          className="item-image-topic"
                          onError={(e) => {
                            e.target.src =
                              "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zNSA0MEg2NVY0NEgzNVY0MFpNMzUgNTBINjVWNTRIMzVWNTBaTTM1IDYwSDU1VjY0SDM1VjYwWiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K";
                          }}
                        />
                      </div>
                      <div className="product-info">
                        <h3 className="product-name">{set.name}</h3>
                        <p className="product-description">{set.description}</p>
                        <div className="product-includes">
                          <span className="includes-label">Includes:</span>
                          <div className="includes-tags">
                            {set.items.map((item) => (
                              <span key={item} className="item-tag">
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="product-footer">
                          <span className="product-price">${set.price}</span>
                          <button
                            onClick={() => addToCart(set, "set")}
                            className="add-to-cart-btn"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "individual" && (
              <div>
                <h2 className="section-title">Individual Items</h2>
                <div className="items-grid">
                  {individualItems.map((item) => (
                    <div key={item.id} className="product-card">
                      <div className="product-image">
                        {/* <div className="image-placeholder">Item Image</div> */}
                        <img
                          src={"../../img/2.jpg"}
                          className="item-image-topic"
                          onError={(e) => {
                            e.target.src =
                              "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zNSA0MEg2NVY0NEgzNVY0MFpNMzUgNTBINjVWNTRIMzVWNTBaTTM1IDYwSDU1VjY0SDM1VjYwWiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K";
                          }}
                        />
                      </div>
                      <div className="product-info">
                        <span className="item-category">{item.category}</span>
                        <h3 className="product-name">{item.name}</h3>
                        <p className="product-description">
                          {item.description}
                        </p>
                        <div className="product-footer">
                          <span className="product-price">${item.price}</span>
                          <button
                            onClick={() => addToCart(item)}
                            className="add-to-cart-btn"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Cart Sidebar */}
          {showCart && (
            <div className="cart-sidebar">
              <div className="cart-container">
                <h3 className="cart-title">
                  <ShoppingCart size={20} />
                  Shopping Cart
                </h3>

                {cart.length === 0 ? (
                  <p className="empty-cart">Your cart is empty</p>
                ) : (
                  <>
                    <div className="cart-items">
                      {cart.map((item) => (
                        <div key={item.cartId} className="cart-item">
                          <div className="cart-item-header">
                            <div className="cart-item-info">
                              <h4 className="cart-item-name">{item.name}</h4>
                              <span className="cart-item-type">
                                {item.type === "set"
                                  ? "Complete Set"
                                  : "Individual Item"}
                              </span>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.cartId)}
                              className="remove-btn"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>

                          <div className="cart-item-footer">
                            <div className="quantity-controls">
                              <button
                                onClick={() =>
                                  updateQuantity(item.cartId, item.quantity - 1)
                                }
                                className="quantity-btn"
                              >
                                <Minus size={16} />
                              </button>
                              <span className="quantity-display">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(item.cartId, item.quantity + 1)
                                }
                                className="quantity-btn"
                              >
                                <Plus size={16} />
                              </button>
                            </div>
                            <span className="item-total">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="cart-footer">
                      <div className="cart-total">
                        <span className="total-label">Total:</span>
                        <span className="total-amount">
                          ${getTotalPrice().toFixed(2)}
                        </span>
                      </div>
                      <button className="checkout-btn">
                        Proceed to Checkout
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuySelectRegalia;
