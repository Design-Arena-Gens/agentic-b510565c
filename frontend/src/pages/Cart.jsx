import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Cart.css';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/checkout');
    } else {
      navigate('/checkout');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="empty-cart">
            <h2>Your cart is empty</h2>
            <p>Add some products to get started!</p>
            <Link to="/products" className="btn btn-primary">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1>Shopping Cart</h1>

        <div className="cart-layout">
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item._id} className="cart-item">
                <div className="item-image">
                  {item.images && item.images[0] ? (
                    <img src={item.images[0]} alt={item.title} />
                  ) : (
                    <div className="no-image">No Image</div>
                  )}
                </div>

                <div className="item-details">
                  <Link to={`/products/${item._id}`} className="item-title">
                    {item.title}
                  </Link>
                  <p className="item-category">{item.category}</p>
                  <p className="item-price">${item.price.toFixed(2)} each</p>
                </div>

                <div className="item-quantity">
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={item.stock}
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(
                        item._id,
                        Math.max(1, parseInt(e.target.value) || 1)
                      )
                    }
                  />
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    disabled={item.quantity >= item.stock}
                  >
                    +
                  </button>
                </div>

                <div className="item-total">
                  <p className="total-price">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                  <button
                    className="btn-remove"
                    onClick={() => removeFromCart(item._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <button className="btn btn-danger" onClick={clearCart}>
              Clear Cart
            </button>
          </div>

          <div className="cart-summary">
            <h2>Order Summary</h2>

            <div className="summary-row">
              <span>Subtotal ({cart.length} items)</span>
              <span>${getCartTotal().toFixed(2)}</span>
            </div>

            <div className="summary-row">
              <span>Shipping</span>
              <span>{getCartTotal() > 100 ? 'FREE' : '$10.00'}</span>
            </div>

            <div className="summary-row">
              <span>Tax (8%)</span>
              <span>${(getCartTotal() * 0.08).toFixed(2)}</span>
            </div>

            <hr />

            <div className="summary-row total">
              <span>Total</span>
              <span>
                $
                {(
                  getCartTotal() +
                  (getCartTotal() > 100 ? 0 : 10) +
                  getCartTotal() * 0.08
                ).toFixed(2)}
              </span>
            </div>

            {getCartTotal() <= 100 && (
              <p className="free-shipping-notice">
                Add ${(100 - getCartTotal()).toFixed(2)} more for free shipping!
              </p>
            )}

            <button className="btn btn-primary btn-large" onClick={handleCheckout}>
              Proceed to Checkout
            </button>

            <Link to="/products" className="continue-shopping">
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
