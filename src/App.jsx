import { HashRouter, Routes, Route } from 'react-router-dom'
import Register from './pages/Register.jsx'
import Home from './pages/Main/Home.jsx'
import Menu from './pages/Menu.jsx'
import Cart from './pages/Cart.jsx'
import Profile from './pages/Profile.jsx'

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </HashRouter>
  )
}

export default App