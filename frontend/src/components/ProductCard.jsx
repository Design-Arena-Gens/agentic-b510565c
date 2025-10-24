import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
    alert('Added to cart!');
  };

  return (
    <Link to={`/products/${product._id}`} className="product-card">
      <div className="product-image">
        {product.images && product.images[0] ? (
          <img src={product.images[0]} alt={product.title} />
        ) : (
          <div className="no-image">No Image</div>
        )}
        {product.featured && <span className="badge-featured">Featured</span>}
        {product.stock === 0 && <span className="badge-out-of-stock">Out of Stock</span>}
      </div>

      <div className="product-info">
        <h3 className="product-title">{product.title}</h3>
        <p className="product-category">{product.category}</p>

        <div className="product-price-section">
          <div>
            <span className="product-price">${product.price.toFixed(2)}</span>
            {product.compareAtPrice && (
              <span className="product-compare-price">
                ${product.compareAtPrice.toFixed(2)}
              </span>
            )}
          </div>

          {product.stock > 0 ? (
            <button className="btn-add-to-cart" onClick={handleAddToCart}>
              Add to Cart
            </button>
          ) : (
            <button className="btn-disabled" disabled>
              Out of Stock
            </button>
          )}
        </div>

        {product.averageRating > 0 && (
          <div className="product-rating">
            <span className="stars">{'★'.repeat(Math.round(product.averageRating))}</span>
            <span className="rating-text">
              {product.averageRating.toFixed(1)} ({product.reviewCount})
            </span>
          </div>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;
