import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './register.css';

function Register() {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    const validateEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!isLogin && !name) {
            setError("Name is required.");
            return;
        }

        if (!email) {
            setError("Email is required.");
            return;
        }

        if (!validateEmail(email)) {
            setError("Please enter a valid email address (e.g., name@example.com).");
            return;
        }

        if (!password) {
            setError("Password is required.");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        const users = JSON.parse(localStorage.getItem("users")) || [];

        if (isLogin) {
            const foundUser = users.find(u => u.email === email && u.password === password);
            
            if (foundUser) {
                localStorage.setItem("currentUser", JSON.stringify(foundUser));
                alert("Login successful!");
                resetForm();
                navigate("/Home");
            } else {
                setError("Invalid email or password.");
            }
        } else {
            if (users.find(u => u.email === email)) {
                setError("Email already registered.");
                return;
            }

            const newUser = { 
                name, 
                email, 
                password,
                id: Date.now()
            };
            
            users.push(newUser);
            localStorage.setItem("users", JSON.stringify(users));
            localStorage.setItem("currentUser", JSON.stringify(newUser));
            
            alert("Registration successful!");
            resetForm();
            navigate("/Home");
        }
    };

    const resetForm = () => {
        setEmail('');
        setPassword('');
        setName('');
        setError('');
    };

    return (
        <div className="register-page">
            <div className="container">
                <h1>Urban Bites</h1>
                
                {error && (
                    <div className="error-message" style={{color: 'black'}}>
                        {error}
                    </div>
                )}

                <div className="form-container">
                    {isLogin ? (
                        <div className="login-form">
                            <h2 className="text-center">Login</h2>
                            <form onSubmit={handleSubmit}>
                                <input 
                                    type="email" 
                                    placeholder="Email" 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)} 
                                />
                                <input 
                                    type="password" 
                                    placeholder="Password" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button type="submit" className="btn btn-submit btn-success w-100 mt-2">
                                    Login
                                </button>
                            </form>
                            <br />
                            <button className="btn btn-primary w-100 mt-2" onClick={() => {
                                setIsLogin(false);
                                setError('');
                                resetForm();
                            }}>
                                New user?
                                <span style={{fontWeight:"bold"}}> Register here</span>
                            </button>
                        </div>
                    ) : (
                        <div className="register-form">
                            <h2 className="text-center">Register</h2>
                            <form onSubmit={handleSubmit}>
                                <input 
                                    type="text" 
                                    placeholder="Name" 
                                    value={name} 
                                    onChange={(e) => setName(e.target.value)}
                                />
                                <input 
                                    type="email" 
                                    placeholder="Email" 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <input 
                                    type="password" 
                                    placeholder="Password" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button type="submit" className="btn btn-submit btn-success w-100 mt-2">
                                    Register
                                </button>
                            </form>
                            <br />
                            <button className="btn btn-primary w-100 mt-2" onClick={() => {
                                setIsLogin(true);
                                setError('');
                                resetForm();
                            }}>
                                Already Registered?
                                <span style={{fontWeight:"bold"}}> Login!</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Register;