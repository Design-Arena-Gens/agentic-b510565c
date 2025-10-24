import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowMobileMenu(false);
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">
            <h1>E-Shop</h1>
          </Link>

          <button
            className="mobile-menu-btn"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            ☰
          </button>

          <div className={`navbar-menu ${showMobileMenu ? 'active' : ''}`}>
            <Link
              to="/"
              className="nav-link"
              onClick={() => setShowMobileMenu(false)}
            >
              Home
            </Link>
            <Link
              to="/products"
              className="nav-link"
              onClick={() => setShowMobileMenu(false)}
            >
              Products
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/orders"
                  className="nav-link"
                  onClick={() => setShowMobileMenu(false)}
                >
                  My Orders
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="nav-link"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Admin
                  </Link>
                )}
                <Link
                  to="/cart"
                  className="nav-link cart-link"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Cart
                  {getCartCount() > 0 && (
                    <span className="cart-badge">{getCartCount()}</span>
                  )}
                </Link>
                <span className="nav-user">Hi, {user?.name}</span>
                <button className="btn btn-outline-small" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/cart"
                  className="nav-link cart-link"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Cart
                  {getCartCount() > 0 && (
                    <span className="cart-badge">{getCartCount()}</span>
                  )}
                </Link>
                <Link
                  to="/login"
                  className="btn btn-outline-small"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary-small"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
