import React, { useState, useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';
import { useNavigate } from 'react-router-dom';
import './Menu.css';

const Menu = () => {
  const navigate = useNavigate();
  const [restaurantData, setRestaurantData] = useState(null);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [showCartMessage, setShowCartMessage] = useState(false);
  const [addedItem, setAddedItem] = useState('');

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', name: 'All Items', icon: '🍽️' },
    { id: 'veg', name: 'Vegetarian', icon: '🌱' },
    { id: 'non-veg', name: 'Non-Vegetarian', icon: '🍗' },
    { id: 'desserts', name: 'Desserts', icon: '🍨' }
  ];

  const priceRanges = [
    { label: 'All Prices', min: 0, max: 1000 },
    { label: 'Under ₹200', min: 0, max: 200 },
    { label: '₹200 - ₹500', min: 200, max: 500 },
    { label: '₹500 - ₹1000', min: 500, max: 1000 },
    { label: 'Above ₹1000', min: 1000, max: 5000 }
  ];

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }

    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        const response = await fetch('/data/restaurantData.json');
        const data = await response.json();
        setRestaurantData(data);
        setFilteredItems(data.menu.items);
        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  useEffect(() => {
    if (!restaurantData) return;

    let items = [...restaurantData.menu.items];

    if (selectedCategory === 'veg') {
      items = items.filter(item => item.isVegetarian === true);
    } else if (selectedCategory === 'non-veg') {
      items = items.filter(item => item.isVegetarian === false);
    } else if (selectedCategory === 'desserts') {
      items = items.filter(item => 
        item.category.toLowerCase() === 'desserts' || 
        item.category.toLowerCase() === 'sweets' ||
        item.category.toLowerCase() === 'cakes'
      );
    }

    items = items.filter(item => 
      item.price >= priceRange[0] && item.price <= priceRange[1]
    );

    if (searchQuery) {
      items = items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredItems(items);
  }, [restaurantData, selectedCategory, priceRange, searchQuery]);

  const addToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    
    let updatedCart;
    if (existingItem) {
      updatedCart = cart.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      );
    } else {
      updatedCart = [...cart, { ...item, quantity: 1 }];
    }
    
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartUpdated'));
    
    setAddedItem(item.name);
    setShowCartMessage(true);
    setTimeout(() => setShowCartMessage(false), 2000);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={`star-${i}`} className="star filled">★</span>);
    }
    if (hasHalfStar) {
      stars.push(<span key="half-star" className="star half">★</span>);
    }
    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star empty">★</span>);
    }
    return stars;
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="menu-loading">Loading menu...</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {showCartMessage && (
        <div className="cart-notification">
          ✓ {addedItem} added to cart!
        </div>
      )}

      <div className="menu-page-container">
        <div className="menu-header">
          <h1 className="menu-title">Our Menu</h1>
          <p className="menu-subtitle">Discover our delicious offerings</p>
        </div>

        <div className="search-container">
          <i className="bi bi-search search-icon"></i>
          <input
            type="text"
            placeholder="Search for dishes..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-search" onClick={() => setSearchQuery('')}>
              <i className="bi bi-x"></i>
            </button>
          )}
        </div>

        <div className="filters-section">
          <div className="category-filters">
            {categories.map(category => (
              <button
                key={category.id}
                className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <span className="category-icon">{category.icon}</span>
                <span className="category-name">{category.name}</span>
              </button>
            ))}
          </div>

          <div className="filter-controls">
            <div className="filter-group price-filter-group">
              <label className="filter-label">Price Range</label>
              <select
                className="price-select"
                value={`${priceRange[0]}-${priceRange[1]}`}
                onChange={(e) => {
                  const [min, max] = e.target.value.split('-').map(Number);
                  setPriceRange([min, max]);
                }}
              >
                {priceRanges.map(range => (
                  <option key={range.label} value={`${range.min}-${range.max}`}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="results-count">
              {filteredItems.length} items found
            </div>
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <div className="no-results">
            <i className="bi bi-emoji-frown no-results-icon"></i>
            <h3>No items found</h3>
            <p>Try adjusting your filters</p>
            <button 
              className="clear-filters-btn"
              onClick={() => {
                setSelectedCategory('all');
                setPriceRange([0, 1000]);
                setSearchQuery('');
              }}
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="menu-grid">
            {filteredItems.map((item) => (
              <div key={item.id} className="menu-card">
                {item.popular && <span className="popular-badge">Popular</span>}
                <div className="menu-img-wrapper">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="menu-img"
                    loading="lazy"
                  />
                  <span className="menu-category">{item.category}</span>
                  <span className={`food-type-badge ${item.isVegetarian ? 'veg' : 'non-veg'}`}>
                    {item.isVegetarian ? '🟢 Veg' : '🔴 Non-Veg'}
                  </span>
                </div>
                <div className="menu-info">
                  <div className="menu-header">
                    <h3 className="menu-name">{item.name}</h3>
                    <span className="menu-price">₹{item.price}</span>
                  </div>
                  
                  <div className="rating-section">
                    <div className="stars">
                      {renderStars(item.rating)}
                    </div>
                    <span className="reviews">({item.reviews} reviews)</span>
                  </div>

                  <p className="menu-desc">{item.description}</p>
                  
                  <div className="menu-meta">
                    <span className="spice-level">
                      {item.spicyLevel === 'Hot' ? '🌶️' : ''} 
                      {item.spicyLevel === 'Medium' ? '🌶️🌶️' : ''} 
                      {item.spicyLevel === 'Mild' ? '🌶️' : ''} 
                      {item.spicyLevel}
                    </span>
                    <span className="prep-time">⏱️ {item.prepTime}</span>
                  </div>

                  <button 
                    className="add-to-cart-btn"
                    onClick={() => addToCart(item)}
                    disabled={!item.isAvailable}
                  >
                    {item.isAvailable ? (
                      <>
                        <i className="bi bi-cart-plus"></i>
                        Add to Cart
                      </>
                    ) : (
                      'Out of Stock'
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Menu;