import React, { useState, useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [purchaseDetails, setPurchaseDetails] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    pincode: ''
  });

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      removeItem(itemId);
      return;
    }

    const updatedCart = cart.map(item =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const removeItem = (itemId) => {
    const updatedCart = cart.filter(item => item.id !== itemId);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const clearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      setCart([]);
      localStorage.removeItem('cart');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPurchaseDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const { fullName, phone, address, city, pincode } = purchaseDetails;
    if (!fullName || !phone || !address || !city || !pincode) {
      alert('Please fill in all fields');
      return false;
    }
    if (phone.length !== 10 || isNaN(phone)) {
      alert('Please enter a valid 10-digit phone number');
      return false;
    }
    if (pincode.length !== 6 || isNaN(pincode)) {
      alert('Please enter a valid 6-digit pincode');
      return false;
    }
    return true;
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setShowSuccess(true);
    
    setTimeout(() => {
      setCart([]);
      localStorage.removeItem('cart');
      setShowSuccess(false);
      setPurchaseDetails({
        fullName: '',
        phone: '',
        address: '',
        city: '',
        pincode: ''
        
      });
      
      navigate('/home');
    }, 2000);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const getGST = () => {
    return getCartTotal() * 0.05;
  };

  const getDeliveryCharge = () => {
    return getCartTotal() > 500 ? 0 : 40;
  };

  const getGrandTotal = () => {
    return getCartTotal() + getGST() + getDeliveryCharge();
  };

  return (
    <MainLayout>
      <div className="cart-container">
        {showSuccess && (
          <div className="simple-success">
            <i className="bi bi-check-circle-fill"></i>
            <span>Order placed successfully! Thank you for your order.</span>
          </div>
        )}

        <div className="cart-header">
          <h1 className="cart-title">Your Cart</h1>
          {cart.length > 0 && (
            <button className="clear-cart-btn" onClick={clearCart}>
              <i className="bi bi-trash"></i> Clear Cart
            </button>
          )}
        </div>

        {cart.length === 0 ? (
          <div className="empty-cart">
            <i className="bi bi-cart-x empty-cart-icon"></i>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added anything to your cart yet</p>
            <button className="shop-now-btn" onClick={() => navigate('/home')}>
              <i className="bi bi-shop"></i> Continue Shopping
            </button>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-items-section">
              <h2 className="section-title">Your Items ({getTotalItems()})</h2>
              <div className="cart-items">
                {cart.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-image">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div className="cart-item-details">
                      <div className="cart-item-header">
                        <h3 className="cart-item-name">{item.name}</h3>
                        <p className="cart-item-price">₹{item.price}</p>
                      </div>
                      <p className="cart-item-category">{item.category}</p>
                      {item.isVegetarian && (
                        <span className="cart-item-veg">🌱 Vegetarian</span>
                      )}
                      <div className="cart-item-actions">
                        <div className="quantity-control">
                          <button 
                            className="quantity-btn"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <i className="bi bi-dash"></i>
                          </button>
                          <span className="quantity">{item.quantity}</span>
                          <button 
                            className="quantity-btn"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <i className="bi bi-plus"></i>
                          </button>
                        </div>
                        <button 
                          className="remove-btn"
                          onClick={() => removeItem(item.id)}
                        >
                          <i className="bi bi-trash"></i> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="purchase-section">
              <h2 className="section-title">Delivery Details</h2>
              
              <form className="purchase-form" onSubmit={handlePlaceOrder}>
                <div className="form-group">
                  <label htmlFor="fullName">Full Name *</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={purchaseDetails.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={purchaseDetails.phone}
                    onChange={handleInputChange}
                    placeholder="10-digit mobile number"
                    maxLength="10"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="address">Delivery Address *</label>
                  <textarea
                    id="address"
                    name="address"
                    value={purchaseDetails.address}
                    onChange={handleInputChange}
                    placeholder="Enter your complete address"
                    rows="3"
                    required
                  ></textarea>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="city">City *</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={purchaseDetails.city}
                      onChange={handleInputChange}
                      placeholder="Enter city"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="pincode">Pincode *</label>
                    <input
                      type="text"
                      id="pincode"
                      name="pincode"
                      value={purchaseDetails.pincode}
                      onChange={handleInputChange}
                      placeholder="6-digit pincode"
                      maxLength="6"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Payment Method</label>
                  <div className="payment-method-display">
                    <i className="bi bi-cash"></i>
                    <span>Cash on Delivery</span>
                  </div>
                </div>

                <div className="form-order-summary">
                  <h3>Order Summary</h3>
                  <div className="summary-row">
                    <span>Items ({getTotalItems()}):</span>
                    <span>₹{getCartTotal()}</span>
                  </div>
                  <div className="summary-row">
                    <span>GST (5%):</span>
                    <span>₹{getGST().toFixed(2)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Delivery:</span>
                    <span>
                      {getDeliveryCharge() === 0 ? (
                        <span className="free-delivery">FREE</span>
                      ) : (
                        `₹${getDeliveryCharge()}`
                      )}
                    </span>
                  </div>
                  <div className="summary-row total">
                    <span>Total:</span>
                    <span>₹{getGrandTotal().toFixed(2)}</span>
                  </div>
                </div>

                {getCartTotal() < 500 && (
                  <div className="delivery-message">
                    Add ₹{(500 - getCartTotal()).toFixed(2)} more for free delivery
                  </div>
                )}

                <button type="submit" className="place-order-btn">
                  <i className="bi bi-check-circle"></i> Place Order (Cash on Delivery)
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Cart;