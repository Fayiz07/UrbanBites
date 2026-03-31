import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./nav.css";

const Navbar = () => {
    const navigate = useNavigate();
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        const updateCartCount = () => {
            try {
                const cart = JSON.parse(localStorage.getItem('cart')) || [];
                const count = cart.reduce((total, item) => total + (item.quantity || 0), 0);
                setCartCount(count);
            } catch (error) {
                console.error('Error updating cart count:', error);
                setCartCount(0);
            }
        };

        updateCartCount();
        window.addEventListener('cartUpdated', updateCartCount);
        
        return () => {
            window.removeEventListener('cartUpdated', updateCartCount);
        };
    }, []);

    return (
        <div className="navbar1">
            <nav className="navbar">
                <button onClick={() => navigate("/home")}>
                    <i className="bi bi-house-heart-fill"></i>
                    Home
                </button>
                <button onClick={() => navigate("/menu")}>
                    <i className="bi bi-fork-knife"></i>
                    Menu
                </button>
                <button onClick={() => navigate("/cart")} className="cart-button">
                    <i className="bi bi-bag-heart-fill"></i>
                    Cart
                    {cartCount > 0 && (
                        <span className="cart-badge">{cartCount}</span>
                    )}
                </button>
                <button onClick={() => navigate("/profile")}>
                    <i className="bi bi-person-circle"></i>
                    Profile
                </button>
            </nav>
        </div>
    );
};

export default Navbar;