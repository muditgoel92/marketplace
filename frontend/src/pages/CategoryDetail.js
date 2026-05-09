import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';

export default function CategoryDetail() {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const [categoryRes, productsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/categories/${id}/`),
          axios.get(`${API_BASE_URL}/products/?category=${id}`),
        ]);

        setCategory(categoryRes.data);
        setProducts(productsRes.data.results || productsRes.data);
      } catch (error) {
        console.error('Error fetching category data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [id]);

  if (loading) {
    return <div className="loader">Loading category details...</div>;
  }

  if (!category) {
    return <div className="loader">Category not found.</div>;
  }

  return (
    <div className="container">
      {/* Category Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
          {category.icon || '📁'}
        </div>
        <h1 className="section-title">{category.name}</h1>
        <p style={{ color: '#666', fontSize: '1.1rem', marginBottom: '1rem' }}>
          {category.description}
        </p>
        <p style={{ color: '#999' }}>
          Showing {products.length} product{products.length !== 1 ? 's' : ''} in this category
        </p>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="loader">No products found in this category.</div>
      ) : (
        <div className="grid grid-4">
          {products.map(product => (
            <div key={product.id} className="card product-card">
              <div className="product-image">📦</div>
              <h3 className="product-name">{product.name}</h3>
              <p className="product-vendor">{product.vendor_name}</p>
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
              <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column' }}>
                <Link to={`/products/${product.id}`} className="button">View Details</Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Back Link */}
      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <Link to="/" className="button">← Back to Home</Link>
      </div>
    </div>
  );
}
