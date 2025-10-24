import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../utils/api';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const { data } = await api.get(`/products/${id}`);
      setProduct(data);
    } catch (error) {
      console.error('Failed to fetch product:', error);
      alert('Product not found');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product && quantity > 0 && quantity <= product.stock) {
      addToCart(product, quantity);
      alert(`Added ${quantity} ${product.title} to cart!`);
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  if (loading) {
    return <div className="loading">Loading product...</div>;
  }

  if (!product) {
    return <div className="loading">Product not found</div>;
  }

  return (
    <div className="product-detail-page">
      <div className="container">
        <button className="btn-back" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <div className="product-detail">
          <div className="product-images">
            <div className="main-image">
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[selectedImage]}
                  alt={product.title}
                />
              ) : (
                <div className="no-image-large">No Image</div>
              )}
            </div>

            {product.images && product.images.length > 1 && (
              <div className="image-thumbnails">
                {product.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    className={selectedImage === index ? 'active' : ''}
                    onClick={() => setSelectedImage(index)}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="product-details">
            <h1>{product.title}</h1>

            <div className="product-meta">
              <span className="category">{product.category}</span>
              {product.sku && <span className="sku">SKU: {product.sku}</span>}
            </div>

            {product.averageRating > 0 && (
              <div className="rating">
                <span className="stars">
                  {'★'.repeat(Math.round(product.averageRating))}
                </span>
                <span className="rating-text">
                  {product.averageRating.toFixed(1)} ({product.reviewCount} reviews)
                </span>
              </div>
            )}

            <div className="price-section">
              <span className="price">${product.price.toFixed(2)}</span>
              {product.compareAtPrice && (
                <span className="compare-price">
                  ${product.compareAtPrice.toFixed(2)}
                </span>
              )}
            </div>

            <div className="stock-info">
              {product.stock > 0 ? (
                <span className="in-stock">
                  ✓ In Stock ({product.stock} available)
                </span>
              ) : (
                <span className="out-of-stock">✗ Out of Stock</span>
              )}
            </div>

            <p className="description">{product.description}</p>

            {product.attributes && Object.keys(product.attributes).length > 0 && (
              <div className="attributes">
                <h3>Specifications</h3>
                <ul>
                  {Object.entries(product.attributes).map(([key, value]) => (
                    <li key={key}>
                      <strong>{key}:</strong> {String(value)}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {product.stock > 0 && (
              <div className="purchase-section">
                <div className="quantity-selector">
                  <label>Quantity:</label>
                  <div className="quantity-controls">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      max={product.stock}
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(
                          Math.min(
                            product.stock,
                            Math.max(1, parseInt(e.target.value) || 1)
                          )
                        )
                      }
                    />
                    <button
                      onClick={() =>
                        setQuantity(Math.min(product.stock, quantity + 1))
                      }
                      disabled={quantity >= product.stock}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="action-buttons">
                  <button
                    className="btn btn-primary btn-large"
                    onClick={handleAddToCart}
                  >
                    Add to Cart
                  </button>
                  <button
                    className="btn btn-secondary btn-large"
                    onClick={handleBuyNow}
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
