import React, { useState, useEffect } from 'react';
import MainLayout from '../../layouts/MainLayout';
import './Home.css';

const Home = () => {
  const [restaurantData, setRestaurantData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [showCartMessage, setShowCartMessage] = useState(false);
  const [addedItem, setAddedItem] = useState('');

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }

    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      window.location.href = '/';
      return;
    }

    const fetchData = async () => {
      try {
        const response = await fetch('/data/restaurantData.json');
        const data = await response.json();
        setRestaurantData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  if (loading) {
    return (
      <MainLayout>
        <div className="loadingSpinner">Loading...</div>
      </MainLayout>
    );
  }

  if (!restaurantData) {
    return (
      <MainLayout>
        <div className="errorMessage">Failed to load content</div>
      </MainLayout>
    );
  }

  const { hero, menu, about } = restaurantData;
  
  const homepageItems = menu.items.slice(0, 9);

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

  return (
    <MainLayout>
      {showCartMessage && (
        <div className="cart-notification">
          ✓ {addedItem} added to cart!
        </div>
      )}

      <div className="homeContainer">
        <section 
          className="heroSection"
          style={{ 
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${hero.backgroundImage})`
          }}
        >
          <div className="heroContent">
            <h1 className="heroTitle">{hero.welcomeMessage}</h1>
            <p className="heroSubtitle">{hero.subtitle}</p>
            <button className="heroBtn" onClick={() => document.getElementById('menu-section').scrollIntoView({ behavior: 'smooth' })}>
              {hero.ctaButton}
            </button>
          </div>
        </section>

        <section id="menu-section" className="menuSection">
          <div className="container">
            <div className="sectionHeader">
              <h2 className="sectionTitle">{menu.title}</h2>
              <p className="sectionSubtitle">{menu.subtitle}</p>
            </div>

            <div className="menuGrid">
              {homepageItems.map((item) => (
                <div key={item.id} className="menuCard">
                  {item.popular && <span className="popularBadge">Popular</span>}
                  <div className="menuImgWrapper">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="menuImg"
                      loading="lazy"
                    />
                    <span className="menuCategory">{item.category}</span>
                    <span className={`food-type-badge ${item.isVegetarian ? 'veg' : 'non-veg'}`}>
                      {item.isVegetarian ? '🟢 Veg' : '🔴 Non-Veg'}
                    </span>
                  </div>
                  <div className="menuInfo">
                    <div className="menuHeader">
                      <h3 className="menuName">{item.name}</h3>
                      <span className="menuPrice">₹{item.price}</span>
                    </div>
                    
                    <div className="ratingSection">
                      <div className="stars">
                        {renderStars(item.rating)}
                      </div>
                      <span className="reviews">({item.reviews} reviews)</span>
                    </div>

                    <p className="menuDesc">{item.description}</p>
                    
                    <div className="menuMeta">
                      <span className="spiceLevel">
                        {item.spicyLevel === 'Hot' ? '🌶️' : ''} 
                        {item.spicyLevel === 'Medium' ? '🌶️🌶️' : ''} 
                        {item.spicyLevel === 'Mild' ? '🌶️' : ''} 
                        {item.spicyLevel}
                      </span>
                      <span className="prepTime">⏱️ {item.prepTime}</span>
                    </div>

                    <button 
                      className="addToCartBtn"
                      onClick={() => addToCart(item)}
                      disabled={!item.isAvailable}
                    >
                      {item.isAvailable ? (
                        <>
                          <span className="cart-icon">🛒</span>
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

            <div className="viewAllContainer">
              <button className="viewAllBtn" onClick={() => window.location.href = '/menu'}>
                View Full Menu
              </button>
            </div>
          </div>
        </section>

        <section className="aboutSection">
          <div className="container">
            <div className="aboutWrapper">
              <div className="aboutContent">
                <h2 className="aboutTitle">{about.title}</h2>
                <p className="aboutText">{about.content}</p>
                <div className="featuresGrid">
                  {about.features.map((feature, index) => (
                    <div key={index} className="featureItem">
                      <span className="featureIcon">✓</span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="aboutImageWrapper">
                <img 
                  src={about.image} 
                  alt="Restaurant interior" 
                  className="aboutImage"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default Home;