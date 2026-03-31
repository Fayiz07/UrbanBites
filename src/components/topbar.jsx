import "./topbar.css";
import { useNavigate } from "react-router-dom";

function TopBar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('cart');
        navigate('/');
    };

    return (
        <div className="topbar">
            <div className="logo">
                <img src="/Images/Logo.png" alt="Urban Bites Logo" />
                <h1>Urban Bites</h1>
            </div>
            <div>
                <button className="logout-btn" onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right"></i>
                    Logout
                </button>
            </div>
        </div>
    );
}

export default TopBar;