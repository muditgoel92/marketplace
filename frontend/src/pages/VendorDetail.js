import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';

export default function VendorDetail() {
  const { id } = useParams();
  const [vendor, setVendor] = useState(null);
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendorData = async () => {
      setLoading(true);
      try {
        const params = categoryFilter ? `&category=${categoryFilter}` : '';
        const [vendorRes, productsRes, reviewsRes, categoriesRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/vendors/${id}/`),
          axios.get(`${API_BASE_URL}/products/?vendor=${id}${params}`),
          axios.get(`${API_BASE_URL}/reviews/?vendor=${id}`),
          axios.get(`${API_BASE_URL}/categories/`),
        ]);

        setVendor(vendorRes.data);
        setProducts(productsRes.data.results || productsRes.data);
        setReviews(reviewsRes.data.results || reviewsRes.data);
        setCategories(categoriesRes.data.results || categoriesRes.data);
      } catch (error) {
        console.error('Error fetching vendor data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVendorData();
  }, [id, categoryFilter]);

  const handleCategoryChange = (e) => {
    setCategoryFilter(e.target.value);
  };

  if (loading) {
    return <div className="loader">Loading vendor details...</div>;
  }

  if (!vendor) {
    return <div className="loader">Vendor not found.</div>;
  }

  return (
    <div className="container">
      {/* Vendor Header */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
          <div style={{ fontSize: '4rem' }}>🏢</div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '2rem', color: '#1a1a2e', marginBottom: '0.5rem' }}>
              {vendor.name}
            </h1>
            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <div>
                <strong>Rating:</strong> ⭐ {vendor.rating}/5
              </div>
              {vendor.founded_year && (
                <div>
                  <strong>Founded:</strong> {vendor.founded_year}
                </div>
              )}
              {vendor.employees && (
                <div>
                  <strong>Employees:</strong> {vendor.employees}
                </div>
              )}
            </div>
            {vendor.locations && (
              <div style={{ marginBottom: '1rem' }}>
                <strong>Locations:</strong> {vendor.locations}
              </div>
            )}
            <p style={{ color: '#666', marginBottom: '1rem' }}>{vendor.description}</p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              {vendor.website && (
                <a href={vendor.website} target="_blank" rel="noopener noreferrer" className="button">
                  Visit Website
                </a>
              )}
              {vendor.email && (
                <a href={`mailto:${vendor.email}`} className="button button-primary">
                  Contact Vendor
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <h2 className="section-title" style={{ margin: 0 }}>Products by {vendor.name}</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to={`/list-product/${id}`} className="button button-primary">+ List New Product</Link>
          <Link to="/vendors" className="button">Back to Vendors</Link>
        </div>
      </div>

      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <label htmlFor="vendor-category-filter" style={{ color: '#333', fontWeight: 'bold' }}>
          Filter by category:
        </label>
        <select
          id="vendor-category-filter"
          value={categoryFilter}
          onChange={handleCategoryChange}
          style={{ padding: '0.75rem', borderRadius: '6px', border: '2px solid #ddd', minWidth: '240px' }}
        >
          <option value="">All categories</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {products.length === 0 ? (
        <div className="loader">No products found from this vendor.</div>
      ) : (
        <div className="grid grid-4">
          {products.map(product => (
            <div key={product.id} className="card product-card">
              <div className="product-image">📦</div>
              <h3 className="product-name">{product.name}</h3>
              <p className="product-description">{product.short_description}</p>
              <div className="product-meta">
                <span className="rating stars">{product.rating}/5</span>
                <span className="pricing-model">{product.pricing_model}</span>
              </div>
              {product.demo_available && (
                <div style={{ fontSize: '0.85rem', color: '#4caf50', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  ✓ Demo Available
                </div>
              )}
              <Link to={`/products/${product.id}`} className="button">View Details</Link>
              {product.category_name && (
                <p style={{ marginTop: '0.75rem', color: '#999', fontSize: '0.85rem' }}>
                  Category: {product.category_name}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Reviews Section */}
      <h2 className="section-title" style={{ marginTop: '3rem' }}>
        Customer Reviews ({reviews.length})
      </h2>
      {reviews.length === 0 ? (
        <div className="loader">No reviews yet.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {reviews.map(review => (
            <div key={review.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                <div>
                  <strong>{review.title}</strong>
                  <p style={{ color: '#666', fontSize: '0.9rem' }}>
                    by {review.author} {review.company && `from ${review.company}`}
                  </p>
                </div>
                <span style={{ fontSize: '1rem', color: '#ffc107' }}>⭐ {review.rating}/5</span>
              </div>
              <p style={{ color: '#666', marginTop: '0.5rem' }}>{review.content}</p>
              {review.verified && (
                <p style={{ fontSize: '0.8rem', color: '#4caf50', marginTop: '0.5rem' }}>
                  ✓ Verified Review
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
